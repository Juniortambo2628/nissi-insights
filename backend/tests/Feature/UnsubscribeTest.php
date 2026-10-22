<?php

use App\Models\EmailContact;
use App\Models\Subscriber;

it('opts a subscriber out with a valid token', function () {
    $subscriber = Subscriber::factory()->create();

    $response = $this->postJson('/api/unsubscribe', [
        'token' => $subscriber->unsubscribe_token,
    ]);

    $response->assertOk()
        ->assertJsonPath('email', $subscriber->email);

    $this->assertNotNull($subscriber->fresh()->unsubscribed_at);
});

it('opts a contact out with a valid token', function () {
    $contact = EmailContact::factory()->create();

    $response = $this->postJson('/api/unsubscribe', [
        'token' => $contact->unsubscribe_token,
    ]);

    $response->assertOk()
        ->assertJsonPath('email', $contact->email);

    $this->assertNotNull($contact->fresh()->unsubscribed_at);
});

it('opts out all records with the same email across both tables', function () {
    $email = 'cross-table@example.com';
    $subscriber = Subscriber::factory()->create(['email' => $email]);
    $contact = EmailContact::factory()->create(['email' => $email]);

    $this->postJson('/api/unsubscribe', [
        'token' => $subscriber->unsubscribe_token,
    ])->assertOk();

    $this->assertNotNull($subscriber->fresh()->unsubscribed_at);
    $this->assertNotNull($contact->fresh()->unsubscribed_at);
});

it('is idempotent when already opted out', function () {
    $subscriber = Subscriber::factory()->optedOut()->create();

    $this->postJson('/api/unsubscribe', [
        'token' => $subscriber->unsubscribe_token,
    ])->assertOk();

    $this->postJson('/api/unsubscribe', [
        'token' => $subscriber->unsubscribe_token,
    ])->assertOk();
});

it('returns 404 for an invalid token', function () {
    Subscriber::factory()->create();

    $response = $this->postJson('/api/unsubscribe', [
        'token' => 'not-a-real-token',
    ]);

    $response->assertNotFound();
});

it('validates the token is required', function () {
    $this->postJson('/api/unsubscribe', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['token']);
});

it('assigns an unsubscribe token on subscribe', function () {
    $this->postJson('/api/subscribe', [
        'email' => 'token-check@example.com',
    ])->assertCreated();

    $subscriber = Subscriber::where('email', 'token-check@example.com')->first();
    expect($subscriber->unsubscribe_token)->not->toBeNull();
});

it('assigns an unsubscribe token when creating a contact', function () {
    $contact = EmailContact::factory()->create();

    expect($contact->unsubscribe_token)->not->toBeNull();
});
