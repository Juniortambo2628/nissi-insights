<?php

namespace App\Console\Commands;

use App\Models\EmailTemplate;
use Illuminate\Console\Command;

class VerifyEmailTemplates extends Command
{
    protected $signature = 'email-templates:verify';

    protected $description = 'Verify that all required email templates exist and are active';

    protected array $requiredTemplates = [
        'event_registered_client',
        'event_registered_admin',
        'event_reminder_approaching',
        'event_reminder_started',
        'event_thank_you_ended',
        'event_attended_thank_you',
        'consultation_request_user',
        'consultation_request_admin',
        'rsvp_confirmation',
        'subscriber_welcome',
        'content_update_notification',
        'password_reset',
    ];

    public function handle(): int
    {
        $missing = [];
        $inactive = [];

        foreach ($this->requiredTemplates as $key) {
            $template = EmailTemplate::byKey($key)->first();

            if (! $template) {
                $missing[] = $key;
                continue;
            }

            if (! $template->is_active) {
                $inactive[] = $key;
            }
        }

        if (empty($missing) && empty($inactive)) {
            $this->info('All required email templates are present and active.');
            return self::SUCCESS;
        }

        if (! empty($missing)) {
            $this->error('Missing templates:');
            foreach ($missing as $key) {
                $this->error("  - {$key}");
            }
        }

        if (! empty($inactive)) {
            $this->warn('Inactive templates:');
            foreach ($inactive as $key) {
                $this->warn("  - {$key}");
            }
        }

        $this->info('Run "php artisan db:seed --class=EmailTemplateSeeder --force" to recreate missing templates.');

        return self::FAILURE;
    }
}
