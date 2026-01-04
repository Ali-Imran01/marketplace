<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // The actor
            $table->string('actor_name')->nullable();
            $table->string('actor_role')->nullable();
            $table->string('entity_type'); // Transaction, Item, etc
            $table->unsignedBigInteger('entity_id');
            $table->string('action'); // created, status_changed, etc
            $table->text('description')->nullable();
            $table->json('properties')->nullable(); // For old/new values
            $table->timestamps();
            
            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
