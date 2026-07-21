<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EventRegistration extends Model
{
    use HasFactory;
    protected $fillable = [
        'event_id',
        'name',
        'email',
        'phone',
        'organization',
        'attended',
    ];

    protected $casts = [
        'attended' => 'boolean',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
