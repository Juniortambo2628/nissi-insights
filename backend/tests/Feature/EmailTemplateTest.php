<?php

use App\Models\EmailTemplate;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists email templates when authenticated', function () {
    EmailTemplate::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-templates');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('filters email templates by key', function () {
    EmailTemplate::factory()->create(['key' => 'welcome']);
    EmailTemplate::factory()->create(['key' => 'reset-password']);

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-templates?key=welcome');

    $response->assertOk()
        ->assertJsonCount(1);
});

it('filters active email templates only', function () {
    EmailTemplate::factory()->count(2)->create(['is_active' => true]);
    EmailTemplate::factory()->inactive()->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-templates?active_only=1');

    $response->assertOk()
        ->assertJsonCount(2);
});

it('creates an email template when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/email-templates', [
            'key' => 'test-template',
            'name' => 'Test Template',
            'subject' => 'Hello {{ name }}',
            'body' => '<p>Welcome {{ name }}</p>',
            'variables' => ['name'],
            'is_active' => true,
        ]);

    $response->assertCreated()
        ->assertJsonPath('key', 'test-template');

    $this->assertDatabaseHas('email_templates', ['key' => 'test-template']);
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/email-templates', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['key', 'name', 'subject', 'body']);
});

it('validates unique key on create', function () {
    EmailTemplate::factory()->create(['key' => 'existing-key']);

    $response = $this->actingAs($this->user)
        ->postJson('/api/email-templates', [
            'key' => 'existing-key',
            'name' => 'Test',
            'subject' => 'Test',
            'body' => 'Test',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['key']);
});

it('shows an email template by ID', function () {
    $template = EmailTemplate::factory()->create();

    $response = $this->actingAs($this->user)
        ->getJson("/api/email-templates/{$template->id}");

    $response->assertOk()
        ->assertJsonPath('key', $template->key);
});

it('returns 404 for non-existent email template', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/email-templates/999');

    $response->assertNotFound();
});

it('updates an email template when authenticated', function () {
    $template = EmailTemplate::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/email-templates/{$template->id}", [
            'name' => 'Updated Name',
            'subject' => 'Updated Subject',
            'body' => '<p>Updated body</p>',
        ]);

    $response->assertOk()
        ->assertJsonPath('name', 'Updated Name');
});

it('deletes an email template when authenticated', function () {
    $template = EmailTemplate::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/email-templates/{$template->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('email_templates', ['id' => $template->id]);
});

it('returns email health status when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/email-templates/health');

    $response->assertOk()
        ->assertJsonStructure([
            'mailer',
            'from_address',
            'admin_address',
            'is_log_driver',
            'deliverability_guidance',
        ]);
});

it('previews an email template with direct content', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/email-templates/preview', [
            'content' => '<p>Hello World</p>',
            'subject' => 'Test Subject',
        ]);

    $response->assertOk()
        ->assertJsonStructure(['html', 'subject']);
});

it('returns 422 when no preview source provided', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/email-templates/preview', []);

    $response->assertStatus(422);
});

it('returns validation error for non-existent template in preview', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/email-templates/preview', [
            'template_id' => 999,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['template_id']);
});

it('requires authentication for listing', function () {
    $response = $this->getJson('/api/email-templates');

    $response->assertUnauthorized();
});

it('requires authentication for store', function () {
    $response = $this->postJson('/api/email-templates', [
        'key' => 'test',
        'name' => 'Test',
        'subject' => 'Test',
        'body' => 'Test',
    ]);

    $response->assertUnauthorized();
});
