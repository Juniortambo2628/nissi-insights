<?php

namespace App\Models;

use App\Traits\HasOptOut;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailContact extends Model
{
    use HasFactory, HasOptOut;

    protected $fillable = [
        'email',
        'name',
        'source',
    ];

    protected $casts = [
        'unsubscribed_at' => 'datetime',
    ];

    public function scopeOptedIn($query)
    {
        return $query->whereNull('unsubscribed_at');
    }
}
