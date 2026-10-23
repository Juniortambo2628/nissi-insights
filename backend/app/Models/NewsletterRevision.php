<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterRevision extends Model
{
    const UPDATED_AT = null;

    public const SOURCE_MANUAL = 'manual';

    public const SOURCE_AUTOSAVE = 'autosave';

    public const SOURCE_RESTORE = 'restore';

    protected $fillable = [
        'newsletter_id',
        'user_id',
        'source',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function newsletter()
    {
        return $this->belongsTo(Newsletter::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
