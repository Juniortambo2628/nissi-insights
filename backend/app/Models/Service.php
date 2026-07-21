<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    public function pillar()
    {
        return $this->belongsTo(Pillar::class);
    }
}
