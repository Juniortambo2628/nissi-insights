<?php

namespace Database\Factories;

use App\Models\Value;
use Illuminate\Database\Eloquent\Factories\Factory;

class ValueFactory extends Factory
{
    protected $model = Value::class;

    public function definition(): array
    {
        return [
            'icon' => fake()->word(),
            'title' => fake()->unique()->words(3, true),
            'description' => fake()->paragraph(),
            'order' => fake()->unique()->numberBetween(1, 100),
        ];
    }
}
