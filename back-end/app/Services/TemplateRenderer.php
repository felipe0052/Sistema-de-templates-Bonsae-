<?php

namespace App\Services;

use App\Models\StaticVariable;
use App\Models\Template;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Support\Facades\Log;

class TemplateRenderer
{
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

        foreach ($this->getAvailableVariables() as $variable) {
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

    public function getAvailableVariables(): array
    {
        return StaticVariable::query()
            ->orderBy('name')
            ->pluck('name')
            ->all();
    }
}
