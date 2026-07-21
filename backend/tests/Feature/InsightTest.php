<?php

use App\Models\User;
use App\Models\Insight;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists published insights', function () {
    Insight::factory()->count(3)->create();
    Insight::factory()->draft()->create();

    $response = $this->getJson('/api/insights');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows an insight by slug', function () {
    $insight = Insight::factory()->create();

    $response = $this->getJson("/api/insights/{$insight->slug}");

    $response->assertOk()
        ->assertJsonPath('title', $insight->title);
});

it('returns 404 for non-existent insight', function () {
    $response = $this->getJson('/api/insights/non-existent-slug');

    $response->assertNotFound();
});

it('creates an insight when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/insights', [
            'title' => 'Test Insight',
            'content' => 'Full content of the insight',
            'is_published' => true,
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Test Insight');

    $this->assertDatabaseHas('insights', ['title' => 'Test Insight']);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/insights', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'content']);
});

it('updates an insight when authenticated', function () {
    $insight = Insight::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->putJson("/api/insights/{$insight->id}", [
            'title' => 'Updated Insight',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Insight');
});

it('deletes an insight when authenticated', function () {
    $insight = Insight::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/insights/{$insight->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('insights', ['id' => $insight->id]);
});

it('requires authentication for all write operations', function () {
    $insight = Insight::factory()->create();

    $this->postJson('/api/insights', ['title' => 'Test', 'content' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/insights/{$insight->id}", ['title' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/insights/{$insight->id}")
        ->assertUnauthorized();
});
