<?php

namespace Database\Factories;

use App\Models\Newsletter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsletterFactory extends Factory
{
    protected $model = Newsletter::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'subject' => fake()->sentence(6),
            'preheader' => fake()->sentence(10),
            'content' => '<p>'.fake()->paragraph().'</p>',
            'header_image' => null,
            'background_color' => '#ffffff',
            'text_color' => '#0f172a',
            'accent_color' => '#2563eb',
            'status' => Newsletter::STATUS_DRAFT,
            'sent_at' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(fn () => [
            'status' => Newsletter::STATUS_SENT,
            'sent_at' => now(),
        ]);
    }
}
