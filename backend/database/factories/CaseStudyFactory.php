<?php

namespace Database\Factories;

use App\Models\CaseStudy;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CaseStudyFactory extends Factory
{
    protected $model = CaseStudy::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'client_name' => fake()->company(),
            'significant_figure' => fake()->numerify('##') . '%',
            'problem' => fake()->paragraph(),
            'methodology' => fake()->paragraph(),
            'outcome' => fake()->paragraph(),
            'image' => null,
            'is_featured' => false,
            'category' => fake()->randomElement(['Energy', 'Finance', 'Technology', 'Healthcare']),
            'tags' => [fake()->word()],
            'meta_title' => null,
            'meta_description' => null,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }
}
