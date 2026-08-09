<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\NotFoundLog;
use App\Models\PageView;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    // Public — log a page view
    public function track(Request $request)
    {
        $request->validate([
            'path' => 'required|string|max:500',
        ]);

        PageView::create([
            'path' => $request->path,
            'referrer' => $request->header('referer'),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true], 201);
    }

    // Public — log a 404 Not Found
    public function track404(Request $request)
    {
        $request->validate([
            'path' => 'required|string|max:500',
            'source' => 'nullable|string|max:100',
        ]);

        NotFoundLog::create([
            'path' => $request->path,
            'source' => $request->input('source', 'unknown'),
            'referrer' => $request->header('referer'),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true], 201);
    }

    // Protected — admin summary
    public function summary(Request $request)
    {
        $now = Carbon::now();

        // Total counts
        $totalViews = PageView::count();
        $todayViews = PageView::whereDate('created_at', $now->toDateString())->count();
        $weekViews = PageView::where('created_at', '>=', $now->subDays(7))->count();
        $monthViews = PageView::where('created_at', '>=', Carbon::now()->subDays(30))->count();

        // Unique IPs (proxy for unique visitors)
        $uniqueVisitors = PageView::where('created_at', '>=', Carbon::now()->subDays(30))
            ->distinct('ip')->count('ip');

        // Top pages (last 30 days)
        $topPages = PageView::where('created_at', '>=', Carbon::now()->subDays(30))
            ->select('path', DB::raw('COUNT(*) as views'))
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        // Views over time (last 14 days)
        $viewsOverTime = PageView::where('created_at', '>=', Carbon::now()->subDays(14))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as views'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // Top referrers
        $topReferrers = PageView::where('created_at', '>=', Carbon::now()->subDays(30))
            ->whereNotNull('referrer')
            ->where('referrer', '!=', '')
            ->select('referrer', DB::raw('COUNT(*) as count'))
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return response()->json([
            'total_views' => $totalViews,
            'today_views' => $todayViews,
            'week_views' => $weekViews,
            'month_views' => $monthViews,
            'unique_visitors' => $uniqueVisitors,
            'top_pages' => $topPages,
            'views_over_time' => $viewsOverTime,
            'top_referrers' => $topReferrers,
        ]);
    }

    public function notFoundLogs(Request $request)
    {
        $query = NotFoundLog::latest();

        if ($request->has('path')) {
            $query->where('path', 'like', '%'.$request->path.'%');
        }

        $perPage = $request->input('per_page', 50);

        return response()->json($query->paginate($perPage));
    }

    public function notFoundSummary()
    {
        return response()->json([
            'total' => NotFoundLog::count(),
            'today' => NotFoundLog::whereDate('created_at', Carbon::today())->count(),
            'top_paths' => NotFoundLog::select('path', DB::raw('COUNT(*) as count'))
                ->groupBy('path')
                ->orderByDesc('count')
                ->limit(20)
                ->get(),
        ]);
    }

    public function eventAnalytics()
    {
        $eventsCount = Event::count();
        $totalRegistrations = EventRegistration::count();
        $totalAttendance = EventRegistration::where('attended', true)->count();

        $attendanceRate = $totalRegistrations > 0
            ? round(($totalAttendance / $totalRegistrations) * 100, 1)
            : 0;

        // Registrations per event
        $registrationsByEvent = Event::withCount('registrations')
            ->orderByDesc('registrations_count')
            ->limit(10)
            ->get();

        // Growth: Registrations over last 30 days
        $registrationsOverTime = EventRegistration::where('created_at', '>=', Carbon::now()->subDays(30))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // Upcoming events with registration counts
        $upcomingEvents = Event::where('date', '>=', Carbon::now())
            ->where('is_published', true)
            ->withCount('registrations')
            ->orderBy('date')
            ->get();

        return response()->json([
            'total_events' => $eventsCount,
            'total_registrations' => $totalRegistrations,
            'total_attendance' => $totalAttendance,
            'attendance_rate' => $attendanceRate,
            'registrations_by_event' => $registrationsByEvent,
            'registrations_over_time' => $registrationsOverTime,
            'upcoming_events' => $upcomingEvents,
        ]);
    }

    public function systemHealth()
    {
        $dbHealthy = true;
        $dbMessage = 'OK';
        $dbConnectionCount = null;
        $dbMaxConnections = null;

        try {
            $variables = DB::select("SHOW VARIABLES LIKE 'max_connections'");
            $processes = DB::select('SHOW PROCESSLIST');
            $dbMaxConnections = $variables[0]->Value ?? null;
            $dbConnectionCount = count($processes);
        } catch (\Exception $e) {
            $dbHealthy = false;
            $dbMessage = $e->getMessage();
        }

        return response()->json([
            'database' => [
                'healthy' => $dbHealthy,
                'message' => $dbMessage,
                'max_connections' => $dbMaxConnections,
                'current_connections' => $dbConnectionCount,
            ],
            'cache_store' => config('cache.default'),
            'session_driver' => config('session.driver'),
            'queue_connection' => config('queue.default'),
            'recommendations' => [
                'Set CACHE_STORE=file and SESSION_DRIVER=file in .env to reduce database load.',
                "Run 'php artisan optimize' and 'php artisan config:cache' after changing .env.",
                'If current_connections is near max_connections, ask your host to raise max_connections.',
            ],
        ]);
    }
}
