<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Services\TemplateHtmlSanitizer;
use App\Services\TemplateRenderer;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TemplateController extends Controller
{
    public function __construct(
        protected TemplateRenderer $renderer,
        protected TemplateHtmlSanitizer $sanitizer,
    )
    {
    }

    public function index()
    {
        $templates = Template::all(); // Alterado de paginate para retornar todos
        return response()->json([
            "data" => $templates->map(fn (Template $template) => $this->serializeTemplate($template)),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => "required|string|max:255",
            "content" => "required|string",
            "variables" => "nullable|array",
            "background_image" => "nullable|image|mimes:jpg,jpeg,png|max:5120",
            "background_image_url" => "nullable|string",
            "visibility" => "required|in:public,private",
            "metadata" => "nullable|array",
        ]);

        $data = $validated;
        $data["content"] = $this->sanitizer->sanitize($data["content"]);
        $data["created_by"] = auth()->id() ?? 1; // Fallback para ID 1 se não autenticado (teste)
        $data["tenant_id"] = auth()->user()->tenant_id ?? 1; // Garante tenant_id no store

        unset($data["background_image"], $data["background_image_url"]);
        $data["background_image_url"] = $this->storeBackgroundImage($request);

        $template = Template::create($data);

        return response()->json($this->serializeTemplate($template), 201);
    }

    public function show(Template $template)
    {
        $this->ensureTemplateBelongsToCurrentTenant($template);

        return response()->json($this->serializeTemplate($template));
    }

    public function update(Request $request, Template $template)
    {
        $this->ensureTemplateBelongsToCurrentTenant($template);

        $validated = $request->validate([
            "title" => "sometimes|required|string|max:255",
            "content" => "sometimes|required|string",
            "variables" => "nullable|array",
            "background_image" => "nullable|image|mimes:jpg,jpeg,png|max:5120",
            "background_image_url" => "nullable|string",
            "visibility" => "sometimes|required|in:public,private",
            "metadata" => "nullable|array",
        ]);

        $data = $validated;
        if (array_key_exists("content", $data)) {
            $data["content"] = $this->sanitizer->sanitize($data["content"]);
        }

        unset($data["background_image"], $data["background_image_url"]);
        $backgroundPath = $this->storeBackgroundImage($request);
        if ($backgroundPath !== null || $request->has("background_image_url")) {
            $data["background_image_url"] = $backgroundPath;
        }

        $template->update($data);

        return response()->json($this->serializeTemplate($template));
    }

    public function destroy(Template $template)
    {
        $this->ensureTemplateBelongsToCurrentTenant($template);

        $template->delete();
        return response()->json(null, 204);
    }

    public function render(Request $request, Template $template)
    {
        $this->ensureTemplateBelongsToCurrentTenant($template);

        $validated = $request->validate([
            "variables" => "required|array",
            "missing_variable_behavior" => "nullable|in:blank,underline",
            "format" => "nullable|in:html,pdf",
        ]);

        $behavior = $validated["missing_variable_behavior"] ?? "blank";
        $format = $validated["format"] ?? "html";

        $renderedContent = $this->renderer->render(
            $template,
            $validated["variables"],
            $behavior,
        );

        if ($format === "pdf") {
            $pdf = $this->renderer->generatePdf(
                $renderedContent,
                $template->background_image_url,
                $request->user()->preferences ?? [],
            );

            return response($pdf, Response::HTTP_OK, [
                "Content-Type" => "application/pdf",
                "Content-Disposition" =>
                    'attachment; filename="template-' .
                    $template->id .
                    "-" .
                    now()->format("Ymd_His") .
                    '.pdf"',
            ]);
        }

        return response()->json([
            "html" => $renderedContent,
            "template_id" => $template->id,
            "variables" => $validated["variables"],
        ]);
    }

    public function background(Template $template)
    {
        $path = $template->background_image_url;

        if (empty($path) || Str::startsWith($path, ['http://', 'https://', 'data:'])) {
            abort(404);
        }

        $disk = Storage::disk($this->backgroundDisk());
        if (!$disk->exists($path)) {
            abort(404);
        }

        return response($disk->get($path), Response::HTTP_OK, [
            "Content-Type" => $disk->mimeType($path) ?: "application/octet-stream",
            "Cache-Control" => "private, max-age=300",
        ]);
    }

    protected function storeBackgroundImage(Request $request): ?string
    {
        $disk = $this->backgroundDisk();

        if ($request->hasFile("background_image")) {
            return $request->file("background_image")->store("templates/backgrounds", $disk);
        }

        $dataUrl = $request->input("background_image_url");
        if (!is_string($dataUrl) || trim($dataUrl) === "") {
            return null;
        }

        if (Str::startsWith($dataUrl, ['http://', 'https://'])) {
            return $dataUrl;
        }

        if (!preg_match('/^data:image\/(png|jpe?g);base64,(.+)$/i', $dataUrl, $matches)) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, "Imagem do papel timbrado inválida.");
        }

        $binary = base64_decode($matches[2], true);
        if ($binary === false || strlen($binary) > 5 * 1024 * 1024) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, "Imagem do papel timbrado inválida ou maior que 5MB.");
        }

        $extension = strtolower($matches[1]) === "jpeg" ? "jpg" : strtolower($matches[1]);
        $path = "templates/backgrounds/" . (string) Str::uuid() . "." . $extension;
        Storage::disk($disk)->put($path, $binary);

        return $path;
    }

    protected function serializeTemplate(Template $template): array
    {
        $data = $template->toArray();

        if (!empty($template->background_image_url) && !Str::startsWith($template->background_image_url, ['http://', 'https://', 'data:'])) {
            $data["background_image_path"] = $template->background_image_url;
            $data["background_image_url"] = URL::temporarySignedRoute(
                "api.templates.background",
                now()->addMinutes(30),
                ["template" => $template->id],
            );
        }

        return $data;
    }

    protected function backgroundDisk(): string
    {
        return config("filesystems.template_background_disk", "public");
    }

    protected function ensureTemplateBelongsToCurrentTenant(
        Template $template,
    ): void {
        if (
            auth()->check() &&
            (int) $template->tenant_id !== (int) auth()->user()->tenant_id
        ) {
            throw new ModelNotFoundException()->setModel(Template::class, [
                $template->id,
            ]);
        }
    }
}
