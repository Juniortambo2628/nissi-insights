<?php

use App\Models\ConsultationRequest;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('submits a consultation request', function () {
    $response = $this->postJson('/api/consultation-requests', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'message' => 'I would like to discuss...',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('consultation_requests', ['email' => 'john@example.com']);
});

it('validates consultation request fields', function () {
    $response = $this->postJson('/api/consultation-requests', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'message']);
});

it('lists consultation requests when authenticated', function () {
    ConsultationRequest::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/consultation-requests');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('updates a consultation request when authenticated', function () {
    $request = ConsultationRequest::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/consultation-requests/{$request->id}", [
            'status' => 'contacted',
        ]);

    $response->assertOk()
        ->assertJsonPath('status', 'contacted');
});

it('deletes a consultation request when authenticated', function () {
    $request = ConsultationRequest::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/consultation-requests/{$request->id}");

    $response->assertNoContent();
});
