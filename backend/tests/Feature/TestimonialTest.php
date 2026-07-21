<?php

use App\Models\User;
use App\Models\Testimonial;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists featured testimonials', function () {
    Testimonial::factory()->count(2)->featured()->create();
    Testimonial::factory()->count(3)->create(['is_featured' => false]);

    $response = $this->getJson('/api/testimonials');

    $response->assertOk()
        ->assertJsonCount(2);
});

it('creates a testimonial when authenticated', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/testimonials', [
            'name' => 'John Doe',
            'role' => 'CEO',
            'company' => 'Acme Inc',
            'quote' => 'Great service!',
            'rating' => 5,
        ]);

    $response->assertCreated()
        ->assertJsonPath('name', 'John Doe');
});

it('validates required fields on create', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/testimonials', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'role', 'company', 'quote']);
});

it('updates a testimonial when authenticated', function () {
    $testimonial = Testimonial::factory()->create();

    $response = $this->actingAs($this->user)
        ->putJson("/api/testimonials/{$testimonial->id}", [
            'quote' => 'Updated quote',
        ]);

    $response->assertOk()
        ->assertJsonPath('quote', 'Updated quote');
});

it('deletes a testimonial when authenticated', function () {
    $testimonial = Testimonial::factory()->create();

    $response = $this->actingAs($this->user)
        ->deleteJson("/api/testimonials/{$testimonial->id}");

    $response->assertNoContent();
});

it('requires authentication for write operations', function () {
    $testimonial = Testimonial::factory()->create();

    $this->postJson('/api/testimonials', ['name' => 'Test', 'quote' => 'Test'])
        ->assertUnauthorized();

    $this->putJson("/api/testimonials/{$testimonial->id}", ['quote' => 'Test'])
        ->assertUnauthorized();

    $this->deleteJson("/api/testimonials/{$testimonial->id}")
        ->assertUnauthorized();
});
