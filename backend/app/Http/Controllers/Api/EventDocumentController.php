<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EventDocument;
use Illuminate\Http\Request;

class EventDocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = EventDocument::query();

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        return response()->json($query->orderBy('sort_order')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:file,link',
            'path' => 'required|string|max:1000',
            'original_filename' => 'nullable|string|max:255',
            'mime_type' => 'nullable|string|max:100',
            'size' => 'nullable|integer|min:0',
            'is_published' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $document = EventDocument::create($validated);

        return response()->json($document, 201);
    }

    public function show(EventDocument $eventDocument)
    {
        return response()->json($eventDocument);
    }

    public function update(Request $request, EventDocument $eventDocument)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:file,link',
            'path' => 'sometimes|string|max:1000',
            'original_filename' => 'nullable|string|max:255',
            'mime_type' => 'nullable|string|max:100',
            'size' => 'nullable|integer|min:0',
            'is_published' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $eventDocument->update($validated);

        return response()->json($eventDocument);
    }

    public function destroy(EventDocument $eventDocument)
    {
        $eventDocument->delete();

        return response()->json(null, 204);
    }
}
