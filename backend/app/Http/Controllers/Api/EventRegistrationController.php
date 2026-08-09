<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EventRegistration;
use App\Traits\SendsTemplatedMail;
use Illuminate\Http\Request;

class EventRegistrationController extends Controller
{
    use SendsTemplatedMail;

    public function index(Request $request)
    {
        $query = EventRegistration::with('event');

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show(EventRegistration $eventRegistration)
    {
        $eventRegistration->load('event');

        return response()->json($eventRegistration);
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

        $event = \App\Models\Event::findOrFail($validated['event_id']);
        if ($event->status === 'past') {
            return response()->json(['message' => 'Registration is not available for past events.'], 422);
        }

        $registration = EventRegistration::create($validated);
        $registration->load('event');

        $this->sendRegistrationEmails($registration);

        return response()->json($registration, 201);
    }

    public function update(Request $request, EventRegistration $eventRegistration)
    {
        $oldAttended = $eventRegistration->attended;

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'nullable|string|max:20',
            'organization' => 'nullable|string|max:255',
            'attended' => 'sometimes|boolean',
        ]);

        $eventRegistration->update($validated);

        // If changed to attended, send thank you email
        if (! $oldAttended && $eventRegistration->attended) {
            $eventRegistration->load('event');
            $this->sendTemplatedMail(
                'event_attended_thank_you',
                $eventRegistration->email,
                $eventRegistration->event->templateDataForRegistration($eventRegistration),
                $eventRegistration
            );
        }

        return response()->json($eventRegistration);
    }

    public function destroy(EventRegistration $eventRegistration)
    {
        $eventRegistration->delete();

        return response()->json(null, 204);
    }

    public function sendReminder(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'registration_ids' => 'nullable|array',
            'registration_ids.*' => 'integer|exists:event_registrations,id',
            'template_key' => 'nullable|string|exists:email_templates,key',
        ]);

        $event = \App\Models\Event::with('registrations')->findOrFail($validated['event_id']);
        $templateKey = $validated['template_key'] ?? 'event_reminder_approaching';
        $registrationIds = $validated['registration_ids'] ?? null;

        $registrations = $registrationIds
            ? $event->registrations()->whereIn('id', $registrationIds)->get()
            : $event->registrations;

        if ($registrations->isEmpty()) {
            return response()->json(['error' => 'No registrations found for this event.'], 404);
        }

        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($registrations as $registration) {
            $success = $this->sendTemplatedMail(
                $templateKey,
                $registration->email,
                $registration->event->templateDataForRegistration($registration),
                $registration
            );
            if ($success) {
                $sent++;
            } else {
                $failed++;
                $errors[] = "{$registration->email}: Failed to send";
            }
        }

        return response()->json([
            'message' => "Reminders sent: {$sent}, failed: {$failed}",
            'sent' => $sent,
            'failed' => $failed,
            'errors' => $errors,
        ]);
    }

    protected function sendRegistrationEmails(EventRegistration $registration): void
    {
        $commonData = $registration->event->templateDataForRegistration($registration);

        // Client confirmation
        $this->sendTemplatedMail('event_registered_client', $registration->email, $commonData, $registration);

        // Admin notification
        $adminAddress = config('mail.admin_address', config('mail.from.address'));
        $adminData = array_merge($commonData, [
            'email' => $registration->email,
            'phone' => $registration->phone,
            'organization' => $registration->organization,
        ]);
        $this->sendTemplatedMail('event_registered_admin', $adminAddress, $adminData, $registration);
    }
}
