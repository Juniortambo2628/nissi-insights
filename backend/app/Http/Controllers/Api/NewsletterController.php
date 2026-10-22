<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class NewsletterController extends Controller
{
    protected const COLOR_PATTERN = '/^#[0-9A-Fa-f]{6}$/';

    public function index()
    {
        $newsletters = Newsletter::with('user:id,name')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json($newsletters);
    }

    public function store(Request $request)
    {
        $validated = $this->validateNewsletter($request);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = Newsletter::STATUS_DRAFT;

        $newsletter = Newsletter::create($validated);

        return response()->json($newsletter, 201);
    }

    public function show(Newsletter $newsletter)
    {
        return response()->json($newsletter->load('user:id,name'));
    }

    public function update(Request $request, Newsletter $newsletter)
    {
        $validated = $this->validateNewsletter($request);

        $newsletter->update($validated);

        return response()->json($newsletter->load('user:id,name'));
    }

    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();

        return response()->json(null, 204);
    }

    public function preview(Request $request)
    {
        $validated = $request->validate([
            'newsletter_id' => 'nullable|integer|exists:newsletters,id',
            'title' => 'nullable|string|max:255',
            'preheader' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'header_image' => 'nullable|string|max:255',
            'background_color' => ['nullable', 'string', 'regex:'.self::COLOR_PATTERN],
            'text_color' => ['nullable', 'string', 'regex:'.self::COLOR_PATTERN],
            'accent_color' => ['nullable', 'string', 'regex:'.self::COLOR_PATTERN],
        ]);

        $newsletter = Newsletter::find($validated['newsletter_id'] ?? null) ?? new Newsletter;

        $newsletter->fill(array_filter([
            'title' => $validated['title'] ?? null,
            'preheader' => $validated['preheader'] ?? null,
            'content' => isset($validated['content'])
                ? html_entity_decode($validated['content'], ENT_QUOTES | ENT_HTML5, 'UTF-8')
                : null,
            'header_image' => $validated['header_image'] ?? null,
            'background_color' => $validated['background_color'] ?? null,
            'text_color' => $validated['text_color'] ?? null,
            'accent_color' => $validated['accent_color'] ?? null,
        ], fn ($value) => $value !== null));

        $html = View::make('emails.newsletter', [
            'newsletter' => $newsletter,
            'unsubscribeUrl' => frontend_url('/unsubscribe?token=preview-token'),
            'contentHtml' => $newsletter->renderedContent(),
            'headerImageUrl' => $newsletter->absoluteUrl($newsletter->header_image),
        ])->render();

        return response()->json(['html' => $html]);
    }

    protected function validateNewsletter(Request $request): array
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'preheader' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'header_image' => 'nullable|string|max:255',
            'background_color' => ['nullable', 'string', 'regex:'.self::COLOR_PATTERN],
            'text_color' => ['nullable', 'string', 'regex:'.self::COLOR_PATTERN],
            'accent_color' => ['nullable', 'string', 'regex:'.self::COLOR_PATTERN],
        ]);

        if (isset($validated['content'])) {
            $validated['content'] = html_entity_decode($validated['content'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return $validated;
    }
}
