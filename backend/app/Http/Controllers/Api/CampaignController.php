<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\Campaign;
use App\Models\EmailContact;
use App\Models\Newsletter;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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

    public function send(Request $request, Campaign $campaign)
    {
        $campaign->load('newsletter');

        if (! $campaign->newsletter) {
            return response()->json(['message' => 'Campaign has no newsletter attached.'], 422);
        }

        if ($campaign->status !== Campaign::STATUS_DRAFT) {
            return response()->json(['message' => 'This campaign has already been sent.'], 422);
        }

        $validated = $request->validate([
            'subscriber_ids' => 'nullable|array',
            'subscriber_ids.*' => 'integer|exists:subscribers,id',
            'contact_ids' => 'nullable|array',
            'contact_ids.*' => 'integer|exists:email_contacts,id',
        ]);

        $recipientsByEmail = [];

        if (! empty($validated['subscriber_ids']) && ! empty($validated['contact_ids'])) {
            // Explicit ids from both lists.
            $subscribers = Subscriber::whereIn('id', $validated['subscriber_ids'])->optedIn()->orderBy('id')->get();
            $contacts = EmailContact::whereIn('id', $validated['contact_ids'])->optedIn()->orderBy('id')->get();
        } elseif (! empty($validated['subscriber_ids'])) {
            $subscribers = Subscriber::whereIn('id', $validated['subscriber_ids'])->optedIn()->orderBy('id')->get();
            $contacts = collect();
        } elseif (! empty($validated['contact_ids'])) {
            $subscribers = collect();
            $contacts = EmailContact::whereIn('id', $validated['contact_ids'])->optedIn()->orderBy('id')->get();
        } else {
            // Send-to-all mode: pull every eligible recipient from both lists.
            $subscribers = Subscriber::query()->optedIn()->orderBy('id')->get();
            $contacts = EmailContact::query()->optedIn()->orderBy('id')->get();
        }

        foreach ($subscribers as $sub) {
            $recipientsByEmail[$sub->email] = [
                'email' => $sub->email,
                'name' => $sub->name,
                'unsubscribe_url' => $sub->unsubscribeUrl(),
            ];
        }

        foreach ($contacts as $contact) {
            if (! isset($recipientsByEmail[$contact->email])) {
                $recipientsByEmail[$contact->email] = [
                    'email' => $contact->email,
                    'name' => $contact->name,
                    'unsubscribe_url' => $contact->unsubscribeUrl(),
                ];
            }
        }

        $recipients = array_values($recipientsByEmail);

        if (empty($recipients)) {
            return response()->json(['message' => 'No eligible recipients selected.'], 422);
        }

        $campaign->update([
            'status' => 'sending',
            'total_recipients' => count($recipients),
        ]);

        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($recipients as $recipient) {
            try {
                $mail = new NewsletterMail(
                    $campaign->newsletter,
                    $campaign,
                    $recipient['email'],
                    $recipient['name'],
                    $recipient['unsubscribe_url']
                );
                Mail::to($recipient['email'])->send($mail);
                $mail->log($recipient['email'], 'sent');
                $sent++;
            } catch (\Exception $e) {
                Log::error("Newsletter campaign {$campaign->id} failed for {$recipient['email']}: ".$e->getMessage());
                (new NewsletterMail($campaign->newsletter, $campaign, $recipient['email']))
                    ->log($recipient['email'], 'failed', $e->getMessage());
                $failed++;
                $errors[] = ['email' => $recipient['email'], 'error' => $e->getMessage()];
            }
        }

        $campaign->update([
            'status' => $sent > 0 ? Campaign::STATUS_SENT : Campaign::STATUS_FAILED,
            'sent_count' => $sent,
            'failed_count' => $failed,
            'sent_at' => now(),
        ]);

        if ($sent > 0 && $campaign->newsletter->status !== Newsletter::STATUS_SENT) {
            $campaign->newsletter->update([
                'status' => Newsletter::STATUS_SENT,
                'sent_at' => now(),
            ]);
        }

        return response()->json([
            'message' => "Campaign \"{$campaign->name}\": {$sent} sent, {$failed} failed.",
            'sent' => $sent,
            'failed' => $failed,
            'total' => count($recipients),
            'errors' => $errors,
        ]);
    }
}
