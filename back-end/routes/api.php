<?php

use App\Http\Controllers\Api\UnifiedAuthController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\StaticVariableController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Middleware\EnsureUserHasTenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AssistedController;

// Rota de Login para obter o token de teste (Mantida para comp. mas com Unified Auth Controller)
Route::post('/auth/identify', [UnifiedAuthController::class, 'identify']);
Route::post('/auth/login', [UnifiedAuthController::class, 'login']);
Route::post('/auth/activate', [UnifiedAuthController::class, 'activate']);
Route::middleware('auth:sanctum')->post('/auth/select-tenant', [UnifiedAuthController::class, 'selectTenant']);

// Rota antiga para retrocompatibilidade do front end enquanto mudamos
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/admin-mode/login', [\App\Http\Controllers\Api\AuthController::class, 'adminModeLogin']);

Route::get('templates/{template}/background', [TemplateController::class, 'background'])
    ->middleware('signed')
    ->name('api.templates.background');

// Variáveis disponíveis
Route::get('/variables', [StaticVariableController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::middleware(EnsureUserHasTenant::class)->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // CRUD de Templates
        Route::apiResource('templates', TemplateController::class);
        
        // CRUD de Documentos Gerados
        Route::apiResource('documents', DocumentController::class);

        // CRUD de Assistidos
        Route::apiResource('assisteds', AssistedController::class);
        
        Route::post('/variables', [StaticVariableController::class, 'store']);
        Route::put('/variables/{variable}', [StaticVariableController::class, 'update']);
        Route::delete('/variables/{variable}', [StaticVariableController::class, 'destroy']);

        Route::post('templates/{template}/render', [TemplateController::class, 'render'])->name('api.templates.render');
        
        Route::get('templates/render-status/{jobId}', function ($jobId) {
            return response()->json([
                'job_id' => $jobId,
                'status' => 'processing',
                'message' => 'Your document is being processed.'
            ]);
        })->name('api.templates.render-status');
    });
});
