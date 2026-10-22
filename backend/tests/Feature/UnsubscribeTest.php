<?php

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
