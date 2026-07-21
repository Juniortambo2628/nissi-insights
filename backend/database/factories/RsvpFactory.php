<?php

namespace Database\Factories;

use App\Models\Rsvp;
use Illuminate\Database\Eloquent\Factories\Factory;

class RsvpFactory extends Factory
{
    protected $model = Rsvp::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'company' => fake()->company(),
            'job_title' => fake()->jobTitle(),
            'sector' => fake()->randomElement(['Energy', 'Finance', 'Technology', 'Healthcare', 'Government']),
            'interest' => fake()->sentence(),
            'consent' => true,
            'newsletter' => fake()->boolean(),
            'attendance' => fake()->randomElement(['in-person', 'virtual', 'maybe']),
            'type' => 'launch',
        ];
    }
}
