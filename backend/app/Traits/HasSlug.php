<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    public function generateSlug(string $title, string $modelClass): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while ($modelClass::where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$count;
            $count++;
        }

        return $slug;
    }

    public function generateUniqueSlug(string $title, int $ignoreId, string $modelClass): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while ($modelClass::where('slug', $slug)->where('id', '!=', $ignoreId)->exists()) {
            $slug = $originalSlug.'-'.$count;
            $count++;
        }

        return $slug;
    }
}
