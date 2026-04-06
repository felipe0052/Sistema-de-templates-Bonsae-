<?php

namespace Database\Factories;

use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Template>
 */
class TemplateFactory extends Factory
{
    protected $model = Template::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'content' => 'Conteúdo {{assistido_nome}}',
            'variables' => ['assistido_nome'],
            'visibility' => 'public',
            'metadata' => [],
        ];
    }
}
