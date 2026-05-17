<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Assisted;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssistedController extends Controller
{
    public function index(Request $request)
    {
        $query = $this->accessibleAssisteds()->with('address');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('cpf', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('social_name', 'like', "%{$search}%")
                    ->orWhereHas('address', function (Builder $aq) use ($search) {
                        $aq->where('street_name', 'like', "%{$search}%")
                            ->orWhere('city', 'like', "%{$search}%")
                            ->orWhere('state', 'like', "%{$search}%")
                            ->orWhere('cep', 'like', "%{$search}%")
                            ->orWhere('neighborhood', 'like', "%{$search}%");
                    });
            });
        }

        $assisteds = $query->latest()->get();

        return response()->json(['data' => $assisteds]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'cpf'       => 'nullable|string|max:30',
            'email'     => 'nullable|email',
            'telephone' => 'nullable|string|max:30',
            'address'   => 'nullable|array',
            'address.cep' => 'nullable|string|max:20',
            'address.street_name' => 'nullable|string|max:191',
            'address.number' => 'nullable|string|max:20',
            'address.complement' => 'nullable|string|max:191',
            'address.neighborhood' => 'nullable|string|max:100',
            'address.city' => 'nullable|string|max:100',
            'address.state' => 'nullable|string|max:2',
        ]);

        $addressId = null;

        if (!empty($data['address'])) {
            $addressData = $data['address'];
            $address = Address::create($addressData);
            $addressId = $address->id;
        }

        unset($data['address']);
        $data['creator_id'] = auth()->id();
        $data['address_id'] = $addressId;

        $assisted = Assisted::create($data);

        return response()->json($assisted->load('address'), 201);
    }

    public function show(Assisted $assisted)
    {
        $this->ensureAssistedBelongsToCurrentTenant($assisted);

        return response()->json($assisted->load('address'));
    }

    public function update(Request $request, Assisted $assisted)
    {
        $this->ensureAssistedBelongsToCurrentTenant($assisted);

        $data = $request->validate([
            'name'      => 'sometimes|required|string',
            'cpf'       => 'nullable|string|max:30',
            'email'     => 'nullable|email',
            'telephone' => 'nullable|string|max:30',
            'address'   => 'nullable|array',
            'address.cep' => 'nullable|string|max:20',
            'address.street_name' => 'nullable|string|max:191',
            'address.number' => 'nullable|string|max:20',
            'address.complement' => 'nullable|string|max:191',
            'address.neighborhood' => 'nullable|string|max:100',
            'address.city' => 'nullable|string|max:100',
            'address.state' => 'nullable|string|max:2',
        ]);

        if (!empty($data['address'])) {
            $addressData = $data['address'];

            if ($assisted->address_id) {
                $assisted->address->update($addressData);
            } else {
                $address = Address::create($addressData);
                $assisted->address_id = $address->id;
            }
        }

        unset($data['address']);
        $assisted->update($data);

        return response()->json($assisted->load('address'));
    }

    public function destroy(Assisted $assisted)
    {
        $this->ensureAssistedBelongsToCurrentTenant($assisted);

        DB::transaction(function () use ($assisted) {
            if ($assisted->address_id) {
                $assisted->address?->delete();
            }
            $assisted->delete();
        });

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
