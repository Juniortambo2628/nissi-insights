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
        return SiteSettingResource::make($setting);
    }

    public function show(SiteSetting $siteSetting)
    {
        return SiteSettingResource::make($siteSetting);
    }

    public function update(Request $request, SiteSetting $siteSetting)
    {
        $validated = $request->validate([
            'value' => 'nullable|string',
        ]);

        $siteSetting->update($validated);
        return SiteSettingResource::make($siteSetting);
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
        \Illuminate\Support\Facades\Log::info('getLaunchSettings called');
        $settings = SiteSetting::where('group', 'launch')->get()->pluck('value', 'key');
        
        $menuFile = $settings->get('rsvp_menu_file');
        
        // Use default if empty
        if (!$menuFile) {
            $menuFile = '/assets/defaults/rsvp-menu.pdf';
        } else {
            // Ensure path from DB is converted to URL if it's just a path
            if (!filter_var($menuFile, FILTER_VALIDATE_URL)) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = \Illuminate\Support\Facades\Storage::disk('public');
                $menuFile = $disk->url($menuFile);
            }
        }

        return response()->json([
            'isActive' => filter_var($settings->get('rsvp_active', '0'), FILTER_VALIDATE_BOOLEAN),
            'date' => $settings->get('rsvp_date', '2026-06-01 00:00:00'),
            'title' => $settings->get('rsvp_title', 'Coming Soon'),
            'description' => $settings->get('rsvp_description', ''),
            'media' => $settings->get('rsvp_media', ''),
            'bgLight' => $settings->get('rsvp_bg_light', ''),
            'bgDark' => $settings->get('rsvp_bg_dark', ''),
            'venue' => $settings->get('rsvp_venue', 'The Sage Delicacy, Gigiri'),
            'address' => $settings->get('rsvp_address', 'Gigiri, Nairobi'),
            'time' => $settings->get('rsvp_time', '7:00-9:00 P.M.'),
            'menuFile' => $menuFile,
        ]);
    }
}

