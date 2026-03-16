<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$keys = ['chatbot_faq_data', 'chatbot_quick_replies', 'main_nav_links'];

foreach ($keys as $key) {
    $setting = \App\Models\SiteSetting::where('key', $key)->first();
    if ($setting) {
        echo "Key: $key\n";
        echo "Value: " . $setting->value . "\n";
        echo "-------------------\n";
    } else {
        echo "Key: $key NOT FOUND\n";
    }
}
