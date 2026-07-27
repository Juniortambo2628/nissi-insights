<?php

namespace App\Console\Commands;

use App\Mail\TemplatedMail;
use App\Models\EmailLog;
use App\Models\Event;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendEventReminders extends Command
{
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

        if (!$now->between($windowStart, $windowEnd)) {
            return 0;
        }

        if ($this->alreadySent($registration, 'event_reminder_approaching')) {
            return 0;
        }

        $data = $this->templateData($event, $registration);

        if ($dryRun) {
            $this->info("[DRY-RUN] Approaching reminder -> {$registration->email}");
            return 1;
        }

        return $this->sendTemplate('event_reminder_approaching', $registration->email, $data, $registration);
    }

    protected function handleStartedReminder(Event $event, $registration, bool $dryRun): int
    {
        $windowStart = $event->startTime()->copy()->subMinutes(15);
        $windowEnd = $event->startTime()->copy()->addMinutes(15);
        $now = now($event->timezone);

        if (!$now->between($windowStart, $windowEnd)) {
            return 0;
        }

        if ($this->alreadySent($registration, 'event_reminder_started')) {
            return 0;
        }

        $data = $this->templateData($event, $registration);

        if ($dryRun) {
            $this->info("[DRY-RUN] Started reminder -> {$registration->email}");
            return 1;
        }

        return $this->sendTemplate('event_reminder_started', $registration->email, $data, $registration);
    }

    protected function handleEndedThankYou(Event $event, $registration, bool $dryRun): int
    {
        $windowStart = $event->endTime()->copy()->addMinutes(45);
        $windowEnd = $event->endTime()->copy()->addDay();
        $now = now($event->timezone);

        if (!$now->between($windowStart, $windowEnd)) {
            return 0;
        }

        if ($this->alreadySent($registration, 'event_thank_you_ended')) {
            return 0;
        }

        $data = $this->templateData($event, $registration);

        if ($dryRun) {
            $this->info("[DRY-RUN] Thank you -> {$registration->email}");
            return 1;
        }

        return $this->sendTemplate('event_thank_you_ended', $registration->email, $data, $registration);
    }

    protected function alreadySent($registration, string $templateKey): bool
    {
        return EmailLog::where('sendable_type', get_class($registration))
            ->where('sendable_id', $registration->id)
            ->where('template_key', $templateKey)
            ->where('status', 'sent')
            ->exists();
    }

    protected function templateData(Event $event, $registration): array
    {
        $start = $event->startTime();

        return [
            'name' => $registration->name,
            'eventTitle' => $event->title,
            'eventDate' => $start->format('F j, Y'),
            'eventTime' => $start->format('g:i a T'),
            'eventLocation' => $event->location ?? 'TBC',
            'eventLink' => $event->link ?? null,
            'eventId' => $event->id,
            'eventImage' => $event->image ? config('app.url') . '/api/storage/' . ltrim($event->image, '/') : null,
        ];
    }

    protected function sendTemplate(string $templateKey, string $recipient, array $data, $registration): int
    {
        try {
            $mail = new TemplatedMail($templateKey, $data, $registration);
            Mail::to($recipient)->send($mail);
            $mail->log($recipient, 'sent');
            return 1;
        } catch (\Exception $e) {
            \Log::error("Failed to send {$templateKey} to {$recipient}: " . $e->getMessage());
            (new TemplatedMail($templateKey, $data, $registration))->log($recipient, 'failed', $e->getMessage());
            return 0;
        }
    }
}
