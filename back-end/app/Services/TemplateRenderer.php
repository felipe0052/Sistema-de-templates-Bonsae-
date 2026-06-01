<?php

namespace App\Services;

use App\Models\StaticVariable;
use App\Models\Template;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TemplateRenderer
{
    public function __construct(private TemplateHtmlSanitizer $sanitizer)
    {
    }

    /**
     * Render the template with the provided variables.
     *
     * @param Template $template
     * @param array $values
     * @param string $missingVariableBehavior ('blank' or 'underline')
     * @return string
     */
    public function render(
        Template $template,
        array $values,
        string $missingVariableBehavior = "blank",
    ): string {
        $values['data_atual'] ??= now()->format('d/m/Y');

        $content = $this->sanitizer->sanitize($template->content);

        foreach ($this->getAvailableVariables() as $variable) {
            $placeholder = "{{" . $variable . "}}";
            $replacement = isset($values[$variable])
                ? e((string) $values[$variable])
                : $this->getMissingValue($missingVariableBehavior);
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
    public function generatePdf(
        string $htmlContent,
        ?string $backgroundImageUrl = null,
    ) {
        $html = view("templates.render_pdf", [
            "content" => $htmlContent,
            "backgroundImage" => $this->resolveBackgroundImage($backgroundImageUrl),
        ])->render();

        return Pdf::loadHTML($html)->setPaper("a4")->output();
    }

    protected function resolveBackgroundImage(?string $backgroundImageUrl): ?string
    {
        if (empty($backgroundImageUrl) || Str::startsWith($backgroundImageUrl, ['http://', 'https://', 'data:'])) {
            return $backgroundImageUrl;
        }

        $disk = Storage::disk(config("filesystems.template_background_disk", "public"));
        if (!$disk->exists($backgroundImageUrl)) {
            return null;
        }

        $mimeType = $disk->mimeType($backgroundImageUrl) ?: "image/png";
        return "data:" . $mimeType . ";base64," . base64_encode($disk->get($backgroundImageUrl));
    }

    protected function getMissingValue(string $behavior): string
    {
        return $behavior === "underline" ? "____________________" : "";
    }

    public function getAvailableVariables(): array
    {
        $staticVariables = StaticVariable::query()->orderBy("name")->pluck("name")->all();
        $autoVariables = app(AssistedVariableService::class)->getAllVariableNames();
        $merged = array_unique(array_merge($staticVariables, $autoVariables));
        sort($merged);
        return $merged;
    }
}
