<?php

use App\Models\Subscriber;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('subscribes to newsletter', function () {
    $response = $this->postJson('/api/subscribe', [
        'email' => 'subscriber@example.com',
        'name' => 'Test Subscriber',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('subscribers', ['email' => 'subscriber@example.com']);
});

it('validates email on subscribe', function () {
    $response = $this->postJson('/api/subscribe', [
        'email' => 'not-an-email',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('lists subscribers when authenticated', function () {
    Subscriber::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/subscribers');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('deletes a subscriber when authenticated', function () {
    $subscriber = Subscriber::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/subscribers/{$subscriber->id}");

    $response->assertNoContent();
});
