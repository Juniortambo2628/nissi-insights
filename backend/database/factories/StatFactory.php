<?php

namespace Database\Factories;

use App\Models\Stat;
use Illuminate\Database\Eloquent\Factories\Factory;

class StatFactory extends Factory
{
    protected $model = Stat::class;

    public function definition(): array
    {
        return [
            'label' => fake()->unique()->words(3, true),
            'value' => fake()->numerify('###') . '+',
            'icon' => fake()->word(),
            'order' => fake()->unique()->numberBetween(1, 100),
        ];
    }
}
