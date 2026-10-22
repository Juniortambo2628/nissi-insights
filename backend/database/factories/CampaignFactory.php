<?php

namespace Database\Factories;

use App\Models\Campaign;
use App\Models\Newsletter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'newsletter_id' => Newsletter::factory(),
            'name' => fake()->sentence(3),
            'subject' => null,
            'status' => Campaign::STATUS_DRAFT,
            'total_recipients' => 0,
            'sent_count' => 0,
            'failed_count' => 0,
            'sent_at' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(fn () => [
            'status' => Campaign::STATUS_SENT,
            'total_recipients' => 3,
            'sent_count' => 3,
            'failed_count' => 0,
            'sent_at' => now(),
        ]);
    }
}
