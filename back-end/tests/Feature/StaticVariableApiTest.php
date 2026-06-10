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
        $this->user = User::where(
            "tenant_id",
            $this->tenant->id,
        )->firstOrFail();
    }

    public function test_can_list_seeded_static_variables(): void
    {
        $response = $this->getJson("/api/variables");

        $response->assertOk();

        $data = $response->json("data");

        $this->assertGreaterThan(30, count($data));

        $bySource = function (string $source) use ($data) {
            return array_map(
                fn($v) => $v["name"],
                array_filter($data, fn($v) => $v["source"] === $source),
            );
        };

        $manualNames = $bySource("manual");
        $autoNames = $bySource("auto");
        $aliasNames = $bySource("alias");
        $systemNames = $bySource("system");

        $this->assertContains("assistido_nome", $aliasNames);
        $this->assertContains("data_atual", $systemNames);
        $this->assertContains("endereco", $systemNames);

        $this->assertNotEmpty($autoNames);
        $this->assertNotEmpty($aliasNames);
        $this->assertNotEmpty($systemNames);

        foreach ($data as $entry) {
            if ($entry["source"] === "auto") {
                $this->assertStringStartsWith("auto_", $entry["id"]);
            }
        }
    }

    public function test_can_search_static_variables(): void
    {
        $response = $this->getJson("/api/variables?search=cpf");

        $response->assertOk();

        $data = $response->json("data");
        $this->assertNotEmpty($data);

        $cpfVars = array_filter($data, fn($v) => $v["name"] === "cpf");
        $this->assertNotEmpty($cpfVars);
        $this->assertSame("auto", reset($cpfVars)["source"]);
    }

    public function test_authenticated_user_can_create_static_variable(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            "name" => "numero_processo",
            "description" => "Número do processo judicial.",
            "example" => "1234/2024",
        ];

        $response = $this->postJson("/api/variables", $payload);

        $response->assertCreated()->assertJsonPath("name", "numero_processo");

        $this->assertDatabaseHas("static_variables", [
            "name" => "numero_processo",
        ]);
    }

    public function test_cannot_create_static_variable_with_invalid_name(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/variables", [
            "name" => "Numero Processo",
            "description" => "Inválida",
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(["name"]);
    }

    public function test_cannot_create_duplicate_static_variable_ignoring_case(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/variables", [
            "name" => "cpf",
            "description" => "Duplicada",
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(["name"]);
    }

    public function test_authenticated_user_can_update_static_variable(): void
    {
        Sanctum::actingAs($this->user);

        $variable = StaticVariable::query()->create([
            "name" => "numero_processo",
            "description" => "Número anterior.",
            "example" => "1111/2024",
        ]);

        $response = $this->putJson("/api/variables/{$variable->id}", [
            "name" => "numero_cnj",
            "description" => "Número CNJ do processo.",
            "example" => "5000000-00.2024.8.26.0000",
        ]);

        $response
            ->assertOk()
            ->assertJsonPath("name", "numero_cnj")
            ->assertJsonPath("description", "Número CNJ do processo.");

        $this->assertDatabaseHas("static_variables", [
            "id" => $variable->id,
            "name" => "numero_cnj",
        ]);
    }

    public function test_cannot_update_static_variable_with_duplicate_name_ignoring_case(): void
    {
        Sanctum::actingAs($this->user);

        $variable = StaticVariable::query()->create([
            "name" => "numero_processo",
            "description" => "Número do processo.",
            "example" => "1234/2024",
        ]);

        $response = $this->putJson("/api/variables/{$variable->id}", [
            "name" => "cpf",
            "description" => "Tentativa duplicada.",
            "example" => "123.456.789-00",
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(["name"]);
    }

    public function test_authenticated_user_can_delete_static_variable(): void
    {
        Sanctum::actingAs($this->user);

        $variable = StaticVariable::query()->create([
            "name" => "processo_temporario",
            "description" => "Variável removível.",
            "example" => "TMP-1",
        ]);

        $response = $this->deleteJson("/api/variables/{$variable->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing("static_variables", [
            "id" => $variable->id,
        ]);
    }

    public function test_renderer_uses_persisted_static_variables(): void
    {
        StaticVariable::query()->create([
            "name" => "numero_processo",
            "description" => "Número do processo.",
            "example" => "1234/2024",
        ]);

        Sanctum::actingAs($this->user);

        $template = Template::create([
            "tenant_id" => $this->tenant->id,
            "title" => "Render Test",
            "content" =>
                "Processo {{numero_processo}} / Ignorar {{inexistente}}",
            "visibility" => "public",
        ]);

        $response = $this->postJson("/api/templates/{$template->id}/render", [
            "variables" => [
                "numero_processo" => "1234/2024",
                "inexistente" => "nao deve entrar",
            ],
        ]);

        $response
            ->assertOk()
            ->assertJsonPath(
                "html",
                "Processo 1234/2024 / Ignorar {{inexistente}}",
            );
    }
}
