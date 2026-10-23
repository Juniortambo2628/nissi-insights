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
        if (Schema::hasTable('saved_blocks')) {
            return;
        }

        Schema::create('saved_blocks', function (Blueprint $table) {
            $table->id();
            // No FK: the production `users` table is MyISAM, which cannot
            // participate in foreign key constraints (MySQL error 1824).
            $table->unsignedBigInteger('user_id');
            $table->string('name', 100);
            $table->string('block_type', 40);
            // Full TipTap node JSON ({type, attrs, content}) — attrs carry
            // the block's styling (labels, align/valign, widths, colors).
            $table->longText('content');
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_blocks');
    }
};
