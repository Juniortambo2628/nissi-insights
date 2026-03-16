<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Insight;
use App\Models\CaseStudy;
use App\Models\Service;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // ===================
        //  INSIGHTS (8 items)
        // ===================
        $insights = [
            [
                'title' => 'The Future of PPA Structures in European Energy Markets',
                'slug' => 'future-ppa-structures-europe',
                'category' => 'Energy',
                'excerpt' => 'Exploring how power purchase agreements are evolving amid regulatory shifts and the accelerating energy transition across European markets.',
                'content' => '<p>Power Purchase Agreements (PPAs) remain the cornerstone of renewable energy project finance. However, the European landscape is shifting dramatically. New regulations, grid constraints, and the emergence of corporate clean energy commitments are reshaping how PPAs are structured, priced, and risk-managed.</p><p>Our analysis examines the key trends: hybrid PPAs combining fixed and floating components, the rise of virtual PPAs for cross-border transactions, and the growing importance of shape risk management. We also look at how AI-driven forecasting is improving price curve modelling and reducing basis risk for both generators and offtakers.</p><p>For investors and developers, understanding these shifts is critical. The PPA market is maturing, and the winners will be those who adapt their structuring approach to the new reality of intermittent generation and dynamic pricing.</p>',
                'image' => 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
                'user_id' => 1,
                'is_published' => true,
                'published_at' => '2026-02-20',
            ],
            [
                'title' => 'Central Bank Digital Currencies: Implications for African Fintech',
                'slug' => 'cbdc-african-fintech-implications',
                'category' => 'Fintech',
                'excerpt' => 'How the rollout of CBDCs across Africa could reshape mobile money, cross-border payments, and financial inclusion strategies.',
                'content' => '<p>Central Bank Digital Currencies are moving from concept to reality across the African continent. Nigeria\'s eNaira, Ghana\'s e-Cedi pilot, and Kenya\'s CBDC research programme are all at various stages of development. For the fintech ecosystem, these developments present both opportunity and disruption.</p><p>Mobile money operators—which have been the primary vehicle for financial inclusion in Sub-Saharan Africa—face an existential question: will CBDCs complement or compete with existing mobile money infrastructure? Our research suggests a nuanced answer that depends heavily on implementation design, interoperability frameworks, and regulatory positioning.</p><p>For fintech companies operating in these markets, the strategic imperative is clear: engage early with central bank pilots, invest in interoperability technology, and position for a hybrid future where CBDCs and private payment rails coexist.</p>',
                'image' => 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
                'is_published' => true,
                'published_at' => '2026-02-18',
            ],
            [
                'title' => 'Geopolitical Risk and Commodity Supply Chains in 2026',
                'slug' => 'geopolitical-risk-commodity-supply-chains-2026',
                'category' => 'Market Analysis',
                'excerpt' => 'An assessment of how evolving geopolitical dynamics are reshaping commodity flows, trade routes, and strategic resource access.',
                'content' => '<p>The geopolitical landscape continues to reshape global commodity markets in ways that demand new analytical frameworks. Traditional supply chain models that assumed stable trade corridors and predictable regulatory environments are no longer sufficient.</p><p>Our 2026 outlook examines three critical dynamics: the reconfiguration of LNG trade flows following new terminal capacity in South Asia, the impact of critical mineral supply chain diversification policies on battery metals pricing, and the emerging role of sovereign wealth funds as strategic commodity buyers rather than passive investors.</p><p>Decision-makers need to integrate geopolitical scenario analysis into their commodity strategy. The cost of ignoring political risk in commodity markets has never been higher.</p>',
                'image' => 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
                'is_published' => true,
                'published_at' => '2026-02-15',
            ],
            [
                'title' => 'Embedded Finance: The Next Growth Frontier for B2B Platforms',
                'slug' => 'embedded-finance-b2b-growth',
                'category' => 'Fintech',
                'excerpt' => 'Why B2B platforms are increasingly embedding financial services into their value propositions, and what it means for traditional financial institutions.',
                'content' => '<p>Embedded finance—the integration of financial services directly into non-financial platforms—is no longer a consumer fintech phenomenon. B2B platforms across logistics, procurement, and enterprise software are rapidly embedding lending, payments, and insurance into their core offerings.</p><p>This shift is driven by powerful economic logic: platforms that embed financial services see 2-5x revenue per user increases and significantly higher retention rates. For B2B buyers, the benefit is equally compelling—access to financing at the point of need, streamlined payment workflows, and reduced friction in complex procurement processes.</p><p>However, execution requires careful navigation of regulatory requirements, credit risk management, and technology integration. Our analysis provides a framework for B2B platforms evaluating embedded finance strategies.</p>',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
                'is_published' => true,
                'published_at' => '2026-02-12',
            ],
            [
                'title' => 'Carbon Markets: Voluntary vs Compliance Convergence',
                'slug' => 'carbon-markets-convergence',
                'category' => 'Energy',
                'excerpt' => 'As voluntary and compliance carbon markets converge, we analyse the implications for pricing, integrity, and corporate strategy.',
                'content' => '<p>The long-anticipated convergence between voluntary and compliance carbon markets is beginning to materialise. Article 6 of the Paris Agreement, combined with proposals for mandatory climate disclosure, is creating a new market architecture that blurs the traditional boundaries.</p><p>For corporates, this convergence has significant strategic implications. Credit quality and provenance are becoming paramount, prices are likely to increase, and the distinction between offsetting and insetting is becoming more nuanced. Our analysis examines the key market dynamics, pricing trajectories, and risk factors that should inform corporate carbon strategy in 2026 and beyond.</p>',
                'image' => 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
                'is_published' => true,
                'published_at' => '2026-02-08',
            ],
            [
                'title' => 'Sovereign Debt Restructuring in Emerging Markets',
                'slug' => 'sovereign-debt-restructuring-emerging-markets',
                'category' => 'Diplomacy',
                'excerpt' => 'Lessons from recent sovereign debt restructurings and what they mean for investor protection, multilateral coordination, and market access.',
                'content' => '<p>Recent sovereign debt restructurings in Zambia, Sri Lanka, and Ghana have highlighted the inadequacy of existing frameworks for addressing debt distress in emerging markets. The Common Framework, designed to coordinate creditor responses, has delivered mixed results at best.</p><p>Our analysis examines the key lessons from these restructurings: the critical role of bilateral negotiations, the evolving position of Chinese lenders, and the impact on future market access for restructured sovereigns. We also assess the emerging tools—such as climate-linked debt instruments and GDP-linked bonds—that could reshape how sovereign debt is structured for climate-vulnerable economies.</p>',
                'image' => 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
                'is_published' => true,
                'published_at' => '2026-02-05',
            ],
            [
                'title' => 'Hydrogen Economy: Investment Outlook and Market Readiness',
                'slug' => 'hydrogen-economy-investment-outlook',
                'category' => 'Energy',
                'excerpt' => 'Assessing the investment case for green hydrogen projects and the infrastructure requirements for a viable hydrogen economy.',
                'content' => '<p>The hydrogen economy remains one of the most debated topics in energy transition investment. While government subsidies and targets have accelerated project development, fundamental questions about cost competitiveness, infrastructure readiness, and end-use demand remain.</p><p>Our investment outlook examines the realistic timeline for green hydrogen cost parity, the critical role of electrolyser manufacturing scale-up, and the sectors where hydrogen offers compelling advantages over direct electrification. We conclude that selective, corridor-based hydrogen investments offer the best risk-adjusted returns, while hub-and-spoke distribution models face significant infrastructure challenges.</p>',
                'image' => 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&q=80',
                'is_published' => true,
                'published_at' => '2026-01-28',
            ],
            [
                'title' => 'RegTech Adoption in African Banking',
                'slug' => 'regtech-adoption-african-banking',
                'category' => 'Fintech',
                'excerpt' => 'How African banks are leveraging regulatory technology to navigate compliance complexity and reduce operational costs.',
                'content' => '<p>African banking is at an inflection point for regulatory technology adoption. Rising compliance costs, cross-border regulatory harmonisation efforts, and the digitisation of central bank supervision are creating powerful incentives for RegTech investment.</p><p>Our analysis profiles the key RegTech categories gaining traction—KYC/AML automation, real-time transaction monitoring, and regulatory reporting platforms—and examines the unique challenges of deploying these solutions in markets with fragmented data infrastructure and evolving regulatory frameworks.</p>',
                'image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
                'is_published' => true,
                'published_at' => '2026-01-20',
            ],
        ];

        foreach ($insights as $data) {
            $data['user_id'] = 1;
            Insight::updateOrCreate(['slug' => $data['slug']], $data);
        }

        // ======================
        //  CASE STUDIES (6 items)
        // ======================
        $caseStudies = [
            [
                'title' => 'PPA Structuring for 250MW Solar Portfolio',
                'slug' => 'ppa-structuring-250mw-solar',
                'client_name' => 'Global Energy Partners',
                'significant_figure' => '£180M PPA Portfolio',
                'problem' => 'A major renewable energy developer needed to structure a complex multi-offtaker PPA for a 250MW solar portfolio spanning three jurisdictions, each with distinct regulatory frameworks and grid connection requirements.',
                'methodology' => 'We conducted comprehensive market analysis, regulatory review across all three jurisdictions, and developed bespoke PPA structures combining fixed-floor and indexed pricing mechanisms. Our team provided end-to-end advisory from term sheet negotiation to financial close.',
                'outcome' => 'Successfully structured and closed a £180M PPA portfolio with a blended price 12% above market benchmarks, achieving investment-grade credit ratings across all three tranches.',
                'image' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
                'is_featured' => true,
            ],
            [
                'title' => 'Digital Banking License Strategy for West Africa',
                'slug' => 'digital-banking-license-west-africa',
                'client_name' => 'AfriPay Technologies',
                'significant_figure' => '500k+ Active Users',
                'problem' => 'A leading fintech company sought to obtain digital banking licenses across four West African markets simultaneously, navigating complex regulatory environments and demonstrating compliance readiness.',
                'methodology' => 'Our advisory team developed a comprehensive regulatory strategy, managed stakeholder engagement with central banks, prepared capital adequacy models, and designed compliance frameworks tailored to each jurisdiction\'s requirements.',
                'outcome' => 'Secured digital banking licenses in all four target markets within 14 months—40% faster than industry average. The client launched operations serving 500,000+ customers in the first year.',
                'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
                'is_featured' => true,
            ],
            [
                'title' => 'Cross-Border Investment Facilitation: Kenya-UAE Corridor',
                'slug' => 'cross-border-investment-kenya-uae',
                'client_name' => 'Sovereign Partners Advisory',
                'significant_figure' => '$200M Strategic Inflow',
                'problem' => 'A sovereign wealth fund sought to deploy $200M into East African infrastructure but lacked the local intelligence, government relationships, and risk assessment frameworks necessary for confident capital deployment.',
                'methodology' => 'We provided comprehensive country risk assessments, facilitated government-to-government dialogue, identified and vetted co-investment partners, and structured investment vehicles with appropriate political risk insurance.',
                'outcome' => 'Successfully facilitated $200M in infrastructure investment across three sectors (energy, transport, digital) with expected risk-adjusted returns of 14-18% IRR.',
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
                'is_featured' => true,
            ],
            [
                'title' => 'Carbon Credit Portfolio Valuation & Strategy',
                'slug' => 'carbon-credit-portfolio-valuation',
                'client_name' => 'Nordic Climate Fund',
                'significant_figure' => '22% Portfolio Growth',
                'problem' => 'A climate-focused investment fund needed independent valuation and strategic advice for a $45M portfolio of voluntary carbon credits across forestry, renewable energy, and cookstove projects.',
                'methodology' => 'We developed a proprietary valuation framework incorporating credit quality, vintage risk, methodology integrity, and market pricing dynamics. This was complemented by project-level due diligence and scenario-based risk analysis.',
                'outcome' => 'Identified $8M in potential portfolio write-downs from low-quality credits while recommending strategic acquisitions that increased portfolio value by 22% within 12 months.',
                'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
                'is_featured' => false,
            ],
            [
                'title' => 'Payment Infrastructure Design for SADC Region',
                'slug' => 'payment-infrastructure-sadc',
                'client_name' => 'Pan-African Payments Ltd',
                'significant_figure' => '8-Nation Interoperability',
                'problem' => 'A payments company needed to design cross-border payment infrastructure connecting eight SADC countries, requiring interoperability with diverse national payment systems and compliance with multiple regulatory regimes.',
                'methodology' => 'Our fintech advisory team conducted detailed technology assessments, designed API-first architecture specifications, developed regulatory compliance matrices, and facilitated central bank engagement across all target markets.',
                'outcome' => 'Delivered a comprehensive infrastructure blueprint that reduced projected settlement times from 3-5 days to real-time, while achieving full regulatory approval across all eight markets.',
                'image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
                'is_featured' => false,
            ],
            [
                'title' => 'LNG Terminal Due Diligence & Investment Advisory',
                'slug' => 'lng-terminal-due-diligence',
                'client_name' => 'Maritime Energy Corp',
                'significant_figure' => '$150M Capital Saving',
                'problem' => 'A consortium of investors required comprehensive technical, commercial, and regulatory due diligence for a $1.2B floating LNG import terminal in Southeast Asia.',
                'methodology' => 'We assembled a specialist team covering marine engineering assessment, commercial modelling of gas supply and demand balances, regulatory risk analysis, and political economy assessment of the host country energy sector.',
                'outcome' => 'Due diligence identified critical commercial risks that led to a restructured deal saving $150M in projected costs, ultimately achieving financial close with 6 international lenders.',
                'image' => 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80',
                'is_featured' => true,
            ],
        ];

        foreach ($caseStudies as $data) {
            CaseStudy::updateOrCreate(['slug' => $data['slug']], $data);
        }

        // ======================
        //  SERVICES (15+ items)
        // ======================
        $services = [
            // Energy Advisory
            [
                'title' => 'PPA Structuring & Negotiation',
                'slug' => 'ppa-structuring-negotiation',
                'category' => 'Energy Advisory',
                'description' => 'Expert advisory on structuring, negotiating, and optimising Power Purchase Agreements for renewable energy projects.',
                'content' => 'We provide end-to-end PPA advisory services covering term sheet design, pricing mechanism selection, risk allocation, bankability assessment, and counterparty credit evaluation. Our team has structured PPAs across solar, wind, and battery storage projects in over 20 countries.',
                'icon' => 'Zap',
                'is_active' => true,
            ],
            [
                'title' => 'Due Diligence & Market Entry',
                'slug' => 'due-diligence-market-entry',
                'category' => 'Energy Advisory',
                'description' => 'Comprehensive due diligence services for energy investments, including market screening, technical assessment, and regulatory analysis.',
                'content' => 'Our due diligence practice covers technical, commercial, regulatory, and environmental assessment of energy assets and projects. We support investors, developers, and lenders with detailed analysis that enables confident capital deployment.',
                'icon' => 'Search',
                'is_active' => true,
            ],
            [
                'title' => 'Carbon Markets & ESG Advisory',
                'slug' => 'carbon-markets-esg-advisory',
                'category' => 'Energy Advisory',
                'description' => 'Strategic advisory on carbon credit markets, ESG frameworks, and sustainability-linked financial instruments.',
                'content' => 'We help organisations navigate the evolving carbon market landscape, including voluntary and compliance markets, Article 6 mechanisms, and corporate sustainability commitments. Our advisory covers credit origination, portfolio strategy, and ESG reporting.',
                'icon' => 'Leaf',
                'is_active' => true,
            ],
            [
                'title' => 'Route to Market Strategy',
                'slug' => 'route-to-market-strategy',
                'category' => 'Energy Advisory',
                'description' => 'Developing and executing route-to-market strategies for energy commodities including renewables, gas, and power.',
                'content' => 'We design and implement route-to-market strategies for energy developers, traders, and investors. Our approach covers market timing, offtaker identification, pricing optimisation, and contract structuring.',
                'icon' => 'TrendingUp',
                'is_active' => true,
            ],
            [
                'title' => 'Energy Storage & Grid Solutions',
                'slug' => 'energy-storage-grid-solutions',
                'category' => 'Energy Advisory',
                'description' => 'Advisory on battery storage systems, grid integration, and smart energy solutions for the evolving electricity market.',
                'content' => 'Our grid solutions advisory covers battery energy storage systems, demand response programmes, virtual power plants, and innovative grid balancing mechanisms. We support both developers seeking to optimise revenue and utilities managing system integration.',
                'icon' => 'Battery',
                'is_active' => true,
            ],
            [
                'title' => 'Hydrogen & Future Fuels',
                'slug' => 'hydrogen-future-fuels',
                'category' => 'Energy Advisory',
                'description' => 'Investment and strategy advisory for hydrogen, ammonia, and sustainable aviation fuel projects.',
                'content' => 'We provide advisory services across the hydrogen value chain—from production and storage to transport and end-use applications. Our team supports project developers, investors, and government agencies with feasibility studies, market assessments, and investment structuring.',
                'icon' => 'Flame',
                'is_active' => true,
            ],
            [
                'title' => 'Energy Regulation & Policy',
                'slug' => 'energy-regulation-policy',
                'category' => 'Energy Advisory',
                'description' => 'Advisory on energy regulation, policy frameworks, and government relations for market participants.',
                'content' => 'Our regulatory advisory practice helps energy companies navigate complex regulatory landscapes, anticipate policy changes, and engage effectively with government and regulatory bodies across multiple jurisdictions.',
                'icon' => 'Scale',
                'is_active' => true,
            ],
            [
                'title' => 'Portfolio & Risk Management',
                'slug' => 'portfolio-risk-management-energy',
                'category' => 'Energy Advisory',
                'description' => 'Quantitative risk management and portfolio optimisation services for energy asset portfolios.',
                'content' => 'We provide advanced analytics and risk management frameworks for energy portfolios, covering market risk, credit risk, operational risk, and regulatory risk. Our quantitative tools help asset managers and traders make data-driven decisions.',
                'icon' => 'Shield',
                'is_active' => true,
            ],
            // Fintech
            [
                'title' => 'Digital Payments Strategy',
                'slug' => 'digital-payments-strategy',
                'category' => 'Fintech',
                'description' => 'End-to-end advisory for digital payment platforms, including licensing, product design, and go-to-market strategy.',
                'content' => 'We help fintech companies design and launch digital payment solutions across mobile money, card payments, and real-time payment rails. Our advisory covers regulatory strategy, product architecture, risk management, and distribution partnerships.',
                'icon' => 'CreditCard',
                'is_active' => true,
            ],
            [
                'title' => 'Embedded Finance & Lending',
                'slug' => 'embedded-finance-lending',
                'category' => 'Fintech',
                'description' => 'Advisory on embedded lending products, credit scoring, and financial service integration for B2B and B2C platforms.',
                'content' => 'We guide platforms through the complexities of embedded lending—from credit model design and regulatory compliance to technology integration and capital sourcing. Our experience spans consumer lending, SME finance, and supply chain financing.',
                'icon' => 'Landmark',
                'is_active' => true,
            ],
            [
                'title' => 'Regulatory & Compliance Advisory',
                'slug' => 'regulatory-compliance-fintech',
                'category' => 'Fintech',
                'description' => 'Navigating complex regulatory landscapes for fintech companies across banking, payments, and securities.',
                'content' => 'Our regulatory advisory practice helps fintech companies understand, prepare for, and comply with regulatory requirements across multiple jurisdictions. We cover licensing, AML/KYC frameworks, data protection, and ongoing compliance management.',
                'icon' => 'FileCheck',
                'is_active' => true,
            ],
            [
                'title' => 'Blockchain & Digital Assets',
                'slug' => 'blockchain-digital-assets',
                'category' => 'Fintech',
                'description' => 'Strategy and regulatory advisory for blockchain-based financial services, tokenisation, and digital asset management.',
                'content' => 'We provide strategic advisory on blockchain applications in financial services, including tokenised securities, DeFi protocols, stablecoin frameworks, and central bank digital currencies. Our approach balances innovation with regulatory compliance.',
                'icon' => 'Link',
                'is_active' => true,
            ],
            [
                'title' => 'Capital Raising & Investor Relations',
                'slug' => 'capital-raising-fintech',
                'category' => 'Fintech',
                'description' => 'Supporting fintech companies with fundraising strategy, investor preparation, and capital structure optimisation.',
                'content' => 'We help growth-stage fintech companies navigate the fundraising process—from strategy development and investor targeting to due diligence preparation and term sheet negotiation. Our network spans VCs, PE firms, and strategic investors focused on financial services.',
                'icon' => 'TrendingUp',
                'is_active' => true,
            ],
            [
                'title' => 'Data & Payment Infrastructure',
                'slug' => 'data-payment-infrastructure',
                'category' => 'Fintech',
                'description' => 'Technical advisory on payment infrastructure design, data architecture, and API strategy for financial services.',
                'content' => 'We advise on the technical architecture of payment systems, data management frameworks, and API strategies that underpin modern financial services platforms. Our work covers core banking integration, real-time settlement systems, and cross-border payment rails.',
                'icon' => 'Database',
                'is_active' => true,
            ],
            // International Diplomacy
            [
                'title' => 'Strategic Government Engagement',
                'slug' => 'strategic-government-engagement',
                'category' => 'International Diplomacy',
                'description' => 'Facilitating government-to-government dialogue and institutional engagement for cross-border commercial activities.',
                'content' => 'We facilitate strategic engagement between corporate clients, sovereign wealth funds, and government institutions. Our approach covers stakeholder mapping, diplomatic protocol, policy alignment, and sustained relationship management across multiple jurisdictions.',
                'icon' => 'Users',
                'is_active' => true,
            ],
            [
                'title' => 'Cross-Border Deal Enablement',
                'slug' => 'cross-border-deal-enablement',
                'category' => 'International Diplomacy',
                'description' => 'Providing intelligence and facilitation services for complex cross-border transactions and investment flows.',
                'content' => 'We support investors and corporates with the intelligence, relationships, and risk assessment frameworks needed to execute cross-border transactions in complex markets. Our services cover political risk analysis, partner vetting, and deal structuring.',
                'icon' => 'Globe',
                'is_active' => true,
            ],
            [
                'title' => 'Geopolitical & Policy Risk Advisory',
                'slug' => 'geopolitical-policy-risk-advisory',
                'category' => 'International Diplomacy',
                'description' => 'Analysing geopolitical dynamics, policy risk, and regulatory trends that affect investment and commercial decisions.',
                'content' => 'Our geopolitical advisory practice provides scenario-based analysis of political risk, regulatory change, and policy trends. We help clients integrate geopolitical intelligence into investment decisions, strategic planning, and risk management frameworks.',
                'icon' => 'AlertTriangle',
                'is_active' => true,
            ],
            [
                'title' => 'Reputation & Trust Positioning',
                'slug' => 'reputation-trust-positioning',
                'category' => 'International Diplomacy',
                'description' => 'Advisory on international reputation management, institutional trust-building, and stakeholder communications.',
                'content' => 'We help organisations build and maintain trust with sovereign counterparts, regulatory bodies, and international institutions. Our advisory covers strategic communications, ESG narrative development, and reputation risk management in sensitive markets.',
                'icon' => 'Award',
                'is_active' => true,
            ],
            [
                'title' => 'Multilateral & Development Finance',
                'slug' => 'multilateral-development-finance',
                'category' => 'International Diplomacy',
                'description' => 'Advisory on engaging with multilateral development banks, DFIs, and international development agencies.',
                'content' => 'We help clients navigate the complex landscape of multilateral and development finance institutions—from project preparation and application strategy to compliance and reporting requirements. Our network spans the World Bank, IFC, AfDB, and major bilateral DFIs.',
                'icon' => 'Building',
                'is_active' => true,
            ],
        ];

        foreach ($services as $data) {
            Service::updateOrCreate(['slug' => $data['slug']], $data);
        }

        $this->command->info('Content seeded: ' . count($insights) . ' insights, ' . count($caseStudies) . ' case studies, ' . count($services) . ' services.');
    }
}
