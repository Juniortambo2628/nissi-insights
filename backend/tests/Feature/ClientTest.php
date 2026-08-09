<?php

use App\Models\Client;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists active clients', function () {
    Client::factory()->count(3)->create();
    Client::factory()->inactive()->create();

    $response = $this->getJson('/api/clients');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('creates a client when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/clients', [
            'name' => 'Acme Corp',
            'website' => 'https://acme.com',
        ]);

    $response->assertCreated()
        ->assertJsonPath('name', 'Acme Corp');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/clients', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('updates a client when authenticated', function () {
    $client = Client::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => 'Updated Client',
        ]);

    $response->assertOk()
        ->assertJsonPath('name', 'Updated Client');
});

it('deletes a client when authenticated', function () {
    $client = Client::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/clients/{$client->id}");

    $response->assertNoContent();
});

it('requires authentication for write operations', function () {
    $client = Client::factory()->create();

    $this->postJson('/api/clients', ['name' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/clients/{$client->id}", ['name' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/clients/{$client->id}")
        ->assertUnauthorized();
});
