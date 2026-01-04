<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ItemController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        
        // Protected resource routes
        Route::get('my-items', [ItemController::class, 'myItems']);
        Route::apiResource('items', ItemController::class)->except(['index', 'show']);
        Route::apiResource('transactions', TransactionController::class);
        Route::apiResource('reviews', ReviewController::class)->only(['store']);

        // Admin Routes
        Route::prefix('admin')->group(function () {
            Route::get('/users', [AdminController::class, 'users']);
            Route::put('/users/{user}', [AdminController::class, 'updateUser']);
            Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
            Route::get('/items', [AdminController::class, 'items']);
            Route::delete('/items/{item}', [AdminController::class, 'deleteItem']);
        });

        // Chat Routes
        Route::get('/chat', [ChatController::class, 'index']);
        Route::get('/chat/{transaction}', [ChatController::class, 'getChat']);
        Route::post('/chat', [ChatController::class, 'store']);
        Route::put('/chat/{message}/read', [ChatController::class, 'markAsRead']);

        // Notification Routes
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

        // Payment Routes
        Route::post('/transactions/{transaction}/checkout', [\App\Http\Controllers\API\PaymentController::class, 'checkout']);
        Route::post('/payments/{payment}/callback', [\App\Http\Controllers\API\PaymentController::class, 'callback']);

        // Profile Routes
        Route::put('/profile', [UserController::class, 'update']);
    });

    // Public routes
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('items', ItemController::class)->only(['index', 'show']);
    Route::apiResource('reviews', ReviewController::class)->only(['index']);

    Route::get('/ping', function () {
        return response()->json(['message' => 'pong']);
    });
});
