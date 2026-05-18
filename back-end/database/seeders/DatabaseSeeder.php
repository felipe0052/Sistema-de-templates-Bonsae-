<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        DB::table('tenants')->updateOrInsert(
            ['domain' => 'exemplo.com.br'],
            [
                'name' => 'Instituição de Exemplo',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $tenant = Tenant::query()->where('domain', 'exemplo.com.br')->firstOrFail();

        DB::table('users')->updateOrInsert(
            ['email' => 'admin@instituicao.com'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Admin Teste',
                'password' => Hash::make('password'),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $user = User::query()->where('email', 'admin@instituicao.com')->firstOrFail();

        foreach ($this->staticVariables() as $variable) {
            DB::table('static_variables')->updateOrInsert(
                ['name' => $variable['name']],
                [
                    'description' => $variable['description'],
                    'example' => $variable['example'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        DB::table('templates')->updateOrInsert(
            [
                'tenant_id' => $tenant->id,
                'title' => 'Modelo de Procuração',
            ],
            [
                'content' => '<h1>PROCURAÇÃO</h1><p>Eu, <strong>{{assistido_nome}}</strong>, portador do CPF <strong>{{cpf}}</strong>, nascido em {{data_nascimento}}, filho de {{nome_pai}} e {{nome_mae}}, residente em {{endereco}}, {{cidade}}, nomeio meu procurador...</p><p>Data: {{data_atual}}</p>',
                'variables' => json_encode([
                    'assistido_nome',
                    'cpf',
                    'data_nascimento',
                    'nome_pai',
                    'nome_mae',
                    'endereco',
                    'cidade',
                    'data_atual'
                ], JSON_UNESCAPED_UNICODE),
                'visibility' => 'public',
                'created_by' => $user->id,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        foreach ($this->addresses() as $addressData) {
            DB::table('addresses')->updateOrInsert(
                ['cep' => $addressData['cep']],
                [
                    ...$addressData,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        $addresses = \App\Models\Address::all()->keyBy('cep');

        foreach ($this->assisteds($user->id, $addresses) as $assisted) {
            DB::table('clients')->updateOrInsert(
                ['cpf' => $assisted['cpf']],
                [
                    ...$assisted,
                    'creator_id' => $user->id,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }

    private function staticVariables(): array
    {
        return [
            [
                'name' => 'nome',
                'description' => 'Nome completo da pessoa atendida.',
                'example' => 'João Silva',
            ],
            [
                'name' => 'assistido_nome',
                'description' => 'Nome completo da pessoa assistida.',
                'example' => 'Maria da Silva',
            ],
            [
                'name' => 'cpf',
                'description' => 'CPF da pessoa assistida.',
                'example' => '123.456.789-00',
            ],
            [
                'name' => 'rg',
                'description' => 'RG da pessoa atendida.',
                'example' => '12.345.678-9',
            ],
            [
                'name' => 'data_nascimento',
                'description' => 'Data de nascimento da pessoa assistida.',
                'example' => '01/01/1990',
            ],
            [
                'name' => 'nome_pai',
                'description' => 'Nome completo do pai.',
                'example' => 'José da Silva',
            ],
            [
                'name' => 'nome_mae',
                'description' => 'Nome completo da mãe.',
                'example' => 'Ana Maria da Silva',
            ],
            [
                'name' => 'endereco',
                'description' => 'Endereço completo.',
                'example' => 'Rua das Flores, 123',
            ],
            [
                'name' => 'cidade',
                'description' => 'Cidade de residência.',
                'example' => 'São Paulo',
            ],
            [
                'name' => 'estado',
                'description' => 'Estado de residência.',
                'example' => 'SP',
            ],
            [
                'name' => 'cep',
                'description' => 'CEP do endereço.',
                'example' => '01234-567',
            ],
            [
                'name' => 'telefone',
                'description' => 'Telefone de contato.',
                'example' => '(11) 99999-9999',
            ],
            [
                'name' => 'email',
                'description' => 'E-mail de contato.',
                'example' => 'joao@email.com',
            ],
            [
                'name' => 'data_atual',
                'description' => 'Data atual no momento da geração.',
                'example' => now()->format('d/m/Y'),
            ],
            [
                'name' => 'numero_documento',
                'description' => 'Número identificador do documento.',
                'example' => 'DOC-2024-001',
            ],
        ];
    }

    private function addresses(): array
    {
        return [
            [
                'cep' => '01001000',
                'street_name' => 'Praça da Sé',
                'number' => '100',
                'complement' => 'Sala 5',
                'neighborhood' => 'Sé',
                'city' => 'São Paulo',
                'state' => 'SP',
            ],
            [
                'cep' => '39400000',
                'street_name' => 'Rua Santo Antônio',
                'number' => '250',
                'complement' => null,
                'neighborhood' => 'Centro',
                'city' => 'Montes Claros',
                'state' => 'MG',
            ],
        ];
    }

    private function assisteds(int $creatorId, $addresses): array
    {
        return [
            [
                'creator_id' => $creatorId,
                'address_id' => $addresses->get('01001000')?->id,
                'name' => 'Maria da Silva',
                'mother_name' => 'Ana Maria da Silva',
                'father_name' => 'José da Silva',
                'cpf' => '12345678900',
                'birth_date' => '1990-01-01',
                'rg' => '123456789',
                'marital_status' => 'Solteira',
                'profession' => 'Auxiliar administrativa',
                'education' => 'Ensino médio completo',
                'monthly_income' => 1800.00,
                'nationality' => 'Brasileira',
                'naturalness' => 'São Paulo',
                'telephone' => '11999999999',
                'email' => 'maria.silva@example.com',
            ],
            [
                'creator_id' => $creatorId,
                'address_id' => $addresses->get('39400000')?->id,
                'name' => 'João Pereira',
                'mother_name' => 'Cláudia Pereira',
                'father_name' => 'Antônio Pereira',
                'cpf' => '98765432100',
                'birth_date' => '1985-05-20',
                'rg' => '987654321',
                'marital_status' => 'Casado',
                'profession' => 'Pedreiro',
                'education' => 'Ensino fundamental completo',
                'monthly_income' => 2500.00,
                'nationality' => 'Brasileiro',
                'naturalness' => 'Montes Claros',
                'telephone' => '38988887777',
                'email' => 'joao.pereira@example.com',
            ],
        ];
    }
}
