<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resources = [
            [
                'title' => 'Global Energy Transition Report 2026',
                'slug' => 'global-energy-transition-report-2026',
                'type' => 'Report',
                'description' => 'An in-depth analysis of the transition to renewable energy sources globally, highlighting key challenges and opportunities.',
                'tags' => json_encode(['Energy', 'Renewables', 'Transition']),
                'is_published' => true,
            ],
            [
                'title' => 'The Future of Fintech in Emerging Markets',
                'slug' => 'future-of-fintech-emerging-markets',
                'type' => 'White Paper',
                'description' => 'Exploring the impact of financial technology on economic growth in emerging markets, with case studies from Africa and Asia.',
                'tags' => json_encode(['Fintech', 'Emerging Markets', 'Growth']),
                'is_published' => true,
            ],
            [
                'title' => 'Strategic Diplomacy in a Multipolar World',
                'slug' => 'strategic-diplomacy-multipolar-world',
                'type' => 'Article',
                'description' => 'A strategic overview of how nations and multinationals can navigate the complexities of a multipolar world order.',
                'tags' => json_encode(['Diplomacy', 'Geopolitics', 'Strategy']),
                'is_published' => true,
            ],
            [
                'title' => 'Carbon Markets: A Comprehensive Guide',
                'slug' => 'carbon-markets-comprehensive-guide',
                'type' => 'White Paper',
                'description' => 'Understanding the mechanisms, regulations, and potential of carbon markets in driving sustainable business practices.',
                'tags' => json_encode(['Carbon', 'Sustainability', 'Markets']),
                'is_published' => true,
            ],
        ];

        foreach ($resources as $resource) {
            \App\Models\Resource::create($resource);
        }
    }
}
