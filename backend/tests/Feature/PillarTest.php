<?php

use App\Models\Pillar;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists all pillars', function () {
    Pillar::factory()->count(3)->create();

    $response = $this->getJson('/api/pillars');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows a pillar by slug', function () {
    $pillar = Pillar::factory()->create();

    $response = $this->getJson("/api/pillars/{$pillar->slug}");

    $response->assertOk()
        ->assertJsonPath('title', $pillar->title);
});

it('creates a pillar when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/pillars', [
            'title' => 'Test Pillar',
            'overview' => 'An overview',
            'content' => 'Detailed content',
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Test Pillar');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/pillars', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title']);
});

it('updates a pillar when authenticated', function () {
    $pillar = Pillar::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/pillars/{$pillar->id}", [
            'title' => 'Updated Pillar',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Pillar');
});

it('deletes a pillar when authenticated', function () {
    $pillar = Pillar::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/pillars/{$pillar->id}");

    $response->assertNoContent();
});

it('requires authentication for write operations', function () {
    $pillar = Pillar::factory()->create();

    $this->postJson('/api/pillars', ['title' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/pillars/{$pillar->id}", ['title' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/pillars/{$pillar->id}")
        ->assertUnauthorized();
});
