<?php

use App\Mail\NewsletterMail;
use App\Mail\TemplatedMail;
use App\Models\Campaign;
use App\Models\EmailContact;
use App\Models\EmailLog;
use App\Models\Insight;
use App\Models\Newsletter;
use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->user = User::factory()->create();
    Mail::fake();
});

function draftCampaign(User $user): Campaign
{
    $newsletter = Newsletter::factory()->create(['user_id' => $user->id]);

    return Campaign::factory()->create([
        'user_id' => $user->id,
        'newsletter_id' => $newsletter->id,
        'status' => Campaign::STATUS_DRAFT,
    ]);
}

it('refuses bulk sends when bulk mail is disabled', function () {
    config(['bulk_mail.enabled' => false]);
    Subscriber::factory()->create();
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertStatus(503);

    $insight = Insight::factory()->create(['is_published' => true]);
    $this->actingAs($this->user)
        ->postJson('/api/content-broadcasts', [
            'content_type' => 'insight',
            'content_id' => $insight->id,
            'to_subscribers' => true,
        ])
        ->assertStatus(503);

    Mail::assertNothingSent();
    expect($campaign->fresh()->status)->toBe(Campaign::STATUS_DRAFT);
});

it('sends campaigns in batches and resumes the rest', function () {
    config(['bulk_mail.per_send_limit' => 2]);
    Subscriber::factory()->count(5)->create();
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertOk()
        ->assertJsonPath('sent', 2)
        ->assertJsonPath('remaining', 3)
        ->assertJsonPath('status', Campaign::STATUS_PARTIAL);

    Mail::assertSent(NewsletterMail::class, 2);
    expect($campaign->fresh()->total_recipients)->toBe(5);

    $this->actingAs($this->user)->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertOk()->assertJsonPath('remaining', 1);
    $this->actingAs($this->user)->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertOk()
        ->assertJsonPath('remaining', 0)
        ->assertJsonPath('status', Campaign::STATUS_SENT);

    // Every recipient emailed exactly once.
    Mail::assertSent(NewsletterMail::class, 5);
    expect($campaign->fresh()->sent_count)->toBe(5);

    $this->actingAs($this->user)->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertUnprocessable();
});

it('enforces the hourly limit across sends', function () {
    config(['bulk_mail.hourly_limit' => 3]);
    EmailLog::create([
        'template_key' => 'newsletter',
        'recipient' => 'earlier@example.com',
        'status' => 'sent',
        'sent_at' => now()->subMinutes(10),
    ]);
    Subscriber::factory()->count(4)->create();
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertOk()
        ->assertJsonPath('sent', 2)
        ->assertJsonPath('remaining', 2);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertStatus(429);

    Mail::assertSent(NewsletterMail::class, 2);
});

it('refuses a draft campaign outright when the quota is used up', function () {
    config(['bulk_mail.daily_limit' => 1]);
    EmailLog::create([
        'template_key' => 'content_update_notification',
        'recipient' => 'earlier@example.com',
        'status' => 'sent',
        'sent_at' => now()->subHours(5),
    ]);
    Subscriber::factory()->create();
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertStatus(429);

    expect($campaign->fresh()->status)->toBe(Campaign::STATUS_DRAFT);
    expect($campaign->emailLogs()->count())->toBe(0);
});

it('requires consent before a campaign includes saved contacts', function () {
    EmailContact::factory()->create();
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertUnprocessable();

    Mail::assertNothingSent();

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send", ['consent_confirmed' => true])
        ->assertOk()
        ->assertJsonPath('sent', 1);
});

it('does not email a subscriber who opted out as a contact', function () {
    Subscriber::factory()->create(['email' => 'both@example.com']);
    EmailContact::factory()->create(['email' => 'both@example.com', 'unsubscribed_at' => now()]);
    Subscriber::factory()->create(['email' => 'keep@example.com']);
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertOk()
        ->assertJsonPath('sent', 1);

    Mail::assertSent(NewsletterMail::class, fn ($mail) => $mail->recipientEmail === 'keep@example.com');
    Mail::assertNotSent(NewsletterMail::class, fn ($mail) => $mail->recipientEmail === 'both@example.com');
});

it('skips queued recipients who opt out between batches', function () {
    config(['bulk_mail.per_send_limit' => 1]);
    Subscriber::factory()->create(['email' => 'first@example.com']);
    $second = Subscriber::factory()->create(['email' => 'second@example.com']);
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)->postJson("/api/campaigns/{$campaign->id}/send")->assertOk();
    $second->markOptedOut();
    $this->actingAs($this->user)->postJson("/api/campaigns/{$campaign->id}/send")->assertOk();

    Mail::assertSent(NewsletterMail::class, 1);
    $this->assertDatabaseHas('email_logs', ['recipient' => 'second@example.com', 'status' => 'skipped']);
    expect($campaign->fresh()->status)->toBe(Campaign::STATUS_SENT);
});

it('requires consent for pasted broadcast recipients', function () {
    $insight = Insight::factory()->create(['is_published' => true]);

    $this->actingAs($this->user)
        ->postJson('/api/content-broadcasts', [
            'content_type' => 'insight',
            'content_id' => $insight->id,
            'recipients' => ['someone@example.com'],
        ])
        ->assertUnprocessable();

    Mail::assertNothingSent();
});

it('never broadcasts to an address that opted out, even when pasted again', function () {
    EmailContact::factory()->create(['email' => 'gone@example.com', 'unsubscribed_at' => now()]);
    $insight = Insight::factory()->create(['is_published' => true]);

    $this->actingAs($this->user)
        ->postJson('/api/content-broadcasts', [
            'content_type' => 'insight',
            'content_id' => $insight->id,
            'recipients' => ['gone@example.com', 'new@example.com'],
            'consent_confirmed' => true,
        ])
        ->assertOk()
        ->assertJsonPath('sent', 1);

    Mail::assertSent(TemplatedMail::class, fn ($mail) => $mail->hasTo('new@example.com'));
    Mail::assertNotSent(TemplatedMail::class, fn ($mail) => $mail->hasTo('gone@example.com'));
});

it('adds an unsubscribe link and one-click header to broadcasts', function () {
    $insight = Insight::factory()->create(['is_published' => true]);

    $this->actingAs($this->user)
        ->postJson('/api/content-broadcasts', [
            'content_type' => 'insight',
            'content_id' => $insight->id,
            'recipients' => ['reader@example.com'],
            'consent_confirmed' => true,
        ])
        ->assertOk();

    $contact = EmailContact::where('email', 'reader@example.com')->firstOrFail();

    Mail::assertSent(TemplatedMail::class, function (TemplatedMail $mail) use ($contact) {
        $headers = $mail->headers()->text;

        return $headers['List-Unsubscribe'] === '<'.$contact->oneClickUnsubscribeUrl().'>'
            && $headers['List-Unsubscribe-Post'] === 'List-Unsubscribe=One-Click'
            && str_contains($mail->render(), $contact->unsubscribe_token);
    });
});

it('refuses a broadcast larger than the current allowance', function () {
    config(['bulk_mail.per_send_limit' => 2]);
    Subscriber::factory()->count(3)->create();
    $insight = Insight::factory()->create(['is_published' => true]);

    $this->actingAs($this->user)
        ->postJson('/api/content-broadcasts', [
            'content_type' => 'insight',
            'content_id' => $insight->id,
            'to_subscribers' => true,
        ])
        ->assertStatus(429);

    Mail::assertNothingSent();
});

it('sends bulk mail through the configured bulk mailer', function () {
    config([
        'bulk_mail.mailer' => 'bulk_provider',
        'mail.mailers.bulk_provider' => ['transport' => 'array'],
    ]);
    Subscriber::factory()->create();
    $campaign = draftCampaign($this->user);

    $this->actingAs($this->user)
        ->postJson("/api/campaigns/{$campaign->id}/send")
        ->assertOk();

    Mail::assertSent(NewsletterMail::class, fn ($mail) => $mail->mailer === 'bulk_provider');
});

it('lets mail clients unsubscribe with a one-click POST', function () {
    $subscriber = Subscriber::factory()->create();

    $path = parse_url($subscriber->oneClickUnsubscribeUrl());
    $this->post($path['path'].'?'.$path['query'], ['List-Unsubscribe' => 'One-Click'])
        ->assertOk();

    expect($subscriber->fresh()->isOptedOut())->toBeTrue();
});
