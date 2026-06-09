<?php

namespace Tests\Feature;

use App\Models\StaticVariable;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TemplateApiTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create(['name' => 'Test Tenant']);
        $this->user = User::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_can_list_templates()
    {
        Template::factory()->count(3)->create(['tenant_id' => $this->tenant->id]);

        $response = $this->getJson('/api/templates');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_template_with_image()
    {
        config(['filesystems.template_background_disk' => 'template-backgrounds-test']);
        Storage::fake('template-backgrounds-test');

        $payload = [
            'title' => 'New Template',
            'content' => 'Hello {{assistido_nome}}',
            'visibility' => 'public',
            'background_image' => UploadedFile::fake()->createWithContent(
                'bg.png',
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn6zkAAAAAASUVORK5CYII=')
            ),
        ];

        $response = $this->postJson('/api/templates', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('templates', ['title' => 'New Template']);
        
        $template = Template::first();
        $this->assertNotNull($template->background_image_url);
        
        // Check if file was uploaded to the configured public disk
        $path = 'templates/backgrounds/' . $payload['background_image']->hashName();
        Storage::disk('template-backgrounds-test')->assertExists($path);
    }

    public function test_can_render_template()
    {
        StaticVariable::create([
            'name' => 'assistido_nome',
            'description' => 'Nome completo da pessoa assistida.',
            'example' => 'Felipe',
        ]);

        $template = Template::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Render Test',
            'content' => 'Hello {{assistido_nome}}',
            'visibility' => 'public',
        ]);

        $payload = [
            'variables' => [
                'assistido_nome' => 'Felipe'
            ]
        ];

        $response = $this->postJson("/api/templates/{$template->id}/render", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('html', 'Hello Felipe');
    }

    public function test_can_render_template_as_pdf()
    {
        StaticVariable::create([
            'name' => 'assistido_nome',
            'description' => 'Nome completo da pessoa assistida.',
            'example' => 'Felipe',
        ]);

        $template = Template::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'PDF Render Test',
            'content' => '<p>Hello {{assistido_nome}}</p>',
            'visibility' => 'public',
        ]);

        $response = $this->postJson("/api/templates/{$template->id}/render", [
            'variables' => [
                'assistido_nome' => 'Felipe',
            ],
            'format' => 'pdf',
        ]);

        $response->assertOk()
            ->assertHeader('Content-Type', 'application/pdf');

        $this->assertStringStartsWith('%PDF', $response->getContent());
    }

    public function test_empty_paragraph_min_height_is_preserved_when_created()
    {
        $payload = [
            'title' => 'Spaced Template',
            'content' => '<p style="min-height: 1.7em"></p><p>Texto</p>',
            'visibility' => 'public',
        ];

        $response = $this->postJson('/api/templates', $payload);

        $response->assertCreated();
        $this->assertSame(
            '<p style="min-height: 1.7em"></p><p>Texto</p>',
            Template::firstOrFail()->content,
        );
    }

    public function test_template_content_is_sanitized_when_created()
    {
        $payload = [
            'title' => 'Unsafe Template',
            'content' => '<p onclick="alert(1)" style="text-align: center; background-image: url(javascript:alert(1));">Oi</p><script>alert(1)</script>',
            'visibility' => 'public',
        ];

        $response = $this->postJson('/api/templates', $payload);

        $response->assertCreated();
        $this->assertSame(
            '<p style="text-align: center">Oi</p>',
            Template::firstOrFail()->content,
        );
    }

    public function test_template_content_is_sanitized_when_updated()
    {
        $template = Template::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Update Test',
            'content' => 'Safe',
            'visibility' => 'public',
        ]);

        $response = $this->putJson("/api/templates/{$template->id}", [
            'content' => '<div onmouseover="alert(1)"><iframe src="x"></iframe><strong>Seguro</strong></div>',
        ]);

        $response->assertOk();
        $this->assertSame(
            '<div><strong>Seguro</strong></div>',
            $template->refresh()->content,
        );
    }

    public function test_render_sanitizes_template_and_escapes_variable_values()
    {
        StaticVariable::create([
            'name' => 'assistido_nome',
            'description' => 'Nome completo da pessoa assistida.',
            'example' => 'Felipe',
        ]);

        $template = Template::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Render Sanitized',
            'content' => '<p onclick="alert(1)">Hello {{assistido_nome}}</p>',
            'visibility' => 'public',
        ]);

        $response = $this->postJson("/api/templates/{$template->id}/render", [
            'variables' => [
                'assistido_nome' => '<img src=x onerror=alert(1)>',
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('html', '<p>Hello &lt;img src=x onerror=alert(1)&gt;</p>');
    }

    public function test_tenant_isolation()
    {
        $otherTenant = Tenant::create(['name' => 'Other Tenant']);
        $otherTemplate = Template::withoutEvents(function () use ($otherTenant) {
            return Template::create([
                'tenant_id' => $otherTenant->id,
                'title' => 'Other Template',
                'content' => 'Secret',
                'visibility' => 'private',
            ]);
        });

        // Current user (from $this->tenant) should not see other tenant's template
        $response = $this->getJson("/api/templates/{$otherTemplate->id}");

        $response->assertStatus(404); // Scoped by global scope
    }

    public function test_variable_token_attribute_is_preserved()
    {
        $payload = [
            'title' => 'Variable Test',
            'content' => '<p>Oi <span data-variable-token="nome">{{nome}}</span></p>',
            'visibility' => 'public',
        ];

        $response = $this->postJson('/api/templates', $payload);

        $response->assertCreated();
        $this->assertStringContainsString(
            'data-variable-token="nome"',
            Template::firstOrFail()->content
        );
    }

    public function test_variable_token_survives_render()
    {
        StaticVariable::create([
            'name' => 'assistido_nome',
            'description' => 'Nome completo.',
            'example' => 'Felipe',
        ]);

        $template = Template::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Render Variable Token',
            'content' => '<p>Olá <span data-variable-token="assistido_nome">{{assistido_nome}}</span></p>',
            'visibility' => 'public',
        ]);

        $response = $this->postJson("/api/templates/{$template->id}/render", [
            'variables' => ['assistido_nome' => 'Felipe'],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('html', '<p>Olá <span data-variable-token="assistido_nome">Felipe</span></p>');
    }
}
