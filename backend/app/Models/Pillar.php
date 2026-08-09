<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $overview
 * @property string $content
 * @property string $icon
 * @property string $image
 * @property bool $is_active
 */
class Pillar extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'overview',
        'content',
        'icon',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}
