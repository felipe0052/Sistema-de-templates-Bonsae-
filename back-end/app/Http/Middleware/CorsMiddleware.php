<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = array_filter(array_map('trim', explode(',', env('FRONTEND_URL', '*'))));

        $origin = $request->headers->get('Origin', '');

        if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
            $headers = [
                'Access-Control-Allow-Origin'  => in_array('*', $allowedOrigins) ? '*' : $origin,
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
            ];

            if ($request->isMethod('OPTIONS')) {
                return response('', 204)->withHeaders($headers);
            }

            $response = $next($request);

            foreach ($headers as $key => $value) {
                $response->headers->set($key, $value);
            }

            return $response;
        }

        return $next($request);
    }
}
