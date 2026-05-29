<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class UnifiedAuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_identify_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/auth/identify', [
            'email' => 'missing@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_identify_with_existing_email_without_password_returns_needs_activation_and_stores_token(): void
    {
        Mail::fake();

        $tenant = Tenant::query()->create(['name' => 'Tenant 1']);
        $user = User::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Sem Senha',
            'email' => 'sem-senha@example.com',
            'password' => null,
        ]);

        Str::createRandomStringsUsing(fn () => str_repeat('a', 60));

        try {
            $response = $this->postJson('/api/auth/identify', [
                'email' => $user->email,
            ]);
        } finally {
            Str::createRandomStringsNormally();
        }

        $response->assertOk()
            ->assertJsonPath('status', 'needs_activation');

        $this->assertDatabaseHas('activation_tokens', [
            'email' => $user->email,
        ]);

        $record = DB::table('activation_tokens')->where('email', $user->email)->first();
        $this->assertNotNull($record);
        $this->assertTrue(Hash::check(str_repeat('a', 60), $record->token));
    }

    public function test_identify_with_existing_email_with_password_returns_needs_password(): void
    {
        $tenant = Tenant::query()->create(['name' => 'Tenant 1']);
        $user = User::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Com Senha',
            'email' => 'com-senha@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/identify', [
            'email' => $user->email,
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 'needs_password');
    }

    public function test_activate_with_valid_token_and_password_confirmation(): void
    {
        $tenant = Tenant::query()->create(['name' => 'Tenant 1']);
        $user = User::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Ativar Usuário',
            'email' => 'ativar@example.com',
            'password' => null,
        ]);

        Str::createRandomStringsUsing(fn () => str_repeat('b', 60));

        try {
            $this->postJson('/api/auth/identify', [
                'email' => $user->email,
            ])->assertOk();
        } finally {
            Str::createRandomStringsNormally();
        }

        $response = $this->postJson('/api/auth/activate', [
            'email' => $user->email,
            'token' => str_repeat('b', 60),
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 'logged_in');

        $this->assertDatabaseMissing('activation_tokens', [
            'email' => $user->email,
        ]);

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_activate_with_invalid_token(): void
    {
        $tenant = Tenant::query()->create(['name' => 'Tenant 1']);
        $user = User::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Token Inválido',
            'email' => 'token-invalido@example.com',
            'password' => null,
        ]);

        $this->postJson('/api/auth/identify', [
            'email' => $user->email,
        ])->assertOk();

        $response = $this->postJson('/api/auth/activate', [
            'email' => $user->email,
            'token' => 'invalid-token',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('token');
    }

    public function test_login_with_valid_credentials(): void
    {
        $tenant = Tenant::query()->create(['name' => 'Tenant 1']);
        $user = User::query()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Login Simples',
            'email' => 'login@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 'logged_in')
            ->assertJsonPath('tenant_id', $tenant->id)
            ->assertJsonStructure(['access_token', 'user']);
    }

    public function test_login_for_multi_tenant_user_returns_selection_token(): void
    {
        $tenant1 = Tenant::query()->create(['name' => 'Tenant 1']);
        $tenant2 = Tenant::query()->create(['name' => 'Tenant 2']);

        $user = User::query()->create([
            'tenant_id' => $tenant1->id,
            'name' => 'Multi Tenant',
            'email' => 'multi@example.com',
            'password' => bcrypt('password123'),
        ]);

        $user->tenants()->attach([$tenant1->id, $tenant2->id]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 'needs_tenant_selection')
            ->assertJsonStructure(['access_token', 'tenants']);
    }

    public function test_select_tenant_issues_real_token_for_multi_tenant_user(): void
    {
        $tenant1 = Tenant::query()->create(['name' => 'Tenant 1']);
        $tenant2 = Tenant::query()->create(['name' => 'Tenant 2']);

        $user = User::query()->create([
            'tenant_id' => $tenant1->id,
            'name' => 'Multi Tenant',
            'email' => 'multi-select@example.com',
            'password' => bcrypt('password123'),
        ]);

        $user->tenants()->attach([$tenant1->id, $tenant2->id]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $tempToken = $loginResponse->json('access_token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $tempToken)
            ->postJson('/api/auth/select-tenant', [
                'tenant_id' => $tenant2->id,
            ]);

        $response->assertOk()
            ->assertJsonPath('tenant_id', $tenant2->id)
            ->assertJsonStructure(['access_token', 'user']);
    }

    public function test_select_tenant_token_cannot_access_tenant_protected_user_route(): void
    {
        $tenant1 = Tenant::query()->create(['name' => 'Tenant 1']);
        $tenant2 = Tenant::query()->create(['name' => 'Tenant 2']);

        $user = User::query()->create([
            'tenant_id' => $tenant1->id,
            'name' => 'Multi Tenant',
            'email' => 'multi-protected@example.com',
            'password' => bcrypt('password123'),
        ]);

        $user->tenants()->attach([$tenant1->id, $tenant2->id]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $tempToken = $loginResponse->json('access_token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $tempToken)
            ->getJson('/api/user');

        $response->assertStatus(403)
            ->assertJsonPath('code', 'TENANT_SELECTION_REQUIRED');
    }
}
