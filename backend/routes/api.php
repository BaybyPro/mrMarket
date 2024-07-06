<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PayController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;





Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::resource('clients', ClientController::class);
    Route::resource('loans', LoanController::class);
    Route::resource('pays', PayController::class);
    Route::get('clientsFilter',[ClientController::class,'getClientsByFilter']);
    Route::get('client/{loanId}', [ClientController::class, 'getClientsByLoan']);
    Route::post('register',[AuthController::class, 'register']);
    Route::get('user',[AuthController::class,'getUser']);
    Route::get('users',[AuthController::class,'getUsers']);
    Route::get('user/{id}',[AuthController::class,'getUserById']);
    Route::post('getUsersByIds',[AuthController::class,'getUsersByIds']);
    Route::put('user/{id}', [AuthController::class, 'updateUser']);
    Route::delete('user/{id}', [AuthController::class, 'deleteUser']);
    Route::get('loan/{id}',[LoanController::class,'getLoanById']);
    Route::get('loansClient/{id}',[LoanController::class,'getLoanByClient']);
    Route::get('loanActive',[LoanController::class,'getLoanActive']);
    Route::get('getPaysByLoan/{loan_id}',[PayController::class,'getPaysByLoan']);
    Route::get('getPaysActive/{loan_id}',[PayController::class,'getPaysActive']);
    Route::get('getPaysLader/{loan_id}',[PayController::class,'getPaysLader']);
    Route::get('dashboard',[DashboardController::class,'getDashboardData']);
    Route::get('dashboard/{date}',[DashboardController::class,'getDataByMonth']);
    Route::get('dataUser/{date}',[DashboardController::class,'getdataUser']);
    Route::get('dashboardDay/{day}', [DashboardController::class, 'getDataByDay']);
});