<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotFoundLog extends Model
{
    protected $fillable = [
        'path',
        'source',
        'referrer',
        'user_agent',
        'ip',
    ];
}
