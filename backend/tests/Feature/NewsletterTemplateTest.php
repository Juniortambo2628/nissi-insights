<?php

use App\Models\NewsletterTemplate;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('requires authentication to list templates', function () {
    $this->getJson('/api/newsletter-templates')->assertUnauthorized();
});

it('requires authentication to create a template', function () {
    $this->postJson('/api/newsletter-templates', [])->assertUnauthorized();
});

it('lists only the authenticated user templates', function () {
    NewsletterTemplate::create([
        'user_id' => $this->user->id,
        'name' => 'My Brand',
        'background_color' => '#ffffff',
        'text_color' => '#0f172a',
        'accent_color' => '#2563eb',
    ]);
    NewsletterTemplate::create([
        'user_id' => User::factory()->create()->id,
        'name' => 'Someone Else',
        'background_color' => '#000000',
        'text_color' => '#ffffff',
        'accent_color' => '#ff0000',
    ]);

    $response = $this->actingAs($this->user)
        ->getJson('/api/newsletter-templates');

    $response->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.name', 'My Brand');
});

it('creates a template when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletter-templates', [
            'name' => 'Sand',
            'background_color' => '#fffbeb',
            'text_color' => '#451a03',
            'accent_color' => '#d97706',
        ]);

    $response->assertCreated()
        ->assertJsonPath('name', 'Sand')
        ->assertJsonPath('accent_color', '#d97706')
        ->assertJsonPath('user_id', $this->user->id);

    $this->assertDatabaseHas('newsletter_templates', [
        'user_id' => $this->user->id,
        'name' => 'Sand',
    ]);
});

it('validates required fields and hex colors on template create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletter-templates', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'background_color', 'text_color', 'accent_color']);

    $this->actingAs($this->user)
        ->postJson('/api/newsletter-templates', [
            'name' => 'Bad',
            'background_color' => 'white',
            'text_color' => '#0f172a',
            'accent_color' => '#2563eb',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['background_color']);
});

it('deletes own template', function () {
    $template = NewsletterTemplate::create([
        'user_id' => $this->user->id,
        'name' => 'Temporary',
        'background_color' => '#ffffff',
        'text_color' => '#0f172a',
        'accent_color' => '#2563eb',
    ]);

    $this->actingAs($this->user)
        ->deleteJson("/api/newsletter-templates/{$template->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('newsletter_templates', ['id' => $template->id]);
});

it('forbids deleting another user template', function () {
    $template = NewsletterTemplate::create([
        'user_id' => User::factory()->create()->id,
        'name' => 'Not Mine',
        'background_color' => '#ffffff',
        'text_color' => '#0f172a',
        'accent_color' => '#2563eb',
    ]);

    $this->actingAs($this->user)
        ->deleteJson("/api/newsletter-templates/{$template->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('newsletter_templates', ['id' => $template->id]);
});
