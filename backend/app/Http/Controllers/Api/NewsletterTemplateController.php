<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class NewsletterTemplateController extends Controller
{
    protected const COLOR_PATTERN = '/^#[0-9A-Fa-f]{6}$/';

    public function index(Request $request)
    {
        if (! Schema::hasTable('newsletter_templates')) {
            return response()->json([
                'message' => 'Database migration pending: newsletter_templates table missing. Run php artisan migrate.',
            ], 503);
        }

        $templates = NewsletterTemplate::where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->get();

        return response()->json($templates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'background_color' => ['required', 'string', 'regex:'.self::COLOR_PATTERN],
            'text_color' => ['required', 'string', 'regex:'.self::COLOR_PATTERN],
            'accent_color' => ['required', 'string', 'regex:'.self::COLOR_PATTERN],
        ]);

        $validated['user_id'] = $request->user()->id;

        return response()->json(NewsletterTemplate::create($validated), 201);
    }

    public function destroy(Request $request, NewsletterTemplate $template)
    {
        if ($template->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $template->delete();

        return response()->json(null, 204);
    }
}
