<?php

namespace App\Console\Commands;

use App\Models\SiteSetting;
use Illuminate\Console\Command;

class CleanSiteSettings extends Command
{
    protected $signature = 'settings:clean';

    protected $description = 'Clean corrupted site settings (e.g. comma-separated image URLs)';

    public function handle(): int
    {
        $fixed = 0;

        $settings = SiteSetting::whereIn('type', ['image', 'file', 'video'])->get();

        foreach ($settings as $setting) {
            if (str_contains($setting->value, ',')) {
                $parts = array_filter(array_map('trim', explode(',', $setting->value)));
                $cleaned = $parts[0] ?? '';

                if ($cleaned !== $setting->value) {
                    $setting->update(['value' => $cleaned]);
                    $this->info("Cleaned [{$setting->key}]: {$cleaned}");
                    $fixed++;
                }
            }
        }

        $this->info("Done. Cleaned {$fixed} setting(s).");

        return self::SUCCESS;
    }
}
