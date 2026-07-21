<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamMemberFactory extends Factory
{
    protected $model = TeamMember::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'role' => fake()->jobTitle(),
            'bio' => fake()->paragraph(),
            'qualifications' => fake()->sentence(),
            'linkedin' => fake()->url(),
            'image' => null,
            'order' => fake()->unique()->numberBetween(1, 100),
        ];
    }
}
