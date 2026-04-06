<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\StaticVariable;
use App\Models\User;
use App\Models\Template;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Criar um Tenant
        $tenant = Tenant::create([
            'name' => 'Instituição de Exemplo',
            'domain' => 'exemplo.com.br',
        ]);

        // Criar um Usuário para o Tenant
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Admin Teste',
            'email' => 'admin@instituicao.com',
            'password' => Hash::make('password'),
        ]);

        foreach ($this->staticVariables() as $variable) {
            StaticVariable::query()->create($variable);
        }

        // Criar um Template de exemplo
        Template::create([
            'tenant_id' => $tenant->id,
            'title' => 'Modelo de Procuração',
            'content' => '<h1>PROCURAÇÃO</h1><p>Eu, <strong>{{assistido_nome}}</strong>, portador do CPF <strong>{{cpf}}</strong>, nascido em {{data_nascimento}}, filho de {{nome_pai}} e {{nome_mae}}, residente em {{endereco}}, {{cidade}}, nomeio meu procurador...</p><p>Data: {{data_atual}}</p>',
            'variables' => [
                'assistido_nome',
                'cpf',
                'data_nascimento',
                'nome_pai',
                'nome_mae',
                'endereco',
                'cidade',
                'data_atual'
            ],
            'visibility' => 'public',
            'created_by' => $user->id,
        ]);
    }

    private function staticVariables(): array
    {
        return [
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
                'name' => 'data_atual',
                'description' => 'Data atual no momento da geração.',
                'example' => now()->format('d/m/Y'),
            ],
        ];
    }
}
