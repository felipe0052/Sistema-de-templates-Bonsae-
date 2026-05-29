<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Throwable;

class UnifiedAuthController extends Controller
{
    public function identify(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['E-mail não encontrado na base de dados. Entre em contato com a coordenação do NPJ.'],
            ]);
        }

        if (!$user->password) {
            // Primeiro acesso
            $token = Str::random(60);
            DB::table('activation_tokens')->updateOrInsert(
                ['email' => $user->email],
                ['token' => Hash::make($token), 'created_at' => Carbon::now()]
            );

            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $activationLink = "{$frontendUrl}/ativar-conta?token={$token}&email=" . urlencode($user->email);

            try {
                Mail::raw(
                    "Olá, {$user->name}.\n\nAcesse o link abaixo para ativar sua conta no NPJ:\n{$activationLink}\n\nEste link expira em 15 minutos.",
                    function ($message) use ($user) {
                        $message->to($user->email, $user->name)
                            ->subject('Ativação de conta NPJ');
                    }
                );
            } catch (Throwable $exception) {
                Log::warning('Falha ao enviar e-mail de ativação NPJ; link registrado no log.', [
                    'email' => $user->email,
                    'error' => $exception->getMessage(),
                ]);
                Log::info("E-mail de Ativação NPJ: {$activationLink}");
            }

            return response()->json([
                'status' => 'needs_activation',
                'message' => 'Um link de ativação foi enviado para o seu e-mail.'
            ]);
        }

        return response()->json([
            'status' => 'needs_password'
        ]);
    }

    public function activate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $record = DB::table('activation_tokens')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            throw ValidationException::withMessages(['token' => ['Token inválido ou expirado.']]);
        }

        if (Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
            DB::table('activation_tokens')->where('email', $request->email)->delete();
            throw ValidationException::withMessages(['token' => ['Token expirado. Solicite um novo acesso.']]);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('activation_tokens')->where('email', $request->email)->delete();

        return $this->issueTokenOrSelection($user);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        return $this->issueTokenOrSelection($user);
    }

    public function selectTenant(Request $request)
    {
        $request->validate(['tenant_id' => 'required|exists:tenants,id']);
        $user = $request->user();

        if (!$user->tokenCan('select-tenant')) {
            abort(403, 'Ação não permitida com este token.');
        }

        if (!$user->tenants()->where('tenants.id', $request->tenant_id)->exists() && $user->tenant_id != $request->tenant_id) {
            throw ValidationException::withMessages(['tenant_id' => ['Você não tem acesso a este tenant.']]);
        }

        // Delete the temporary selection token
        $user->currentAccessToken()->delete();

        // Issue actual token
        $token = $user->createToken('auth_token', ['tenant:' . $request->tenant_id])->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'tenant_id' => $request->tenant_id,
            'user' => $user
        ]);
    }

    private function issueTokenOrSelection(User $user)
    {
        $tenants = $user->tenants()->get();
        if ($tenants->isEmpty() && $user->tenant_id) {
            $tenants = Tenant::where('id', $user->tenant_id)->get();
        }

        if ($tenants->count() > 1) {
            $token = $user->createToken('select_tenant_token', ['select-tenant'])->plainTextToken;
            return response()->json([
                'status' => 'needs_tenant_selection',
                'access_token' => $token,
                'tenants' => $tenants
            ]);
        }

        $tenantId = $tenants->first()->id ?? $user->tenant_id;
        
        if (!$tenantId) {
            throw ValidationException::withMessages(['email' => ['Usuário não possui tenant vinculado.']]);
        }

        $token = $user->createToken('auth_token', ['tenant:' . $tenantId])->plainTextToken;

        return response()->json([
            'status' => 'logged_in',
            'access_token' => $token,
            'tenant_id' => $tenantId,
            'user' => $user
        ]);
    }
}
