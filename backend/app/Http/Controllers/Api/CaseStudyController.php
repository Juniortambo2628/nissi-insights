<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Models\CaseStudy;
use App\Traits\HasSlug;
use Illuminate\Http\Request;

class CaseStudyController extends Controller
{
    use HasSlug;

    public function index()
    {
        return CaseStudyResource::collection(CaseStudy::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'nullable|string',
            'significant_figure' => 'nullable|string|max:255',
            'problem' => 'nullable|string',
            'methodology' => 'nullable|string',
            'outcome' => 'nullable|string',
            'image' => 'nullable|string',
            'is_featured' => 'boolean',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $validated['slug'] = $this->generateSlug($validated['title'], CaseStudy::class);
        $caseStudy = CaseStudy::create($validated);

        return new CaseStudyResource($caseStudy);
    }

    public function show(CaseStudy $caseStudy)
    {
        return new CaseStudyResource($caseStudy);
    }

    public function update(Request $request, CaseStudy $caseStudy)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'client_name' => 'nullable|string',
            'significant_figure' => 'nullable|string|max:255',
            'problem' => 'nullable|string',
            'methodology' => 'nullable|string',
            'outcome' => 'nullable|string',
            'image' => 'nullable|string',
            'is_featured' => 'boolean',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $caseStudy->id, CaseStudy::class);
        }

        $caseStudy->update($validated);

        return new CaseStudyResource($caseStudy);
    }

    public function destroy(CaseStudy $caseStudy)
    {
        $caseStudy->delete();

        return response()->json(null, 204);
    }
}
