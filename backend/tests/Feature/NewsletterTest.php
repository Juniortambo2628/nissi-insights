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

it('resolves editor color tokens to the newsletter colors in rendered content', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'background_color' => '#fffbeb',
        'text_color' => '#451a03',
        'accent_color' => '#d97706',
        'content' => '<div style="color:var(--ni-accent,#2563eb); border-color:var(--ni-accent); background:var(--ni-bg,#ffffff);">'
            .'<p style="color:var(--ni-text,#0f172a)">Body</p></div>',
    ]);

    $rendered = $newsletter->renderedContent();

    expect($rendered)->not->toContain('var(--ni-accent');
    expect($rendered)->not->toContain('var(--ni-text');
    expect($rendered)->not->toContain('var(--ni-bg');
    expect($rendered)->toContain('#d97706');
    expect($rendered)->toContain('#451a03');
    expect($rendered)->toContain('#fffbeb');
});

it('preserves encoded quotes in saved block attributes', function () {
    $content = '<div data-ni-stats="" data-items="{&quot;value&quot;:&quot;14&quot;,&quot;label&quot;:&quot;Developments&quot;}"></div>';

    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletters', [
            'title' => 'Stats Block',
            'subject' => 'Stats subject',
            'content' => $content,
        ]);

    $response->assertCreated();

    $stored = Newsletter::find($response->json('id'));

    expect($stored->content)->toContain('data-items="{&quot;value&quot;');
    expect($stored->content)->not->toContain('data-items="{"');
});

it('renders the branded footer in newsletter emails', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'title' => 'Footer Check',
        'content' => '<p>Body</p>',
    ]);

    $response = $this->actingAs($this->user)
        ->postJson('/api/newsletters/preview', [
            'newsletter_id' => $newsletter->id,
        ]);

    $response->assertOk();
    $html = $response->json('html');

    expect($html)->toContain('NISSI');
    expect($html)->toContain('INSIGHTS');
    expect($html)->toContain('Energy &middot; Fintech &middot; International Diplomacy');
    expect($html)->toContain('Navigating Complexity. Empowering Change.');
    expect($html)->toContain('Nissi Insights Ltd &middot; 254742668529 G.P.O. Nairobi, Kenya');
    expect($html)->toContain('+254 717 128 838 &middot; +44 7838 725536');
    expect($html)->toContain('www.nissi-insights.com');
    expect($html)->toContain("isn't legal advice");
    expect($html)->toContain("You're getting this because you signed up for updates from Nissi Insights.");
    expect($html)->toContain('Unsubscribe');
});
