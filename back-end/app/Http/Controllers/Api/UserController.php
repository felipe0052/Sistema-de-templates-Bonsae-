<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function show(Request $request)
    {
        return $request->user()->load('tenant');
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'preferences' => 'sometimes|array',
            'preferences.pdf_default_format' => 'sometimes|string|in:a4,letter,legal',
            'preferences.pdf_margin_top' => 'sometimes|numeric|min:0|max:100',
            'preferences.pdf_margin_bottom' => 'sometimes|numeric|min:0|max:100',
            'preferences.pdf_margin_left' => 'sometimes|numeric|min:0|max:100',
            'preferences.pdf_margin_right' => 'sometimes|numeric|min:0|max:100',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['preferences'])) {
            $allowed = ['pdf_default_format', 'pdf_margin_top', 'pdf_margin_bottom', 'pdf_margin_left', 'pdf_margin_right'];
            $sanitized = array_intersect_key($validated['preferences'], array_flip($allowed));
            $user->preferences = array_merge(
                $user->preferences ?? [],
                $sanitized
            );
        }

        $user->save();

        return response()->json($user);
    }
}
