<?php

namespace Tests\Feature;

use App\Models\StaticVariable;
use App\Models\Template;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StaticVariableApiTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenant;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $this->tenant = Tenant::firstOrFail();
        $this->user = User::where('tenant_id', $this->tenant->id)->firstOrFail();
    }

    public function test_can_list_seeded_static_variables(): void
    {
        $response = $this->getJson('/api/variables');

        $response->assertOk()
            ->assertJsonPath('data.0.name', 'assistido_nome')
            ->assertJsonCount(15, 'data');
    }

    public function test_can_search_static_variables(): void
    {
        $response = $this->getJson('/api/variables?search=cpf');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'cpf');
    }

    public function test_authenticated_user_can_create_static_variable(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'name' => 'numero_processo',
            'description' => 'Número do processo judicial.',
            'example' => '1234/2024',
        ];

        $response = $this->postJson('/api/variables', $payload);

        $response->assertCreated()
            ->assertJsonPath('name', 'numero_processo');

        $this->assertDatabaseHas('static_variables', [
            'name' => 'numero_processo',
        ]);
    }

    public function test_cannot_create_static_variable_with_invalid_name(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/variables', [
            'name' => 'Numero Processo',
            'description' => 'Inválida',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_cannot_create_duplicate_static_variable_ignoring_case(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/variables', [
            'name' => 'cpf',
            'description' => 'Duplicada',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_renderer_uses_persisted_static_variables(): void
    {
        StaticVariable::query()->create([
            'name' => 'numero_processo',
            'description' => 'Número do processo.',
            'example' => '1234/2024',
        ]);

        Sanctum::actingAs($this->user);

        $template = Template::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Render Test',
            'content' => 'Processo {{numero_processo}} / Ignorar {{inexistente}}',
            'visibility' => 'public',
        ]);

        $response = $this->postJson("/api/templates/{$template->id}/render", [
            'variables' => [
                'numero_processo' => '1234/2024',
                'inexistente' => 'nao deve entrar',
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('html', 'Processo 1234/2024 / Ignorar {{inexistente}}');
    }
}
