<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with('template:id,title')
            ->latest()
            ->paginate(20);
            
        return response()->json($documents);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:templates,id',
            'name' => 'required|string|max:255',
            'data_json' => 'required|array',
            'rendered_content' => 'nullable|string',
        ]);

        $document = Document::create([
            'template_id' => $validated['template_id'],
            'name' => $validated['name'],
            'data_json' => $validated['data_json'],
            'rendered_content' => $validated['rendered_content'] ?? null,
            'created_by' => auth()->id(),
            'tenant_id' => auth()->user()->tenant_id,
        ]);

        return response()->json($document, 201);
    }

    public function show(Document $document)
    {
        return response()->json($document->load('template'));
    }

    public function destroy(Document $document)
    {
        $document->delete();
        return response()->json(null, 204);
    }
}
