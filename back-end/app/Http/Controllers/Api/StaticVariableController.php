<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaticVariable;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StaticVariableController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $variables = StaticVariable::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', '%' . $search . '%')
                        ->orWhere('description', 'like', '%' . $search . '%');
                });
            })
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $variables,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('static_variables', 'name'),
            ],
            'description' => ['required', 'string'],
            'example' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['name'] = strtolower($validated['name']);

        $existing = StaticVariable::query()
            ->whereRaw('LOWER(name) = ?', [$validated['name']])
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'The name has already been taken.',
                'errors' => [
                    'name' => ['The name has already been taken.'],
                ],
            ], 422);
        }

        $variable = StaticVariable::create($validated);

        return response()->json($variable, 201);
    }
}
