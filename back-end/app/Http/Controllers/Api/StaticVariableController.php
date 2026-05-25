<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaticVariable;
use App\Services\AssistedVariableService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class StaticVariableController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $staticVariables = StaticVariable::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', '%' . $search . '%')
                        ->orWhere('description', 'like', '%' . $search . '%');
                });
            })
            ->orderBy('name')
            ->get()
            ->map(fn ($v) => [
                'id' => (string) $v->id,
                'name' => $v->name,
                'description' => $v->description,
                'example' => $v->example ?? '',
                'source' => 'manual',
            ]);

        $autoService = app(AssistedVariableService::class);
        $autoVariables = collect($autoService->getAutoVariables())
            ->map(function ($meta, $varName) use ($search) {
                if ($search !== '' && !str_contains($varName, $search) && !str_contains($meta['description'], $search)) {
                    return null;
                }
                return [
                    'id' => 'auto_' . $meta['field'],
                    'name' => $varName,
                    'description' => $meta['description'],
                    'example' => '',
                    'source' => 'auto',
                ];
            })
            ->filter()
            ->values();

        $merged = $staticVariables->concat($autoVariables)
            ->keyBy('name')
            ->sortKeys()
            ->values();

        return response()->json([
            'data' => $merged,
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

        $autoNames = app(AssistedVariableService::class)->getAllVariableNames();
        if (in_array($normalizedName, $autoNames)) {
            throw ValidationException::withMessages([
                'name' => ['This name conflicts with an auto-generated variable from the clients table.'],
            ]);
        }

        return $validated;
    }
}
