<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use Illuminate\Http\Request;

class EmailLogController extends Controller
{
    public function index(Request $request)
    {
        $query = EmailLog::with('sendable')->latest();

        if ($request->has('template_key')) {
            $query->where('template_key', $request->template_key);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('recipient')) {
            $query->where('recipient', 'like', '%' . $request->recipient . '%');
        }

        $perPage = $request->input('per_page', 50);

        return response()->json($query->paginate($perPage));
    }

    public function summary(Request $request)
    {
        $query = EmailLog::query();

        if ($request->has('template_key')) {
            $query->where('template_key', $request->template_key);
        }

        return response()->json([
            'total' => (clone $query)->count(),
            'sent' => (clone $query)->where('status', 'sent')->count(),
            'failed' => (clone $query)->where('status', 'failed')->count(),
            'queued' => (clone $query)->where('status', 'queued')->count(),
        ]);
    }
}
