<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            // === ENERGY ADVISORY ===
            [
                'title' => 'Due Diligence & Strategy',
                'category' => 'Energy Advisory',
                'slug' => 'due-diligence-strategy',
                'description' => 'Comprehensive due diligence and strategic advisory for energy investments, green commodity trading, and renewable asset allocation.',
                'icon' => 'Search',
            ],
            [
                'title' => 'Commercial Advisory',
                'category' => 'Energy Advisory',
                'slug' => 'commercial-advisory',
                'description' => 'Expert commercial guidance for energy market participants, including bankability assessments and transaction structuring.',
                'icon' => 'TrendingUp',
            ],
            [
                'title' => 'Route to Market & Contracting',
                'category' => 'Energy Advisory',
                'slug' => 'route-to-market-contracting',
                'description' => 'Optimizing route-to-market strategies, PPA structures, and contract negotiation for energy assets.',
                'icon' => 'FileText',
            ],
            [
                'title' => 'Legal & Policy',
                'category' => 'Energy Advisory',
                'slug' => 'legal-policy',
                'description' => 'Navigating the regulatory landscape, policy analysis, and legal structuring for energy transactions.',
                'icon' => 'Scale',
            ],
            [
                'title' => 'Transaction & Investment Support',
                'category' => 'Energy Advisory',
                'slug' => 'transaction-investment-support',
                'description' => 'End-to-end transaction support from deal origination through financial close for energy investments.',
                'icon' => 'Briefcase',
            ],
            [
                'title' => 'Portfolio & Risk Advisory',
                'category' => 'Energy Advisory',
                'slug' => 'portfolio-risk-advisory',
                'description' => 'Portfolio optimisation, risk modelling, and hedging strategies for energy asset portfolios.',
                'icon' => 'Shield',
            ],
            [
                'title' => 'Market & Price Advisory',
                'category' => 'Energy Advisory',
                'slug' => 'market-price-advisory',
                'description' => 'Market intelligence, price forecasting, and trend analysis across energy commodity markets.',
                'icon' => 'BarChart2',
            ],
            [
                'title' => 'Performance Benchmark',
                'category' => 'Energy Advisory',
                'slug' => 'performance-benchmark',
                'description' => 'Benchmarking operational and financial performance against industry standards and best practices.',
                'icon' => 'Target',
            ],

            // === FINTECH ===
            [
                'title' => 'Strategy & Commercial Model Design',
                'category' => 'Fintech',
                'slug' => 'strategy-commercial-model-design',
                'description' => 'Designing robust commercial models, revenue strategies, and business architecture for fintech ventures.',
                'icon' => 'BarChart2',
            ],
            [
                'title' => 'Product & Go-to-Market Advisory',
                'category' => 'Fintech',
                'slug' => 'product-go-to-market-advisory',
                'description' => 'Product strategy, market entry planning, and go-to-market execution for financial technology products.',
                'icon' => 'Rocket',
            ],
            [
                'title' => 'Risk, Compliance & Regulation',
                'category' => 'Fintech',
                'slug' => 'risk-compliance-regulation',
                'description' => 'Regulatory compliance, risk management frameworks, and licensing strategy for fintech companies.',
                'icon' => 'ShieldCheck',
            ],
            [
                'title' => 'Financial & Capital Advisory',
                'category' => 'Fintech',
                'slug' => 'financial-capital-advisory',
                'description' => 'Capital raising, investor relations, and financial structuring for fintech growth and expansion.',
                'icon' => 'DollarSign',
            ],
            [
                'title' => 'Data, Payment & Infrastructure Advisory',
                'category' => 'Fintech',
                'slug' => 'data-payment-infrastructure-advisory',
                'description' => 'Payment infrastructure design, data strategy, and technology architecture for financial platforms.',
                'icon' => 'Database',
            ],
            [
                'title' => 'M&A and Transaction Support',
                'category' => 'Fintech',
                'slug' => 'fintech-ma-transaction-support',
                'description' => 'Mergers, acquisitions, and strategic transaction support for fintech companies and investors.',
                'icon' => 'ArrowLeftRight',
            ],

            // === INTERNATIONAL DIPLOMACY ===
            [
                'title' => 'Strategic Government & Sovereign Engagement',
                'category' => 'International Diplomacy',
                'slug' => 'strategic-government-sovereign-engagement',
                'description' => 'Facilitating high-level government engagement, sovereign wealth fund advisory, and public-private partnerships.',
                'icon' => 'Globe',
            ],
            [
                'title' => 'Cross-border Deal Enablement',
                'category' => 'International Diplomacy',
                'slug' => 'cross-border-deal-enablement',
                'description' => 'Enabling complex cross-border transactions, trade facilitation, and international deal structuring.',
                'icon' => 'ArrowLeftRight',
            ],
            [
                'title' => 'Geopolitical & Policy Risk Advisory',
                'category' => 'International Diplomacy',
                'slug' => 'geopolitical-policy-risk-advisory',
                'description' => 'Geopolitical risk assessment, policy impact analysis, and strategic advisory for international operations.',
                'icon' => 'AlertTriangle',
            ],
            [
                'title' => 'Reputation & Trust Positioning',
                'category' => 'International Diplomacy',
                'slug' => 'reputation-trust-positioning',
                'description' => 'Building international credibility, trust positioning, and reputation management for governments and institutions.',
                'icon' => 'Award',
            ],
        ];

        // Truncate and re-seed for fresh data
        \App\Models\Service::truncate();

        foreach ($services as $service) {
            \App\Models\Service::create($service);
        }
    }
}
