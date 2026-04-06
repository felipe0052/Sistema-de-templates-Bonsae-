<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function adminModeLogin()
    {
        abort_unless($this->isAdminModeEnabled(), 403, 'Admin mode is disabled.');

        $tenant = Tenant::query()->firstOrCreate(
            ['domain' => 'instituicao.local'],
            ['name' => 'Instituição Admin']
        );

        $user = User::query()->firstOrCreate(
            ['email' => 'admin@instituicao.com'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Administrador',
                'password' => Hash::make('password'),
            ]
        );

        if ((int) $user->tenant_id !== (int) $tenant->id) {
            $user->forceFill(['tenant_id' => $tenant->id])->save();
        }

        $token = $user->createToken('admin_mode_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'mode' => 'admin',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'tenant_id' => $user->tenant_id,
            ],
        ]);
    }

    protected function isAdminModeEnabled(): bool
    {
        return (bool) config('app.admin_mode_enabled');
    }
}
