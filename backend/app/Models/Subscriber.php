<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'name',
        'source',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'unsubscribed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Subscriber $subscriber) {
            if (! $subscriber->unsubscribe_token) {
                $subscriber->unsubscribe_token = static::generateToken();
            }
        });
    }

    public static function generateToken(): string
    {
        return Str::random(40);
    }

    public function scopeOptedIn($query)
    {
        return $query->where('is_active', true)->whereNull('unsubscribed_at');
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
     * Mark the subscriber as opted out of email campaigns. Idempotent.
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
