<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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

            $table->index(['is_active', 'priority']);
        });

        // Use a prefix unique index to stay within MySQL's 1000-byte key limit.
        DB::statement('ALTER TABLE redirects ADD UNIQUE redirects_from_path_unique (from_path(191))');
    }

    public function down(): void
    {
        Schema::table('redirects', function (Blueprint $table) {
            $table->dropUnique('redirects_from_path_unique');
        });

        Schema::dropIfExists('redirects');
    }
};
