<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\TemplatedMail;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EventRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = EventRegistration::with('event');

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
        $registration->load('event');

        $this->sendRegistrationEmails($registration);

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
                $eventRegistration->load('event');
                $mail = new TemplatedMail('event_attended_thank_you', $this->templateData($eventRegistration), $eventRegistration);
                Mail::to($eventRegistration->email)->send($mail);
                $mail->log($eventRegistration->email, 'sent');
            } catch (\Exception $e) {
                \Log::error("Failed to send event thank you email: " . $e->getMessage());
                (new TemplatedMail('event_attended_thank_you', $this->templateData($eventRegistration), $eventRegistration))
                    ->log($eventRegistration->email, 'failed', $e->getMessage());
            }
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
            'template_key' => 'nullable|string|in:event_reminder_approaching,event_reminder_started,event_thank_you_ended',
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
            try {
                $data = $this->templateData($registration);
                $mail = new TemplatedMail($templateKey, $data, $registration);
                Mail::to($registration->email)->send($mail);
                $mail->log($registration->email, 'sent');
                $sent++;
            } catch (\Exception $e) {
                \Log::error("Failed to send manual reminder to {$registration->email}: " . $e->getMessage());
                (new TemplatedMail($templateKey, $this->templateData($registration), $registration))
                    ->log($registration->email, 'failed', $e->getMessage());
                $failed++;
                $errors[] = "{$registration->email}: {$e->getMessage()}";
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
        $commonData = $this->templateData($registration);

        // Client confirmation
        try {
            $clientMail = new TemplatedMail('event_registered_client', $commonData, $registration);
            Mail::to($registration->email)->send($clientMail);
            $clientMail->log($registration->email, 'sent');
        } catch (\Exception $e) {
            \Log::error("Failed to send event registration email to client: " . $e->getMessage());
            (new TemplatedMail('event_registered_client', $commonData, $registration))
                ->log($registration->email, 'failed', $e->getMessage());
        }

        // Admin notification
        try {
            $adminAddress = config('mail.admin_address', config('mail.from.address'));
            $adminData = array_merge($commonData, [
                'email' => $registration->email,
                'phone' => $registration->phone,
                'organization' => $registration->organization,
            ]);
            $adminMail = new TemplatedMail('event_registered_admin', $adminData, $registration);
            Mail::to($adminAddress)->send($adminMail);
            $adminMail->log($adminAddress, 'sent');
        } catch (\Exception $e) {
            \Log::error("Failed to send event registration email to admin: " . $e->getMessage());
            (new TemplatedMail('event_registered_admin', $adminData, $registration))
                ->log($adminAddress, 'failed', $e->getMessage());
        }
    }

    protected function templateData(EventRegistration $registration): array
    {
        $event = $registration->event;
        $start = $event->startTime();

        return [
            'name' => $registration->name,
            'eventTitle' => $event->title,
            'eventDate' => $start->format('F j, Y'),
            'eventTime' => $start->format('g:i a T'),
            'eventLocation' => $event->location ?? 'TBC',
            'eventLink' => $event->link ?? null,
            'eventId' => $event->id,
            'eventImage' => $event->image ? config('app.url') . '/api/storage/' . ltrim($event->image, '/') : null,
        ];
    }
}
