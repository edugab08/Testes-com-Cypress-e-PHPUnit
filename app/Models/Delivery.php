<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delivery extends Model
{
    protected $fillable = ['order_id', 'address', 'city', 'fee', 'scheduled_at', 'status', 'tracking_code'];

    protected $casts = ['fee' => 'decimal:2', 'scheduled_at' => 'date'];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
}
