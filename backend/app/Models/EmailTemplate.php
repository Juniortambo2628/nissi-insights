<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Support\Facades\Blade;

class EmailTemplate extends Model
{
    protected $fillable = [
        'key',
        'name',
        'subject',
        'body',
        'variables',
        'is_active',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByKey($query, string $key)
    {
        return $query->where('key', $key);
    }

    /**
     * Render an active template as a Mailable Content object if it exists.
     * Returns null when the template is missing or inactive so callers can
     * fall back to their default views.
     */
    public static function renderIfExists(string $key, array $data = []): ?Content
    {
        $template = static::active()->byKey($key)->first();

        if (! $template) {
            return null;
        }

        $body = $template->body;

        if (! str_contains($body, '<html')) {
            $body = view('emails.layout', ['content' => $body])->render();
        }

        return new Content(
            htmlString: Blade::render($body, $data),
        );
    }

    public static function subjectIfExists(string $key, array $data = [], string $default = ''): string
    {
        $template = static::active()->byKey($key)->first();

        if (! $template) {
            return $default;
        }

        return Blade::render($template->subject, $data);
    }
}
