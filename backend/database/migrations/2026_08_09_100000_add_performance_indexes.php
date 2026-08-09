<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // P1: event_registrations.email index
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->index('email');
        });

        // P2: Commonly filtered boolean/enum columns
        Schema::table('insights', function (Blueprint $table) {
            $table->index('is_published');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->index('is_published');
            $table->index('status');
        });

        Schema::table('resources', function (Blueprint $table) {
            $table->index('is_published');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('pillars', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->index('is_featured');
        });

        Schema::table('case_studies', function (Blueprint $table) {
            $table->index('is_featured');
        });

        Schema::table('event_documents', function (Blueprint $table) {
            $table->index('is_published');
        });

        Schema::table('email_templates', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('subscribers', function (Blueprint $table) {
            $table->index('is_active');
        });

        Schema::table('rsvps', function (Blueprint $table) {
            $table->index('type');
        });

        // P2: Foreign key columns (explicit indexes)
        Schema::table('insights', function (Blueprint $table) {
            $table->index('user_id');
        });

        Schema::table('event_registrations', function (Blueprint $table) {
            $table->index('event_id');
        });

        Schema::table('event_documents', function (Blueprint $table) {
            $table->index('event_id');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->index('pillar_id');
        });

        // P2: Analytics columns
        Schema::table('page_views', function (Blueprint $table) {
            $table->index('path');
            $table->index('country');
        });

        // P2: Order columns
        Schema::table('stats', function (Blueprint $table) {
            $table->index('order');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->index('order');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->index('order');
        });

        Schema::table('values', function (Blueprint $table) {
            $table->index('order');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->index('order');
        });

        // P3: Category indexes
        Schema::table('services', function (Blueprint $table) {
            $table->index('category');
        });

        Schema::table('insights', function (Blueprint $table) {
            $table->index('category');
        });

        Schema::table('case_studies', function (Blueprint $table) {
            $table->index('category');
        });

        // P3: consultation_requests.email
        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropIndex(['email', 'event_id']);
        });

        Schema::table('insights', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'user_id', 'category']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'status']);
        });

        Schema::table('resources', function (Blueprint $table) {
            $table->dropIndex('is_published');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'pillar_id', 'category']);
        });

        Schema::table('pillars', function (Blueprint $table) {
            $table->dropIndex('is_active');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'order']);
        });

        Schema::table('consultation_requests', function (Blueprint $table) {
            $table->dropIndex(['status', 'email']);
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropIndex(['is_featured', 'order']);
        });

        Schema::table('case_studies', function (Blueprint $table) {
            $table->dropIndex(['is_featured', 'category']);
        });

        Schema::table('event_documents', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'event_id']);
        });

        Schema::table('email_templates', function (Blueprint $table) {
            $table->dropIndex('is_active');
        });

        Schema::table('subscribers', function (Blueprint $table) {
            $table->dropIndex('is_active');
        });

        Schema::table('rsvps', function (Blueprint $table) {
            $table->dropIndex('type');
        });

        Schema::table('page_views', function (Blueprint $table) {
            $table->dropIndex(['path', 'country']);
        });

        Schema::table('stats', function (Blueprint $table) {
            $table->dropIndex('order');
        });

        Schema::table('team_members', function (Blueprint $table) {
            $table->dropIndex('order');
        });

        Schema::table('values', function (Blueprint $table) {
            $table->dropIndex('order');
        });
    }
};
