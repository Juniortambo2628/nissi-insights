<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;
use App\Models\Client;

class TestimonialClientSeeder extends Seeder
{
    public function run(): void
    {
        // Testimonials
        $testimonials = [
            [
                'client_name' => 'Dr. Sarah Mitchell',
                'role' => 'Chief Investment Officer',
                'company' => 'Nordic Energy Capital',
                'quote' => 'Nissi Insights delivered an exceptional due diligence report that gave our board full confidence to proceed with a £200M offshore wind investment. Their sector expertise is unmatched.',
                'rating' => 5,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'client_name' => 'James Okonkwo',
                'role' => 'CEO',
                'company' => 'AfriPay Technologies',
                'quote' => 'Their fintech regulatory mapping across 5 African markets saved us 12 months of research and helped us launch ahead of schedule. A true strategic partner.',
                'rating' => 5,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'client_name' => 'Ambassador Helena Voss',
                'role' => 'Senior Diplomatic Advisor',
                'company' => 'European External Action Service',
                'quote' => 'The team\'s understanding of sovereign stakeholder dynamics is remarkable. They facilitated connections that would have taken years to build through traditional channels.',
                'rating' => 5,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'client_name' => 'Richard Chen',
                'role' => 'Managing Director',
                'company' => 'Pacific Infrastructure Fund',
                'quote' => 'We\'ve engaged Nissi Insights on three separate transactions. Their commercial advisory consistently identifies value others miss.',
                'rating' => 5,
                'is_featured' => true,
                'order' => 4,
            ],
            [
                'client_name' => 'Fatima Al-Rashid',
                'role' => 'Head of Strategy',
                'company' => 'Gulf Sovereign Partners',
                'quote' => 'Their cross-border treaty negotiation support was instrumental in unlocking $500M in co-investment opportunities for our fund.',
                'rating' => 5,
                'is_featured' => true,
                'order' => 5,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(['client_name' => $t['client_name']], $t);
        }

        // Client logos
        $clients = [
            ['name' => 'Nordic Energy Capital', 'order' => 1],
            ['name' => 'Shell Renewables', 'order' => 2],
            ['name' => 'AfriPay Technologies', 'order' => 3],
            ['name' => 'World Bank Group', 'order' => 4],
            ['name' => 'European Investment Bank', 'order' => 5],
            ['name' => 'Gulf Sovereign Partners', 'order' => 6],
            ['name' => 'Pacific Infrastructure Fund', 'order' => 7],
            ['name' => 'AU Commission', 'order' => 8],
        ];

        foreach ($clients as $c) {
            $c['is_active'] = true;
            Client::updateOrCreate(['name' => $c['name']], $c);
        }
    }
}
