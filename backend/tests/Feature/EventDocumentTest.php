<?php

use App\Models\Event;
use App\Models\EventDocument;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->event = Event::factory()->create();
});

it('lists event documents for an event', function () {
    EventDocument::factory()->count(3)->create(['event_id' => $this->event->id]);

    $response = $this->getJson("/api/events/{$this->event->slug}/documents");

    $response->assertOk()
        ->assertJsonCount(3);
});

it('lists all event documents when authenticated', function () {
    EventDocument::factory()->count(5)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/event-documents');

    $response->assertOk()
        ->assertJsonCount(5);
});

it('filters event documents by event_id', function () {
    EventDocument::factory()->count(2)->create(['event_id' => $this->event->id]);
    EventDocument::factory()->create();

    $response = $this->actingAs($this->user)
        ->getJson("/api/event-documents?event_id={$this->event->id}");

    $response->assertOk()
        ->assertJsonCount(2);
});

it('creates an event document when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/event-documents', [
            'event_id' => $this->event->id,
            'title' => 'Conference Slides',
            'type' => 'file',
            'path' => '/documents/slides.pdf',
            'original_filename' => 'slides.pdf',
            'mime_type' => 'application/pdf',
            'size' => 1024000,
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Conference Slides');

    $this->assertDatabaseHas('event_documents', ['title' => 'Conference Slides']);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/event-documents', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['event_id', 'title', 'type', 'path']);
});

it('validates type is file or link', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/event-documents', [
            'event_id' => $this->event->id,
            'title' => 'Test',
            'type' => 'invalid',
            'path' => '/test',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['type']);
});

it('shows an event document by ID', function () {
    $document = EventDocument::factory()->create(['event_id' => $this->event->id]);

    $response = $this->actingAs($this->user)
        ->getJson("/api/event-documents/{$document->id}");

    $response->assertOk()
        ->assertJsonPath('title', $document->title);
});

it('returns 404 for non-existent event document', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/event-documents/999');

    $response->assertNotFound();
});

it('updates an event document when authenticated', function () {
    $document = EventDocument::factory()->create(['event_id' => $this->event->id]);

    $response = $this->actingAs($this->user)
        ->putJson("/api/event-documents/{$document->id}", [
            'title' => 'Updated Title',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Title');
});

it('deletes an event document when authenticated', function () {
    $document = EventDocument::factory()->create(['event_id' => $this->event->id]);

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/event-documents/{$document->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('event_documents', ['id' => $document->id]);
});

it('requires authentication for store', function () {
    $response = $this->postJson('/api/event-documents', [
        'event_id' => $this->event->id,
        'title' => 'Test',
        'type' => 'file',
        'path' => '/test',
    ]);

    $response->assertUnauthorized();
});

it('requires authentication for update', function () {
    $document = EventDocument::factory()->create(['event_id' => $this->event->id]);

    $response = $this->putJson("/api/event-documents/{$document->id}", [
        'title' => 'Updated',
    ]);

    $response->assertUnauthorized();
});

it('requires authentication for delete', function () {
    $document = EventDocument::factory()->create(['event_id' => $this->event->id]);

    $response = $this->deleteJson("/api/event-documents/{$document->id}");

    $response->assertUnauthorized();
});
