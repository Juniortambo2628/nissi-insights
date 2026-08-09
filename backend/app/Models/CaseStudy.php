<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'client_name',
        'significant_figure',
        'problem',
        'methodology',
        'outcome',
        'image',
        'is_featured',
        'category',
        'tags',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
    ];
}
