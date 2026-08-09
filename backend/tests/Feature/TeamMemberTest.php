<?php

use App\Models\TeamMember;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists team members', function () {
    TeamMember::factory()->count(3)->create();

    $response = $this->getJson('/api/team-members');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('creates a team member when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/team-members', [
            'name' => 'Jane Smith',
            'role' => 'Senior Consultant',
            'bio' => 'Experienced professional',
        ]);

    $response->assertCreated()
        ->assertJsonPath('name', 'Jane Smith');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/team-members', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'role']);
});

it('updates a team member when authenticated', function () {
    $member = TeamMember::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/team-members/{$member->id}", [
            'name' => $member->name,
            'role' => 'Updated Role',
        ]);

    $response->assertOk()
        ->assertJsonPath('role', 'Updated Role');
});

it('deletes a team member when authenticated', function () {
    $member = TeamMember::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/team-members/{$member->id}");

    $response->assertNoContent();
});

it('requires authentication for write operations', function () {
    $member = TeamMember::factory()->create();

    $this->postJson('/api/team-members', ['name' => 'Test', 'role' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/team-members/{$member->id}", ['name' => 'Test', 'role' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/team-members/{$member->id}")
        ->assertUnauthorized();
});
