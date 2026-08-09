<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'resource_id',
        'title',
        'type',
        'path',
        'original_filename',
        'mime_type',
        'size',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'size' => 'integer',
        'sort_order' => 'integer',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function getUrlAttribute(): ?string
    {
        if ($this->type === 'link') {
            return $this->path;
        }

        return $this->path ? config('app.url').'/api/storage/'.ltrim($this->path, '/') : null;
    }

    public function getDownloadUrlAttribute(): ?string
    {
        return $this->getUrlAttribute();
    }
}
