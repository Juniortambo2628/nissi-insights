<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventDocument;
use App\Models\Resource;
use App\Traits\HasSlug;
use Illuminate\Http\Request;

class EventDocumentController extends Controller
{
    use HasSlug;

    public function index(Request $request)
    {
        $query = EventDocument::with('event');

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

        // Auto-create Resource in knowledge hub
        $event = Event::find($validated['event_id']);
        $resourceData = [
            'title' => $validated['title'],
            'slug' => $this->generateSlug($validated['title'], Resource::class),
            'type' => 'event',
            'is_published' => $validated['is_published'] ?? true,
            'tags' => ['event', 'event-'.$validated['event_id']],
        ];

        if ($validated['type'] === 'link') {
            $resourceData['external_link'] = $validated['path'];
        } else {
            $resourceData['file_path'] = $validated['path'];
        }

        if ($event) {
            $resourceData['description'] = 'Resource from event: '.$event->title;
        }

        $resource = Resource::create($resourceData);
        $document->update(['resource_id' => $resource->id]);

        return response()->json($document->load('event'), 201);
    }

    public function show(EventDocument $eventDocument)
    {
        return response()->json($eventDocument->load('event'));
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

        // Sync to knowledge hub resource
        if ($eventDocument->resource) {
            $updateData = [];
            if (isset($validated['title'])) {
                $updateData['title'] = $validated['title'];
            }
            if (isset($validated['is_published'])) {
                $updateData['is_published'] = $validated['is_published'];
            }
            if (isset($validated['type']) || isset($validated['path'])) {
                $type = $validated['type'] ?? $eventDocument->type;
                $path = $validated['path'] ?? $eventDocument->path;
                if ($type === 'link') {
                    $updateData['external_link'] = $path;
                    $updateData['file_path'] = null;
                } else {
                    $updateData['file_path'] = $path;
                    $updateData['external_link'] = null;
                }
            }
            if (! empty($updateData)) {
                $eventDocument->resource->update($updateData);
            }
        }

        return response()->json($eventDocument->load('event'));
    }

    public function destroy(EventDocument $eventDocument)
    {
        // Delete associated knowledge hub resource
        if ($eventDocument->resource) {
            $eventDocument->resource->delete();
        }

        $eventDocument->delete();

        return response()->json(null, 204);
    }
}
