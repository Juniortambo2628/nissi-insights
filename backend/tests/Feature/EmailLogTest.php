<?php

use App\Models\EmailLog;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists email logs when authenticated', function () {
    EmailLog::factory()->count(5)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-logs');

    $response->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveCount(5);
});

it('filters email logs by template key', function () {
    EmailLog::factory()->create(['template_key' => 'welcome']);
    EmailLog::factory()->create(['template_key' => 'reset-password']);

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-logs?template_key=welcome');

    $response->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveCount(1);
});

it('filters email logs by status', function () {
    EmailLog::factory()->sent()->count(2)->create();
    EmailLog::factory()->failed()->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-logs?status=sent');

    $response->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveCount(2);
});

it('filters email logs by recipient', function () {
    EmailLog::factory()->create(['recipient' => 'john@example.com']);
    EmailLog::factory()->create(['recipient' => 'jane@example.com']);

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-logs?recipient=john');

    $response->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveCount(1);
});

it('returns email log summary when authenticated', function () {
    EmailLog::factory()->sent()->count(3)->create();
    EmailLog::factory()->failed()->count(2)->create();
    EmailLog::factory()->queued()->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-logs/summary');

    $response->assertOk()
        ->assertJsonStructure(['total', 'sent', 'failed', 'queued'])
        ->assertJson([
            'total' => 6,
            'sent' => 3,
            'failed' => 2,
            'queued' => 1,
        ]);
});

it('filters summary by template key', function () {
    EmailLog::factory()->sent()->create(['template_key' => 'welcome']);
    EmailLog::factory()->sent()->create(['template_key' => 'reset-password']);

    $response = $this->actingAs($this->user)
        ->getJson('/api/email-logs/summary?template_key=welcome');

    $response->assertOk()
        ->assertJson(['total' => 1, 'sent' => 1]);
});

it('requires authentication for listing', function () {
    $response = $this->getJson('/api/email-logs');

    $response->assertUnauthorized();
});

it('requires authentication for summary', function () {
    $response = $this->getJson('/api/email-logs/summary');

    $response->assertUnauthorized();
});
