<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

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
            ->chunkById(200, function ($contacts) {
                foreach ($contacts as $contact) {
                    DB::table('email_contacts')
                        ->where('id', $contact->id)
                        ->update(['unsubscribe_token' => Str::random(40)]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('email_contacts', function (Blueprint $table) {
            $table->dropColumn(['unsubscribed_at', 'unsubscribe_token']);
        });
    }
};
