<?php

namespace Database\Factories;

use App\Models\Redirect;
use Illuminate\Database\Eloquent\Factories\Factory;

class RedirectFactory extends Factory
{
    protected $model = Redirect::class;

    public function definition(): array
    {
        return [
            'from_path' => '/' . fake()->unique()->slug(),
            'to' => '/' . fake()->slug(),
            'status_code' => fake()->randomElement([301, 302]),
            'is_active' => true,
            'priority' => fake()->numberBetween(0, 100),
            'notes' => fake()->sentence(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
