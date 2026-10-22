<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Idempotent: columns may already exist if applied manually.
        if (Schema::hasColumn('subscribers', 'unsubscribe_token')) {
            return;
        }

        Schema::table('subscribers', function (Blueprint $table) {
            if (! Schema::hasColumn('subscribers', 'unsubscribed_at')) {
                $table->timestamp('unsubscribed_at')->nullable()->after('is_active');
            }
            $table->string('unsubscribe_token', 64)->nullable()->unique()->after('unsubscribed_at');
        });

        // Backfill tokens for existing subscribers so legacy emails can still opt out.
        DB::table('subscribers')
            ->whereNull('unsubscribe_token')
            ->orderBy('id')
            ->pluck('id')
            ->each(function ($id) {
                DB::table('subscribers')
                    ->where('id', $id)
                    ->update(['unsubscribe_token' => bin2hex(random_bytes(20))]);
            });
    }

    public function down(): void
    {
        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropUnique(['unsubscribe_token']);
            $table->dropColumn(['unsubscribed_at', 'unsubscribe_token']);
        });
    }
};
