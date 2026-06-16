<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'type',
        'file_path',
        'thumbnail',
        'description',
        'content',
        'external_link',
        'tags',
        'is_published',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
    ];
}
