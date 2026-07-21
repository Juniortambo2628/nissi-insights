<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\Pillar;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);
        return [
            'title' => $title,
            'slug' => \Illuminate\Support\Str::slug($title),
            'category' => fake()->randomElement(['Consulting', 'Advisory', 'Strategy', 'Analytics']),
            'description' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'icon' => fake()->word(),
            'image' => null,
            'video_url' => null,
            'is_active' => true,
            'pillar_id' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function forPillar(Pillar $pillar): static
    {
        return $this->state(fn () => ['pillar_id' => $pillar->id]);
    }
}
