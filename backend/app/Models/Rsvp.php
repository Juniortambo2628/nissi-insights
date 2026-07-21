<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $company
 * @property string|null $job_title
 * @property string|null $sector
 * @property string|null $interest
 * @property bool $consent
 * @property bool $newsletter
 * @property string|null $attendance
 * @property string $type
 */
class Rsvp extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'company',
        'job_title',
        'sector',
        'interest',
        'consent',
        'newsletter',
        'attendance',
        'type',
    ];
}
