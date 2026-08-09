<?php

namespace Database\Factories;

use App\Models\Resource;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ResourceFactory extends Factory
{
    protected $model = Resource::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'type' => fake()->randomElement(['pdf', 'doc', 'video', 'link']),
            'file_path' => null,
            'thumbnail' => null,
            'description' => fake()->paragraph(),
            'content' => fake()->paragraphs(2, true),
            'external_link' => null,
            'tags' => [fake()->word()],
            'is_published' => true,
            'meta_title' => null,
            'meta_description' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['is_published' => false]);
    }
}
