<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assisted;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class AssistedController extends Controller
{
    public function index()
    {
        $assisteds = $this->accessibleAssisteds()
            ->latest()
            ->get();

        return response()->json(['data' => $assisteds]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'cpf'      => 'nullable|string|max:30',
            'email'    => 'nullable|email',
            'telephone'=> 'nullable|string|max:30',
        ]);

        $data['creator_id'] = auth()->id();

        return response()->json(Assisted::create($data), 201);
    }

    public function show(Assisted $assisted)
    {
        $this->ensureAssistedBelongsToCurrentTenant($assisted);

        return response()->json($assisted);
    }

    public function update(Request $request, Assisted $assisted)
    {
        $this->ensureAssistedBelongsToCurrentTenant($assisted);

        $data = $request->validate([
            'name'      => 'sometimes|required|string',
            'cpf'       => 'nullable|string|max:30',
            'email'     => 'nullable|email',
            'telephone' => 'nullable|string|max:30',
        ]);

        $assisted->update($data);
        return response()->json($assisted);
    }

    public function destroy(Assisted $assisted)
    {
        $this->ensureAssistedBelongsToCurrentTenant($assisted);

        $assisted->delete();
        return response()->json(null, 204);
    }

    protected function accessibleAssisteds(): Builder
    {
        return Assisted::query()
            ->whereHas('creator', function (Builder $query): void {
                $query->where('tenant_id', auth()->user()->tenant_id);
            });
    }

    protected function ensureAssistedBelongsToCurrentTenant(Assisted $assisted): void
    {
        if (! $this->accessibleAssisteds()->whereKey($assisted->getKey())->exists()) {
            throw (new ModelNotFoundException())->setModel(Assisted::class, [
                $assisted->getKey(),
            ]);
        }
    }
}
