<?php

namespace App\Services;

use App\Models\Template;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Support\Facades\Log;

class TemplateRenderer
{
    /**
     * List of fixed variables available for the system.
     */
    public static array $AVAILABLE_VARIABLES = [
        'assistido_nome',
        'cpf',
        'data_nascimento',
        'nome_pai',
        'nome_mae',
        'endereco',
        'cidade',
        'data_atual',
    ];

    /**
     * Render the template with the provided variables.
     *
     * @param Template $template
     * @param array $values
     * @param string $missingVariableBehavior ('blank' or 'underline')
     * @return string
     */
    public function render(Template $template, array $values, string $missingVariableBehavior = 'blank'): string
    {
        $content = $template->content;

        foreach (self::$AVAILABLE_VARIABLES as $variable) {
            $placeholder = "{{" . $variable . "}}";
            $replacement = $values[$variable] ?? $this->getMissingValue($missingVariableBehavior);
            $content = str_replace($placeholder, $replacement, $content);
        }

        return $content;
    }

    /**
     * Generate PDF from the rendered content.
     *
     * @param string $htmlContent
     * @param string|null $backgroundImageUrl
     * @return mixed
     */
    public function generatePdf(string $htmlContent, ?string $backgroundImageUrl = null)
    {
        $html = view('templates.render_pdf', [
            'content' => $htmlContent,
            'backgroundImage' => $backgroundImageUrl
        ])->render();

        // In a real environment, you would use SnappyPdf or similar
        // SnappyPdf::loadHTML($html)->setPaper('a4')->setOption('margin-bottom', 0);
        
        // For this example, let's just return the HTML or a mock binary if snappy is not available
        return $html;
    }

    protected function getMissingValue(string $behavior): string
    {
        return $behavior === 'underline' ? '____________________' : '';
    }
}
