<?php

namespace App\Models;

use App\Traits\HasOptOut;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    use HasFactory, HasOptOut;

    protected $fillable = [
        'email',
        'name',
        'source',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'unsubscribed_at' => 'datetime',
    ];

    public function scopeOptedIn($query)
    {
        return $query->where('is_active', true)->whereNull('unsubscribed_at');
    }
}
