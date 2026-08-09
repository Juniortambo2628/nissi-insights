<?php

namespace Database\Factories;

use App\Models\PageView;
use Illuminate\Database\Eloquent\Factories\Factory;

class PageViewFactory extends Factory
{
    protected $model = PageView::class;

    public function definition(): array
    {
        return [
            'path' => '/'.fake()->randomElement(['services', 'insights', 'case-studies', 'events', 'about']),
            'referrer' => fake()->optional(0.6)->url(),
            'user_agent' => fake()->userAgent(),
            'ip' => fake()->ipv4(),
            'country' => fake()->optional(0.5)->countryCode(),
        ];
    }

    public function forPath(string $path): static
    {
        return $this->state(fn () => ['path' => $path]);
    }
}
