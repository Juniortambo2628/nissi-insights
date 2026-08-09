<?php

namespace Database\Factories;

use App\Models\EmailTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EmailTemplateFactory extends Factory
{
    protected $model = EmailTemplate::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'key' => Str::slug($name),
            'name' => ucfirst($name),
            'subject' => fake()->sentence(),
            'body' => '<p>Hello {{ first_name }},</p><p>This is a test email.</p>',
            'variables' => ['first_name', 'last_name', 'email'],
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
