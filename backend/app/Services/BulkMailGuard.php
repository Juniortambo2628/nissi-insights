<?php

namespace App\Services;

use App\Models\EmailContact;
use App\Models\EmailLog;
use App\Models\Subscriber;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Support\Facades\Mail;

/**
 * Safeguards shared by every bulk send (newsletter campaigns and content
 * broadcasts): an on/off switch, hourly/daily caps, a per-request batch size,
 * pacing between messages, and suppression of anyone who has opted out.
 */
class BulkMailGuard
{
    public function enabled(): bool
    {
        return (bool) config('bulk_mail.enabled');
    }

    public function disabledMessage(): string
    {
        return 'Bulk email sending is currently turned off. Set BULK_MAIL_ENABLED=true '
            .'(ideally with BULK_MAIL_MAILER pointing at a dedicated email provider) to send campaigns.';
    }

    /**
     * Bulk messages sent within the given number of minutes.
     */
    public function sentWithin(int $minutes): int
    {
        return EmailLog::query()
            ->whereIn('template_key', config('bulk_mail.template_keys', []))
            ->where('status', 'sent')
            ->where('sent_at', '>=', now()->subMinutes($minutes))
            ->count();
    }

    /**
     * How many more bulk messages may be sent right now without breaking
     * the hourly or daily cap.
     */
    public function remainingQuota(): int
    {
        $hourly = (int) config('bulk_mail.hourly_limit') - $this->sentWithin(60);
        $daily = (int) config('bulk_mail.daily_limit') - $this->sentWithin(60 * 24);

        return max(0, min($hourly, $daily));
    }

    /**
     * Most messages the current request may send: the batch size, further
     * limited by the remaining hourly/daily quota.
     */
    public function batchAllowance(): int
    {
        return max(0, min((int) config('bulk_mail.per_send_limit'), $this->remainingQuota()));
    }

    public function quotaExhaustedMessage(): string
    {
        return sprintf(
            'Sending limit reached (%d per hour, %d per day) to protect the domain from being flagged for spam. '
            .'Try again later.',
            config('bulk_mail.hourly_limit'),
            config('bulk_mail.daily_limit')
        );
    }

    /**
     * Addresses (lower-cased) that have opted out on either list. An opt-out
     * on one list applies to every bulk send.
     *
     * @param  array<int, string>  $emails
     * @return array<string, true>
     */
    public function suppressed(array $emails): array
    {
        $emails = array_values(array_unique(array_map(fn ($e) => strtolower(trim($e)), $emails)));

        if (empty($emails)) {
            return [];
        }

        $suppressed = [];

        foreach (array_chunk($emails, 500) as $chunk) {
            foreach ([Subscriber::class, EmailContact::class] as $model) {
                $model::query()
                    ->whereNotNull('unsubscribed_at')
                    ->whereIn('email', $chunk)
                    ->pluck('email')
                    ->each(function ($email) use (&$suppressed) {
                        $suppressed[strtolower($email)] = true;
                    });
            }
        }

        return $suppressed;
    }

    public function mailer(): Mailer
    {
        return Mail::mailer(config('bulk_mail.mailer') ?: null);
    }

    /**
     * Allow a paced batch to finish on hosts with a short PHP time limit.
     */
    public function prepareForBatch(int $count): void
    {
        $needed = 60 + (int) ceil($count * (config('bulk_mail.delay_ms') / 1000 + 3));

        if (function_exists('set_time_limit')) {
            @set_time_limit($needed);
        }
    }

    /**
     * Pause between messages so a batch is spread out over time.
     */
    public function pause(): void
    {
        $ms = (int) config('bulk_mail.delay_ms');

        if ($ms > 0) {
            usleep($ms * 1000);
        }
    }
}
