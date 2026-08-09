<?php

use App\Models\CaseStudy;
use App\Models\Event;
use App\Models\Insight;
use App\Models\Pillar;
use App\Models\Resource;
use App\Models\Service;

it('returns empty results for short query', function () {
    $response = $this->getJson('/api/search?q=ab');

    $response->assertOk()
        ->assertJson([
            'services' => [],
            'insights' => [],
            'case_studies' => [],
            'events' => [],
            'pillars' => [],
            'resources' => [],
        ]);
});

it('searches services by title', function () {
    Service::factory()->create(['title' => 'Energy Consulting', 'is_active' => true]);
    Service::factory()->create(['title' => 'Digital Transformation', 'is_active' => true]);

    $response = $this->getJson('/api/search?q=energy');

    $response->assertOk()
        ->assertJsonCount(1, 'services');
});

it('searches insights by title', function () {
    Insight::factory()->create(['title' => 'Oil Market Analysis', 'is_published' => true]);
    Insight::factory()->create(['title' => 'Renewable Energy Trends', 'is_published' => true]);

    $response = $this->getJson('/api/search?q=oil');

    $response->assertOk()
        ->assertJsonCount(1, 'insights');
});

it('searches case studies by title', function () {
    CaseStudy::factory()->create(['title' => 'Shell Digital Transformation']);

    $response = $this->getJson('/api/search?q=shell');

    $response->assertOk()
        ->assertJsonCount(1, 'case_studies');
});

it('searches events by title', function () {
    Event::factory()->create(['title' => 'Energy Summit 2026', 'is_published' => true]);

    $response = $this->getJson('/api/search?q=summit');

    $response->assertOk()
        ->assertJsonCount(1, 'events');
});

it('searches pillars by title', function () {
    Pillar::factory()->create(['title' => 'Sustainability', 'is_active' => true]);

    $response = $this->getJson('/api/search?q=sustainability');

    $response->assertOk()
        ->assertJsonCount(1, 'pillars');
});

it('searches resources by title', function () {
    Resource::factory()->create(['title' => 'Annual Report 2025', 'is_published' => true]);

    $response = $this->getJson('/api/search?q=annual');

    $response->assertOk()
        ->assertJsonCount(1, 'resources');
});

it('filters search by type', function () {
    Service::factory()->create(['title' => 'Energy Consulting', 'is_active' => true]);
    Insight::factory()->create(['title' => 'Energy Market Report', 'is_published' => true]);

    $response = $this->getJson('/api/search?q=energy&type=services');

    $response->assertOk()
        ->assertJsonCount(1, 'services')
        ->assertJsonCount(0, 'insights');
});

it('does not return inactive services', function () {
    Service::factory()->create(['title' => 'Energy Consulting', 'is_active' => false]);

    $response = $this->getJson('/api/search?q=energy');

    $response->assertOk()
        ->assertJsonCount(0, 'services');
});

it('does not return unpublished insights', function () {
    Insight::factory()->create(['title' => 'Energy Report', 'is_published' => false]);

    $response = $this->getJson('/api/search?q=energy');

    $response->assertOk()
        ->assertJsonCount(0, 'insights');
});

it('returns combined results across types', function () {
    Service::factory()->create(['title' => 'Energy Service', 'is_active' => true]);
    Insight::factory()->create(['title' => 'Energy Insight', 'is_published' => true]);
    Event::factory()->create(['title' => 'Energy Event', 'is_published' => true]);

    $response = $this->getJson('/api/search?q=energy');

    $response->assertOk()
        ->assertJsonCount(1, 'services')
        ->assertJsonCount(1, 'insights')
        ->assertJsonCount(1, 'events');
});
