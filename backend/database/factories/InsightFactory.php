<?php

namespace Database\Factories;

use App\Models\Insight;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InsightFactory extends Factory
{
    protected $model = Insight::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'category' => fake()->randomElement(['Technology', 'Finance', 'Energy', 'Markets']),
            'excerpt' => fake()->sentence(),
            'content' => fake()->paragraphs(5, true),
            'image' => null,
            'user_id' => User::factory(),
            'is_published' => true,
            'published_at' => now(),
            'tags' => [fake()->word(), fake()->word()],
            'meta_title' => null,
            'meta_description' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}
