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
            ['key' => 'main_nav_links', 'value' => json_encode([
                ['name' => 'Advisory', 'href' => '#'],
                ['name' => 'Insights', 'href' => '/insights'],
                ['name' => 'Events', 'href' => '/events'],
                ['name' => 'Knowledge Hub', 'href' => '/knowledge-base'],
                ['name' => 'Case Studies', 'href' => '/case-studies'],
                ['name' => 'About', 'href' => '/about'],
                ['name' => 'Contact', 'href' => '/contact'],
            ]), 'group' => 'general', 'type' => 'json'],
            ['key' => 'logo_light', 'value' => '/assets/logos/logo-light.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'logo_dark', 'value' => '/assets/logos/logo-dark.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'favicon', 'value' => '/assets/favicons/favicon.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'dashboard_favicon', 'value' => '/assets/favicons/dashboard-favicon.png', 'type' => 'image', 'group' => 'branding'],
            ['key' => 'hero_title', 'value' => 'Intelligence for the future of energy', 'type' => 'text', 'group' => 'homepage'],
            
            // About Page
            ['key' => 'about_title', 'value' => 'Intelligence for the Global Energy Transition', 'type' => 'text', 'group' => 'about'],
            ['key' => 'about_tagline', 'value' => 'Visionary Strategy & Rigorous Analysis', 'type' => 'text', 'group' => 'about'],
            ['key' => 'about_story', 'value' => 'Nissi Insights was founded on the principle that market intelligence should be more than just data—it should be a strategic asset. We connect global decision-makers with the granular insights they need to navigate the world\'s most complex energy and financial landscapes, providing a bridge between emerging markets and global capital.', 'type' => 'textarea', 'group' => 'about'],
            ['key' => 'about_mission_title', 'value' => 'Our Strategic Mission', 'type' => 'text', 'group' => 'about'],
            ['key' => 'about_mission_text', 'value' => 'To empower sovereign entities and private enterprises with actionable intelligence that drives sustainable growth, ensures energy security, and facilitates transparent international cooperation.', 'type' => 'textarea', 'group' => 'about'],
            ['key' => 'about_vision_title', 'value' => 'Our Vision for 2030', 'type' => 'text', 'group' => 'about'],
            ['key' => 'about_vision_text', 'value' => 'To be the preeminent global advisor for energy and fintech intelligence, recognized for our integrity, our depth of analysis, and our commitment to a stable and prosperous global energy future.', 'type' => 'textarea', 'group' => 'about'],
            ['key' => 'about_image', 'value' => '/NI-Digital-Assets/international-diplomacy.jpg', 'type' => 'image', 'group' => 'about'],

            // Contact Page
            ['key' => 'contact_email', 'value' => 'info@nissi-insights.com', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '+44 20 7946 0000', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'business_addresses', 'value' => '[{"label":"Nairobi Office","address":"Gigiri, Nairobi, Kenya","phone":"+254 700 000000","map_url":""},{"label":"London Office","address":"One Canary Wharf, London, United Kingdom","phone":"+44 20 0000 0000","map_url":""}]', 'type' => 'json', 'group' => 'contact'],
            ['key' => 'contact_map_url', 'value' => 'https://www.google.com/maps/embed?...', 'type' => 'text', 'group' => 'contact'],

            // Widgets
            ['key' => 'nissi_assistant_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'widgets'],
            ['key' => 'nissi_assistant_id', 'value' => 'cl-...', 'type' => 'text', 'group' => 'widgets'],
            ['key' => 'whatsapp_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'widgets'],
            ['key' => 'whatsapp_number', 'value' => '+447000000000', 'type' => 'text', 'group' => 'widgets'],
            ['key' => 'whatsapp_message', 'value' => 'Hello, I have a question about Nissi Insights.', 'type' => 'text', 'group' => 'widgets'],

            // Pre-launch RSVP
            ['key' => 'rsvp_active', 'value' => '1', 'type' => 'boolean', 'group' => 'launch'],
            ['key' => 'rsvp_date', 'value' => '2026-03-20 19:00:00', 'type' => 'text', 'group' => 'launch'],
            ['key' => 'rsvp_title', 'value' => 'The Future of Energy Intelligence', 'type' => 'text', 'group' => 'launch'],
            ['key' => 'rsvp_description', 'value' => 'We are preparing to launch a revolutionary market intelligence platform. Register your interest below to be notified when we go live.', 'type' => 'textarea', 'group' => 'launch'],
            ['key' => 'rsvp_media', 'value' => '/assets/videos/hero.mp4', 'type' => 'image', 'group' => 'launch'],
            ['key' => 'rsvp_bg_light', 'value' => '', 'type' => 'image', 'group' => 'launch'],
            ['key' => 'rsvp_bg_dark', 'value' => '', 'type' => 'image', 'group' => 'launch'],
            
            // RSVP Event Details
            ['key' => 'rsvp_venue', 'value' => 'The Sage Delicacy, Gigiri', 'type' => 'text', 'group' => 'launch'],
            ['key' => 'rsvp_address', 'value' => 'Corner of, 183 Gigiri Close, United Nations Cresent, Nairobi', 'type' => 'text', 'group' => 'launch'],
            ['key' => 'rsvp_time', 'value' => '7:00-9:00 P.M.', 'type' => 'text', 'group' => 'launch'],
            ['key' => 'rsvp_menu_file', 'value' => '', 'type' => 'file', 'group' => 'launch'],
            ['key' => 'rsvp_polling_enabled', 'value' => '0', 'type' => 'boolean', 'group' => 'launch'],

            // Pillar Heros
            ['key' => 'hero_pillar_energy_advisory', 'value' => '/NI-Digital-Assets/energy-advisory.jpg', 'type' => 'image', 'group' => 'hero-media'],
            ['key' => 'hero_pillar_fintech', 'value' => '/NI-Digital-Assets/financial-technology.jpg', 'type' => 'image', 'group' => 'hero-media'],
            ['key' => 'hero_pillar_international_diplomacy', 'value' => '/NI-Digital-Assets/international-diplomacy.jpg', 'type' => 'image', 'group' => 'hero-media'],
        ];

        foreach ($settings as $setting) {
            \App\Models\SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
