<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Traits\HasSlug;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use HasSlug;

    public function index()
    {
        $services = Service::with('pillar')->where('is_active', true)->get();

        return ServiceResource::collection($services);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $validated['slug'] = $this->generateSlug($validated['title'], Service::class);
        $service = Service::create($validated);

        return new ServiceResource($service);
    }

    public function show(Service $service)
    {
        return new ServiceResource($service);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'category' => 'string',
            'description' => 'string',
            'content' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $service->id, Service::class);
        }

        $service->update($validated);

        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(null, 204);
    }
}
