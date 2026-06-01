<?php

namespace App\Services;

use App\Models\StaticVariable;
use App\Models\Template;
use Mpdf\Mpdf;
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
     * @param array|null $preferences
     * @return string
     */
    public function generatePdf(
        string $htmlContent,
        ?string $backgroundImageUrl = null,
        ?array $preferences = null,
    ): string {
        ini_set("pcre.backtrack_limit", "2000000");

        $format = $preferences['pdf_default_format'] ?? 'A4';
        $mL = (int) ($preferences['pdf_margin_left'] ?? 20);
        $mR = (int) ($preferences['pdf_margin_right'] ?? 20);
        $mT = (int) ($preferences['pdf_margin_top'] ?? 20);
        $mB = (int) ($preferences['pdf_margin_bottom'] ?? 20);

        $formatMap = [
            'a4'     => 'A4',
            'letter' => 'LETTER',
            'legal'  => [216, 356],
        ];
        $pageFormat = $formatMap[$format] ?? 'A4';

        $mpdf = new Mpdf([
            'format'        => $pageFormat,
            'margin_left'   => $mL,
            'margin_right'  => $mR,
            'margin_top'    => $mT,
            'margin_bottom' => $mB,
            'default_font'  => 'times',
        ]);

        $bgUrl = $this->resolveBackgroundImage($backgroundImageUrl);

        if ($bgUrl) {
            $mpdf->SetWatermarkImage($bgUrl, 1, [$mpdf->fw, $mpdf->fh], 'P');
            $mpdf->showWatermarkImage = true;
            $mpdf->watermarkImgBehind = true;
        }

        $html = view("templates.render_pdf", [
            "content" => $htmlContent,
        ])->render();

        $html = preg_replace('/@import\s+url\s*\(/i', '/* @import disabled */', $html);

        $mpdf->WriteHTML($html);
        return $mpdf->Output('', 'S');
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
