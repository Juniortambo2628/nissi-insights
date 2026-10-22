<?php

namespace App\Traits;

use Illuminate\Support\Str;

/**
 * Shared opt-out behaviour for models that receive email campaigns.
 * Expects `unsubscribe_token` (string, unique) and `unsubscribed_at`
 * (nullable datetime) columns on the underlying table.
 */
trait HasOptOut
{
    public static function generateToken(): string
    {
        return Str::random(40);
    }

    protected static function bootHasOptOut(): void
    {
        static::creating(function ($model) {
            if (! $model->unsubscribe_token) {
                $model->unsubscribe_token = static::generateToken();
            }
        });
    }

    public function scopeOptedOut($query)
    {
        return $query->whereNotNull('unsubscribed_at');
    }

    public function isOptedOut(): bool
    {
        return $this->unsubscribed_at !== null;
    }

    /**
     * Mark this record as opted out of email campaigns. Idempotent.
     */
    public function markOptedOut(): void
    {
        if ($this->isOptedOut()) {
            return;
        }

        $this->forceFill(['unsubscribed_at' => now()])->save();
    }

    public function unsubscribeUrl(): ?string
    {
        if (! $this->unsubscribe_token) {
            return null;
        }

        return frontend_url('/unsubscribe?token='.$this->unsubscribe_token);
    }
}
