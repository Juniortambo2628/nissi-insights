<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Insight;
use App\Models\CaseStudy;
use App\Models\Event;
use App\Models\Pillar;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q', '');
        $type = $request->get('type', 'all'); // all, services, insights, case_studies, events, pillars

        if (strlen($q) < 2) {
            return response()->json([
                'services' => [], 
                'insights' => [], 
                'case_studies' => [],
                'events' => [],
                'pillars' => []
            ]);
        }

        $results = [
            'services' => [],
            'insights' => [],
            'case_studies' => [],
            'events' => [],
            'pillars' => [],
        ];

        $words = explode(' ', $q);

        if ($type === 'all' || $type === 'services') {
            $results['services'] = Service::where('is_active', true)
                ->where(function ($query) use ($q, $words) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%")
                        ->orWhere('category', 'like', "%{$q}%");
                    
                    foreach ($words as $word) {
                        if (strlen($word) > 2) {
                            $query->orWhere('title', 'like', "%{$word}%");
                        }
                    }
                })
                ->orderByRaw("CASE 
                    WHEN title LIKE ? THEN 1 
                    WHEN title LIKE ? THEN 2 
                    ELSE 3 END", ["{$q}", "{$q}%"])
                ->select('id', 'title', 'slug', 'category', 'description')
                ->limit(10)
                ->get();
        }

        if ($type === 'all' || $type === 'insights') {
            $results['insights'] = Insight::where('is_published', true)
                ->where(function ($query) use ($q, $words) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('excerpt', 'like', "%{$q}%")
                        ->orWhere('category', 'like', "%{$q}%")
                        ->orWhere('content', 'like', "%{$q}%");
                        
                    foreach ($words as $word) {
                        if (strlen($word) > 2) {
                            $query->orWhere('title', 'like', "%{$word}%");
                        }
                    }
                })
                ->orderByRaw("CASE 
                    WHEN title LIKE ? THEN 1 
                    WHEN title LIKE ? THEN 2 
                    ELSE 3 END", ["{$q}", "{$q}%"])
                ->select('id', 'title', 'slug', 'category', 'excerpt')
                ->limit(10)
                ->get();
        }

        if ($type === 'all' || $type === 'case_studies') {
            $results['case_studies'] = CaseStudy::where(function ($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('client_name', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%")
                        ->orWhere('challenge', 'like', "%{$q}%")
                        ->orWhere('solution', 'like', "%{$q}%");
                })
                ->orderByRaw("CASE 
                    WHEN title LIKE ? THEN 1 
                    WHEN title LIKE ? THEN 2 
                    ELSE 3 END", ["{$q}", "{$q}%"])
                ->select('id', 'title', 'slug', 'client_name')
                ->limit(10)
                ->get();
        }

        if ($type === 'all' || $type === 'events') {
            $results['events'] = Event::where('is_published', true)
                ->where(function ($query) use ($q, $words) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%")
                        ->orWhere('overview', 'like', "%{$q}%")
                        ->orWhere('location', 'like', "%{$q}%");
                        
                    foreach ($words as $word) {
                        if (strlen($word) > 2) {
                            $query->orWhere('title', 'like', "%{$word}%");
                        }
                    }
                })
                ->orderByRaw("CASE 
                    WHEN title LIKE ? THEN 1 
                    WHEN title LIKE ? THEN 2 
                    ELSE 3 END", ["{$q}", "{$q}%"])
                ->select('id', 'title', 'slug', 'date', 'location')
                ->limit(10)
                ->get();
        }

        if ($type === 'all' || $type === 'pillars') {
            $results['pillars'] = Pillar::where('is_active', true)
                ->where(function ($query) use ($q, $words) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('overview', 'like', "%{$q}%")
                        ->orWhere('content', 'like', "%{$q}%");
                        
                    foreach ($words as $word) {
                        if (strlen($word) > 2) {
                            $query->orWhere('title', 'like', "%{$word}%");
                        }
                    }
                })
                ->orderByRaw("CASE 
                    WHEN title LIKE ? THEN 1 
                    WHEN title LIKE ? THEN 2 
                    ELSE 3 END", ["{$q}", "{$q}%"])
                ->select('id', 'title', 'slug', 'overview')
                ->limit(5)
                ->get();
        }

        return response()->json($results);
    }
}
