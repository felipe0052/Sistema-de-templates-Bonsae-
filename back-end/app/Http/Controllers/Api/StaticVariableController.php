<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaticVariable;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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
        $validated = $this->validatePayload($request);

        $validated['name'] = strtolower($validated['name']);

        $variable = StaticVariable::create($validated);

        return response()->json($variable, 201);
    }

    public function update(Request $request, StaticVariable $variable)
    {
        $validated = $this->validatePayload($request, $variable);

        $validated['name'] = strtolower($validated['name']);

        $variable->update($validated);

        return response()->json($variable);
    }

    public function destroy(StaticVariable $variable)
    {
        $variable->delete();

        return response()->noContent();
    }

    protected function validatePayload(Request $request, ?StaticVariable $variable = null): array
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('static_variables', 'name')->ignore($variable?->id),
            ],
            'description' => ['required', 'string'],
            'example' => ['nullable', 'string', 'max:255'],
        ]);

        $normalizedName = strtolower($validated['name']);

        $exists = StaticVariable::query()
            ->whereRaw('LOWER(name) = ?', [$normalizedName])
            ->when($variable, fn ($query) => $query->whereKeyNot($variable->id))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'name' => ['The name has already been taken.'],
            ]);
        }

        return $validated;
    }
}
