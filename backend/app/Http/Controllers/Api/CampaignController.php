<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\Campaign;
use App\Models\EmailContact;
use App\Models\EmailLog;
use App\Models\Newsletter;
use App\Models\Subscriber;
use App\Services\BulkMailGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class CampaignController extends Controller
{
    public function index()
    {
        if (! Schema::hasTable('campaigns')) {
            return response()->json([
                'message' => 'Database migration pending: campaigns table missing. Run php artisan migrate.',
            ], 503);
        }

        $campaigns = Campaign::with('newsletter:id,title,subject,status')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($campaigns);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'newsletter_id' => 'required|integer|exists:newsletters,id',
            'subject' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = Campaign::STATUS_DRAFT;

        $campaign = Campaign::create($validated);

        return response()->json($campaign->load('newsletter:id,title,subject,status'), 201);
    }

    public function show(Campaign $campaign)
    {
        return response()->json(
            $campaign->load('newsletter:id,title,subject,status')
        );
    }

    public function update(Request $request, Campaign $campaign)
    {
        if ($campaign->status !== Campaign::STATUS_DRAFT) {
            return response()->json(['message' => 'Only draft campaigns can be edited.'], 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
        ]);

        $campaign->update($validated);

        return response()->json($campaign->load('newsletter:id,title,subject,status'));
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->emailLogs()->delete();
        $campaign->delete();

        return response()->json(null, 204);
    }

    /**
     * Send (or resume) a campaign.
     *
     * The first call resolves the recipients and queues one EmailLog row per
     * address. Each call then delivers the next batch, limited by the bulk
     * mail safeguards (batch size, hourly/daily caps, pacing). Campaigns with
     * recipients left over stay "partial" and are finished by calling send
     * again later.
     */
    public function send(Request $request, Campaign $campaign, BulkMailGuard $guard)
    {
        $campaign->load('newsletter');

        if (! $campaign->newsletter) {
            return response()->json(['message' => 'Campaign has no newsletter attached.'], 422);
        }

        if (! in_array($campaign->status, Campaign::SENDABLE_STATUSES, true)) {
            return response()->json(['message' => 'This campaign has already been sent.'], 422);
        }

        if (! $guard->enabled()) {
            return response()->json(['message' => $guard->disabledMessage()], 503);
        }

        $lock = Cache::lock("campaign-send-{$campaign->id}", 900);

        if (! $lock->get()) {
            return response()->json(['message' => 'This campaign is already being sent. Please wait.'], 409);
        }

        try {
            if ($campaign->status === Campaign::STATUS_DRAFT) {
                $queued = $this->queueRecipients($request, $campaign, $guard);

                if ($queued instanceof JsonResponse) {
                    return $queued;
                }
            }

            return $this->sendBatch($campaign, $guard);
        } finally {
            $lock->release();
        }
    }

    /**
     * Resolve the recipients of a draft campaign and queue a log row for each.
     */
    protected function queueRecipients(Request $request, Campaign $campaign, BulkMailGuard $guard): ?JsonResponse
    {
        $validated = $request->validate([
            'subscriber_ids' => 'nullable|array',
            'subscriber_ids.*' => 'integer|exists:subscribers,id',
            'contact_ids' => 'nullable|array',
            'contact_ids.*' => 'integer|exists:email_contacts,id',
            'consent_confirmed' => 'nullable|boolean',
        ]);

        if (! empty($validated['subscriber_ids']) || ! empty($validated['contact_ids'])) {
            $subscribers = ! empty($validated['subscriber_ids'])
                ? Subscriber::whereIn('id', $validated['subscriber_ids'])->optedIn()->orderBy('id')->get()
                : collect();
            $contacts = ! empty($validated['contact_ids'])
                ? EmailContact::whereIn('id', $validated['contact_ids'])->optedIn()->orderBy('id')->get()
                : collect();
        } else {
            // Send-to-all mode: every eligible recipient from both lists.
            $subscribers = Subscriber::query()->optedIn()->orderBy('id')->get();
            $contacts = EmailContact::query()->optedIn()->orderBy('id')->get();
        }

        // Saved contacts did not sign up through the website, so the sender
        // must confirm they agreed to receive these emails.
        if ($contacts->isNotEmpty() && ! ($validated['consent_confirmed'] ?? false)) {
            return response()->json([
                'message' => 'Confirm that every saved contact has agreed to receive these emails before sending.',
            ], 422);
        }

        $emails = [];
        foreach ($subscribers->concat($contacts) as $recipient) {
            $emails[strtolower(trim($recipient->email))] = true;
        }

        $suppressed = $guard->suppressed(array_keys($emails));
        $emails = array_values(array_diff(array_keys($emails), array_keys($suppressed)));

        if (empty($emails)) {
            return response()->json(['message' => 'No eligible recipients selected.'], 422);
        }

        if ($guard->batchAllowance() === 0) {
            return response()->json(['message' => $guard->quotaExhaustedMessage()], 429);
        }

        foreach ($emails as $email) {
            $log = new EmailLog([
                'template_key' => 'newsletter',
                'recipient' => $email,
                'status' => 'queued',
            ]);
            $log->sendable()->associate($campaign);
            $log->save();
        }

        $campaign->update([
            'status' => Campaign::STATUS_PARTIAL,
            'total_recipients' => count($emails),
        ]);

        return null;
    }

    /**
     * Deliver the next batch of queued recipients for the campaign.
     */
    protected function sendBatch(Campaign $campaign, BulkMailGuard $guard): JsonResponse
    {
        $allowance = $guard->batchAllowance();

        if ($allowance === 0) {
            return response()->json(array_merge(
                ['message' => $guard->quotaExhaustedMessage()],
                $this->progress($campaign, 0, 0, [])
            ), 429);
        }

        $batch = $campaign->emailLogs()
            ->where('status', 'queued')
            ->orderBy('id')
            ->limit($allowance)
            ->get();

        $suppressed = $guard->suppressed($batch->pluck('recipient')->all());
        $mailer = $guard->mailer();
        $guard->prepareForBatch($batch->count());

        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($batch as $index => $log) {
            if (isset($suppressed[strtolower($log->recipient)])) {
                $log->update(['status' => 'skipped', 'error' => 'Recipient has opted out.']);

                continue;
            }

            if ($index > 0) {
                $guard->pause();
            }

            [$name, $unsubscribeUrl, $oneClickUrl] = $this->recipientDetails($log->recipient);

            try {
                $mailer->to($log->recipient)->send(new NewsletterMail(
                    $campaign->newsletter,
                    $campaign,
                    $log->recipient,
                    $name,
                    $unsubscribeUrl,
                    $oneClickUrl
                ));
                $log->update(['status' => 'sent', 'sent_at' => now(), 'error' => null]);
                $sent++;
            } catch (\Exception $e) {
                Log::error("Newsletter campaign {$campaign->id} failed for {$log->recipient}: ".$e->getMessage());
                $log->update(['status' => 'failed', 'error' => $e->getMessage()]);
                $failed++;
                $errors[] = ['email' => $log->recipient, 'error' => $e->getMessage()];
            }
        }

        $totals = $campaign->emailLogs()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $remaining = (int) ($totals['queued'] ?? 0);
        $sentTotal = (int) ($totals['sent'] ?? 0);

        $campaign->update([
            'status' => $remaining > 0
                ? Campaign::STATUS_PARTIAL
                : ($sentTotal > 0 ? Campaign::STATUS_SENT : Campaign::STATUS_FAILED),
            'sent_count' => $sentTotal,
            'failed_count' => (int) ($totals['failed'] ?? 0),
            'sent_at' => now(),
        ]);

        if ($sentTotal > 0 && $campaign->newsletter->status !== Newsletter::STATUS_SENT) {
            $campaign->newsletter->update([
                'status' => Newsletter::STATUS_SENT,
                'sent_at' => now(),
            ]);
        }

        $message = "Campaign \"{$campaign->name}\": {$sent} sent, {$failed} failed.";
        if ($remaining > 0) {
            $message .= " {$remaining} recipient(s) left; send again later to continue.";
        }

        return response()->json(array_merge(
            ['message' => $message],
            $this->progress($campaign, $sent, $failed, $errors)
        ));
    }

    /**
     * @return array{0: ?string, 1: ?string, 2: ?string} name, unsubscribe page URL, one-click URL
     */
    protected function recipientDetails(string $email): array
    {
        $record = Subscriber::where('email', $email)->first()
            ?? EmailContact::where('email', $email)->first();

        return [$record?->name, $record?->unsubscribeUrl(), $record?->oneClickUnsubscribeUrl()];
    }

    protected function progress(Campaign $campaign, int $sent, int $failed, array $errors): array
    {
        return [
            'sent' => $sent,
            'failed' => $failed,
            'total' => (int) $campaign->total_recipients,
            'remaining' => $campaign->emailLogs()->where('status', 'queued')->count(),
            'status' => $campaign->fresh()->status,
            'errors' => $errors,
        ];
    }
}
