<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query();

        if (!$request->user()) {
            $query->where('is_published', true);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'overview' => 'nullable|string',
            'date' => 'required|date',
            'duration_minutes' => 'nullable|integer|min:1',
            'timezone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'link' => 'nullable|string',
            'status' => 'nullable|string|in:upcoming,past',
            'is_published' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $count = 1;
        while (Event::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }
        $validated['slug'] = $slug;
        $validated['date'] = $this->normalizeDate($validated);

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    public function show($slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'overview' => 'nullable|string',
            'date' => 'required|date',
            'duration_minutes' => 'nullable|integer|min:1',
            'timezone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'link' => 'nullable|string',
            'status' => 'nullable|string|in:upcoming,past',
            'is_published' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if ($validated['title'] !== $event->title) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $count = 1;
            while (Event::where('slug', $slug)->where('id', '!=', $event->id)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            $validated['slug'] = $slug;
        }

        $validated['date'] = $this->normalizeDate($validated, $event);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }

    /**
     * Interpret the incoming datetime-local value as a wall-clock time in the
     * event timezone and store it as UTC.
     */
    protected function normalizeDate(array $validated, ?Event $event = null): Carbon
    {
        $timezone = $validated['timezone'] ?? ($event?->timezone ?? config('app.timezone', 'UTC'));

        return Carbon::parse($validated['date'], $timezone)->setTimezone('UTC');
    }
}
