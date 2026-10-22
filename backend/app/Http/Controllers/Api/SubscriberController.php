<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriberResource;
use App\Models\EmailContact;
use App\Models\Subscriber;
use App\Traits\SendsTemplatedMail;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    use SendsTemplatedMail;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email',
            'name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:100',
        ]);

        $subscriber = Subscriber::create($validated);

        $this->sendTemplatedMail(
            'subscriber_welcome',
            $subscriber->email,
            ['subscriber' => $subscriber],
            $subscriber
        );

        return new SubscriberResource($subscriber);
    }

    public function index()
    {
        return SubscriberResource::collection(Subscriber::orderByDesc('created_at')->get());
    }

    public function show(Subscriber $subscriber)
    {
        return new SubscriberResource($subscriber);
    }

    public function update(Request $request, Subscriber $subscriber)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $subscriber->update($validated);

        return new SubscriberResource($subscriber);
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();

        return response()->json(null, 204);
    }

    /**
     * Public opt-out endpoint used by the unsubscribe link in newsletter emails.
     * Accepts tokens from both Subscriber and EmailContact records; opting out
     * marks ALL records with the same email in both tables as opted out.
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string|max:64',
        ]);

        $token = $validated['token'];

        // Look up token in either table.
        $subscriber = Subscriber::where('unsubscribe_token', $token)->first();
        $contact = null;

        if ($subscriber) {
            $email = $subscriber->email;
        } else {
            $contact = EmailContact::where('unsubscribe_token', $token)->first();

            if (! $contact) {
                return response()->json(['message' => 'Invalid unsubscribe link.'], 404);
            }

            $email = $contact->email;
        }

        // Opt out every record with this email across both tables.
        Subscriber::where('email', $email)->optedIn()->get()->each->markOptedOut();
        EmailContact::where('email', $email)->optedIn()->get()->each->markOptedOut();

        return response()->json([
            'message' => 'You have been unsubscribed from email campaigns.',
            'email' => $email,
        ]);
    }
}
