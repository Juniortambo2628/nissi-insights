<?php

use App\Mail\TemplatedMail;
use App\Models\EmailContact;
use App\Models\Insight;
use App\Models\Resource;
use App\Models\Subscriber;
use App\Models\User;
use Database\Seeders\EmailTemplateSeeder;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->user = User::factory()->create();
    Mail::fake();
});

it('requires authentication', function () {
    $insight = Insight::factory()->create();

    $this->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => $insight->id,
        'recipients' => ['someone@example.com'],
    ])->assertUnauthorized();
});

it('validates required fields', function () {
    $response = $this->actingAs($this->user)->postJson('/api/content-broadcasts', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['content_type', 'content_id']);
});

it('returns 404 when the content does not exist', function () {
    $response = $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => 999,
        'recipients' => ['someone@example.com'],
    ]);

    $response->assertNotFound();
});

it('rejects unpublished content', function () {
    $insight = Insight::factory()->draft()->create();

    $response = $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => $insight->id,
        'recipients' => ['someone@example.com'],
    ]);

    $response->assertStatus(422);
    Mail::assertNothingSent();
});

it('rejects a send with no valid recipients', function () {
    $insight = Insight::factory()->create();

    $response = $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => $insight->id,
        'recipients' => ['not-an-email'],
    ]);

    $response->assertStatus(422);
    Mail::assertNothingSent();
});

it('emails a published insight to a pasted list of contacts', function () {
    $this->seed(EmailTemplateSeeder::class);

    $insight = Insight::factory()->create([
        'title' => 'Kenya Power Market Brief',
        'category' => 'Energy',
        'excerpt' => '<p>A deep dive into the power sector.</p>',
    ]);

    $response = $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => $insight->id,
        'recipients' => [
            'pauline@example.com',
            'CHRISPINE@example.com',
            'pauline@example.com',
            'invalid',
        ],
    ]);

    $response->assertOk()
        ->assertJsonPath('sent', 2)
        ->assertJsonPath('failed', 0)
        ->assertJsonPath('total', 2);

    Mail::assertSent(TemplatedMail::class, 2);
    Mail::assertSent(TemplatedMail::class, function (TemplatedMail $mail) use ($insight) {
        return $mail->templateKey === 'content_update_notification'
            && $mail->data['title'] === 'Kenya Power Market Brief'
            && $mail->data['typeLabel'] === 'Insight'
            && $mail->data['excerpt'] === 'A deep dive into the power sector.'
            && str_ends_with($mail->data['url'], "/insights/{$insight->slug}");
    });

    $this->assertDatabaseHas('email_logs', [
        'template_key' => 'content_update_notification',
        'recipient' => 'pauline@example.com',
        'status' => 'sent',
        'sendable_type' => Insight::class,
        'sendable_id' => $insight->id,
    ]);
});

it('emails a published knowledge base report', function () {
    $resource = Resource::factory()->create([
        'title' => 'East Africa Energy Outlook 2026',
        'type' => 'Report',
    ]);

    $response = $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'resource',
        'content_id' => $resource->id,
        'recipients' => ['reader@example.com'],
    ]);

    $response->assertOk()->assertJsonPath('sent', 1);

    Mail::assertSent(TemplatedMail::class, function (TemplatedMail $mail) use ($resource) {
        return $mail->data['typeLabel'] === 'Report'
            && $mail->data['title'] === 'East Africa Energy Outlook 2026'
            && str_ends_with($mail->data['url'], "/knowledge-base/{$resource->slug}");
    });
});

it('merges saved contacts and subscribers and dedupes recipients', function () {
    EmailContact::factory()->create(['email' => 'contact@example.com']);
    EmailContact::factory()->create(['email' => 'dupe@example.com']);
    Subscriber::factory()->create(['email' => 'dupe@example.com', 'is_active' => true]);
    Subscriber::factory()->create(['email' => 'inactive@example.com', 'is_active' => false]);

    $insight = Insight::factory()->create();

    $response = $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => $insight->id,
        'recipients' => ['dupe@example.com', 'extra@example.com'],
        'contact_ids' => EmailContact::pluck('id')->all(),
        'to_subscribers' => true,
    ]);

    $response->assertOk()->assertJsonPath('total', 3);

    Mail::assertSent(TemplatedMail::class, 3);
});

it('saves recipients as contacts for future sends by default', function () {
    $insight = Insight::factory()->create();

    $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => $insight->id,
        'recipients' => ['future@example.com'],
    ])->assertOk();

    $this->assertDatabaseHas('email_contacts', [
        'email' => 'future@example.com',
        'source' => 'broadcast',
    ]);
});

it('does not save contacts when save_contacts is false', function () {
    $insight = Insight::factory()->create();

    $this->actingAs($this->user)->postJson('/api/content-broadcasts', [
        'content_type' => 'insight',
        'content_id' => $insight->id,
        'recipients' => ['private@example.com'],
        'save_contacts' => false,
    ])->assertOk();

    $this->assertDatabaseMissing('email_contacts', ['email' => 'private@example.com']);
});
