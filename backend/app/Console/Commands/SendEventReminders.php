<?php

namespace App\Console\Commands;

use App\Models\EmailLog;
use App\Models\Event;
use App\Traits\SendsTemplatedMail;
use Illuminate\Console\Command;

class SendEventReminders extends Command
{
    use SendsTemplatedMail;

    protected $signature = 'events:send-reminders
                            {--dry-run : Show what would be sent without sending}';

    protected $description = 'Send approaching, started, and ended emails for events.';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $sent = 0;
        $skipped = 0;

        $events = Event::with('registrations')->where('is_published', true)->get();

        foreach ($events as $event) {
            foreach ($event->registrations as $registration) {
                $sent += $this->handleApproachingReminder($event, $registration, $dryRun);
                $sent += $this->handleStartedReminder($event, $registration, $dryRun);
                $sent += $this->handleEndedThankYou($event, $registration, $dryRun);
            }
        }

        $this->info("Emails sent: {$sent}, skipped (already sent or not due): {$skipped}");

        return self::SUCCESS;
    }

    protected function handleApproachingReminder(Event $event, $registration, bool $dryRun): int
    {
        $windowStart = $event->startTime()->copy()->subDay()->subMinutes(15);
        $windowEnd = $event->startTime()->copy()->subDay()->addMinutes(15);
        $now = now($event->timezone);

        if (! $now->between($windowStart, $windowEnd)) {
            return 0;
        }

        if ($this->alreadySent($registration, 'event_reminder_approaching')) {
            return 0;
        }

        if ($dryRun) {
            $this->info("[DRY-RUN] Approaching reminder -> {$registration->email}");

            return 1;
        }

        $data = $event->templateDataForRegistration($registration);

        return $this->sendTemplatedMail('event_reminder_approaching', $registration->email, $data, $registration) ? 1 : 0;
    }

    protected function handleStartedReminder(Event $event, $registration, bool $dryRun): int
    {
        $windowStart = $event->startTime()->copy()->subMinutes(15);
        $windowEnd = $event->startTime()->copy()->addMinutes(15);
        $now = now($event->timezone);

        if (! $now->between($windowStart, $windowEnd)) {
            return 0;
        }

        if ($this->alreadySent($registration, 'event_reminder_started')) {
            return 0;
        }

        if ($dryRun) {
            $this->info("[DRY-RUN] Started reminder -> {$registration->email}");

            return 1;
        }

        $data = $event->templateDataForRegistration($registration);

        return $this->sendTemplatedMail('event_reminder_started', $registration->email, $data, $registration) ? 1 : 0;
    }

    protected function handleEndedThankYou(Event $event, $registration, bool $dryRun): int
    {
        $windowStart = $event->endTime()->copy()->addMinutes(45);
        $windowEnd = $event->endTime()->copy()->addDay();
        $now = now($event->timezone);

        if (! $now->between($windowStart, $windowEnd)) {
            return 0;
        }

        if ($this->alreadySent($registration, 'event_thank_you_ended')) {
            return 0;
        }

        if ($dryRun) {
            $this->info("[DRY-RUN] Thank you -> {$registration->email}");

            return 1;
        }

        $data = $event->templateDataForRegistration($registration);

        return $this->sendTemplatedMail('event_thank_you_ended', $registration->email, $data, $registration) ? 1 : 0;
    }

    protected function alreadySent($registration, string $templateKey): bool
    {
        return EmailLog::where('sendable_type', get_class($registration))
            ->where('sendable_id', $registration->id)
            ->where('template_key', $templateKey)
            ->where('status', 'sent')
            ->exists();
    }
}
