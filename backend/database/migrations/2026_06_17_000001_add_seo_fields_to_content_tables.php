<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add SEO-related fields (tags, meta_title, meta_description) to content tables
     * for improved search engine discoverability.
     */
    public function up(): void
    {
        // Insights: add tags, meta_title, meta_description
        Schema::table('insights', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('content');
            $table->string('meta_title', 255)->nullable()->after('tags');
            $table->text('meta_description')->nullable()->after('meta_title');
        });

        // Case Studies: add category, tags, meta_title, meta_description
        Schema::table('case_studies', function (Blueprint $table) {
            $table->string('category')->nullable()->after('image');
            $table->json('tags')->nullable()->after('category');
            $table->string('meta_title', 255)->nullable()->after('tags');
            $table->text('meta_description')->nullable()->after('meta_title');
        });

        // Events: add tags, meta_title, meta_description
        Schema::table('events', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('status');
            $table->string('meta_title', 255)->nullable()->after('tags');
            $table->text('meta_description')->nullable()->after('meta_title');
        });

        // Resources: add meta_title, meta_description (already has tags)
        Schema::table('resources', function (Blueprint $table) {
            $table->string('meta_title', 255)->nullable()->after('tags');
            $table->text('meta_description')->nullable()->after('meta_title');
        });
    }

    public function down(): void
    {
        Schema::table('insights', function (Blueprint $table) {
            $table->dropColumn(['tags', 'meta_title', 'meta_description']);
        });

        Schema::table('case_studies', function (Blueprint $table) {
            $table->dropColumn(['category', 'tags', 'meta_title', 'meta_description']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['tags', 'meta_title', 'meta_description']);
        });

        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn(['meta_title', 'meta_description']);
        });
    }
};
