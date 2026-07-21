<?php

use App\Models\User;
use App\Models\Event;
use App\Models\EventRegistration;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists published events', function () {
    Event::factory()->count(3)->create();
    Event::factory()->draft()->create();

    $response = $this->getJson('/api/events');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows an event by slug', function () {
    $event = Event::factory()->create();

    $response = $this->getJson("/api/events/{$event->slug}");

    $response->assertOk()
        ->assertJsonPath('title', $event->title);
});

it('creates an event when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/events', [
            'title' => 'Test Event',
            'description' => 'Event description',
            'date' => now()->addWeek()->toDateTimeString(),
            'location' => 'New York',
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Test Event');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/events', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'date']);
});

it('registers for an event', function () {
    $event = Event::factory()->create();

    $response = $this->postJson('/api/events/register', [
        'event_id' => $event->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('event_registrations', [
        'event_id' => $event->id,
        'email' => 'jane@example.com',
    ]);
});

it('lists event registrations when authenticated', function () {
    EventRegistration::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/event-registrations');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('requires authentication for event write operations', function () {
    $event = Event::factory()->create();

    $this->postJson('/api/events', ['title' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/events/{$event->id}", ['title' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/events/{$event->id}")
        ->assertUnauthorized();
});
