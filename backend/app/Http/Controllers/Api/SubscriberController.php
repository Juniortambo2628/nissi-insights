<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriberResource;
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
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string|max:64',
        ]);

        $subscriber = Subscriber::where('unsubscribe_token', $validated['token'])->first();

        if (! $subscriber) {
            return response()->json(['message' => 'Invalid unsubscribe link.'], 404);
        }

        $subscriber->markOptedOut();

        return response()->json([
            'message' => 'You have been unsubscribed from email campaigns.',
            'email' => $subscriber->email,
        ]);
    }
}
