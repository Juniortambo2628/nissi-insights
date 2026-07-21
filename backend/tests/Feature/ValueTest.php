<?php

use App\Models\User;
use App\Models\Value;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists values', function () {
    Value::factory()->count(3)->create();

    $response = $this->getJson('/api/values');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('creates a value when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/values', [
            'icon' => 'star',
            'title' => 'Excellence',
            'description' => 'We strive for excellence',
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Excellence');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/values', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'description']);
});

it('updates a value when authenticated', function () {
    $value = Value::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/values/{$value->id}", [
            'title' => 'Updated Value',
            'description' => 'Updated description',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Value');
});

it('deletes a value when authenticated', function () {
    $value = Value::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/values/{$value->id}");

    $response->assertNoContent();
});

it('requires authentication for write operations', function () {
    $value = Value::factory()->create();

    $this->postJson('/api/values', ['title' => 'Test', 'description' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/values/{$value->id}", ['title' => 'Test', 'description' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/values/{$value->id}")
        ->assertUnauthorized();
});
