<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\TemplatedMail;
use App\Models\EmailContact;
use App\Models\Insight;
use App\Models\Resource;
use App\Models\Subscriber;
use App\Services\BulkMailGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContentBroadcastController extends Controller
{
    protected const MAX_RECIPIENTS = 1000;

    public function send(Request $request, BulkMailGuard $guard)
    {
        $validated = $request->validate([
            'content_type' => 'required|string|in:insight,resource',
            'content_id' => 'required|integer',
            'recipients' => 'nullable|array|max:'.self::MAX_RECIPIENTS,
            'recipients.*' => 'string|max:255',
            'contact_ids' => 'nullable|array|max:'.self::MAX_RECIPIENTS,
            'contact_ids.*' => 'integer|exists:email_contacts,id',
            'to_subscribers' => 'nullable|boolean',
            'save_contacts' => 'nullable|boolean',
            'consent_confirmed' => 'nullable|boolean',
        ]);

        [$content, $notFound] = $this->resolveContent(
            $validated['content_type'],
            (int) $validated['content_id']
        );

        if ($notFound) {
            return response()->json(['message' => $notFound], 404);
        }

        if (! $content->is_published) {
            return response()->json([
                'message' => 'This content must be published before it can be emailed.',
            ], 422);
        }

        if (! $guard->enabled()) {
            return response()->json(['message' => $guard->disabledMessage()], 503);
        }

        $pasted = $this->normalizeEmails($validated['recipients'] ?? []);
        $emails = $pasted;

        if (! empty($validated['contact_ids'])) {
            $contactEmails = EmailContact::whereIn('id', $validated['contact_ids'])
                ->optedIn()
                ->pluck('email');
            $emails = $this->mergeEmails($emails, $contactEmails->all());
        }

        // Pasted addresses and saved contacts did not sign up through the
        // website, so the sender must confirm they agreed to receive email.
        $needsConsent = ! empty($pasted) || ! empty($validated['contact_ids']);
        if ($needsConsent && ! ($validated['consent_confirmed'] ?? false)) {
            return response()->json([
                'message' => 'Confirm that every pasted address and saved contact has agreed to receive these emails before sending.',
            ], 422);
        }

        if ($validated['to_subscribers'] ?? false) {
            $subscriberEmails = Subscriber::optedIn()->pluck('email');
            $emails = $this->mergeEmails($emails, $subscriberEmails->all());
        }

        // Never email anyone who has opted out on either list, even if their
        // address was pasted in again.
        $suppressed = $guard->suppressed($emails);
        $emails = array_values(array_filter($emails, fn ($email) => ! isset($suppressed[$email])));

        if (empty($emails)) {
            return response()->json([
                'message' => 'Choose at least one valid recipient (emails, saved contacts, or subscribers) who has not opted out.',
            ], 422);
        }

        if (count($emails) > self::MAX_RECIPIENTS) {
            return response()->json([
                'message' => 'Too many recipients. The limit is '.self::MAX_RECIPIENTS.' per send.',
            ], 422);
        }

        $allowance = $guard->batchAllowance();

        if ($allowance === 0) {
            return response()->json(['message' => $guard->quotaExhaustedMessage()], 429);
        }

        if (count($emails) > $allowance) {
            return response()->json([
                'message' => sprintf(
                    'This send has %d recipients but only %d can go out right now (sending limits: %d per send, %d per hour, %d per day). '
                    .'Send to fewer recipients, or share a newsletter campaign, which sends in batches.',
                    count($emails),
                    $allowance,
                    config('bulk_mail.per_send_limit'),
                    config('bulk_mail.hourly_limit'),
                    config('bulk_mail.daily_limit')
                ),
            ], 429);
        }

        $data = $this->templateDataFor($content, $validated['content_type']);
        $mailer = $guard->mailer();
        $guard->prepareForBatch(count($emails));

        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($emails as $index => $email) {
            if ($index > 0) {
                $guard->pause();
            }

            // Every recipient needs an opt-out record so the unsubscribe link
            // works; non-subscribers are kept as saved contacts for that reason.
            $record = Subscriber::where('email', $email)->first()
                ?? EmailContact::firstOrCreate(['email' => $email], ['source' => 'broadcast']);

            $mail = new TemplatedMail(
                'content_update_notification',
                $data,
                $content,
                $record->unsubscribeUrl(),
                $record->oneClickUnsubscribeUrl()
            );

            try {
                $mailer->to($email)->send($mail);
                $mail->log($email, 'sent');
                $sent++;
            } catch (\Exception $e) {
                Log::error("Failed to send content_update_notification to {$email}: ".$e->getMessage());
                $mail->log($email, 'failed', $e->getMessage());
                $failed++;
                $errors[] = "{$email}: Failed to send";
            }
        }

        return response()->json([
            'message' => "Emails sent: {$sent}, failed: {$failed}",
            'sent' => $sent,
            'failed' => $failed,
            'total' => count($emails),
            'errors' => $errors,
        ]);
    }

    /**
     * @return array{0: ?Insight|?\App\Models\Resource, 1: ?string}
     */
    protected function resolveContent(string $type, int $id): array
    {
        $content = $type === 'insight'
            ? Insight::find($id)
            : Resource::find($id);

        if (! $content) {
            return [null, ucfirst($type).' not found.'];
        }

        return [$content, null];
    }

    protected function templateDataFor($content, string $type): array
    {
        if ($type === 'insight') {
            return [
                'typeLabel' => 'Insight',
                'categoryLabel' => $content->category ?: 'Insight',
                'title' => $content->title,
                'excerpt' => $this->summarise($content->excerpt ?? $content->content),
                'url' => frontend_url('/insights/'.$content->slug),
                'imageUrl' => $content->image
                    ? config('app.url').'/api/storage/'.ltrim($content->image, '/')
                    : null,
            ];
        }

        return [
            'typeLabel' => $content->type ?: 'Report',
            'categoryLabel' => $content->type ?: 'Knowledge Base',
            'title' => $content->title,
            'excerpt' => $this->summarise($content->description ?? $content->content),
            'url' => frontend_url('/knowledge-base/'.$content->slug),
            'imageUrl' => $content->thumbnail
                ? config('app.url').'/api/storage/'.ltrim($content->thumbnail, '/')
                : null,
        ];
    }

    protected function summarise(?string $html, int $limit = 300): string
    {
        $text = trim(strip_tags((string) $html));

        if ($text === '') {
            return 'Tap the button below to read the full piece on our website.';
        }

        if (mb_strlen($text) <= $limit) {
            return $text;
        }

        return rtrim(mb_substr($text, 0, $limit)).'…';
    }

    /**
     * @param  array<int, string>  $emails
     * @param  array<int, string>  $extra
     * @return array<int, string>
     */
    protected function mergeEmails(array $emails, array $extra): array
    {
        return $this->normalizeEmails(array_merge($emails, $extra));
    }

    /**
     * @param  array<int, string>  $raw
     * @return array<int, string>
     */
    protected function normalizeEmails(array $raw): array
    {
        $emails = [];

        foreach ($raw as $email) {
            $email = strtolower(trim((string) $email));

            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }

            $emails[$email] = $email;
        }

        return array_values($emails);
    }
}
