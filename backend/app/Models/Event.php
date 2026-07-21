<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;

class Event extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'slug',
        'description',
        'overview',
        'date',
        'duration_minutes',
        'timezone',
        'location',
        'image',
        'link',
        'status',
        'is_published',
        'tags',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'date' => 'datetime',
        'duration_minutes' => 'integer',
        'is_published' => 'boolean',
        'tags' => 'array',
    ];

    protected static function booted(): void
    {
        static::saving(function (Event $event) {
            $event->syncStatusFromDate();
        });
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function eventDateInTimezone(): Carbon
    {
        return $this->date->copy()->setTimezone($this->timezone ?? config('app.timezone', 'UTC'));
    }

    public function startTime(): Carbon
    {
        return $this->eventDateInTimezone();
    }

    public function endTime(): Carbon
    {
        return $this->startTime()->copy()->addMinutes($this->duration_minutes ?? 60);
    }

    public function isUpcoming(): bool
    {
        return $this->startTime()->isFuture();
    }

    public function isInProgress(): bool
    {
        $now = now($this->timezone ?? config('app.timezone', 'UTC'));

        return $this->startTime()->lessThanOrEqualTo($now) && $this->endTime()->greaterThan($now);
    }

    public function isEnded(): bool
    {
        return $this->endTime()->isPast();
    }

    public function syncStatusFromDate(): void
    {
        if ($this->isEnded()) {
            $this->status = 'past';
        } else {
            $this->status = 'upcoming';
        }
    }
}
