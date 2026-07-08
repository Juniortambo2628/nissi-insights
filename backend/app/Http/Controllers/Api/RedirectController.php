<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Redirect;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RedirectController extends Controller
{
    public function index(Request $request)
    {
        $query = Redirect::query();

        if ($request->has('active_only')) {
            $query->active();
        }

        return response()->json($query->orderByDesc('priority')->orderBy('from_path')->paginate($request->input('per_page', 100)));
    }

    public function publicList()
    {
        return response()->json(
            Redirect::active()
                ->orderByDesc('priority')
                ->orderBy('from_path')
                ->get(['from_path', 'to', 'status_code'])
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'from_path' => ['required', 'string', 'max:512', 'unique:redirects,from_path'],
            'to' => ['required', 'string', 'max:1024'],
            'status_code' => ['nullable', 'integer', Rule::in([301, 302, 307, 308])],
            'is_active' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $redirect = Redirect::create($data);

        return response()->json($redirect, 201);
    }

    public function show(Redirect $redirect)
    {
        return response()->json($redirect);
    }

    public function update(Request $request, Redirect $redirect)
    {
        $data = $request->validate([
            'from_path' => ['sometimes', 'string', 'max:512', Rule::unique('redirects')->ignore($redirect->id)],
            'to' => ['sometimes', 'string', 'max:1024'],
            'status_code' => ['nullable', 'integer', Rule::in([301, 302, 307, 308])],
            'is_active' => ['nullable', 'boolean'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $redirect->update($data);

        return response()->json($redirect);
    }

    public function destroy(Redirect $redirect)
    {
        $redirect->delete();

        return response()->json(['message' => 'Redirect deleted.']);
    }
}
