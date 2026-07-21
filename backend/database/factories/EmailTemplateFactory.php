<?php

namespace Database\Factories;

use App\Models\EmailTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailTemplateFactory extends Factory
{
    protected $model = EmailTemplate::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(),
            'name' => fake()->words(3, true),
            'subject' => fake()->sentence(),
            'body' => '<h1>Hello {{ name }}</h1><p>{{ content }}</p>',
            'variables' => ['name', 'content'],
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
