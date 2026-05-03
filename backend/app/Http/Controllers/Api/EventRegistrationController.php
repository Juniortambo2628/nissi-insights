<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventRegistered;
use App\Mail\EventAttendanceThankYou;

class EventRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = EventRegistration::query();
        
        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'organization' => 'nullable|string|max:255',
        ]);

        $registration = EventRegistration::create($validated);

        // Send registration email
        try {
            Mail::to($registration->email)->send(new EventRegistered($registration));
        } catch (\Exception $e) {
            \Log::error("Failed to send event registration email: " . $e->getMessage());
        }

        return response()->json($registration, 201);
    }

    public function update(Request $request, EventRegistration $eventRegistration)
    {
        $oldAttended = $eventRegistration->attended;
        
        $validated = $request->validate([
            'attended' => 'required|boolean',
        ]);

        $eventRegistration->update($validated);

        // If changed to attended, send thank you email
        if (!$oldAttended && $eventRegistration->attended) {
            try {
                Mail::to($eventRegistration->email)->send(new EventAttendanceThankYou($eventRegistration));
            } catch (\Exception $e) {
                \Log::error("Failed to send event thank you email: " . $e->getMessage());
            }
        }

        return response()->json($eventRegistration);
    }

    public function destroy(EventRegistration $eventRegistration)
    {
        $eventRegistration->delete();
        return response()->json(null, 204);
    }
}
