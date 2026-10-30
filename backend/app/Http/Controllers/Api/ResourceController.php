<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Traits\HasSlug;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    use HasSlug;

    public function index(Request $request)
    {
        $query = Resource::query();

        if ($request->has('all') && $request->all === 'true') {
            return $query->orderBy('created_at', 'desc')->get();
        }

        $query->where('is_published', true);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            ...$this->optionalRules(),
        ]);

        $validated['slug'] = $this->generateSlug($validated['title'], Resource::class);
        $resource = Resource::create($validated);

        return response()->json($resource, 201);
    }

    public function show(string $slug)
    {
        $resource = Resource::where('slug', $slug)->firstOrFail();

        return response()->json($resource);
    }

    public function update(Request $request, Resource $resource)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'type' => 'string',
            ...$this->optionalRules(),
        ]);

        if (isset($validated['title']) && $validated['title'] !== $resource->title) {
            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $resource->id, Resource::class);
        }

        $resource->update($validated);

        return response()->json($resource);
    }

    private function optionalRules(): array
    {
        return [
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'file_path' => 'nullable|string|max:255',
            'thumbnail' => 'nullable|string|max:255',
            'external_link' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'is_published' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ];
    }

    public function destroy(Resource $resource)
    {
        $resource->delete();

        return response()->json(['message' => 'Resource deleted']);
    }
}
