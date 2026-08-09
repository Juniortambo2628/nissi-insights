<?php

namespace Database\Factories;

use App\Models\EmailLog;
use App\Models\EventRegistration;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailLogFactory extends Factory
{
    protected $model = EmailLog::class;

    public function definition(): array
    {
        return [
            'sendable_type' => EventRegistration::class,
            'sendable_id' => EventRegistration::factory(),
            'template_key' => 'event_registration',
            'recipient' => fake()->safeEmail(),
            'status' => fake()->randomElement(['sent', 'failed', 'queued']),
            'error' => null,
            'sent_at' => fake()->optional(0.8)->dateTimeThisMonth(),
        ];
    }

    public function sent(): static
    {
        return $this->state(fn () => ['status' => 'sent', 'sent_at' => now()]);
    }

    public function failed(): static
    {
        return $this->state(fn () => ['status' => 'failed', 'error' => 'SMTP connection failed']);
    }

    public function queued(): static
    {
        return $this->state(fn () => ['status' => 'queued']);
    }
}
