<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'Nissi Insights', 'type' => 'text', 'group' => 'general'],
            ['key' => 'logo_light', 'value' => '/assets/logos/logo-light.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'logo_dark', 'value' => '/assets/logos/logo-dark.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'favicon', 'value' => '/assets/favicons/favicon.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'dashboard_favicon', 'value' => '/assets/favicons/dashboard-favicon.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'hero_title', 'value' => 'Intelligence for the future of energy', 'type' => 'text', 'group' => 'homepage'],
            
            // About Page
            ['key' => 'about_title', 'value' => 'Intelligence for the Future', 'type' => 'text', 'group' => 'about'],
            ['key' => 'about_tagline', 'value' => 'Our Mission & Vision', 'type' => 'text', 'group' => 'about'],
            ['key' => 'about_story', 'value' => 'Nissi Insights was founded on the principle that market intelligence should be accessible, actionable, and rigorous. We connect decision-makers with the data they need to navigate the world\'s most complex energy and financial landscapes.', 'type' => 'textarea', 'group' => 'about'],
            ['key' => 'about_image', 'value' => '/NI-Digital-Assets/international-diplomacy.jpg', 'type' => 'image', 'group' => 'about'],

            // Contact Page
            ['key' => 'contact_email', 'value' => 'info@nissi-insights.com', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '+44 20 7946 0000', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_address', 'value' => 'One Canary Wharf, London, E14 5AB', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_map_url', 'value' => 'https://www.google.com/maps/embed?...', 'type' => 'text', 'group' => 'contact'],

            // Widgets
            ['key' => 'nissi_assistant_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'widgets'],
            ['key' => 'nissi_assistant_id', 'value' => 'cl-...', 'type' => 'text', 'group' => 'widgets'],
            ['key' => 'whatsapp_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'widgets'],
            ['key' => 'whatsapp_number', 'value' => '+447000000000', 'type' => 'text', 'group' => 'widgets'],
            ['key' => 'whatsapp_message', 'value' => 'Hello, I have a question about Nissi Insights.', 'type' => 'text', 'group' => 'widgets'],

            // Pre-launch RSVP
            ['key' => 'rsvp_active', 'value' => '1', 'type' => 'boolean', 'group' => 'launch'],
            ['key' => 'rsvp_date', 'value' => '2026-06-01 00:00:00', 'type' => 'text', 'group' => 'launch'],
            ['key' => 'rsvp_title', 'value' => 'The Future of Energy Intelligence', 'type' => 'text', 'group' => 'launch'],
            ['key' => 'rsvp_description', 'value' => 'We are preparing to launch a revolutionary market intelligence platform. Register your interest below to be notified when we go live.', 'type' => 'textarea', 'group' => 'launch'],
            ['key' => 'rsvp_media', 'value' => '/assets/videos/hero.mp4', 'type' => 'image', 'group' => 'launch'],
        ];

        foreach ($settings as $setting) {
            \App\Models\SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
