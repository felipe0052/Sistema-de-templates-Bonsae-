<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminModeLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_mode_login_bootstraps_admin_user(): void
    {
        $response = $this->postJson('/api/admin-mode/login');

        $response->assertOk()
            ->assertJsonPath('mode', 'admin')
            ->assertJsonPath('user.email', 'admin@instituicao.com');

        $this->assertDatabaseHas('tenants', [
            'domain' => 'instituicao.local',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@instituicao.com',
        ]);
    }

    public function test_admin_mode_login_reuses_existing_admin_user(): void
    {
        $tenant = Tenant::query()->create([
            'name' => 'Instituição Admin',
            'domain' => 'instituicao.local',
        ]);

        User::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Administrador',
            'email' => 'admin@instituicao.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/admin-mode/login');

        $response->assertOk()
            ->assertJsonPath('user.email', 'admin@instituicao.com');

        $this->assertSame(1, User::query()->where('email', 'admin@instituicao.com')->count());
    }
}
