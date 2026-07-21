<?php

use App\Models\User;
use App\Models\Resource;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists published resources', function () {
    Resource::factory()->count(3)->create(['is_published' => true]);
    Resource::factory()->draft()->create();

    $response = $this->getJson('/api/resources');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows a resource by slug', function () {
    $resource = Resource::factory()->create();

    $response = $this->getJson("/api/resources/{$resource->slug}");

    $response->assertOk()
        ->assertJsonPath('title', $resource->title);
});

it('creates a resource when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/resources', [
            'title' => 'Test Resource',
            'type' => 'pdf',
            'description' => 'A test resource',
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Test Resource');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/resources', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'type']);
});

it('updates a resource when authenticated', function () {
    $resource = Resource::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/resources/{$resource->id}", [
            'title' => 'Updated Resource',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Resource');
});

it('deletes a resource when authenticated', function () {
    $resource = Resource::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/resources/{$resource->id}");

    $response->assertOk();
});

it('requires authentication for write operations', function () {
    $resource = Resource::factory()->create();

    $this->postJson('/api/resources', ['title' => 'Test', 'type' => 'pdf'])
        ->assertUnauthorized();

    $this->putJson("/api/resources/{$resource->id}", ['title' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/resources/{$resource->id}")
        ->assertUnauthorized();
});
