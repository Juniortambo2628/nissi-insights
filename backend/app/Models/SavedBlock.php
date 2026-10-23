<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedBlock extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'block_type',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];
}
