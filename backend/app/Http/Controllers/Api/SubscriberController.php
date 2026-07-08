<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriberResource;
use App\Models\Subscriber;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\TemplatedMail;

class SubscriberController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email',
            'name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:100',
        ]);

        $subscriber = Subscriber::create($validated);

        if (EmailTemplate::active()->byKey('subscriber_welcome')->exists()) {
            try {
                Mail::to($subscriber->email)->send(
                    new TemplatedMail('subscriber_welcome', ['subscriber' => $subscriber], $subscriber)
                );
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send subscriber welcome email: ' . $e->getMessage());
            }
        }

        return new SubscriberResource($subscriber);
    }

    public function index()
    {
        return SubscriberResource::collection(Subscriber::orderByDesc('created_at')->get());
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();
        return response()->json(null, 204);
    }
}

