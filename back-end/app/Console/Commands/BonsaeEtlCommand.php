<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class BonsaeEtlCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:etl-bonsae {--source=bonsae : The source database connection defined in config/database.php}';

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

        // Lista de tabelas para migrar (baseado no ANALYSIS_MIGRATION.md)
        $tablesToMigrate = [
            'profiles'    => 'profiles',
            'users'       => 'users',
            'cities'      => 'cities',
            'states'      => 'states',
            // Adicione mais tabelas conforme necessário
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
            // Verifica se a tabela de origem existe
            $sourceData = DB::connection($sourceConn)->table($sourceTable)->get();
            
            if ($sourceData->isEmpty()) {
                $this->warn("Tabela {$sourceTable} está vazia ou não existe no banco de origem.");
                return;
            }

            $count = 0;
            foreach ($sourceData as $row) {
                // Converter objeto para array
                $data = (array) $row;

                // Aqui você pode adicionar lógica de transformação
                // Exemplo: $data['transformed_column'] = transform($data['original_column']);
                
                // No futuro, se mudar o banco, a lógica de transformação pode ser isolada em classes específicas
                $transformedData = $this->transformData($sourceTable, $data);

                // Inserir ou atualizar no banco de destino (default)
                DB::table($destTable)->updateOrInsert(
                    ['id' => $transformedData['id']],
                    $transformedData
                );
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
        // Implementar transformações específicas por tabela
        switch ($table) {
            case 'users':
                // Exemplo: remover tenant_id se estiver adaptando ao novo schema
                unset($data['tenant_id']);
                // Garantir que campos obrigatórios existam
                $data['updated_at'] = $data['updated_at'] ?? now();
                break;
            
            case 'profiles':
                // Transformações para profiles
                break;
        }

        return $data;
    }
}
