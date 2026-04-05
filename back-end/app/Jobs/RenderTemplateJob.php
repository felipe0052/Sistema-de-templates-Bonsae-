<?php

namespace App\Jobs;

use App\Models\Template;
use App\Services\TemplateRenderer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class RenderTemplateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $template;
    protected $variables;
    protected $behavior;
    protected $jobId;

    public function __construct(Template $template, array $variables, string $behavior, string $jobId)
    {
        $this->template = $template;
        $this->variables = $variables;
        $this->behavior = $behavior;
        $this->jobId = $jobId;
    }

    public function handle(TemplateRenderer $renderer)
    {
        try {
            // Renderiza o HTML
            $htmlContent = $renderer->render($this->template, $this->variables, $this->behavior);
            
            // Gera o PDF (Mock/HTML neste caso)
            $pdfHtml = $renderer->generatePdf($htmlContent, $this->template->background_image_url);

            // Armazena no S3 como um arquivo temporário
            $fileName = "rendered/{$this->jobId}.pdf";
            Storage::disk('s3')->put($fileName, $pdfHtml);

            // Aqui você poderia notificar o usuário via Webhook ou salvar o status em um banco de dados
            Log::info("Job {$this->jobId} completed successfully.");

        } catch (\Exception $e) {
            Log::error("Error in RenderTemplateJob {$this->jobId}: " . $e->getMessage());
            throw $e;
        }
    }
}
