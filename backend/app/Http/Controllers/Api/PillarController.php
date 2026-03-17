<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pillar;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PillarController extends Controller
{
    public function index()
    {
        return Pillar::with('services')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'overview' => 'nullable|string',
            'content' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        
        // Ensure unique slug
        $count = Pillar::where('slug', $validated['slug'])->count();
        if ($count > 0) {
            $validated['slug'] .= '-' . ($count + 1);
        }

        $pillar = Pillar::create($validated);
        return response()->json($pillar, 201);
    }

    public function show($slug)
    {
        $pillar = Pillar::with('services')->where('slug', $slug)->firstOrFail();
        return response()->json($pillar);
    }

    public function update(Request $request, Pillar $pillar)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'overview' => 'nullable|string',
            'content' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $pillar->title) {
            $validated['slug'] = Str::slug($validated['title']);
            $count = Pillar::where('slug', $validated['slug'])->where('id', '!=', $pillar->id)->count();
            if ($count > 0) {
                $validated['slug'] .= '-' . ($count + 1);
            }
        }

        $pillar->update($validated);
        return response()->json($pillar);
    }

    public function destroy(Pillar $pillar)
    {
        $pillar->delete();
        return response()->json(null, 204);
    }
}
