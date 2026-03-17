<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use Illuminate\Http\Request;

use App\Mail\RsvpConfirmation;
use Illuminate\Support\Facades\Mail;

class RsvpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Rsvp::orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:rsvps,email',
            'company' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'sector' => 'nullable|string|max:255',
            'interest' => 'nullable|string|max:255',
            'consent' => 'boolean',
            'newsletter' => 'boolean',
            'attendance' => 'nullable|string|max:255',
            'type' => 'nullable|string|in:rsvp,early_access',
        ]);

        $rsvp = Rsvp::create($validated);

        // Send confirmation email asynchronously
        Mail::to($rsvp->email)->queue(new RsvpConfirmation($rsvp));

        return response()->json([
            'message' => 'Successfully registered for the pre-launch RSVP.',
            'data' => $rsvp
        ], 201);
    }
}
