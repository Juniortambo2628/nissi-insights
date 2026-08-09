<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\EventDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventDocumentFactory extends Factory
{
    protected $model = EventDocument::class;

    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'title' => fake()->sentence(3),
            'type' => fake()->randomElement(['file', 'link']),
            'path' => fake()->randomElement([
                '/documents/'.fake()->slug().'.pdf',
                fake()->url(),
            ]),
            'original_filename' => fake()->word().'.pdf',
            'mime_type' => fake()->randomElement(['application/pdf', 'image/jpeg', 'text/plain']),
            'size' => fake()->numberBetween(1000, 10000000),
            'is_published' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
