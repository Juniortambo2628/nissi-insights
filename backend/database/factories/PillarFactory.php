<?php

namespace Database\Factories;

use App\Models\Pillar;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PillarFactory extends Factory
{
    protected $model = Pillar::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'overview' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'icon' => fake()->word(),
            'image' => null,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
