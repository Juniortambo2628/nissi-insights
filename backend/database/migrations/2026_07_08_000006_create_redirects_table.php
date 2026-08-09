<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->string('from_path', 512);
            $table->string('to', 1024);
            $table->unsignedSmallInteger('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('priority')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique('from_path');
            $table->index(['is_active', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::table('redirects', function (Blueprint $table) {
            $table->dropUnique(['from_path']);
        });

        Schema::dropIfExists('redirects');
    }
};
