<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('dashboard', [
        'products' => \App\Models\Product::count(),
        'customers' => \App\Models\Customer::count(),
        'orders' => \App\Models\Order::count(),
        'deliveries' => \App\Models\Delivery::count(),
    ]);
});

Route::resource('produtos', ProductController::class)->except('show')->parameters(['produtos' => 'produto']);
Route::resource('clientes', CustomerController::class)->except('show')->parameters(['clientes' => 'cliente']);
Route::resource('pedidos', OrderController::class)->except('show')->parameters(['pedidos' => 'pedido']);
Route::resource('entregas', DeliveryController::class)->except('show')->parameters(['entregas' => 'entrega']);
