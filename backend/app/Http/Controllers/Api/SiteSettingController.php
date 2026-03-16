<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->groupBy('group');
        
        return $settings->map(function ($group) {
            return SiteSettingResource::collection($group);
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:site_settings',
            'value' => 'nullable|string',
            'type' => 'string',
            'group' => 'string',
        ]);

        $setting = SiteSetting::create($validated);
        return new SiteSettingResource($setting);
    }

    public function show(SiteSetting $siteSetting)
    {
        return new SiteSettingResource($siteSetting);
    }

    public function update(Request $request, SiteSetting $siteSetting)
    {
        $validated = $request->validate([
            'value' => 'nullable|string',
        ]);

        $siteSetting->update($validated);
        return new SiteSettingResource($siteSetting);
    }

    public function destroy(SiteSetting $siteSetting)
    {
        $siteSetting->delete();
        return response()->json(null, 204);
    }

    public function batchUpdate(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.type' => 'nullable|string',
            'settings.*.group' => 'nullable|string',
        ]);

        foreach ($request->settings as $item) {
            SiteSetting::updateOrCreate(
                ['key' => $item['key']],
                [
                    'value' => $item['value'] ?? '',
                    'type' => $item['type'] ?? 'text',
                    'group' => $item['group'] ?? 'general',
                ]
            );
        }

        $settings = SiteSetting::all()->groupBy('group');
        return $settings->map(function ($group) {
            return SiteSettingResource::collection($group);
        });
    }

    public function getLaunchSettings()
    {
        $settings = SiteSetting::where('group', 'launch')->get()->pluck('value', 'key');
        
        return response()->json([
            'isActive' => filter_var($settings->get('rsvp_active', '0'), FILTER_VALIDATE_BOOLEAN),
            'date' => $settings->get('rsvp_date', '2026-06-01 00:00:00'),
            'title' => $settings->get('rsvp_title', 'Coming Soon'),
            'description' => $settings->get('rsvp_description', ''),
            'media' => $settings->get('rsvp_media', ''),
        ]);
    }
}

