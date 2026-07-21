<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiteSettingFactory extends Factory
{
    protected $model = SiteSetting::class;

    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(),
            'value' => fake()->word(),
            'type' => fake()->randomElement(['text', 'textarea', 'image', 'boolean', 'json']),
            'group' => fake()->randomElement(['general', 'seo', 'social', 'contact', 'launch']),
        ];
    }
}
