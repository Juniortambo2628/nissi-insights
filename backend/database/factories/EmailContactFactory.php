<?php

namespace Database\Factories;

use App\Models\EmailContact;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailContactFactory extends Factory
{
    protected $model = EmailContact::class;

    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'name' => fake()->name(),
            'source' => fake()->randomElement(['manual', 'broadcast', 'import']),
            'unsubscribed_at' => null,
        ];
    }

    public function optedOut(): static
    {
        return $this->state(fn () => [
            'unsubscribed_at' => now(),
        ]);
    }
}
