<?php

namespace Tests\Feature;

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
        Storage::fake('s3');

        $payload = [
            'title' => 'New Template',
            'content' => 'Hello {{assistido_nome}}',
            'visibility' => 'public',
            'background_image' => UploadedFile::fake()->image('bg.jpg')
        ];

        $response = $this->postJson('/api/templates', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('templates', ['title' => 'New Template']);
        
        $template = Template::first();
        $this->assertNotNull($template->background_image_url);
        
        // Check if file was uploaded to S3
        $path = 'templates/backgrounds/' . $payload['background_image']->hashName();
        Storage::disk('s3')->assertExists($path);
    }

    public function test_can_render_template()
    {
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
            ->assertJsonFragment(['html' => '<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Documento Gerado</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            position: relative;
            width: 21cm;
            height: 29.7cm;
        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image: url(\'\');
            background-size: cover;
            background-position: center;
            opacity: 1;
        }
        .content {
            padding: 2.5cm 2.5cm; /* Margens padrão ABNT ou conforme necessário */
            position: relative;
            z-index: 1;
            line-height: 1.5;
            font-size: 12pt;
        }
    </style>
</head>
<body>
    <div class="content">
        Hello Felipe
    </div>
</body>
</html>
']);
    }

    public function test_tenant_isolation()
    {
        $otherTenant = Tenant::create(['name' => 'Other Tenant']);
        $otherTemplate = Template::create([
            'tenant_id' => $otherTenant->id,
            'title' => 'Other Template',
            'content' => 'Secret',
            'visibility' => 'private',
        ]);

        // Current user (from $this->tenant) should not see other tenant's template
        $response = $this->getJson("/api/templates/{$otherTemplate->id}");

        $response->assertStatus(404); // Scoped by global scope
    }
}
