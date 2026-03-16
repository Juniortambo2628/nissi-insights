<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stat;
use Illuminate\Http\Request;

class StatController extends Controller
{
    public function index()
    {
        return response()->json(Stat::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string',
            'value' => 'required|string',
            'icon' => 'nullable|string',
            'order' => 'integer',
        ]);

        $stat = Stat::create($validated);
        return response()->json($stat, 201);
    }

    public function show(Stat $stat)
    {
        return response()->json($stat);
    }

    public function update(Request $request, Stat $stat)
    {
        $validated = $request->validate([
            'label' => 'string',
            'value' => 'string',
            'icon' => 'nullable|string',
            'order' => 'integer',
        ]);

        $stat->update($validated);
        return response()->json($stat);
    }

    public function destroy(Stat $stat)
    {
        $stat->delete();
        return response()->json(null, 204);
    }
}
