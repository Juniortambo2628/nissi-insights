<?php

use App\Models\Rsvp;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('submits an RSVP', function () {
    $response = $this->postJson('/api/rsvps', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'company' => 'Acme Corp',
        'attendance' => 'accept',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('rsvps', ['email' => 'john@example.com']);
});

it('validates RSVP fields', function () {
    $response = $this->postJson('/api/rsvps', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email']);
});

it('validates unique email for RSVP', function () {
    Rsvp::factory()->create(['email' => 'john@example.com']);

    $response = $this->postJson('/api/rsvps', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('validates attendance values', function () {
    $response = $this->postJson('/api/rsvps', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'attendance' => 'invalid-value',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['attendance']);
});

it('lists RSVPs when authenticated', function () {
    Rsvp::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/rsvps');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows a single RSVP when authenticated', function () {
    $rsvp = Rsvp::factory()->create();

    $response = $this->actingAs($this->user)
        ->getJson("/api/rsvps/{$rsvp->id}");

    $response->assertOk()
        ->assertJsonPath('email', $rsvp->email);
});

it('returns 404 for non-existent RSVP', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/rsvps/999');

    $response->assertNotFound();
});

it('updates an RSVP when authenticated', function () {
    $rsvp = Rsvp::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/rsvps/{$rsvp->id}", [
            'name' => 'Updated Name',
            'attendance' => 'decline',
        ]);

    $response->assertOk()
        ->assertJsonPath('name', 'Updated Name');
});

it('deletes an RSVP when authenticated', function () {
    $rsvp = Rsvp::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/rsvps/{$rsvp->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('rsvps', ['id' => $rsvp->id]);
});

it('requires authentication for listing', function () {
    $response = $this->getJson('/api/rsvps');

    $response->assertUnauthorized();
});

it('requires authentication for show', function () {
    $rsvp = Rsvp::factory()->create();

    $response = $this->getJson("/api/rsvps/{$rsvp->id}");

    $response->assertUnauthorized();
});

it('requires authentication for update', function () {
    $rsvp = Rsvp::factory()->create();

    $response = $this->putJson("/api/rsvps/{$rsvp->id}", ['name' => 'Test']);

    $response->assertUnauthorized();
});

it('requires authentication for delete', function () {
    $rsvp = Rsvp::factory()->create();

    $response = $this->deleteJson("/api/rsvps/{$rsvp->id}");

    $response->assertUnauthorized();
});
