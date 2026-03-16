<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'client_name',
        'significant_figure',
        'problem',
        'methodology',
        'outcome',
        'image',
        'is_featured',
    ];
}
