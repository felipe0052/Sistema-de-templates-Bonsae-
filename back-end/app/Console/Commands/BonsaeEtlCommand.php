<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Exception;

class BonsaeEtlCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:etl-bonsae
        {--source=bonsae : The source database connection defined in config/database.php}
        {--dump-file= : Caminho para um dump MySQL (.sql) do Bonsae para rodar o ETL sem precisar de MySQL local}';

    protected $legacyCities = [];
    protected $legacyStates = [];

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Executa o processo de ETL para carregar dados do banco legado Bonsae';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sourceConnection = $this->option('source');
        $dumpFile = $this->option('dump-file');

        if (is_string($dumpFile) && trim($dumpFile) !== '') {
            return $this->migrateFromDumpFile($dumpFile);
        }

        $this->info("Iniciando ETL do banco: {$sourceConnection}");

        try {
            // Testar conexão
            DB::connection($sourceConnection)->getPdo();
            $this->info("Conexão com o banco de origem estabelecida com sucesso.");
        } catch (Exception $e) {
            $this->error("Falha ao conectar no banco de origem: " . $e->getMessage());
            $this->line("Verifique as configurações no arquivo .env para a conexão '{$sourceConnection}'");
            return 1;
        }

        $tablesToMigrate = [
            'users' => 'users',
            'clients' => 'clients',
        ];

        foreach ($tablesToMigrate as $sourceTable => $destTable) {
            $this->migrateTable($sourceConnection, $sourceTable, $destTable);
        }

        $this->info("Processo de ETL concluído!");
        return 0;
    }

    /**
     * Migra dados de uma tabela específica
     */
    protected function migrateTable($sourceConn, $sourceTable, $destTable)
    {
        $this->comment("Migrando tabela: {$sourceTable} -> {$destTable}...");

        try {
            if (!Schema::connection($sourceConn)->hasTable($sourceTable)) {
                $this->warn("Tabela {$sourceTable} não existe no banco de origem.");
                return;
            }

            // Stream rows to avoid loading the entire table into memory
            $query = DB::connection($sourceConn)->table($sourceTable);

            if (!$query->exists()) {
                $this->warn("Tabela {$sourceTable} está vazia.");
                return;
            }

            $count = 0;
            foreach ($query->cursor() as $row) {
                // Converter objeto para array
                $data = (array) $row;

                $transformedData = $this->transformData($sourceTable, $data);

                if ($sourceTable === 'users') {
                    $key = ['email' => $transformedData['email']];
                } else {
                    $key = ['id' => $transformedData['id']];
                }

                DB::table($destTable)->updateOrInsert($key, $transformedData);

                if ($sourceTable === 'users') {
                    $this->upsertAssistedFromUser($data, $transformedData);
                }
                $count++;
            }

            $this->info("Migrados {$count} registros da tabela {$sourceTable}.");

        } catch (Exception $e) {
            $this->error("Erro ao migrar tabela {$sourceTable}: " . $e->getMessage());
            Log::error("ETL Error ({$sourceTable}): " . $e->getMessage());
        }
    }

    /**
     * Lógica de transformação de dados por tabela
     */
    protected function transformData($table, $data)
    {
        switch ($table) {
            case 'users':
                $tenantId = $this->getOrCreateTenantId();

                $data = [
                    'tenant_id' => $tenantId,
                    'name' => (string) ($data['name'] ?? ''),
                    'email' => (string) ($data['email'] ?? ''),
                    'email_verified_at' => null,
                    'password' => (string) ($data['password'] ?? ''),
                    'remember_token' => $data['remember_token'] ?? null,
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ];
                break;

            case 'addresses':
                $cityId = $data['city_id'] ?? null;
                $stateId = $data['state_id'] ?? null;
                
                $data = [
                    'cep' => $data['cep'] ?? null,
                    'street_name' => $data['street_name'] ?? null,
                    'number' => $data['number'] ?? null,
                    'complement' => $data['complement'] ?? null,
                    'neighborhood' => $data['neighborhood'] ?? null,
                    'city' => $this->legacyCities[$cityId]['name'] ?? null,
                    'state' => $this->legacyStates[$stateId]['uf'] ?? null,
                    'created_at' => $data['created_at'] ?? now(),
                    'updated_at' => $data['updated_at'] ?? now(),
                ];
                break;

            case 'clients':
                // Garantir que temos um creator_id válido
                if (!isset($data['creator_id']) || $data['creator_id'] <= 0) {
                    $data['creator_id'] = (int) (DB::table('users')->min('id') ?? 1);
                }
                
                // Mapear UF do órgão expedidor se for um ID legado
                $ufIssuingBodyId = $data['uf_issuing_body'] ?? null;
                if (is_numeric($ufIssuingBodyId) && isset($this->legacyStates[$ufIssuingBodyId])) {
                    $data['uf_issuing_body'] = $this->legacyStates[$ufIssuingBodyId]['uf'];
                }

                // Limpar campos de data se forem inválidos para SQLite (0000-00-00)
                foreach (['birth_date', 'created_at', 'updated_at', 'deleted_at'] as $dateField) {
                    if (isset($data[$dateField]) && ($data[$dateField] === '0000-00-00' || $data[$dateField] === '0000-00-00 00:00:00')) {
                        $data[$dateField] = null;
                    }
                }

                // Filtrar apenas colunas que existem na tabela de destino
                $destColumns = Schema::getColumnListing('clients');
                $data = array_intersect_key($data, array_flip($destColumns));
                break;
        }

        return $data;
    }

    protected function migrateFromDumpFile(string $dumpFile): int
    {
        $dumpFile = trim($dumpFile, " \t\n\r\0\x0B\"'");

        if (!is_file($dumpFile)) {
            $this->error("Arquivo não encontrado: {$dumpFile}");
            return 1;
        }

        $this->info("Iniciando ETL via dump-file: {$dumpFile}");

        // Carregar Cidades e Estados para mapeamento de endereços
        $this->loadLegacyGeoData($dumpFile);

        // 1. Migrar Usuários
        $legacyUsers = $this->extractTableFromMysqlDump($dumpFile, 'users');
        if ($legacyUsers !== []) {
            $this->comment('Migrando tabela: users -> users...');
            $count = 0;
            foreach ($legacyUsers as $user) {
                $transformed = $this->transformData('users', $user);
                if (($transformed['email'] ?? '') === '') {
                    continue;
                }
                DB::table('users')->updateOrInsert(['email' => $transformed['email']], $transformed);
                $this->upsertAssistedFromUser($user, $transformed);
                $count++;
            }
            $this->info("Migrados {$count} registros da tabela users.");
        }

        // 2. Migrar Endereços
        $legacyAddresses = $this->extractTableFromMysqlDump($dumpFile, 'addresses');
        if ($legacyAddresses !== []) {
            $this->comment('Migrando tabela: addresses -> addresses...');
            $count = 0;
            foreach ($legacyAddresses as $address) {
                $legacyId = $address['id'] ?? null;
                $transformed = $this->transformData('addresses', $address);
                
                if ($legacyId) {
                    $transformed['id'] = $legacyId;
                    DB::table('addresses')->updateOrInsert(['id' => $legacyId], $transformed);
                } else {
                    DB::table('addresses')->insert($transformed);
                }
                $count++;
            }
            $this->info("Migrados {$count} registros da tabela addresses.");
        }

        // 3. Migrar Clientes (Assistidos)
        $legacyClients = $this->extractTableFromMysqlDump($dumpFile, 'clients');
        if ($legacyClients !== []) {
            $this->comment('Migrando tabela: clients -> clients...');
            $count = 0;
            foreach ($legacyClients as $client) {
                $legacyId = $client['id'] ?? null;
                $transformed = $this->transformData('clients', $client);
                
                // Remove o ID original para evitar conflitos de auto-incremento, 
                // mas guardamos no id_old_bonsae para referência e idempotência
                unset($transformed['id']);
                if ($legacyId) {
                    $transformed['id_old_bonsae'] = $legacyId;
                    DB::table('clients')->updateOrInsert(['id_old_bonsae' => $legacyId], $transformed);
                } else {
                    DB::table('clients')->insert($transformed);
                }
                
                $count++;
            }
            $this->info("Migrados {$count} registros da tabela clients.");
        }

        // 4. Migrar Tipos de Documentos
        $legacyTypeDocs = $this->extractTableFromMysqlDump($dumpFile, 'type_documents');
        if ($legacyTypeDocs !== []) {
            $this->comment('Migrando tabela: type_documents -> type_documents...');
            $count = 0;
            foreach ($legacyTypeDocs as $typeDoc) {
                $legacyId = $typeDoc['id'] ?? null;
                $data = [
                    'name' => $typeDoc['name'] ?? '',
                    'created_at' => $typeDoc['created_at'] ?? now(),
                    'updated_at' => $typeDoc['updated_at'] ?? now(),
                ];
                if ($legacyId) {
                    DB::table('type_documents')->updateOrInsert(['id' => $legacyId], $data);
                } else {
                    DB::table('type_documents')->insert($data);
                }
                $count++;
            }
            $this->info("Migrados {$count} registros da tabela type_documents.");
        }

        $this->info('Processo de ETL concluído!');
        return 0;
    }

    protected function loadLegacyGeoData(string $dumpFile): void
    {
        $this->comment('Carregando dados geográficos legados...');

        // Estados
        $states = $this->extractTableFromMysqlDump($dumpFile, 'states');
        foreach ($states as $state) {
            $this->legacyStates[$state['id']] = $state;
        }

        // Cidades
        $cities = $this->extractTableFromMysqlDump($dumpFile, 'cities');
        foreach ($cities as $city) {
            $this->legacyCities[$city['id']] = $city;
        }

        $this->info("Carregados " . count($this->legacyStates) . " estados e " . count($this->legacyCities) . " cidades.");
    }

    protected function extractTableFromMysqlDump(string $dumpFile, string $tableName): array
    {
        $columns = $this->extractCreateTableColumns($dumpFile, $tableName);
        if ($columns === []) {
            return [];
        }

        $rows = [];
        $insertStatements = $this->extractInsertStatements($dumpFile, $tableName);

        foreach ($insertStatements as $statement) {
            $valuesSql = $this->extractValuesSqlFromInsert($statement);
            if ($valuesSql === '') {
                continue;
            }

            foreach ($this->parseMysqlTuples($valuesSql) as $rowValues) {
                $row = [];
                $max = min(count($columns), count($rowValues));
                for ($i = 0; $i < $max; $i++) {
                    $row[$columns[$i]] = $rowValues[$i];
                }

                $rows[] = $row;
            }
        }

        return $rows;
    }

    protected function extractCreateTableColumns(string $dumpFile, string $table): array
    {
        $file = new \SplFileObject($dumpFile, 'r');
        $inCreate = false;
        $columns = [];
        $createRegex = '/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`' . preg_quote($table, '/') . '`\s*\(/i';

        while (!$file->eof()) {
            $line = (string) $file->fgets();

            if (!$inCreate) {
                if (preg_match($createRegex, $line) === 1) {
                    $inCreate = true;
                }
                continue;
            }

            if (preg_match('/^\)\s*ENGINE=/i', trim($line)) === 1) {
                break;
            }

            if (preg_match('/^\s*`([^`]+)`\s+/', $line, $m) === 1) {
                $columns[] = $m[1];
            }
        }

        return $columns;
    }

    protected function extractInsertStatements(string $dumpFile, string $table): array
    {
        $file = new \SplFileObject($dumpFile, 'r');
        $needle = "INSERT INTO `{$table}`";
        $inInsert = false;
        $buffer = '';
        $statements = [];

        while (!$file->eof()) {
            $line = (string) $file->fgets();

            if (!$inInsert) {
                $pos = stripos($line, $needle);
                if ($pos === false) {
                    continue;
                }

                $inInsert = true;
                $buffer = substr($line, $pos);
            } else {
                $buffer .= $line;
            }

            if ($inInsert && strpos($line, ';') !== false) {
                $statements[] = $buffer;
                $inInsert = false;
                $buffer = '';
            }
        }

        return $statements;
    }

    protected function extractValuesSqlFromInsert(string $insertStatement): string
    {
        $pos = stripos($insertStatement, 'VALUES');
        if ($pos === false) {
            return '';
        }

        $values = trim(substr($insertStatement, $pos + 6));
        $values = preg_replace('/;\s*$/', '', $values);
        return trim((string) $values);
    }

    protected function parseMysqlTuples(string $valuesSql): array
    {
        $rows = [];
        $row = [];
        $token = '';
        $inString = false;
        $escape = false;
        $depth = 0;
        $len = strlen($valuesSql);

        for ($i = 0; $i < $len; $i++) {
            $ch = $valuesSql[$i];

            if ($inString) {
                if ($escape) {
                    $token .= $ch;
                    $escape = false;
                    continue;
                }

                if ($ch === '\\') {
                    $escape = true;
                    continue;
                }

                if ($ch === "'") {
                    $inString = false;
                    continue;
                }

                $token .= $ch;
                continue;
            }

            if ($ch === "'") {
                $inString = true;
                continue;
            }

            if ($ch === '(') {
                $depth++;
                if ($depth === 1) {
                    $row = [];
                    $token = '';
                } else {
                    $token .= $ch;
                }
                continue;
            }

            if ($ch === ')') {
                if ($depth === 1) {
                    $row[] = $this->normalizeMysqlToken($token);
                    $rows[] = $row;
                    $row = [];
                    $token = '';
                } else {
                    $token .= $ch;
                }
                $depth--;
                continue;
            }

            if ($ch === ',' && $depth === 1) {
                $row[] = $this->normalizeMysqlToken($token);
                $token = '';
                continue;
            }

            if ($depth >= 1) {
                $token .= $ch;
            }
        }

        return $rows;
    }

    protected function normalizeMysqlToken(string $token)
    {
        $value = trim($token);

        if ($value === '') {
            return '';
        }

        if (strcasecmp($value, 'NULL') === 0) {
            return null;
        }

        return $value;
    }

    protected function getOrCreateTenantId(): int
    {
        $tenantId = (int) (DB::table('tenants')->min('id') ?? 0);
        if ($tenantId > 0) {
            return $tenantId;
        }

        return (int) DB::table('tenants')->insertGetId([
            'name' => 'Instituição Importada',
            'domain' => null,
            'logo_url' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    protected function upsertAssistedFromUser(array $legacyUser, array $transformedUser): void
    {
        if (!Schema::hasTable('clients')) {
            return;
        }

        $email = (string) ($transformedUser['email'] ?? '');
        $tenantId = (int) ($transformedUser['tenant_id'] ?? 0);

        if ($email === '' || $tenantId <= 0) {
            return;
        }

        $user = DB::table('users')
            ->where('email', $email)
            ->where('tenant_id', $tenantId)
            ->first();

        if (!$user) {
            return;
        }

        $name = trim((string) ($transformedUser['name'] ?? ''));
        if ($name === '') {
            $name = trim((string) ($legacyUser['name'] ?? ''));
        }

        if ($name === '') {
            return;
        }

        $legacyId = $legacyUser['id'] ?? null;
        $legacyId = is_numeric($legacyId) ? (int) $legacyId : null;

        $payload = [
            'creator_id' => (int) $user->id,
            'address_id' => null,
            'name' => $name,
            'email' => $email,
            'updated_at' => now(),
            'created_at' => now(),
        ];

        if ($legacyId !== null) {
            $payload['id_old_bonsae'] = $legacyId;
        }

        DB::table('clients')->updateOrInsert(
            ['creator_id' => (int) $user->id, 'email' => $email],
            $payload
        );
    }
}
