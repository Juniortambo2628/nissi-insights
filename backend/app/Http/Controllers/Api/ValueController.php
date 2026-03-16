<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Value;
use Illuminate\Http\Request;

class ValueController extends Controller
{
    public function index()
    {
        return response()->json(Value::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        $value = Value::create($validated);

        return response()->json($value, 201);
    }

    public function show(Value $value)
    {
        return response()->json($value);
    }

    public function update(Request $request, Value $value)
    {
        $validated = $request->validate([
            'icon' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        $value->update($validated);

        return response()->json($value);
    }

    public function destroy(Value $value)
    {
        $value->delete();

        return response()->json(null, 204);
    }
}
