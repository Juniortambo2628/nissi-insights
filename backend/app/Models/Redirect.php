<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Redirect extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_path',
        'to',
        'status_code',
        'is_active',
        'priority',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'status_code' => 'integer',
        'priority' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
