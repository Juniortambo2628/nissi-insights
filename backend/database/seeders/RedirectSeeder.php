<?php

namespace Database\Seeders;

use App\Models\Redirect;
use Illuminate\Database\Seeder;

class RedirectSeeder extends Seeder
{
    public function run(): void
    {
        $redirects = [
            // Legacy paths that commonly appear in Search Console
            [
                'from_path' => '/home',
                'to' => '/',
                'status_code' => 301,
                'priority' => 100,
                'notes' => 'Legacy home alias',
            ],
            [
                'from_path' => '/index',
                'to' => '/',
                'status_code' => 301,
                'priority' => 100,
                'notes' => 'Legacy index alias',
            ],
            [
                'from_path' => '/about-us',
                'to' => '/about',
                'status_code' => 301,
                'priority' => 100,
                'notes' => 'Common about alias',
            ],
            [
                'from_path' => '/contact-us',
                'to' => '/contact',
                'status_code' => 301,
                'priority' => 100,
                'notes' => 'Common contact alias',
            ],
            [
                'from_path' => '/blog',
                'to' => '/insights',
                'status_code' => 301,
                'priority' => 100,
                'notes' => 'Legacy blog alias',
            ],
            [
                'from_path' => '/articles',
                'to' => '/insights',
                'status_code' => 301,
                'priority' => 100,
                'notes' => 'Legacy articles alias',
            ],
            [
                'from_path' => '/case-studies/',
                'to' => '/case-studies',
                'status_code' => 301,
                'priority' => 10,
                'notes' => 'Remove trailing slash',
            ],
            [
                'from_path' => '/insights/',
                'to' => '/insights',
                'status_code' => 301,
                'priority' => 10,
                'notes' => 'Remove trailing slash',
            ],
            [
                'from_path' => '/services/',
                'to' => '/services',
                'status_code' => 301,
                'priority' => 10,
                'notes' => 'Remove trailing slash',
            ],
            [
                'from_path' => '/events/',
                'to' => '/events',
                'status_code' => 301,
                'priority' => 10,
                'notes' => 'Remove trailing slash',
            ],
            [
                'from_path' => '/knowledge-base/',
                'to' => '/knowledge-base',
                'status_code' => 301,
                'priority' => 10,
                'notes' => 'Remove trailing slash',
            ],
        ];

        foreach ($redirects as $redirect) {
            Redirect::firstOrCreate(
                ['from_path' => $redirect['from_path']],
                $redirect
            );
        }
    }
}
