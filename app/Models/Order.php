<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = ['customer_id', 'product_id', 'quantity', 'unit_price', 'status', 'notes'];

    protected $casts = ['unit_price' => 'decimal:2'];

    protected $appends = ['total'];

    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function delivery(): HasOne { return $this->hasOne(Delivery::class); }
    public function getTotalAttribute(): float { return (float) $this->quantity * (float) $this->unit_price; }
}
