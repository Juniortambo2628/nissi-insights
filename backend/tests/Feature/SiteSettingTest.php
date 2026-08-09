<?php

use App\Models\SiteSetting;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists site settings grouped by group', function () {
    SiteSetting::factory()->count(3)->create(['group' => 'general']);
    SiteSetting::factory()->count(2)->create(['group' => 'seo']);

    $response = $this->getJson('/api/settings');

    $response->assertOk();
    $response->assertJsonStructure(['general', 'seo']);
});

it('returns launch settings', function () {
    SiteSetting::factory()->create(['key' => 'is_launched', 'value' => 'true', 'group' => 'general']);
    SiteSetting::factory()->create(['key' => 'launch_date', 'value' => '2026-01-01', 'group' => 'general']);

    $response = $this->getJson('/api/settings/launch');

    $response->assertOk();
});

it('shows a single setting when authenticated', function () {
    $setting = SiteSetting::factory()->create();

    $response = $this->actingAs($this->user)
        ->getJson("/api/settings/{$setting->id}");

    $response->assertOk()
        ->assertJsonPath('key', $setting->key);
});

it('returns 404 for non-existent setting', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/settings/999');

    $response->assertNotFound();
});

it('creates a setting when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/settings', [
            'key' => 'new_setting',
            'value' => 'new value',
            'group' => 'general',
        ]);

    $response->assertCreated();
    $this->assertDatabaseHas('site_settings', ['key' => 'new_setting']);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/settings', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['key']);
});

it('batch updates settings when authenticated', function () {
    SiteSetting::factory()->create(['key' => 'site_name', 'value' => 'Old Name']);
    SiteSetting::factory()->create(['key' => 'site_tagline', 'value' => 'Old Tagline']);

    $response = $this->actingAs($this->user)
        ->putJson('/api/settings/batch', [
            'settings' => [
                ['key' => 'site_name', 'value' => 'New Name'],
                ['key' => 'site_tagline', 'value' => 'New Tagline'],
            ],
        ]);

    $response->assertOk();

    $this->assertDatabaseHas('site_settings', ['key' => 'site_name', 'value' => 'New Name']);
    $this->assertDatabaseHas('site_settings', ['key' => 'site_tagline', 'value' => 'New Tagline']);
});

it('updates a single setting when authenticated', function () {
    $setting = SiteSetting::factory()->create(['key' => 'site_name']);

    $response = $this->actingAs($this->user)
        ->putJson("/api/settings/{$setting->id}", [
            'value' => 'Updated Name',
        ]);

    $response->assertOk();
});

it('deletes a setting when authenticated', function () {
    $setting = SiteSetting::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/settings/{$setting->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('site_settings', ['id' => $setting->id]);
});

it('requires authentication for store', function () {
    $response = $this->postJson('/api/settings', [
        'key' => 'test',
        'value' => 'test',
        'group' => 'general',
    ]);

    $response->assertUnauthorized();
});

it('requires authentication for updates', function () {
    $setting = SiteSetting::factory()->create();

    $this->putJson("/api/settings/{$setting->id}", ['value' => 'Test'])
        ->assertUnauthorized();

    $this->putJson('/api/settings/batch', ['settings' => [['key' => 'test', 'value' => 'test']]])
        ->assertUnauthorized();
});

it('requires authentication for delete', function () {
    $setting = SiteSetting::factory()->create();

    $response = $this->deleteJson("/api/settings/{$setting->id}");

    $response->assertUnauthorized();
});
