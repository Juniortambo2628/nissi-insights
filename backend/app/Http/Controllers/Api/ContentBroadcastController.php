<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailContact;
use App\Models\Insight;
use App\Models\Resource;
use App\Models\Subscriber;
use App\Traits\SendsTemplatedMail;
use Illuminate\Http\Request;

class ContentBroadcastController extends Controller
{
    use SendsTemplatedMail;

    protected const MAX_RECIPIENTS = 1000;

    public function send(Request $request)
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

        $emails = $this->normalizeEmails($validated['recipients'] ?? []);

        if (! empty($validated['contact_ids'])) {
            $contactEmails = EmailContact::whereIn('id', $validated['contact_ids'])->pluck('email');
            $emails = $this->mergeEmails($emails, $contactEmails->all());
        }

        if ($validated['to_subscribers'] ?? false) {
            $subscriberEmails = Subscriber::where('is_active', true)->pluck('email');
            $emails = $this->mergeEmails($emails, $subscriberEmails->all());
        }

        if (empty($emails)) {
            return response()->json([
                'message' => 'Choose at least one valid recipient (emails, saved contacts, or subscribers).',
            ], 422);
        }

        if (count($emails) > self::MAX_RECIPIENTS) {
            return response()->json([
                'message' => 'Too many recipients. The limit is '.self::MAX_RECIPIENTS.' per send.',
            ], 422);
        }

        if ($validated['save_contacts'] ?? true) {
            $this->saveAsContacts($emails);
        }

        $data = $this->templateDataFor($content, $validated['content_type']);

        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($emails as $email) {
            $success = $this->sendTemplatedMail(
                'content_update_notification',
                $email,
                $data,
                $content
            );

            if ($success) {
                $sent++;
            } else {
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
     * @return array{0: ?Insight|?Resource, 1: ?string}
     */
    protected function resolveContent(string $type, int $id): array
    {
        $content = $type === 'insight'
            ? Insight::find($id)
            : Resource::find($id);

        if (! $content) {
            return [null, ucfirst($type)." not found."];
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

    protected function saveAsContacts(array $emails): void
    {
        foreach ($emails as $email) {
            EmailContact::firstOrCreate(
                ['email' => $email],
                ['source' => 'broadcast']
            );
        }
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
