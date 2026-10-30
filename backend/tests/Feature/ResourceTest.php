<?php

use App\Models\Resource;
use App\Models\User;

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

it('persists description, document, thumbnail and tags', function () {
    $payload = [
        'title' => 'Kenya-Ethiopia Power Report',
        'type' => 'report',
        'description' => str_repeat('Ethiopia now supplies a tenth of Kenya’s electricity. ', 20),
        'file_path' => 'https://api.example.com/storage/uploads/report.pdf',
        'thumbnail' => 'https://api.example.com/storage/uploads/cover.jpg',
        'tags' => ['Energy', 'Kenya'],
        'is_published' => true,
    ];

    $id = $this->actingAs($this->user)
        ->postJson('/api/resources', $payload)
        ->assertCreated()
        ->json('id');

    $resource = Resource::findOrFail($id);
    expect($resource->description)->toBe($payload['description'])
        ->and($resource->file_path)->toBe($payload['file_path'])
        ->and($resource->thumbnail)->toBe($payload['thumbnail'])
        ->and($resource->tags)->toBe($payload['tags']);

    $this->actingAs($this->user)
        ->putJson("/api/resources/{$id}", ['description' => 'Updated', 'file_path' => 'https://api.example.com/storage/uploads/v2.pdf'])
        ->assertOk();

    expect($resource->fresh()->description)->toBe('Updated')
        ->and($resource->fresh()->file_path)->toBe('https://api.example.com/storage/uploads/v2.pdf');
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
