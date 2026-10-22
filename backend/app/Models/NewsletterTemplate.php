<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'background_color',
        'text_color',
        'accent_color',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
