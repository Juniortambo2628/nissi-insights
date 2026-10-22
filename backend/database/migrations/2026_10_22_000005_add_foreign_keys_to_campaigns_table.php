<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL-only: SQLite cannot add FKs to an existing table, and the
        // prod anomaly this repairs (campaigns created FK-less after a
        // partial migration failure) only exists on MySQL.
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        $columns = array_column(
            DB::select(
                'SELECT COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE
                 WHERE TABLE_SCHEMA = DATABASE()
                   AND TABLE_NAME = ?
                   AND REFERENCED_TABLE_NAME IS NOT NULL',
                ['campaigns']
            ),
            'COLUMN_NAME'
        );

        if (in_array('user_id', $columns, true) && in_array('newsletter_id', $columns, true)) {
            return;
        }

        Schema::table('campaigns', function (Blueprint $table) use ($columns) {
            if (! in_array('user_id', $columns, true)) {
                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            }
            if (! in_array('newsletter_id', $columns, true)) {
                $table->foreign('newsletter_id')->references('id')->on('newsletters')->cascadeOnDelete();
            }
        });
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['newsletter_id']);
        });
    }
};
