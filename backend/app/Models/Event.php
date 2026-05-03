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
    ];

    protected $casts = [
        'date' => 'datetime',
        'is_published' => 'boolean',
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
