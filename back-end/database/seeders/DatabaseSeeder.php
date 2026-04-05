<?php

namespace Database\Seeders;

use App\Models\Tenant;
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
            'email' => 'admin@exemplo.com',
            'password' => Hash::make('password'),
        ]);

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
}
