<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $fillable = [
        'sendable_type',
        'sendable_id',
        'template_key',
        'recipient',
        'status',
        'error',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function sendable()
    {
        return $this->morphTo();
    }
}
