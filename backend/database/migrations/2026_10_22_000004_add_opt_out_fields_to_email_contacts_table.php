<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_contacts', function (Blueprint $table) {
            $table->timestamp('unsubscribed_at')->nullable()->after('source');
            $table->string('unsubscribe_token', 64)->nullable()->unique()->after('unsubscribed_at');
        });

        // Backfill tokens for existing rows.
        DB::table('email_contacts')
            ->whereNull('unsubscribe_token')
            ->orderBy('id')
            ->pluck('id')
            ->each(function ($id) {
                DB::table('email_contacts')
                    ->where('id', $id)
                    ->update(['unsubscribe_token' => bin2hex(random_bytes(20))]);
            });
    }

    public function down(): void
    {
        Schema::table('email_contacts', function (Blueprint $table) {
            $table->dropColumn(['unsubscribed_at', 'unsubscribe_token']);
        });
    }
};
