<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailContact;
use Illuminate\Http\Request;

class EmailContactController extends Controller
{
    public function index(Request $request)
    {
        $query = EmailContact::query();

        if ($request->filled('q')) {
            $search = $request->string('q')->toString();
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'nullable|email|max:255',
            'emails' => 'nullable|array|max:1000',
            'emails.*' => 'string|max:255',
            'name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:100',
        ]);

        $raw = $validated['emails'] ?? [];
        if (! empty($validated['email'])) {
            $raw[] = $validated['email'];
        }

        if (empty($raw)) {
            return response()->json(['message' => 'Provide at least one email address.'], 422);
        }

        $emails = $this->normalizeEmails($raw);

        if (empty($emails)) {
            return response()->json(['message' => 'No valid email addresses were provided.'], 422);
        }

        $created = 0;
        $existing = 0;

        foreach ($emails as $email) {
            $contact = EmailContact::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $validated['name'] ?? null,
                    'source' => $validated['source'] ?? 'manual',
                ]
            );

            $contact->wasRecentlyCreated ? $created++ : $existing++;
        }

        return response()->json([
            'message' => "Added {$created} contact(s), {$existing} already existed.",
            'created' => $created,
            'existing' => $existing,
            'contacts' => EmailContact::orderBy('created_at', 'desc')->get(),
        ], 201);
    }

    public function destroy(EmailContact $emailContact)
    {
        $emailContact->delete();

        return response()->json(null, 204);
    }

    /**
     * @param  array<int, string>  $raw
     * @return array<int, string>
     */
    protected function normalizeEmails(array $raw): array
    {
        $emails = [];

        foreach ($raw as $email) {
            $email = strtolower(trim((string) $email));

            if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }

            $emails[$email] = $email;
        }

        return array_values($emails);
    }
}
