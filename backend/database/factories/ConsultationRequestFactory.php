<?php

namespace Database\Factories;

use App\Models\ConsultationRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsultationRequestFactory extends Factory
{
    protected $model = ConsultationRequest::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->safeEmail(),
            'subject' => fake()->sentence(),
            'message' => fake()->paragraph(),
            'status' => 'pending',
        ];
    }
}
