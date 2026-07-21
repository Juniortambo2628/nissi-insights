<?php

use App\Models\User;
use App\Models\Service;
use App\Models\Pillar;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->pillar = Pillar::factory()->create();
});

it('lists active services', function () {
    Service::factory()->count(3)->forPillar($this->pillar)->create();
    Service::factory()->inactive()->create();

    $response = $this->getJson('/api/services');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows a service by slug', function () {
    $service = Service::factory()->create(['pillar_id' => $this->pillar->id]);

    $response = $this->getJson("/api/services/{$service->slug}");

    $response->assertOk()
        ->assertJsonPath('title', $service->title);
});

it('returns 404 for non-existent service', function () {
    $response = $this->getJson('/api/services/non-existent-slug');

    $response->assertNotFound();
});

it('creates a service when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/services', [
            'title' => 'Test Service',
            'category' => 'Consulting',
            'description' => 'A test service description',
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Test Service');

    $this->assertDatabaseHas('services', ['title' => 'Test Service']);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/services', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'category', 'description']);
});

it('updates a service when authenticated', function () {
    $service = Service::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/services/{$service->id}", [
            'title' => 'Updated Service',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Service');
});

it('deletes a service when authenticated', function () {
    $service = Service::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/services/{$service->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('services', ['id' => $service->id]);
});

it('requires authentication for store', function () {
    $response = $this->postJson('/api/services', [
        'title' => 'Test',
        'category' => 'Test',
        'description' => 'Test',
    ]);

    $response->assertUnauthorized();
});

it('requires authentication for update', function () {
    $service = Service::factory()->create();

    $response = $this->putJson("/api/services/{$service->id}", [
        'title' => 'Updated',
    ]);

    $response->assertUnauthorized();
});

it('requires authentication for delete', function () {
    $service = Service::factory()->create();

    $response = $this->deleteJson("/api/services/{$service->id}");

    $response->assertUnauthorized();
});
