<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->user = User::factory()->create([
        'password' => Hash::make('secret-password'),
    ]);
});

it('logs in with valid credentials', function () {
    $response = $this->postJson('/api/login', [
        'email' => $this->user->email,
        'password' => 'secret-password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['token', 'user'])
        ->assertJsonPath('user.email', $this->user->email);
});

it('rejects invalid credentials', function () {
    $response = $this->postJson('/api/login', [
        'email' => $this->user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('rejects non-existent email', function () {
    $response = $this->postJson('/api/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('returns authenticated user', function () {
    $response = $this->actingAs($this->user)
        ->getJson('/api/user');

    $response->assertOk()
        ->assertJsonPath('email', $this->user->email);
});

it('logs out successfully', function () {
    $token = $this->user->createToken('auth_token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/logout');

    $response->assertOk()
        ->assertJsonPath('message', 'Logged out');
});

it('requires authentication for user endpoint', function () {
    $response = $this->getJson('/api/user');

    $response->assertUnauthorized();
});

it('requires authentication for logout', function () {
    $response = $this->postJson('/api/logout');

    $response->assertUnauthorized();
});

it('validates required fields on login', function () {
    $response = $this->postJson('/api/login', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});
