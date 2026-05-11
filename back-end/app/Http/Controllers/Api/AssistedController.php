<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assisted;
use Illuminate\Http\Request;

class AssistedController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Assisted::all()]);
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
        return response()->json($assisted);
    }

    public function update(Request $request, Assisted $assisted)
    {
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
        $assisted->delete();
        return response()->json(null, 204);
    }
}