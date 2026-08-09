<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InsightResource;
use App\Models\Insight;
use App\Traits\HasSlug;
use Illuminate\Http\Request;

class InsightController extends Controller
{
    use HasSlug;

    public function index()
    {
        $insights = Insight::with('user')
            ->where('is_published', true)
            ->orderBy('published_at', 'desc')
            ->get();

        return InsightResource::collection($insights);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|string',
            'is_published' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $validated['slug'] = $this->generateSlug($validated['title'], Insight::class);
        $validated['user_id'] = $request->user()->id;

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = now();
        }

        $insight = Insight::create($validated);

        return new InsightResource($insight);
    }

    public function show(Insight $insight)
    {
        return new InsightResource($insight->load('user'));
    }

    public function update(Request $request, Insight $insight)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'category' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'string',
            'image' => 'nullable|string',
            'is_published' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $insight->id, Insight::class);
        }

        if (($validated['is_published'] ?? false) && ! $insight->is_published) {
            $validated['published_at'] = now();
        }

        $insight->update($validated);

        return new InsightResource($insight->load('user'));
    }

    public function destroy(Insight $insight)
    {
        $insight->delete();

        return response()->json(null, 204);
    }
}
