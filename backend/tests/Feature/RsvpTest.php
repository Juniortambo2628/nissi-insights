<?php

use App\Models\User;
use App\Models\Rsvp;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('submits an RSVP', function () {
    $response = $this->postJson('/api/rsvps', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'company' => 'Acme Corp',
        'attendance' => 'in-person',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('rsvps', ['email' => 'john@example.com']);
});

it('validates RSVP fields', function () {
    $response = $this->postJson('/api/rsvps', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email']);
});

it('lists RSVPs when authenticated', function () {
    Rsvp::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/rsvps');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('deletes an RSVP when authenticated', function () {
    $rsvp = Rsvp::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/rsvps/{$rsvp->id}");

    $response->assertNoContent();
});
