<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use App\Models\NewsletterRevision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class NewsletterRevisionController extends Controller
{
    public function index(Request $request, Newsletter $newsletter)
    {
        if (! Schema::hasTable('newsletter_revisions')) {
            return response()->json([
                'message' => 'Database migration pending: newsletter_revisions table missing. Run php artisan migrate.',
            ], 503);
        }

        $revisions = $newsletter->revisions()
            ->with('user:id,name')
            ->orderByDesc('id')
            ->get()
            ->map(fn (NewsletterRevision $revision) => [
                'id' => $revision->id,
                'source' => $revision->source,
                'title' => $revision->payload['title'] ?? null,
                'subject' => $revision->payload['subject'] ?? null,
                'excerpt' => $this->excerpt($revision->payload['content'] ?? ''),
                'user' => $revision->user
                    ? ['id' => $revision->user->id, 'name' => $revision->user->name]
                    : null,
                'created_at' => $revision->created_at->toIso8601String(),
            ]);

        return response()->json($revisions);
    }

    public function restore(Request $request, Newsletter $newsletter, NewsletterRevision $revision)
    {
        if (! Schema::hasTable('newsletter_revisions')) {
            return response()->json([
                'message' => 'Database migration pending: newsletter_revisions table missing. Run php artisan migrate.',
            ], 503);
        }

        if ($revision->newsletter_id !== $newsletter->id) {
            abort(404);
        }

        $newsletter->recordRevision(NewsletterRevision::SOURCE_RESTORE, $request->user()->id);

        $newsletter->fill(
            collect($revision->payload)->only(Newsletter::REVISION_FIELDS)->all()
        );
        $newsletter->save();

        return response()->json($newsletter->load('user:id,name'));
    }

    protected function excerpt(string $content): string
    {
        $text = trim(preg_replace('/\s+/', ' ', strip_tags($content)) ?? '');

        return Str::limit($text, 140);
    }
}
