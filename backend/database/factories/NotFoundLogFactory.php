<?php

namespace Database\Factories;

use App\Models\NotFoundLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotFoundLogFactory extends Factory
{
    protected $model = NotFoundLog::class;

    public function definition(): array
    {
        return [
            'path' => '/'.fake()->slug(),
            'source' => fake()->randomElement(['direct', 'search', 'social', 'link']),
            'referrer' => fake()->optional(0.5)->url(),
            'user_agent' => fake()->userAgent(),
            'ip' => fake()->ipv4(),
        ];
    }

    public function forPath(string $path): static
    {
        return $this->state(fn () => ['path' => $path]);
    }
}
