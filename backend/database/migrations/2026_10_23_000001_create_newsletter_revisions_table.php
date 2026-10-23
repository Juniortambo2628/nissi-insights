<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('newsletter_revisions')) {
            return;
        }

        Schema::create('newsletter_revisions', function (Blueprint $table) {
            $table->id();
            // No FK: production `users`/`newsletters` tables may be MyISAM,
            // which cannot participate in foreign key constraints (MySQL error 1824).
            $table->unsignedBigInteger('newsletter_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('source', 16)->default('manual');
            $table->longText('payload');
            $table->timestamp('created_at')->useCurrent();

            $table->index('newsletter_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_revisions');
    }
};
