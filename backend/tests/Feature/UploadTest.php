<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    Storage::fake('public');
});

it('uploads a file when authenticated', function () {
    $file = UploadedFile::fake()->image('photo.jpg', 800, 600)->size(500);

    $response = $this->actingAs($this->user)
        ->postJson('/api/upload', [
            'file' => $file,
        ]);

    $response->assertCreated()
        ->assertJsonStructure(['url', 'path', 'filename', 'size', 'mime']);
});

it('validates file type on upload', function () {
    $file = UploadedFile::fake()->create('test.exe', 100, 'application/x-msdownload');

    $response = $this->actingAs($this->user)
        ->postJson('/api/upload', [
            'file' => $file,
        ]);

    $response->assertUnprocessable();
});

it('returns 400 when no file uploaded', function () {
    $response = $this->actingAs($this->user)
        ->postJson('/api/upload', []);

    $response->assertBadRequest();
});

it('deletes a file when authenticated', function () {
    Storage::disk('public')->put('uploads/test-file.txt', 'content');

    $response = $this->actingAs($this->user)
        ->deleteJson('/api/upload', [
            'path' => 'uploads/test-file.txt',
        ]);

    $response->assertOk()
        ->assertJson(['message' => 'File deleted']);
});

it('returns 404 when deleting non-existent file', function () {
    $response = $this->actingAs($this->user)
        ->deleteJson('/api/upload', [
            'path' => 'uploads/non-existent.txt',
        ]);

    $response->assertNotFound();
});

it('validates path on delete', function () {
    $response = $this->actingAs($this->user)
        ->deleteJson('/api/upload', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['path']);
});

it('requires authentication for upload', function () {
    $file = UploadedFile::fake()->image('photo.jpg')->size(500);

    $response = $this->postJson('/api/upload', [
        'file' => $file,
    ]);

    $response->assertUnauthorized();
});

it('requires authentication for delete', function () {
    $response = $this->deleteJson('/api/upload', [
        'path' => 'uploads/test.txt',
    ]);

    $response->assertUnauthorized();
});
