<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Middleware\EnsureUserHasTenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rota de Login para obter o token de teste
Route::post('/login', [AuthController::class, 'login']);

// Variáveis disponíveis (tornada pública para fácil visualização de teste)
Route::get('/variables', [TemplateController::class, 'listVariables']);

Route::middleware('auth:sanctum')->group(function () {
    Route::middleware(EnsureUserHasTenant::class)->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // CRUD de Templates
        Route::apiResource('templates', TemplateController::class);

        // Renderização de Templates
        Route::post('templates/{template}/render', [TemplateController::class, 'render'])->name('api.templates.render');
        
        // Geração Assíncrona (exemplo de status)
        Route::get('templates/render-status/{jobId}', function ($jobId) {
            return response()->json([
                'job_id' => $jobId,
                'status' => 'processing', // Mock
                'message' => 'Your document is being processed.'
            ]);
        })->name('api.templates.render-status');
    });
});
