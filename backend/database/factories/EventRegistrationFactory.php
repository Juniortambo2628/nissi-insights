<?php

namespace Database\Factories;

use App\Models\EventRegistration;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventRegistrationFactory extends Factory
{
    protected $model = EventRegistration::class;

    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'organization' => fake()->company(),
            'attended' => false,
        ];
    }
}
