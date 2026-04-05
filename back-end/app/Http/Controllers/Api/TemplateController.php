<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Services\TemplateRenderer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TemplateController extends Controller
{
    protected $renderer;

    public function __construct(TemplateRenderer $renderer)
    {
        $this->renderer = $renderer;
    }

    public function index()
    {
        $templates = Template::all(); // Alterado de paginate para retornar todos
        return response()->json([
            'data' => $templates
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'variables' => 'nullable|array',
            'background_image' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'visibility' => 'required|in:public,private',
            'metadata' => 'nullable|array',
        ]);

        $data = $validated;
        $data['created_by'] = auth()->id() ?? 1; // Fallback para ID 1 se não autenticado (teste)
        $data['tenant_id'] = auth()->user()->tenant_id ?? 1; // Garante tenant_id no store

        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('templates/backgrounds', 'public');
            $data['background_image_url'] = asset('storage/' . $path);
        }

        $template = Template::create($data);

        return response()->json($template, 201);
    }

    public function show(Template $template)
    {
        return response()->json($template);
    }

    public function update(Request $request, Template $template)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'variables' => 'nullable|array',
            'background_image' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'visibility' => 'sometimes|required|in:public,private',
            'metadata' => 'nullable|array',
        ]);

        $data = $validated;

        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('templates/backgrounds', 'public');
            $data['background_image_url'] = asset('storage/' . $path);
        }

        $template->update($data);

        return response()->json($template);
    }

    public function destroy(Template $template)
    {
        $template->delete();
        return response()->json(null, 204);
    }

    public function render(Request $request, Template $template)
    {
        $validated = $request->validate([
            'variables' => 'required|array',
            'missing_variable_behavior' => 'nullable|in:blank,underline',
            'format' => 'nullable|in:html,pdf',
        ]);

        $behavior = $validated['missing_variable_behavior'] ?? 'blank';
        $format = $validated['format'] ?? 'html';

        $renderedContent = $this->renderer->render($template, $validated['variables'], $behavior);

        if ($format === 'pdf') {
            return response()->json([
                'html' => $renderedContent,
                'message' => 'PDF rendering requires wkhtmltopdf binary on system. Returning HTML for preview.'
            ]);
        }

        return response()->json([
            'html' => $renderedContent,
            'template_id' => $template->id,
            'variables' => $validated['variables'],
        ]);
    }

    public function listVariables()
    {
        return response()->json([
            'available_variables' => TemplateRenderer::$AVAILABLE_VARIABLES
        ]);
    }
}
