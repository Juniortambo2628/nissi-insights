<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'overview' => fake()->paragraph(),
            'date' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'duration_minutes' => fake()->randomElement([60, 90, 120, 180]),
            'timezone' => 'UTC',
            'location' => fake()->city(),
            'image' => null,
            'link' => fake()->url(),
            'status' => 'upcoming',
            'is_published' => true,
            'tags' => [fake()->word()],
            'meta_title' => null,
            'meta_description' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['is_published' => false]);
    }
}
