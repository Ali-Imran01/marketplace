<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('condition'); // Enum values: NEW, LIKE_NEW, GOOD, FAIR
            $table->decimal('price', 10, 2);
            $table->string('status')->default('AVAILABLE'); // Enum values: AVAILABLE, RESERVED, SOLD
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
