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
        Storage::fake('public');

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
        Storage::disk('public')->assertExists($path);
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
}
