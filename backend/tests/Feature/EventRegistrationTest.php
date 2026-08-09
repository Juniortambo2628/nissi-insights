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
