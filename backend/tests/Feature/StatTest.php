<?php

use App\Models\User;
use App\Models\Stat;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists stats ordered by order field', function () {
    Stat::factory()->create(['order' => 3]);
    Stat::factory()->create(['order' => 1]);
    Stat::factory()->create(['order' => 2]);

    $response = $this->getJson('/api/stats');

    $response->assertOk()
        ->assertJsonCount(3)
        ->assertJsonPath('0.order', 1)
        ->assertJsonPath('1.order', 2)
        ->assertJsonPath('2.order', 3);
});

it('creates a stat when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/stats', [
            'label' => 'Projects Completed',
            'value' => '150+',
            'icon' => 'briefcase',
            'order' => 1,
        ]);

    $response->assertCreated()
        ->assertJsonPath('label', 'Projects Completed');

    $this->assertDatabaseHas('stats', ['label' => 'Projects Completed']);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/stats', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['label', 'value']);
});

it('updates a stat when authenticated', function () {
    $stat = Stat::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/stats/{$stat->id}", [
            'label' => 'Updated Label',
        ]);

    $response->assertOk()
        ->assertJsonPath('label', 'Updated Label');
});

it('deletes a stat when authenticated', function () {
    $stat = Stat::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/stats/{$stat->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('stats', ['id' => $stat->id]);
});

it('requires authentication for write operations', function () {
    $stat = Stat::factory()->create();

    $this->postJson('/api/stats', ['label' => 'Test', 'value' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/stats/{$stat->id}", ['label' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/stats/{$stat->id}")
        ->assertUnauthorized();
});
