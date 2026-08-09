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

it('requires authentication for updates', function () {
    $setting = SiteSetting::factory()->create();

    $this->putJson("/api/settings/{$setting->id}", ['value' => 'Test'])
        ->assertUnauthorized();

    $this->putJson('/api/settings/batch', ['settings' => [['key' => 'test', 'value' => 'test']]])
        ->assertUnauthorized();
});
