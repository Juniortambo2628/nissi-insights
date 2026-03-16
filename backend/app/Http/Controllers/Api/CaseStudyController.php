<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseStudyResource;
use App\Models\CaseStudy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CaseStudyController extends Controller
{
    public function index()
    {
        return CaseStudyResource::collection(CaseStudy::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'nullable|string',
            'problem' => 'nullable|string',
            'methodology' => 'nullable|string',
            'outcome' => 'nullable|string',
            'image' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
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
            'problem' => 'nullable|string',
            'methodology' => 'nullable|string',
            'outcome' => 'nullable|string',
            'image' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
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

