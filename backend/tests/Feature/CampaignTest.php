<?php

use App\Mail\NewsletterMail;
use App\Models\Campaign;
use App\Models\EmailContact;
use App\Models\EmailLog;
use App\Models\Newsletter;
use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->user = User::factory()->create();
    Mail::fake();
});

it('requires authentication to list campaigns', function () {
    $this->getJson('/api/campaigns')->assertUnauthorized();
});

it('requires authentication to create a campaign', function () {
    $this->postJson('/api/campaigns', [])->assertUnauthorized();
});

it('lists campaigns when authenticated', function () {
    Campaign::factory()->count(2)->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->getJson('/api/campaigns');

    $response->assertOk()
        ->assertJsonCount(2);
});

it('creates a campaign when authenticated', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->postJson('/api/campaigns', [
            'name' => 'March Blast',
            'newsletter_id' => $newsletter->id,
        ]);

    $response->assertCreated()
        ->assertJsonPath('name', 'March Blast')
        ->assertJsonPath('status', 'draft');

    $this->assertDatabaseHas('campaigns', ['name' => 'March Blast']);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/campaigns', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'newsletter_id']);
});

it('sends a campaign to all opted-in recipients from both lists', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    Subscriber::factory()->count(2)->create();
    EmailContact::factory()->count(2)->create();

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send");

    $response->assertOk()
        ->assertJsonPath('sent', 4)
        ->assertJsonPath('failed', 0)
        ->assertJsonPath('total', 4);

    Mail::assertSent(NewsletterMail::class, 4);

    $this->assertDatabaseHas('campaigns', [
        'id' => $campaign->id,
        'status' => Campaign::STATUS_SENT,
        'sent_count' => 4,
        'total_recipients' => 4,
    ]);
});

it('sends a campaign to selected subscribers only', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $selected = Subscriber::factory()->count(2)->create();
    Subscriber::factory()->create();

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", [
            'subscriber_ids' => $selected->pluck('id')->all(),
        ]);

    $response->assertOk()
        ->assertJsonPath('sent', 2);

    Mail::assertSent(NewsletterMail::class, 2);
});

it('sends a campaign to selected contacts only', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $selected = EmailContact::factory()->count(2)->create();
    EmailContact::factory()->create();

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", [
            'contact_ids' => $selected->pluck('id')->all(),
        ]);

    $response->assertOk()
        ->assertJsonPath('sent', 2);

    Mail::assertSent(NewsletterMail::class, 2);
});

it('sends to both selected subscribers and contacts', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $subs = Subscriber::factory()->count(2)->create();
    $contacts = EmailContact::factory()->count(2)->create();

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", [
            'subscriber_ids' => $subs->pluck('id')->all(),
            'contact_ids' => $contacts->pluck('id')->all(),
        ]);

    $response->assertOk()
        ->assertJsonPath('sent', 4);

    Mail::assertSent(NewsletterMail::class, 4);
});

it('never sends to opted-out subscribers', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $active = Subscriber::factory()->create();
    $optedOut = Subscriber::factory()->optedOut()->create();

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", [
            'subscriber_ids' => [$active->id, $optedOut->id],
        ]);

    $response->assertOk()
        ->assertJsonPath('sent', 1)
        ->assertJsonPath('total', 1);

    Mail::assertSent(NewsletterMail::class, 1);
    Mail::assertNotSent(NewsletterMail::class, function ($mail) use ($optedOut) {
        return $mail->recipientEmail === $optedOut->email;
    });
});

it('never sends to opted-out contacts', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $active = EmailContact::factory()->create();
    $optedOut = EmailContact::factory()->optedOut()->create();

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", [
            'contact_ids' => [$active->id, $optedOut->id],
        ]);

    $response->assertOk()
        ->assertJsonPath('sent', 1)
        ->assertJsonPath('total', 1);

    Mail::assertSent(NewsletterMail::class, 1);
    Mail::assertNotSent(NewsletterMail::class, function ($mail) use ($optedOut) {
        return $mail->recipientEmail === $optedOut->email;
    });
});

it('never sends to deactivated subscribers', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    Subscriber::factory()->create(['is_active' => false]);

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send");

    $response->assertUnprocessable();
    Mail::assertNothingSent();
});

it('fails validation when there are no eligible recipients', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send");

    $response->assertUnprocessable();
});

it('cannot send the same campaign twice', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->sent()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    Subscriber::factory()->create();

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send");

    $response->assertUnprocessable();
    Mail::assertNothingSent();
});

it('uses the campaign subject override in the mailable', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'subject' => 'Newsletter subject',
    ]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
        'subject' => 'Campaign override subject',
    ]);
    $subscriber = Subscriber::factory()->create();

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send");

    Mail::assertSent(NewsletterMail::class, function ($mail) use ($subscriber, $campaign) {
        return $mail->recipientEmail === $subscriber->email
            && $mail->campaign->is($campaign)
            && $mail->envelope()->subject === 'Campaign override subject';
    });
});

it('includes an unsubscribe link in the newsletter mail headers', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $subscriber = Subscriber::factory()->create();

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send");

    Mail::assertSent(NewsletterMail::class, function ($mail) use ($subscriber) {
        $headers = $mail->headers()->text;

        return str_contains($headers['List-Unsubscribe'] ?? '', $subscriber->unsubscribe_token);
    });
});

it('includes an unsubscribe link for contacts', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $contact = EmailContact::factory()->create();

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", [
            'contact_ids' => [$contact->id],
        ]);

    Mail::assertSent(NewsletterMail::class, function ($mail) use ($contact) {
        $headers = $mail->headers()->text;

        return str_contains($headers['List-Unsubscribe'] ?? '', $contact->unsubscribe_token);
    });
});

it('dedupes recipients that appear in both lists', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    $email = 'shared@example.com';
    $sub = Subscriber::factory()->create(['email' => $email]);
    $contact = EmailContact::factory()->create(['email' => $email]);

    $response = $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", [
            'subscriber_ids' => [$sub->id],
            'contact_ids' => [$contact->id],
        ]);

    $response->assertOk()
        ->assertJsonPath('sent', 1)
        ->assertJsonPath('total', 1);

    Mail::assertSent(NewsletterMail::class, 1);
});

it('blocks editing a campaign after it has been sent', function () {
    $campaign = Campaign::factory()->sent()->create(['user_id' => $this->user->id]);

    $response = $this->actingAs($this->user)
        ->putJson("/api/campaigns/{$campaign->id}", ['name' => 'New name']);

    $response->assertUnprocessable();
});

it('deletes a campaign and its email logs', function () {
    $newsletter = Newsletter::factory()->create(['user_id' => $this->user->id]);
    $campaign = Campaign::factory()->create([
        'user_id' => $this->user->id,
        'newsletter_id' => $newsletter->id,
    ]);
    EmailLog::create([
        'sendable_type' => Campaign::class,
        'sendable_id' => $campaign->id,
        'template_key' => 'newsletter',
        'recipient' => 'someone@example.com',
        'status' => 'sent',
        'sent_at' => now(),
    ]);

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/campaigns/{$campaign->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('campaigns', ['id' => $campaign->id]);
    $this->assertDatabaseMissing('email_logs', ['sendable_id' => $campaign->id]);
});
