<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(
            Client::where('is_active', true)->orderBy('order')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string',
            'website' => 'nullable|string|url',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $client = Client::create($validated);
        return response()->json($client, 201);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'logo' => 'nullable|string',
            'website' => 'nullable|string|url',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $client->update($validated);
        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(null, 204);
    }
}
