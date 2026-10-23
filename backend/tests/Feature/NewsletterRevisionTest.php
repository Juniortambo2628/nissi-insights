<?php

use App\Models\Newsletter;
use App\Models\NewsletterRevision;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->basePayload = [
        'title' => 'Monthly Market Brief',
        'subject' => 'Your March briefing',
        'content' => '<p>Insight body</p>',
        'background_color' => '#ffffff',
        'text_color' => '#0f172a',
        'accent_color' => '#2563eb',
    ];
});

it('requires authentication to list revisions', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);

    $this->getJson("/api/newsletters/{$newsletter->id}/revisions")->assertUnauthorized();
});

it('requires authentication to restore a revision', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $revision = $newsletter->revisions()->create([
        'user_id' => $this->user->id,
        'source' => 'manual',
        'payload' => ['title' => 'Old'],
    ]);

    $this->postJson("/api/newsletters/{$newsletter->id}/revisions/{$revision->id}/restore")
        ->assertUnauthorized();
});

it('records an initial manual revision when a newsletter is created', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $revisions = NewsletterRevision::where('newsletter_id', $newsletter['id'])->get();

    expect($revisions)->toHaveCount(1)
        ->and($revisions->first()->source)->toBe('manual')
        ->and($revisions->first()->payload['title'])->toBe('Monthly Market Brief');
});

it('honours an explicit autosave snapshot source on create', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', array_merge($this->basePayload, [
            'title' => 'Autosaved Draft',
            'snapshot' => 'autosave',
        ]))
        ->assertCreated()
        ->json();

    $latest = NewsletterRevision::where('newsletter_id', $newsletter['id'])->latest('id')->first();

    expect($latest->source)->toBe('autosave');
});

it('records a manual snapshot on update', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter['id']}", [
            'title' => 'Updated Title',
            'subject' => 'Updated Subject',
            'content' => '<p>Updated</p>',
            'snapshot' => 'manual',
        ])
        ->assertOk();

    expect(NewsletterRevision::where('newsletter_id', $newsletter['id'])->count())->toBe(2);
});

it('defaults to a manual snapshot when the snapshot field is omitted', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter['id']}", [
            'title' => 'No Snapshot Field',
            'subject' => 'Updated Subject',
        ])
        ->assertOk();

    $latest = NewsletterRevision::where('newsletter_id', $newsletter['id'])->latest('id')->first();

    expect($latest->source)->toBe('manual')
        ->and($latest->payload['title'])->toBe('No Snapshot Field');
});

it('throttles autosave snapshots inside five minutes and records after the window', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $this->travel(4)->minutes();

    $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter['id']}", [
            'title' => 'Autosave Throttled',
            'subject' => 'Updated Subject',
            'snapshot' => 'autosave',
        ])
        ->assertOk();

    expect(NewsletterRevision::where('newsletter_id', $newsletter['id'])->count())->toBe(1);

    $this->travel(2)->minutes();

    $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter['id']}", [
            'title' => 'Autosave Recorded',
            'subject' => 'Updated Subject',
            'snapshot' => 'autosave',
        ])
        ->assertOk();

    expect(NewsletterRevision::where('newsletter_id', $newsletter['id'])->count())->toBe(2);
});

it('skips a snapshot when the payload is unchanged from the latest revision', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter['id']}", array_merge($this->basePayload, [
            'snapshot' => 'manual',
        ]))
        ->assertOk();

    expect(NewsletterRevision::where('newsletter_id', $newsletter['id'])->count())->toBe(1);
});

it('prunes revision history beyond twenty entries', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    foreach (range(1, 24) as $index) {
        $this->actingAs($this->user)
            ->putJson("/api/newsletters/{$newsletter['id']}", array_merge($this->basePayload, [
                'title' => "Title {$index}",
                'snapshot' => 'manual',
            ]))
            ->assertOk();
    }

    expect(NewsletterRevision::where('newsletter_id', $newsletter['id'])->count())->toBe(20);
});

it('lists revision summaries newest first with a plain text excerpt', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter['id']}", array_merge($this->basePayload, [
            'title' => 'Updated Title',
            'content' => '<p>Updated body with <strong>tags</strong></p>',
            'snapshot' => 'manual',
        ]))
        ->assertOk();

    $response = $this->actingAs($this->user)
        ->getJson("/api/newsletters/{$newsletter['id']}/revisions");

    $response->assertOk()
        ->assertJsonCount(2)
        ->assertJsonPath('0.title', 'Updated Title')
        ->assertJsonPath('0.source', 'manual')
        ->assertJsonPath('0.excerpt', 'Updated body with tags')
        ->assertJsonPath('0.user.name', $this->user->name)
        ->assertJsonPath('1.title', 'Monthly Market Brief');

    expect($response->json('0.id'))->toBeGreaterThan($response->json('1.id'));
});

it('restores a previous revision without losing the pre-restore state', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $this->travel(1)->minutes();

    $this->actingAs($this->user)
        ->putJson("/api/newsletters/{$newsletter['id']}", array_merge($this->basePayload, [
            'title' => 'Newer Title',
            'content' => '<p>Newer body</p>',
            'snapshot' => 'autosave',
        ]))
        ->assertOk();

    $revision = NewsletterRevision::where('newsletter_id', $newsletter['id'])->latest('id')->first();

    $this->actingAs($this->user)
        ->postJson("/api/newsletters/{$newsletter['id']}/revisions/{$revision->id}/restore")
        ->assertOk()
        ->assertJsonPath('title', 'Monthly Market Brief');

    $newsletterRow = Newsletter::find($newsletter['id']);

    expect($newsletterRow->title)->toBe('Monthly Market Brief')
        ->and($newsletterRow->content)->toBe('<p>Insight body</p>');

    $latest = NewsletterRevision::where('newsletter_id', $newsletter['id'])->latest('id')->first();

    expect($latest->source)->toBe('restore')
        ->and($latest->payload['title'])->toBe('Newer Title');
});

it('returns not found when restoring a revision from another newsletter', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $other = $this->actingAs($this->user)
        ->postJson('/api/newsletters', array_merge($this->basePayload, [
            'title' => 'Other Newsletter',
        ]))
        ->assertCreated()
        ->json();

    $revision = NewsletterRevision::where('newsletter_id', $newsletter['id'])->first();

    $this->actingAs($this->user)
        ->postJson("/api/newsletters/{$other['id']}/revisions/{$revision->id}/restore")
        ->assertNotFound();
});

it('deletes a newsletter revisions when the newsletter is deleted', function () {
    $newsletter = $this->actingAs($this->user)
        ->postJson('/api/newsletters', $this->basePayload)
        ->assertCreated()
        ->json();

    $this->actingAs($this->user)
        ->deleteJson("/api/newsletters/{$newsletter['id']}")
        ->assertNoContent();

    $this->assertDatabaseMissing('newsletter_revisions', ['newsletter_id' => $newsletter['id']]);
});
