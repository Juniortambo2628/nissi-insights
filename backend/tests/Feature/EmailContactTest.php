<?php

use App\Models\EmailContact;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('requires authentication to list contacts', function () {
    $this->getJson('/api/email-contacts')->assertUnauthorized();
});

it('requires authentication to create contacts', function () {
    $this->postJson('/api/email-contacts', ['email' => 'a@example.com'])
        ->assertUnauthorized();
});

it('requires authentication to delete a contact', function () {
    $contact = EmailContact::factory()->create();

    $this->deleteJson("/api/email-contacts/{$contact->id}")->assertUnauthorized();
});

it('imports a list of emails when authenticated', function () {
    $response = $this->actingAs($this->user)->postJson('/api/email-contacts', [
        'emails' => [
            'pauline@example.com',
            'chrispine@example.com',
            '  pauline@EXAMPLE.com ',
            'not-an-email',
        ],
        'source' => 'import',
    ]);

    $response->assertCreated()
        ->assertJsonPath('created', 2)
        ->assertJsonPath('existing', 0);

    $this->assertDatabaseHas('email_contacts', ['email' => 'pauline@example.com', 'source' => 'import']);
    $this->assertDatabaseHas('email_contacts', ['email' => 'chrispine@example.com']);
});

it('accepts a single email', function () {
    $response = $this->actingAs($this->user)->postJson('/api/email-contacts', [
        'email' => 'solo@example.com',
    ]);

    $response->assertCreated()->assertJsonPath('created', 1);
    $this->assertDatabaseHas('email_contacts', ['email' => 'solo@example.com']);
});

it('reports existing contacts instead of duplicating them', function () {
    EmailContact::factory()->create(['email' => 'kept@example.com']);

    $response = $this->actingAs($this->user)->postJson('/api/email-contacts', [
        'emails' => ['kept@example.com', 'new@example.com'],
    ]);

    $response->assertCreated()
        ->assertJsonPath('created', 1)
        ->assertJsonPath('existing', 1);

    $this->assertDatabaseCount('email_contacts', 2);
});

it('rejects a payload with no emails', function () {
    $response = $this->actingAs($this->user)->postJson('/api/email-contacts', [
        'emails' => ['not-an-email'],
    ]);

    $response->assertStatus(422);
});

it('lists contacts when authenticated', function () {
    EmailContact::factory()->count(3)->create();

    $response = $this->actingAs($this->user)->getJson('/api/email-contacts');

    $response->assertOk()->assertJsonCount(3);
});

it('searches contacts by email', function () {
    EmailContact::factory()->create(['email' => 'findme@example.com']);
    EmailContact::factory()->create(['email' => 'other@example.com']);

    $response = $this->actingAs($this->user)->getJson('/api/email-contacts?q=findme');

    $response->assertOk()->assertJsonCount(1);
    $response->assertJsonPath('0.email', 'findme@example.com');
});

it('deletes a contact when authenticated', function () {
    $contact = EmailContact::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/email-contacts/{$contact->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('email_contacts', ['id' => $contact->id]);
});
