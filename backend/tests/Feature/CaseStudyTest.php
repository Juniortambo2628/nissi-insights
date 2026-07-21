<?php

use App\Models\User;
use App\Models\CaseStudy;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists case studies', function () {
    CaseStudy::factory()->count(3)->create();

    $response = $this->getJson('/api/case-studies');

    $response->assertOk()
        ->assertJsonCount(3);
});

it('shows a case study by slug', function () {
    $caseStudy = CaseStudy::factory()->create();

    $response = $this->getJson("/api/case-studies/{$caseStudy->slug}");

    $response->assertOk()
        ->assertJsonPath('title', $caseStudy->title);
});

it('creates a case study when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/case-studies', [
            'title' => 'Test Case Study',
            'client_name' => 'Acme Corp',
            'problem' => 'The problem',
            'methodology' => 'Our approach',
            'outcome' => 'The result',
        ]);

    $response->assertCreated()
        ->assertJsonPath('title', 'Test Case Study');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/case-studies', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title']);
});

it('updates a case study when authenticated', function () {
    $caseStudy = CaseStudy::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/case-studies/{$caseStudy->id}", [
            'title' => 'Updated Case Study',
        ]);

    $response->assertOk()
        ->assertJsonPath('title', 'Updated Case Study');
});

it('deletes a case study when authenticated', function () {
    $caseStudy = CaseStudy::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/case-studies/{$caseStudy->id}");

    $response->assertNoContent();
});

it('requires authentication for write operations', function () {
    $caseStudy = CaseStudy::factory()->create();

    $this->postJson('/api/case-studies', ['title' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/case-studies/{$caseStudy->id}", ['title' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/case-studies/{$caseStudy->id}")
        ->assertUnauthorized();
});
