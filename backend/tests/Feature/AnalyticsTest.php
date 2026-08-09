<?php

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\NotFoundLog;
use App\Models\PageView;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('tracks a page view', function () {
    $response = $this->postJson('/api/track', [
        'path' => '/services/consulting',
    ]);

    $response->assertCreated()
        ->assertJson(['ok' => true]);

    $this->assertDatabaseHas('page_views', [
        'path' => '/services/consulting',
    ]);
});

it('validates required path for page view tracking', function () {
    $response = $this->postJson('/api/track', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['path']);
});

it('tracks a 404 not found', function () {
    $response = $this->postJson('/api/track-404', [
        'path' => '/non-existent-page',
        'source' => 'direct',
    ]);

    $response->assertCreated()
        ->assertJson(['ok' => true]);

    $this->assertDatabaseHas('not_found_logs', [
        'path' => '/non-existent-page',
        'source' => 'direct',
    ]);
});

it('validates required path for 404 tracking', function () {
    $response = $this->postJson('/api/track-404', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['path']);
});

it('returns analytics summary when authenticated', function () {
    PageView::factory()->count(5)->create();
    NotFoundLog::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/analytics/summary');

    $response->assertOk()
        ->assertJsonStructure([
            'total_views',
            'today_views',
            'week_views',
            'month_views',
            'unique_visitors',
            'top_pages',
            'views_over_time',
            'top_referrers',
        ]);
});

it('requires authentication for analytics summary', function () {
    $response = $this->getJson('/api/analytics/summary');

    $response->assertUnauthorized();
});

it('returns event analytics when authenticated', function () {
    Event::factory()->count(3)->create();
    EventRegistration::factory()->count(5)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/analytics/events');

    $response->assertOk()
        ->assertJsonStructure([
            'total_events',
            'total_registrations',
            'total_attendance',
            'attendance_rate',
            'registrations_by_event',
            'registrations_over_time',
            'upcoming_events',
        ]);
});

it('requires authentication for event analytics', function () {
    $response = $this->getJson('/api/analytics/events');

    $response->assertUnauthorized();
});

it('returns not found logs when authenticated', function () {
    NotFoundLog::factory()->count(3)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/analytics/not-found-logs');

    $response->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveCount(3);
});

it('filters not found logs by path', function () {
    NotFoundLog::factory()->forPath('/old-page')->count(2)->create();
    NotFoundLog::factory()->forPath('/other-page')->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/analytics/not-found-logs?path=old-page');

    $response->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveCount(2);
});

it('returns not found summary when authenticated', function () {
    NotFoundLog::factory()->count(5)->create();

    $response = $this->actingAs($this->user)
        ->getJson('/api/analytics/not-found-summary');

    $response->assertOk()
        ->assertJsonStructure(['total', 'today', 'top_paths']);
});

it('returns system health when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/analytics/system-health');

    $response->assertOk()
        ->assertJsonStructure([
            'database' => ['healthy', 'message'],
            'cache_store',
            'session_driver',
            'queue_connection',
            'recommendations',
        ]);
});

it('requires authentication for system health', function () {
    $response = $this->getJson('/api/analytics/system-health');

    $response->assertUnauthorized();
});
