<?php

use App\Models\Newsletter;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('requires authentication to list newsletters', function () {
    $this->getJson('/api/newsletters')->assertUnauthorized();
});

it('requires authentication to create a newsletter', function () {
    $this->postJson('/api/newsletters', [])->assertUnauthorized();
});

it('lists newsletters when authenticated', function () {
    Newsletter::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->getJson('/api/newsletters');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('creates a newsletter when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletters', [
            'title' => 'Monthly Market Brief',
            'subject' => 'Your March briefing',
            'preheader' => 'Key takeaways from March',
            'content' => '<p>Insight body</p>',
            'background_color' => '#ffffff',
            'text_color' => '#0f172a',
            'accent_color' => '#2563eb',
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Monthly Market Brief')
        ->assertJsonPath('status', 'draft')
        ->assertJsonPath('user_id', $this->user->id);

    $this->assertDatabaseHas('newsletters', [
        'title' => 'Monthly Market Brief',
        'status' => 'draft',
    ]);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletters', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'subject']);
});

it('validates hex colors on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletters', [
            'title' => 'Test',
            'subject' => 'Test',
            'background_color' => 'not-a-color',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['background_color']);
});

it('updates a newsletter when authenticated', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter->id}", [
            'title' => 'Updated Title',
            'subject' => 'Updated Subject',
            'content' => '<p>Updated</p>',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Title');

    $this->assertDatabaseHas('newsletters', [
        'id' => $newsletter->id,
        'title' => 'Updated Title',
    ]);
});

it('deletes a newsletter when authenticated', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/newsletters/{$newsletter->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('newsletters', ['id' => $newsletter->id]);
});

it('previews a stored newsletter as html', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'title' => 'Preview Title',
        'content' => '<p>Preview body content</p>',
        'background_color' => '#112233',
    ]);

    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletters/preview', [
            'newsletter_id' => $newsletter->id,
        ]);

    $response->assertOk()
        ->assertJsonStructure(['html']);

    $html = $response->json('html');
    expect($html)->toContain('Preview Title');
    expect($html)->toContain('Preview body content');
    expect($html)->toContain('#112233');
    expect($html)->toContain('Unsubscribe');
});

it('previews inline newsletter content', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletters/preview', [
            'title' => 'Inline Preview',
            'content' => '<p>Inline body</p>',
            'text_color' => '#abcdef',
        ]);

    $response->assertOk();
    $html = $response->json('html');
    expect($html)->toContain('Inline Preview');
    expect($html)->toContain('Inline body');
});

it('rewrites relative upload paths to absolute urls in rendered content', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'content' => '<p><img src="uploads/hero-image.jpg" alt="Hero"></p>',
    ]);

    $rendered = $newsletter->renderedContent();

    expect($rendered)->toContain(config('app.url').'/api/storage/hero-image.jpg');
});
