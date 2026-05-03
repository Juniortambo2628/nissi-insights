<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Energy Transition in Emerging Markets: 2024 Outlook',
                'slug' => 'energy-transition-emerging-markets-2024',
                'description' => 'A deep dive into the challenges and opportunities for green energy in sub-Saharan Africa.',
                'overview' => "Our flagship webinar session bringing together ministers of energy and private equity leaders to discuss the roadmap for 2024.\n\nKey Topics:\n- Financing the transition\n- Grid stability and storage\n- Regulatory hurdles in Kenya and Nigeria",
                'date' => now()->addDays(14)->setHour(14)->setMinute(0),
                'location' => 'Zoom Webinar',
                'image' => '/NI-Digital-Assets/corporate-event.jpg',
                'status' => 'upcoming',
                'is_published' => true,
            ],
            [
                'title' => 'Sovereign Debt and Energy Security',
                'slug' => 'sovereign-debt-energy-security',
                'description' => 'Analyzing the intersection of national debt levels and the ability to secure energy futures.',
                'overview' => "A closed-door session for institutional investors and policy makers.\n\nFocus Areas:\n- Debt-for-nature swaps\n- Resource-backed loans\n- The impact of interest rates on energy infrastructure",
                'date' => now()->addDays(30)->setHour(10)->setMinute(0),
                'location' => 'Nairobi, Kenya',
                'image' => '/NI-Digital-Assets/international-diplomacy.jpg',
                'status' => 'upcoming',
                'is_published' => true,
            ],
            [
                'title' => 'Fintech Revolution in Oil & Gas Payments',
                'slug' => 'fintech-oil-gas-payments',
                'description' => 'How digital currencies and blockchain are streamlining cross-border energy trade.',
                'overview' => "Recording of our Q1 session on the evolution of energy finance.",
                'date' => now()->subMonths(2)->setHour(11)->setMinute(0),
                'location' => 'London, UK',
                'image' => '/NI-Digital-Assets/oil-and-gas.jpg',
                'status' => 'past',
                'is_published' => true,
            ],
        ];

        foreach ($events as $event) {
            \App\Models\Event::updateOrCreate(['slug' => $event['slug']], $event);
        }
    }
}
