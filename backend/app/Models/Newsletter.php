<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_SENT = 'sent';

    protected $fillable = [
        'user_id',
        'title',
        'subject',
        'preheader',
        'content',
        'header_image',
        'background_color',
        'text_color',
        'accent_color',
        'status',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    public function scopeSent($query)
    {
        return $query->where('status', self::STATUS_SENT);
    }

    /**
     * Resolve a stored path or URL to an absolute URL usable inside emails.
     */
    public function absoluteUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        $clean = ltrim($path, '/');

        if (str_starts_with($clean, 'uploads/') || str_starts_with($clean, 'storage/')) {
            return config('app.url').'/api/storage/'.preg_replace('#^storage/#', '', $clean);
        }

        return frontend_url('/'.$clean);
    }

    /**
     * Newsletter HTML with relative upload paths rewritten to absolute URLs
     * so images render correctly in email clients, and editor color tokens
     * (var(--ni-accent,#2563eb) etc.) resolved to the newsletter's colors.
     */
    public function renderedContent(): string
    {
        $content = (string) $this->content;
        $appUrl = config('app.url');

        $content = preg_replace_callback(
            '#\b(src|href)="([^"]*uploads/[^"]*)"#i',
            function ($matches) use ($appUrl) {
                $url = $matches[2];

                if (filter_var($url, FILTER_VALIDATE_URL) || str_starts_with($url, 'data:')) {
                    return $matches[0];
                }

                $clean = ltrim($url, '/');
                $absolute = $appUrl.'/api/storage/'.preg_replace('#^(uploads|storage)/#', '', $clean);

                return $matches[1].'="'.$absolute.'"';
            },
            $content
        ) ?? $content;

        return $this->resolveColorTokens($content);
    }

    /**
     * Replace CSS color variables used by inserted blocks with literal
     * colors, since email clients do not support custom properties.
     */
    protected function resolveColorTokens(string $content): string
    {
        $tokens = [
            '--ni-accent' => $this->accent_color ?: '#2563eb',
            '--ni-text' => $this->text_color ?: '#0f172a',
            '--ni-bg' => $this->background_color ?: '#ffffff',
        ];

        $replaced = preg_replace_callback(
            '/var\(\s*(--ni-accent|--ni-text|--ni-bg)\s*(?:,\s*[^)]*)?\)/',
            function ($matches) use ($tokens) {
                return $tokens[$matches[1]] ?? $matches[0];
            },
            $content
        );

        return $replaced ?? $content;
    }
}
