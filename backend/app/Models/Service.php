<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'description',
        'content',
        'icon',
        'image',
        'is_active',
    ];
}
