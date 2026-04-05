<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->tenant_id) {
            return response()->json([
                'code' => 'UNAUTHORIZED_TENANT',
                'message' => 'User is not associated with any institution.',
            ], 403);
        }

        return $next($request);
    }
}
