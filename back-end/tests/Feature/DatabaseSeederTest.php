<?php

namespace Tests\Feature;

use App\Models\Template;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_is_idempotent(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount("tenants", 1);
        $this->assertDatabaseCount("users", 1);
        $this->assertDatabaseCount("templates", 1);
        $this->assertDatabaseCount("static_variables", 0);
        $this->assertDatabaseCount("clients", 2);

        $tenant = Tenant::query()->firstOrFail();
        $user = User::query()->firstOrFail();
        $template = Template::query()->firstOrFail();

        $this->assertSame("exemplo.com.br", $tenant->domain);
        $this->assertSame($tenant->id, $user->tenant_id);
        $this->assertSame($tenant->id, $template->tenant_id);
        $this->assertSame($user->id, $template->created_by);

        $this->assertDatabaseHas("clients", [
            "creator_id" => $user->id,
            "cpf" => "12345678900",
            "name" => "Maria da Silva",
        ]);
    }
}
