<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\Campaign;
use App\Models\Newsletter;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CampaignController extends Controller
{
    public function index()
    {
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
        ]);

        // optedIn() excludes deactivated and opted-out contacts; opted-out
        // contacts can never be targeted even if their ids are supplied.
        $query = Subscriber::query()->optedIn();

        if (! empty($validated['subscriber_ids'])) {
            $query->whereIn('id', $validated['subscriber_ids']);
        }

        $recipients = $query->orderBy('id')->get();

        if ($recipients->isEmpty()) {
            return response()->json(['message' => 'No eligible recipients selected.'], 422);
        }

        $campaign->update([
            'status' => 'sending',
            'total_recipients' => $recipients->count(),
        ]);

        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($recipients as $subscriber) {
            try {
                $mail = new NewsletterMail($campaign->newsletter, $subscriber, $campaign);
                Mail::to($subscriber->email)->send($mail);
                $mail->log($subscriber->email, 'sent');
                $sent++;
            } catch (\Exception $e) {
                Log::error("Newsletter campaign {$campaign->id} failed for {$subscriber->email}: ".$e->getMessage());
                (new NewsletterMail($campaign->newsletter, $subscriber, $campaign))
                    ->log($subscriber->email, 'failed', $e->getMessage());
                $failed++;
                $errors[] = ['email' => $subscriber->email, 'error' => $e->getMessage()];
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
            'total' => $recipients->count(),
            'errors' => $errors,
        ]);
    }
}
