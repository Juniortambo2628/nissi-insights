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
        if (Schema::hasTable('newsletter_templates')) {
            return;
        }

        Schema::create('newsletter_templates', function (Blueprint $table) {
            $table->id();
            // No FK: the production `users` table is MyISAM, which cannot
            // participate in foreign key constraints (MySQL error 1824).
            $table->unsignedBigInteger('user_id');
            $table->string('name', 100);
            $table->string('background_color', 9)->default('#ffffff');
            $table->string('text_color', 9)->default('#0f172a');
            $table->string('accent_color', 9)->default('#2563eb');
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_templates');
    }
};
