<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'pillar_id',
        'title',
        'slug',
        'category',
        'description',
        'content',
        'icon',
        'image',
        'video_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function pillar()
    {
        return $this->belongsTo(Pillar::class);
    }
}
