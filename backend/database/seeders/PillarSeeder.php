<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pillar;
use App\Models\Service;
use Illuminate\Support\Str;

class PillarSeeder extends Seeder
{
    public function run(): void
    {
        $pillars = [
            [
                'title' => 'Energy Advisory',
                'overview' => 'Rigorous intelligence for the future of global energy markets.',
                'content' => 'Our Energy Advisory pillar provides comprehensive market intelligence, due diligence, and strategic guidance for energy market participants. We specialize in green commodity trading, renewable asset allocation, and navigating complex regulatory landscapes.',
                'icon' => 'Zap',
                'image' => '/NI-Digital-Assets/energy-advisory.jpg',
                'is_active' => true,
            ],
            [
                'title' => 'Fintech',
                'overview' => 'Strategic guidance for the next generation of financial technology.',
                'content' => 'The Fintech pillar focuses on product strategy, commercial model design, and regulatory compliance for financial technology ventures. We enable growth through robust risk frameworks and innovative payment infrastructure advisory.',
                'icon' => 'Activity',
                'image' => '/NI-Digital-Assets/financial-technology.jpg',
                'is_active' => true,
            ],
            [
                'title' => 'International Diplomacy',
                'overview' => 'Connecting sovereign interests with global strategic opportunities.',
                'content' => 'Nissi Insights facilitates high-level government engagement and sovereign wealth fund advisory. Our International Diplomacy pillar specializes in cross-border deal enablement and geopolitical risk assessment to build global trust and reputation.',
                'icon' => 'Globe',
                'image' => '/NI-Digital-Assets/international-diplomacy.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($pillars as $pData) {
            $pData['slug'] = Str::slug($pData['title']);
            $pillar = Pillar::updateOrCreate(['slug' => $pData['slug']], $pData);

            // Associate services
            Service::where('category', $pData['title'])->update(['pillar_id' => $pillar->id]);
        }
        
        // Special case for cross-category or mismatched names if any
        // e.g. Service::where('slug', 'some-service')->update(['pillar_id' => $energyPillar->id]);
    }
}
