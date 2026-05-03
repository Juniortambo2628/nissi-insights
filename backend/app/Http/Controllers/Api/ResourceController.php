<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Resource;
use Illuminate\Support\Str;

class ResourceController extends Controller
{
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
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        
        $resource = Resource::create($data);

        return response()->json($resource, 201);
    }

    public function show(string $slug)
    {
        $resource = Resource::where('slug', $slug)->firstOrFail();
        return response()->json($resource);
    }

    public function update(Request $request, string $id)
    {
        $resource = Resource::findOrFail($id);
        
        $request->validate([
            'title' => 'string|max:255',
        ]);

        $data = $request->all();
        if (isset($data['title']) && $data['title'] !== $resource->title) {
            $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        }

        $resource->update($data);

        return response()->json($resource);
    }

    public function destroy(string $id)
    {
        $resource = Resource::findOrFail($id);
        $resource->delete();

        return response()->json(['message' => 'Resource deleted']);
    }

}
