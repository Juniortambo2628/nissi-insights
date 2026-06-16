<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'overview',
        'date',
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
        'is_published' => 'boolean',
        'tags' => 'array',
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
