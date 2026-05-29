<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'code' => 'UNAUTHORIZED',
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $user = auth()->user();
        
        $tenantId = null;
        if ($user->currentAccessToken()) {
            foreach ($user->currentAccessToken()->abilities as $ability) {
                if (str_starts_with($ability, 'tenant:')) {
                    $tenantId = str_replace('tenant:', '', $ability);
                    break;
                }
            }
        }

        if (!$tenantId && !$user->tenant_id) {
            return response()->json([
                'code' => 'UNAUTHORIZED_TENANT',
                'message' => 'User is not associated with any institution.',
            ], 403);
        }

        // Override the user's tenant_id attribute for this request lifecycle
        // so that existing code auth()->user()->tenant_id works seamlessly for multi-tenant users
        $user->tenant_id = $tenantId ?? $user->tenant_id;

        return $next($request);
    }
}
