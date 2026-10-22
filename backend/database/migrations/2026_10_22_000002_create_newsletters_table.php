<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Idempotent: the table may pre-exist if it was created manually on
        // production (e.g. via phpMyAdmin) without a migrations-table record.
        if (Schema::hasTable('newsletters')) {
            return;
        }

        Schema::create('newsletters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('subject');
            $table->string('preheader')->nullable();
            $table->longText('content')->nullable();
            $table->string('header_image')->nullable();
            $table->string('background_color', 9)->default('#ffffff');
            $table->string('text_color', 9)->default('#0f172a');
            $table->string('accent_color', 9)->default('#2563eb');
            $table->string('status')->default('draft');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletters');
    }
};
