<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\SiteSetting;

$settings = [
    // Home Hero Videos
    [
        'key' => 'hero_home_video_1',
        'value' => '/assets/videos/hero/01-energy.mp4',
        'type' => 'video',
        'group' => 'homepage'
    ],
    [
        'key' => 'hero_home_video_2',
        'value' => '/assets/videos/hero/02-fintech.mp4',
        'type' => 'video',
        'group' => 'homepage'
    ],
    [
        'key' => 'hero_home_video_3',
        'value' => '/assets/videos/hero/03-diplomacy.mp4',
        'type' => 'video',
        'group' => 'homepage'
    ],
    // Page Heroes
    [
        'key' => 'hero_about_media',
        'value' => '/NI-Digital-Assets/international-diplomacy.jpg',
        'type' => 'image',
        'group' => 'about'
    ],
    [
        'key' => 'hero_services_media',
        'value' => '/NI-Digital-Assets/financial-technology.jpg',
        'type' => 'image',
        'group' => 'services'
    ],
    [
        'key' => 'hero_insights_media',
        'value' => '/NI-Digital-Assets/energy-transition.jpg',
        'type' => 'image',
        'group' => 'insights'
    ],
    [
        'key' => 'hero_case_studies_media',
        'value' => '/NI-Digital-Assets/financial-technology.jpg',
        'type' => 'image',
        'group' => 'case_studies'
    ],
    [
        'key' => 'hero_client_impact_media',
        'value' => '/NI-Digital-Assets/international-diplomacy.jpg',
        'type' => 'image',
        'group' => 'client_impact'
    ],
    [
        'key' => 'hero_contact_media',
        'value' => '/NI-Digital-Assets/energy-transition.jpg',
        'type' => 'image',
        'group' => 'contact'
    ],
    [
        'key' => 'hero_consultation_media',
        'value' => '/NI-Digital-Assets/financial-technology.jpg',
        'type' => 'image',
        'group' => 'consultation'
    ],
];

foreach ($settings as $setting) {
    SiteSetting::updateOrCreate(
        ['key' => $setting['key']],
        $setting
    );
    echo "Initialized setting: {$setting['key']}\n";
}

echo "Hero media settings initialized successfully.\n";
