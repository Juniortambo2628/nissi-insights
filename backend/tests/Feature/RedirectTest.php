<?php

use App\Models\User;
use App\Models\Redirect;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists redirects', function () {
    Redirect::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/redirects');

    $response->assertOk();
});

it('lists public active redirects', function () {
    Redirect::factory()->count(2)->create(['is_active' => true]);
    Redirect::factory()->inactive()->create();

    $response = $this->getJson('/api/redirects-public');

    $response->assertOk()
        ->assertJsonCount(2);
});

it('creates a redirect when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/redirects', [
            'from_path' => '/old-page',
            'to' => '/new-page',
            'status_code' => 301,
        ]);

    $response->assertCreated()
        ->assertJsonPath('from_path', '/old-page');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/redirects', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['from_path', 'to']);
});

it('updates a redirect when authenticated', function () {
    $redirect = Redirect::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/redirects/{$redirect->id}", [
            'to' => '/updated-destination',
        ]);

    $response->assertOk()
        ->assertJsonPath('to', '/updated-destination');
});

it('deletes a redirect when authenticated', function () {
    $redirect = Redirect::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/redirects/{$redirect->id}");

    $response->assertOk();
});

it('requires authentication for write operations', function () {
    $redirect = Redirect::factory()->create();

    $this->postJson('/api/redirects', ['from_path' => '/test', 'to' => '/test'])
        ->assertUnauthorized();

    $this->putJson("/api/redirects/{$redirect->id}", ['to' => '/test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/redirects/{$redirect->id}")
        ->assertUnauthorized();
});
