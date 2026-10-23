<?php

use App\Models\SavedBlock;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('requires authentication to list saved blocks', function () {
    $this->getJson('/api/saved-blocks')->assertUnauthorized();
});

it('requires authentication to create a saved block', function () {
    $this->postJson('/api/saved-blocks', [])->assertUnauthorized();
});

it('lists only the authenticated user saved blocks', function () {
    SavedBlock::create([
        'user_id' => $this->user->id,
        'name' => 'My Box',
        'block_type' => 'niBox',
        'content' => ['type' => 'niBox', 'attrs' => ['label' => 'Bulletin']],
    ]);
    SavedBlock::create([
        'user_id' => User::factory()->create()->id,
        'name' => 'Someone Else',
        'block_type' => 'niBox',
        'content' => ['type' => 'niBox', 'attrs' => ['label' => 'Other']],
    ]);

    $response = $this->actingAs($this->user)
        ->getJson('/api/saved-blocks');

    $response->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.name', 'My Box');
});

it('creates a saved block when authenticated', function () {
    $node = [
        'type' => 'niGrid',
        'attrs' => ['columns' => 2],
        'content' => [
            ['type' => 'niGridColumn', 'attrs' => ['columns' => 2, 'width' => 60, 'align' => 'center']],
        ],
    ];

    $response = $this->actingAs($this->user)
        ->postJson('/api/saved-blocks', [
            'name' => 'Two-up promo',
            'block_type' => 'niGrid',
            'content' => $node,
        ]);

    $response->assertCreated()
        ->assertJsonPath('name', 'Two-up promo')
        ->assertJsonPath('block_type', 'niGrid')
        ->assertJsonPath('content.type', 'niGrid')
        ->assertJsonPath('content.content.0.attrs.width', 60)
        ->assertJsonPath('user_id', $this->user->id);

    $this->assertDatabaseHas('saved_blocks', [
        'user_id' => $this->user->id,
        'name' => 'Two-up promo',
    ]);
});

it('validates required fields and block type on save', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/saved-blocks', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'block_type', 'content']);

    $this->actingAs($this->user)
        ->postJson('/api/saved-blocks', [
            'name' => 'Bad',
            'block_type' => 'script',
            'content' => ['type' => 'niBox'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['block_type']);
});

it('deletes own saved block', function () {
    $block = SavedBlock::create([
        'user_id' => $this->user->id,
        'name' => 'Temporary',
        'block_type' => 'niStats',
        'content' => ['type' => 'niStats'],
    ]);

    $this->actingAs($this->user)
        ->deleteJson("/api/saved-blocks/{$block->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('saved_blocks', ['id' => $block->id]);
});

it('forbids deleting another user saved block', function () {
    $block = SavedBlock::create([
        'user_id' => User::factory()->create()->id,
        'name' => 'Not Mine',
        'block_type' => 'niCta',
        'content' => ['type' => 'niCta'],
    ]);

    $this->actingAs($this->user)
        ->deleteJson("/api/saved-blocks/{$block->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('saved_blocks', ['id' => $block->id]);
});
