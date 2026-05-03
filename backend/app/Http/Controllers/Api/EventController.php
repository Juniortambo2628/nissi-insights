<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
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
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'link' => 'nullable|string',
            'status' => 'nullable|string|in:upcoming,past',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . rand(1000, 9999);
        
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
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'link' => 'nullable|string',
            'status' => 'nullable|string|in:upcoming,past',
            'is_published' => 'boolean',
        ]);

        if ($validated['title'] !== $event->title) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . rand(1000, 9999);
        }

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }
}
