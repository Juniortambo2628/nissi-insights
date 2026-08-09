<?php

use App\Models\EventRegistration;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists event registrations when authenticated', function () {
    EventRegistration::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/event-registrations');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows a single event registration when authenticated', function () {
    $registration = EventRegistration::factory()->create();

    $response = $this->actingAs($this->user)
        ->getJson("/api/event-registrations/{$registration->id}");

    $response->assertOk()
        ->assertJsonPath('email', $registration->email);
});

it('returns 404 for non-existent event registration', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/event-registrations/999');

    $response->assertNotFound();
});

it('updates an event registration when authenticated', function () {
    $registration = EventRegistration::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/event-registrations/{$registration->id}", [
            'attended' => true,
        ]);

    $response->assertOk()
        ->assertJsonPath('attended', true);
});

it('deletes an event registration when authenticated', function () {
    $registration = EventRegistration::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/event-registrations/{$registration->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('event_registrations', ['id' => $registration->id]);
});

it('registers for an event publicly', function () {
    $event = \App\Models\Event::factory()->create();

    $response = $this->postJson('/api/events/register', [
        'event_id' => $event->id,
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('event_registrations', ['email' => 'john@example.com']);
});

it('validates required fields for event registration', function () {
    $response = $this->postJson('/api/events/register', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['event_id', 'name', 'email']);
});

it('requires authentication for listing', function () {
    $response = $this->getJson('/api/event-registrations');

    $response->assertUnauthorized();
});

it('requires authentication for show', function () {
    $registration = EventRegistration::factory()->create();

    $response = $this->getJson("/api/event-registrations/{$registration->id}");

    $response->assertUnauthorized();
});

it('requires authentication for update', function () {
    $registration = EventRegistration::factory()->create();

    $response = $this->putJson("/api/event-registrations/{$registration->id}", [
        'attended' => true,
    ]);

    $response->assertUnauthorized();
});

it('requires authentication for delete', function () {
    $registration = EventRegistration::factory()->create();

    $response = $this->deleteJson("/api/event-registrations/{$registration->id}");

    $response->assertUnauthorized();
});
