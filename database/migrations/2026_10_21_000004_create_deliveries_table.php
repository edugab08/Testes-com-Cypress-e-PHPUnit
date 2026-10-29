<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('address');
            $table->string('city');
            $table->decimal('fee', 10, 2)->default(0);
            $table->date('scheduled_at')->nullable();
            $table->string('status')->default('scheduled');
            $table->string('tracking_code')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('deliveries'); }
};
