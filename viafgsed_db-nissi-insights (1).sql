-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 17, 2026 at 05:28 PM
-- Server version: 8.0.42
-- PHP Version: 8.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `viafgsed_db-nissi-insights`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `case_studies`
--

CREATE TABLE `case_studies` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `significant_figure` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `problem` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `methodology` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `outcome` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `case_studies`
--

INSERT INTO `case_studies` (`id`, `title`, `slug`, `client_name`, `significant_figure`, `problem`, `methodology`, `outcome`, `image`, `is_featured`, `created_at`, `updated_at`) VALUES
(1, 'PPA Structuring for 250MW Solar Portfolio', 'ppa-structuring-for-250mw-solar-portfolio', 'Global Energy Partners', '£180M PPA Portfolio', '<p>A <strong>major renewable energy </strong>developer needed to structure a complex multi-offtaker PPA for a 250MW solar portfolio spanning three jurisdictions, each with distinct regulatory frameworks and grid connection requirements.</p>', 'We conducted comprehensive market analysis, regulatory review across all three jurisdictions, and developed bespoke PPA structures combining fixed-floor and indexed pricing mechanisms. Our team provided end-to-end advisory from term sheet negotiation to financial close.', '<p>Successfully structured and closed a<strong> £180M PPA portfolio</strong> with a blended price 12% above market benchmarks, achieving investment-grade credit ratings across all three tranches.</p>', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80', 1, '2026-02-25 17:40:19', '2026-03-09 11:47:27'),
(2, 'Digital Banking License Strategy for West Africa', 'digital-banking-license-west-africa', 'AfriPay Technologies', '500k+ Active Users', 'A leading fintech company sought to obtain digital banking licenses across four West African markets simultaneously, navigating complex regulatory environments and demonstrating compliance readiness.', 'Our advisory team developed a comprehensive regulatory strategy, managed stakeholder engagement with central banks, prepared capital adequacy models, and designed compliance frameworks tailored to each jurisdiction\'s requirements.', 'Secured digital banking licenses in all four target markets within 14 months—40% faster than industry average. The client launched operations serving 500,000+ customers in the first year.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 1, '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(3, 'Cross-Border Investment Facilitation: Kenya-UAE Corridor', 'cross-border-investment-kenya-uae', 'Sovereign Partners Advisory', '$200M Strategic Inflow', 'A sovereign wealth fund sought to deploy $200M into East African infrastructure but lacked the local intelligence, government relationships, and risk assessment frameworks necessary for confident capital deployment.', 'We provided comprehensive country risk assessments, facilitated government-to-government dialogue, identified and vetted co-investment partners, and structured investment vehicles with appropriate political risk insurance.', 'Successfully facilitated $200M in infrastructure investment across three sectors (energy, transport, digital) with expected risk-adjusted returns of 14-18% IRR.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', 1, '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(4, 'Carbon Credit Portfolio Valuation & Strategy', 'carbon-credit-portfolio-valuation', 'Nordic Climate Fund', '22% Portfolio Growth', 'A climate-focused investment fund needed independent valuation and strategic advice for a $45M portfolio of voluntary carbon credits across forestry, renewable energy, and cookstove projects.', 'We developed a proprietary valuation framework incorporating credit quality, vintage risk, methodology integrity, and market pricing dynamics. This was complemented by project-level due diligence and scenario-based risk analysis.', 'Identified $8M in potential portfolio write-downs from low-quality credits while recommending strategic acquisitions that increased portfolio value by 22% within 12 months.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', 0, '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(5, 'Payment Infrastructure Design for SADC Region', 'payment-infrastructure-sadc', 'Pan-African Payments Ltd', '8-Nation Interoperability', 'A payments company needed to design cross-border payment infrastructure connecting eight SADC countries, requiring interoperability with diverse national payment systems and compliance with multiple regulatory regimes.', 'Our fintech advisory team conducted detailed technology assessments, designed API-first architecture specifications, developed regulatory compliance matrices, and facilitated central bank engagement across all target markets.', 'Delivered a comprehensive infrastructure blueprint that reduced projected settlement times from 3-5 days to real-time, while achieving full regulatory approval across all eight markets.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', 0, '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(6, 'LNG Terminal Due Diligence & Investment Advisory', 'lng-terminal-due-diligence', 'Maritime Energy Corp', '$150M Capital Saving', 'A consortium of investors required comprehensive technical, commercial, and regulatory due diligence for a $1.2B floating LNG import terminal in Southeast Asia.', 'We assembled a specialist team covering marine engineering assessment, commercial modelling of gas supply and demand balances, regulatory risk analysis, and political economy assessment of the host country energy sector.', 'Due diligence identified critical commercial risks that led to a restructured deal saving $150M in projected costs, ultimately achieving financial close with 6 international lenders.', 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80', 1, '2026-02-25 17:40:19', '2026-02-25 18:37:23');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `logo`, `website`, `is_active`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Nissi Insights Client - 1', 'http://localhost:8000/storage/uploads/RUe1W3g9oJp9Yancv8ux91jOLWT954x0F0dVRNtL.png', NULL, 1, 1, '2026-02-25 16:44:43', '2026-02-27 06:48:10'),
(2, 'Nissi Insights Client -3', 'http://localhost:8000/storage/uploads/nodWxRuHdoIhjlBdmZdFFdoinpvjvQ4I59u6qJv2.png', NULL, 1, 2, '2026-02-25 16:44:43', '2026-02-27 06:48:32'),
(3, 'Nissi Insights Client - 5', 'http://localhost:8000/storage/uploads/opTNivVordLdnp31YA3qDqVVqJ2JMCWOk4CrIyGt.png', NULL, 1, 3, '2026-02-25 16:44:43', '2026-02-27 06:48:54'),
(4, 'Nissi Insights Client - 7', 'http://localhost:8000/storage/uploads/qqm7uh4QYy15MIJkhKMcEavQ3PhP1LFA4vLw9Ju4.png', NULL, 1, 4, '2026-02-25 16:44:43', '2026-02-27 06:49:13'),
(5, 'Nissi Insights Client - 9', 'http://localhost:8000/storage/uploads/8iZZKgy09VXQF78g0kZdFYhvtNWGEQEYJTZUGZLB.png', NULL, 1, 5, '2026-02-25 16:44:43', '2026-02-27 06:49:32'),
(6, 'Nissi Insights Client - 10', 'http://localhost:8000/storage/uploads/dNOJAT4M7vBVXZmMCGW9jpIfkVioLkRwueUv3o01.png', NULL, 1, 5, '2026-02-25 16:44:43', '2026-02-27 06:49:43'),
(9, 'Nissi Insights Client - 2', 'http://localhost:8000/storage/uploads/uy7PvHtftV1rWwIyS4aMAPqp3uYUMQmrDN8nCpkm.png', NULL, 1, 1, '2026-02-25 16:59:08', '2026-02-27 06:48:23'),
(10, 'Nissi Insights Client - 4', 'http://localhost:8000/storage/uploads/bhICGUtPdAgnJeoEDmJty4NMWfMpZW7i8nKFGiAx.png', NULL, 1, 2, '2026-02-25 16:59:08', '2026-02-27 06:48:44'),
(11, 'Nissi Insights Client - 6', 'http://localhost:8000/storage/uploads/1DegMSBtNijLfujbuzRG8WzK3h6oOGRE9wN4rMRC.png', NULL, 1, 3, '2026-02-25 16:59:08', '2026-02-27 06:49:04'),
(12, 'Nissi Insights Client - 8', 'http://localhost:8000/storage/uploads/jDD5cEwG9hlRYfZYsSzzoQLBAjGRKgFZEhU7fWmU.png', NULL, 1, 4, '2026-02-25 16:59:08', '2026-02-27 06:49:23');

-- --------------------------------------------------------

--
-- Table structure for table `consultation_requests`
--

CREATE TABLE `consultation_requests` (
  `id` bigint UNSIGNED NOT NULL,
  `first_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `consultation_requests`
--

INSERT INTO `consultation_requests` (`id`, `first_name`, `last_name`, `email`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Kevin', 'Tambo', 'juniortambo2628@gmail.com', 'Fintech & Digital Assets', 'Organisation: OKJTechnologies\nObjective: This is a test  for submission of the consultation form,\nTimeframe: Urgent (Within 48 hours)', 'pending', '2026-03-10 23:02:37', '2026-03-10 23:02:37'),
(2, 'Kevin', 'Junior', 'kevinjtambo@gmail.com', 'Fintech & Digital Assets', 'Organisation: OKJTech\nObjective: This is another test for the consultation form submission. \nTimeframe: Urgent (Within 48 hours)', 'pending', '2026-03-10 23:03:47', '2026-03-10 23:03:47'),
(3, 'chrispine', 'marvine', 'marvinechrispine@outlook.com', 'Other', 'Test', 'pending', '2026-03-16 17:57:41', '2026-03-16 17:57:41'),
(4, 'Kevin', 'Tambo', 'juniortambo2628@gmail.com', 'Infrastructure & PPP', 'Organisation: OKJTechnologies\nObjective: Email Test\nTimeframe: Urgent (Within 48 hours)', 'pending', '2026-03-17 09:47:57', '2026-03-17 09:47:57');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `insights`
--

CREATE TABLE `insights` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `excerpt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `insights`
--

INSERT INTO `insights` (`id`, `title`, `slug`, `category`, `excerpt`, `content`, `image`, `user_id`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'The Future of PPA Structures in European Energy Markets', 'future-ppa-structures-europe', 'Energy', 'Exploring how power purchase agreements are evolving amid regulatory shifts and the accelerating energy transition across European markets.', '<p>Power Purchase Agreements (PPAs) remain the cornerstone of renewable energy project finance. However, the European landscape is shifting dramatically. New regulations, grid constraints, and the emergence of corporate clean energy commitments are reshaping how PPAs are structured, priced, and risk-managed.</p><p>Our analysis examines the key trends: hybrid PPAs combining fixed and floating components, the rise of virtual PPAs for cross-border transactions, and the growing importance of shape risk management. We also look at how AI-driven forecasting is improving price curve modelling and reducing basis risk for both generators and offtakers.</p><p>For investors and developers, understanding these shifts is critical. The PPA market is maturing, and the winners will be those who adapt their structuring approach to the new reality of intermittent generation and dynamic pricing.</p>', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80', 1, 1, '2026-02-19 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(2, 'Central Bank Digital Currencies: Implications for African Fintech', 'cbdc-african-fintech-implications', 'Fintech', 'How the rollout of CBDCs across Africa could reshape mobile money, cross-border payments, and financial inclusion strategies.', '<p>Central Bank Digital Currencies are moving from concept to reality across the African continent. Nigeria\'s eNaira, Ghana\'s e-Cedi pilot, and Kenya\'s CBDC research programme are all at various stages of development. For the fintech ecosystem, these developments present both opportunity and disruption.</p><p>Mobile money operators—which have been the primary vehicle for financial inclusion in Sub-Saharan Africa—face an existential question: will CBDCs complement or compete with existing mobile money infrastructure? Our research suggests a nuanced answer that depends heavily on implementation design, interoperability frameworks, and regulatory positioning.</p><p>For fintech companies operating in these markets, the strategic imperative is clear: engage early with central bank pilots, invest in interoperability technology, and position for a hybrid future where CBDCs and private payment rails coexist.</p>', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80', 1, 1, '2026-02-17 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(3, 'Geopolitical Risk and Commodity Supply Chains in 2026', 'geopolitical-risk-commodity-supply-chains-2026', 'Market Analysis', 'An assessment of how evolving geopolitical dynamics are reshaping commodity flows, trade routes, and strategic resource access.', '<p>The geopolitical landscape continues to reshape global commodity markets in ways that demand new analytical frameworks. Traditional supply chain models that assumed stable trade corridors and predictable regulatory environments are no longer sufficient.</p><p>Our 2026 outlook examines three critical dynamics: the reconfiguration of LNG trade flows following new terminal capacity in South Asia, the impact of critical mineral supply chain diversification policies on battery metals pricing, and the emerging role of sovereign wealth funds as strategic commodity buyers rather than passive investors.</p><p>Decision-makers need to integrate geopolitical scenario analysis into their commodity strategy. The cost of ignoring political risk in commodity markets has never been higher.</p>', 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80', 1, 1, '2026-02-14 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(4, 'Embedded Finance: The Next Growth Frontier for B2B Platforms', 'embedded-finance-b2b-growth', 'Fintech', 'Why B2B platforms are increasingly embedding financial services into their value propositions, and what it means for traditional financial institutions.', '<p>Embedded finance—the integration of financial services directly into non-financial platforms—is no longer a consumer fintech phenomenon. B2B platforms across logistics, procurement, and enterprise software are rapidly embedding lending, payments, and insurance into their core offerings.</p><p>This shift is driven by powerful economic logic: platforms that embed financial services see 2-5x revenue per user increases and significantly higher retention rates. For B2B buyers, the benefit is equally compelling—access to financing at the point of need, streamlined payment workflows, and reduced friction in complex procurement processes.</p><p>However, execution requires careful navigation of regulatory requirements, credit risk management, and technology integration. Our analysis provides a framework for B2B platforms evaluating embedded finance strategies.</p>', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 1, 1, '2026-02-11 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(5, 'Carbon Markets: Voluntary vs Compliance Convergence', 'carbon-markets-convergence', 'Energy', 'As voluntary and compliance carbon markets converge, we analyse the implications for pricing, integrity, and corporate strategy.', '<p>The long-anticipated convergence between voluntary and compliance carbon markets is beginning to materialise. Article 6 of the Paris Agreement, combined with proposals for mandatory climate disclosure, is creating a new market architecture that blurs the traditional boundaries.</p><p>For corporates, this convergence has significant strategic implications. Credit quality and provenance are becoming paramount, prices are likely to increase, and the distinction between offsetting and insetting is becoming more nuanced. Our analysis examines the key market dynamics, pricing trajectories, and risk factors that should inform corporate carbon strategy in 2026 and beyond.</p>', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80', 1, 1, '2026-02-07 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(6, 'Sovereign Debt Restructuring in Emerging Markets', 'sovereign-debt-restructuring-emerging-markets', 'Diplomacy', 'Lessons from recent sovereign debt restructurings and what they mean for investor protection, multilateral coordination, and market access.', '<p>Recent sovereign debt restructurings in Zambia, Sri Lanka, and Ghana have highlighted the inadequacy of existing frameworks for addressing debt distress in emerging markets. The Common Framework, designed to coordinate creditor responses, has delivered mixed results at best.</p><p>Our analysis examines the key lessons from these restructurings: the critical role of bilateral negotiations, the evolving position of Chinese lenders, and the impact on future market access for restructured sovereigns. We also assess the emerging tools—such as climate-linked debt instruments and GDP-linked bonds—that could reshape how sovereign debt is structured for climate-vulnerable economies.</p>', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80', 1, 1, '2026-02-04 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(7, 'Hydrogen Economy: Investment Outlook and Market Readiness', 'hydrogen-economy-investment-outlook', 'Energy', 'Assessing the investment case for green hydrogen projects and the infrastructure requirements for a viable hydrogen economy.', '<p>The hydrogen economy remains one of the most debated topics in energy transition investment. While government subsidies and targets have accelerated project development, fundamental questions about cost competitiveness, infrastructure readiness, and end-use demand remain.</p><p>Our investment outlook examines the realistic timeline for green hydrogen cost parity, the critical role of electrolyser manufacturing scale-up, and the sectors where hydrogen offers compelling advantages over direct electrification. We conclude that selective, corridor-based hydrogen investments offer the best risk-adjusted returns, while hub-and-spoke distribution models face significant infrastructure challenges.</p>', 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&q=80', 1, 1, '2026-01-27 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23'),
(8, 'RegTech Adoption in African Banking', 'regtech-adoption-african-banking', 'Fintech', 'How African banks are leveraging regulatory technology to navigate compliance complexity and reduce operational costs.', '<p>African banking is at an inflection point for regulatory technology adoption. Rising compliance costs, cross-border regulatory harmonisation efforts, and the digitisation of central bank supervision are creating powerful incentives for RegTech investment.</p><p>Our analysis profiles the key RegTech categories gaining traction—KYC/AML automation, real-time transaction monitoring, and regulatory reporting platforms—and examines the unique challenges of deploying these solutions in markets with fragmented data infrastructure and evolving regulatory frameworks.</p>', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', 1, 1, '2026-01-19 21:00:00', '2026-02-25 17:40:19', '2026-02-25 18:37:23');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_02_25_143311_create_services_table', 2),
(5, '2026_02_25_143312_create_insights_table', 2),
(6, '2026_02_25_143313_create_case_studies_table', 2),
(7, '2026_02_25_143314_create_stats_table', 2),
(8, '2026_02_25_143315_create_site_settings_table', 2),
(9, '2026_02_25_144448_create_personal_access_tokens_table', 3),
(10, '2026_02_25_194112_create_testimonials_table', 3),
(11, '2026_02_25_194134_create_clients_table', 3),
(12, '2026_02_25_194200_add_video_url_to_services_table', 3),
(13, '2026_02_25_213559_add_significant_figures_to_case_studies_table', 4),
(14, '2026_02_26_120000_create_page_views_table', 5),
(15, '2026_02_26_120001_create_subscribers_table', 5),
(16, '2026_03_09_145806_create_team_members_table', 6),
(17, '2026_03_09_145828_create_values_table', 7),
(18, '2026_03_09_145829_create_consultation_requests_table', 8),
(19, '2026_03_10_034415_create_rsvps_table', 9),
(20, '2026_03_10_045831_add_fields_to_rsvps_table', 10);

-- --------------------------------------------------------

--
-- Table structure for table `page_views`
--

CREATE TABLE `page_views` (
  `id` bigint UNSIGNED NOT NULL,
  `path` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referrer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `page_views`
--

INSERT INTO `page_views` (`id`, `path`, `referrer`, `user_agent`, `ip`, `country`, `created_at`, `updated_at`) VALUES
(1, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:19:35', '2026-02-27 08:19:35'),
(2, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:20:33', '2026-02-27 08:20:33'),
(3, '/services/due-diligence-strategy', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:35:10', '2026-02-27 08:35:10'),
(4, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:36:56', '2026-02-27 08:36:56'),
(5, '/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:38:46', '2026-02-27 08:38:46'),
(6, '/services/due-diligence-strategy', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:42:36', '2026-02-27 08:42:36'),
(7, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:42:58', '2026-02-27 08:42:58'),
(8, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:45:15', '2026-02-27 08:45:15'),
(9, '/case-studies/ppa-structuring-250mw-solar', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:46:53', '2026-02-27 08:46:53'),
(10, '/insights/future-ppa-structures-europe', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:47:30', '2026-02-27 08:47:30'),
(11, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:47:45', '2026-02-27 08:47:45'),
(12, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:48:03', '2026-02-27 08:48:03'),
(13, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:48:55', '2026-02-27 08:48:55'),
(14, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:49:52', '2026-02-27 08:49:52'),
(15, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:50:37', '2026-02-27 08:50:37'),
(16, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 08:50:52', '2026-02-27 08:50:52'),
(17, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:17:37', '2026-02-27 09:17:37'),
(18, '/insights/future-ppa-structures-europe', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:19:33', '2026-02-27 09:19:33'),
(19, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:19:42', '2026-02-27 09:19:42'),
(20, '/consultation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:33:02', '2026-02-27 09:33:02'),
(21, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:33:22', '2026-02-27 09:33:22'),
(22, '/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:37:28', '2026-02-27 09:37:28'),
(23, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:37:46', '2026-02-27 09:37:46'),
(24, '/case-studies/carbon-credit-portfolio-valuation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:40:03', '2026-02-27 09:40:03'),
(25, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-02-27 09:41:32', '2026-02-27 09:41:32'),
(26, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 15:55:21', '2026-03-04 15:55:21'),
(27, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:05:25', '2026-03-04 16:05:25'),
(28, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:07:42', '2026-03-04 16:07:42'),
(29, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:08:48', '2026-03-04 16:08:48'),
(30, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:12:42', '2026-03-04 16:12:42'),
(31, '/services/due-diligence-strategy', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:29:38', '2026-03-04 16:29:38'),
(32, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:30:25', '2026-03-04 16:30:25'),
(33, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:30:48', '2026-03-04 16:30:48'),
(34, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:31:12', '2026-03-04 16:31:12'),
(35, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:31:30', '2026-03-04 16:31:30'),
(36, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:36:17', '2026-03-04 16:36:17'),
(37, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:36:17', '2026-03-04 16:36:17'),
(38, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:36:55', '2026-03-04 16:36:55'),
(39, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:07', '2026-03-04 16:37:07'),
(40, '/admin/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:13', '2026-03-04 16:37:13'),
(41, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:19', '2026-03-04 16:37:19'),
(42, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:27', '2026-03-04 16:37:27'),
(43, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:34', '2026-03-04 16:37:34'),
(44, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:40', '2026-03-04 16:37:40'),
(45, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:48', '2026-03-04 16:37:48'),
(46, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:37:54', '2026-03-04 16:37:54'),
(47, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:38:17', '2026-03-04 16:38:17'),
(48, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-04 16:39:00', '2026-03-04 16:39:00'),
(49, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-09 03:53:01', '2026-03-09 03:53:01'),
(50, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-09 10:24:14', '2026-03-09 10:24:14'),
(51, '/admin/login', 'http://127.0.0.1:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:06:22', '2026-03-09 11:06:22'),
(52, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:06:30', '2026-03-09 11:06:30'),
(53, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:06:58', '2026-03-09 11:06:58'),
(54, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:07:05', '2026-03-09 11:07:05'),
(55, '/', 'http://127.0.0.1:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:08:40', '2026-03-09 11:08:40'),
(56, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:08:49', '2026-03-09 11:08:49'),
(57, '/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:09:03', '2026-03-09 11:09:03'),
(58, '/admin/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:09:26', '2026-03-09 11:09:26'),
(59, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:12:46', '2026-03-09 11:12:46'),
(60, '/client-impact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:12:53', '2026-03-09 11:12:53'),
(61, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:13:51', '2026-03-09 11:13:51'),
(62, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:14:31', '2026-03-09 11:14:31'),
(63, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:15:47', '2026-03-09 11:15:47'),
(64, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:18:22', '2026-03-09 11:18:22'),
(65, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:18:27', '2026-03-09 11:18:27'),
(66, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:24:12', '2026-03-09 11:24:12'),
(67, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:27:08', '2026-03-09 11:27:08'),
(68, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:34:19', '2026-03-09 11:34:19'),
(69, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:34:20', '2026-03-09 11:34:20'),
(70, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:36:33', '2026-03-09 11:36:33'),
(71, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:36:39', '2026-03-09 11:36:39'),
(72, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:41:06', '2026-03-09 11:41:06'),
(73, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:41:10', '2026-03-09 11:41:10'),
(74, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:41:15', '2026-03-09 11:41:15'),
(75, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:41:18', '2026-03-09 11:41:18'),
(76, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:41:23', '2026-03-09 11:41:23'),
(77, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:42:48', '2026-03-09 11:42:48'),
(78, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:42:53', '2026-03-09 11:42:53'),
(79, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:47:31', '2026-03-09 11:47:31'),
(80, '/admin/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:47:34', '2026-03-09 11:47:34'),
(81, '/client-impact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:47:44', '2026-03-09 11:47:44'),
(82, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:47:47', '2026-03-09 11:47:47'),
(83, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:47:48', '2026-03-09 11:47:48'),
(84, '/case-studies/ppa-structuring-for-250mw-solar-portfolio', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:48:07', '2026-03-09 11:48:07'),
(85, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:54:15', '2026-03-09 11:54:15'),
(86, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:54:29', '2026-03-09 11:54:29'),
(87, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:55:23', '2026-03-09 11:55:23'),
(88, '/client-impact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:55:25', '2026-03-09 11:55:25'),
(89, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 11:56:40', '2026-03-09 11:56:40'),
(90, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:08:41', '2026-03-09 12:08:41'),
(91, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:26:20', '2026-03-09 12:26:20'),
(92, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:31:02', '2026-03-09 12:31:02'),
(93, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:35:42', '2026-03-09 12:35:42'),
(94, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:37:45', '2026-03-09 12:37:45'),
(95, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:49:53', '2026-03-09 12:49:53'),
(96, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:49:58', '2026-03-09 12:49:58'),
(97, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:50:02', '2026-03-09 12:50:02'),
(98, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:53:55', '2026-03-09 12:53:55'),
(99, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 12:53:58', '2026-03-09 12:53:58'),
(100, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:07:47', '2026-03-09 13:07:47'),
(101, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:08:11', '2026-03-09 13:08:11'),
(102, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:19:27', '2026-03-09 13:19:27'),
(103, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:19:30', '2026-03-09 13:19:30'),
(104, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:19:42', '2026-03-09 13:19:42'),
(105, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:19:48', '2026-03-09 13:19:48'),
(106, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:20:19', '2026-03-09 13:20:19'),
(107, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:20:24', '2026-03-09 13:20:24'),
(108, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:20:25', '2026-03-09 13:20:25'),
(109, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:03', '2026-03-09 13:21:03'),
(110, '/admin/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:12', '2026-03-09 13:21:12'),
(111, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:18', '2026-03-09 13:21:18'),
(112, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:24', '2026-03-09 13:21:24'),
(113, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:26', '2026-03-09 13:21:26'),
(114, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:27', '2026-03-09 13:21:27'),
(115, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:32', '2026-03-09 13:21:32'),
(116, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:35', '2026-03-09 13:21:35'),
(117, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:37', '2026-03-09 13:21:37'),
(118, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:21:41', '2026-03-09 13:21:41'),
(119, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:23:40', '2026-03-09 13:23:40'),
(120, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:41:20', '2026-03-09 13:41:20'),
(121, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:41:26', '2026-03-09 13:41:26'),
(122, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:43:10', '2026-03-09 13:43:10'),
(123, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:43:57', '2026-03-09 13:43:57'),
(124, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:54:30', '2026-03-09 13:54:30'),
(125, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:57:03', '2026-03-09 13:57:03'),
(126, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:57:07', '2026-03-09 13:57:07'),
(127, '/consultation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 13:57:13', '2026-03-09 13:57:13'),
(128, '/consultation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:14:13', '2026-03-09 14:14:13'),
(129, '/case-studies/ppa-structuring-for-250mw-solar-portfolio', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:30:56', '2026-03-09 14:30:56'),
(130, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:31:41', '2026-03-09 14:31:41'),
(131, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:33:17', '2026-03-09 14:33:17'),
(132, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:33:25', '2026-03-09 14:33:25'),
(133, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:34:36', '2026-03-09 14:34:36'),
(134, '/consultation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:35:03', '2026-03-09 14:35:03'),
(135, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:36:08', '2026-03-09 14:36:08'),
(136, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:37:12', '2026-03-09 14:37:12'),
(137, '/consultation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:37:12', '2026-03-09 14:37:12'),
(138, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:39:20', '2026-03-09 14:39:20'),
(139, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:40:03', '2026-03-09 14:40:03'),
(140, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 14:58:19', '2026-03-09 14:58:19'),
(141, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:11:07', '2026-03-09 15:11:07'),
(142, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:12:23', '2026-03-09 15:12:23'),
(143, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:16:18', '2026-03-09 15:16:18'),
(144, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:20:35', '2026-03-09 15:20:35'),
(145, '/privacy', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:21:22', '2026-03-09 15:21:22'),
(146, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:22:30', '2026-03-09 15:22:30'),
(147, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:23:08', '2026-03-09 15:23:08'),
(148, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:24:20', '2026-03-09 15:24:20'),
(149, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:25:47', '2026-03-09 15:25:47'),
(150, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:26:32', '2026-03-09 15:26:32'),
(151, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:26:53', '2026-03-09 15:26:53'),
(152, '/terms', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:27:21', '2026-03-09 15:27:21'),
(153, '/cookies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:28:19', '2026-03-09 15:28:19'),
(154, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:29:05', '2026-03-09 15:29:05'),
(155, '/cookies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:29:33', '2026-03-09 15:29:33'),
(156, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:31:12', '2026-03-09 15:31:12'),
(157, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:31:25', '2026-03-09 15:31:25'),
(158, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:39:37', '2026-03-09 15:39:37'),
(159, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:39:56', '2026-03-09 15:39:56'),
(160, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:44:25', '2026-03-09 15:44:25'),
(161, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:48:23', '2026-03-09 15:48:23'),
(162, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:49:27', '2026-03-09 15:49:27'),
(163, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:49:43', '2026-03-09 15:49:43'),
(164, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:55:40', '2026-03-09 15:55:40'),
(165, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:55:40', '2026-03-09 15:55:40'),
(166, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:55:41', '2026-03-09 15:55:41'),
(167, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:55:43', '2026-03-09 15:55:43'),
(168, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:56:04', '2026-03-09 15:56:04'),
(169, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:56:48', '2026-03-09 15:56:48'),
(170, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:57:10', '2026-03-09 15:57:10'),
(171, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:57:16', '2026-03-09 15:57:16'),
(172, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:57:21', '2026-03-09 15:57:21'),
(173, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:57:27', '2026-03-09 15:57:27'),
(174, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:57:37', '2026-03-09 15:57:37'),
(175, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:57:45', '2026-03-09 15:57:45'),
(176, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 15:59:57', '2026-03-09 15:59:57'),
(177, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:01:26', '2026-03-09 16:01:26'),
(178, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:03:37', '2026-03-09 16:03:37'),
(179, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:04:13', '2026-03-09 16:04:13'),
(180, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:09:41', '2026-03-09 16:09:41'),
(181, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:10:04', '2026-03-09 16:10:04'),
(182, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:10:09', '2026-03-09 16:10:09'),
(183, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:10:50', '2026-03-09 16:10:50'),
(184, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 16:15:14', '2026-03-09 16:15:14'),
(185, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 17:20:26', '2026-03-09 17:20:26'),
(186, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 17:20:33', '2026-03-09 17:20:33'),
(187, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 17:22:43', '2026-03-09 17:22:43'),
(188, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 17:22:43', '2026-03-09 17:22:43'),
(189, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 20:37:31', '2026-03-09 20:37:31'),
(190, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 20:37:31', '2026-03-09 20:37:31'),
(191, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '127.0.0.1', NULL, '2026-03-09 20:51:53', '2026-03-09 20:51:53'),
(192, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 01:38:11', '2026-03-10 01:38:11'),
(193, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 01:39:04', '2026-03-10 01:39:04'),
(194, '/admin/login', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 01:39:05', '2026-03-10 01:39:05'),
(195, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 01:39:44', '2026-03-10 01:39:44'),
(196, '/admin/rsvps', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 01:40:01', '2026-03-10 01:40:01'),
(197, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 01:40:34', '2026-03-10 01:40:34'),
(198, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:01:51', '2026-03-10 02:01:51'),
(199, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:01:57', '2026-03-10 02:01:57'),
(200, '/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:03:23', '2026-03-10 02:03:23'),
(201, '/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:03:56', '2026-03-10 02:03:56'),
(202, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:03:59', '2026-03-10 02:03:59'),
(203, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:04:38', '2026-03-10 02:04:38'),
(204, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:24:55', '2026-03-10 02:24:55'),
(205, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:26:50', '2026-03-10 02:26:50'),
(206, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:14', '2026-03-10 02:30:14'),
(207, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:16', '2026-03-10 02:30:16'),
(208, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:23', '2026-03-10 02:30:23'),
(209, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:27', '2026-03-10 02:30:27'),
(210, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:34', '2026-03-10 02:30:34'),
(211, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:43', '2026-03-10 02:30:43'),
(212, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:49', '2026-03-10 02:30:49'),
(213, '/admin/rsvps', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:30:56', '2026-03-10 02:30:56'),
(214, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:31:02', '2026-03-10 02:31:02'),
(215, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:31:14', '2026-03-10 02:31:14'),
(216, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:31:21', '2026-03-10 02:31:21');
INSERT INTO `page_views` (`id`, `path`, `referrer`, `user_agent`, `ip`, `country`, `created_at`, `updated_at`) VALUES
(217, '/admin/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:31:29', '2026-03-10 02:31:29'),
(218, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:31:35', '2026-03-10 02:31:35'),
(219, '/admin/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:48:43', '2026-03-10 02:48:43'),
(220, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:48:48', '2026-03-10 02:48:48'),
(221, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:00', '2026-03-10 02:49:00'),
(222, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:02', '2026-03-10 02:49:02'),
(223, '/admin/rsvps', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:15', '2026-03-10 02:49:15'),
(224, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:18', '2026-03-10 02:49:18'),
(225, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:24', '2026-03-10 02:49:24'),
(226, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:39', '2026-03-10 02:49:39'),
(227, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:53', '2026-03-10 02:49:53'),
(228, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:56', '2026-03-10 02:49:56'),
(229, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:49:58', '2026-03-10 02:49:58'),
(230, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:50:10', '2026-03-10 02:50:10'),
(231, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:53:14', '2026-03-10 02:53:14'),
(232, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:54:22', '2026-03-10 02:54:22'),
(233, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:56:17', '2026-03-10 02:56:17'),
(234, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:56:17', '2026-03-10 02:56:17'),
(235, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:56:21', '2026-03-10 02:56:21'),
(236, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:11', '2026-03-10 02:57:11'),
(237, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:12', '2026-03-10 02:57:12'),
(238, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:13', '2026-03-10 02:57:13'),
(239, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:15', '2026-03-10 02:57:15'),
(240, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:15', '2026-03-10 02:57:15'),
(241, '/admin/rsvps', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:17', '2026-03-10 02:57:17'),
(242, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:17', '2026-03-10 02:57:17'),
(243, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:24', '2026-03-10 02:57:24'),
(244, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 02:57:25', '2026-03-10 02:57:25'),
(245, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:04:59', '2026-03-10 03:04:59'),
(246, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:10:30', '2026-03-10 03:10:30'),
(247, '/privacy', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:10:41', '2026-03-10 03:10:41'),
(248, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:11:04', '2026-03-10 03:11:04'),
(249, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:12:52', '2026-03-10 03:12:52'),
(250, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:12:56', '2026-03-10 03:12:56'),
(251, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:13:03', '2026-03-10 03:13:03'),
(252, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:13:11', '2026-03-10 03:13:11'),
(253, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:26:07', '2026-03-10 03:26:07'),
(254, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:29:17', '2026-03-10 03:29:17'),
(255, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:29:29', '2026-03-10 03:29:29'),
(256, '/client-impact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:29:51', '2026-03-10 03:29:51'),
(257, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:30:42', '2026-03-10 03:30:42'),
(258, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:31:24', '2026-03-10 03:31:24'),
(259, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:31:32', '2026-03-10 03:31:32'),
(260, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:35:06', '2026-03-10 03:35:06'),
(261, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:36:39', '2026-03-10 03:36:39'),
(262, '/client-impact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:36:45', '2026-03-10 03:36:45'),
(263, '/about', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:36:49', '2026-03-10 03:36:49'),
(264, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:36:55', '2026-03-10 03:36:55'),
(265, '/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:38:35', '2026-03-10 03:38:35'),
(266, '/services/commercial-advisory', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:38:49', '2026-03-10 03:38:49'),
(267, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:45:49', '2026-03-10 03:45:49'),
(268, '/insights/future-ppa-structures-europe', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:47:06', '2026-03-10 03:47:06'),
(269, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:47:21', '2026-03-10 03:47:21'),
(270, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:47:25', '2026-03-10 03:47:25'),
(271, '/case-studies/ppa-structuring-for-250mw-solar-portfolio', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:47:31', '2026-03-10 03:47:31'),
(272, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:53:39', '2026-03-10 03:53:39'),
(273, '/insights/future-ppa-structures-europe', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:53:50', '2026-03-10 03:53:50'),
(274, '/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:53:59', '2026-03-10 03:53:59'),
(275, '/case-studies/payment-infrastructure-sadc', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:54:18', '2026-03-10 03:54:18'),
(276, '/client-impact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:54:25', '2026-03-10 03:54:25'),
(277, '/case-studies/ppa-structuring-for-250mw-solar-portfolio', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:55:28', '2026-03-10 03:55:28'),
(278, '/consultation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 03:59:38', '2026-03-10 03:59:38'),
(279, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:00:13', '2026-03-10 04:00:13'),
(280, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:01:23', '2026-03-10 04:01:23'),
(281, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:02:07', '2026-03-10 04:02:07'),
(282, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:04:07', '2026-03-10 04:04:07'),
(283, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:12:32', '2026-03-10 04:12:32'),
(284, '/admin/content', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:12:54', '2026-03-10 04:12:54'),
(285, '/admin/legal', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:13:09', '2026-03-10 04:13:09'),
(286, '/admin/email', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:13:10', '2026-03-10 04:13:10'),
(287, '/admin/subscribers', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:25', '2026-03-10 04:14:25'),
(288, '/admin/clients', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:33', '2026-03-10 04:14:33'),
(289, '/admin/testimonials', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:37', '2026-03-10 04:14:37'),
(290, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:47', '2026-03-10 04:14:47'),
(291, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:50', '2026-03-10 04:14:50'),
(292, '/admin/stats', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:51', '2026-03-10 04:14:51'),
(293, '/admin/requests', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:54', '2026-03-10 04:14:54'),
(294, '/admin/rsvps', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:14:57', '2026-03-10 04:14:57'),
(295, '/admin/widgets', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:15:01', '2026-03-10 04:15:01'),
(296, '/admin/team', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:15:12', '2026-03-10 04:15:12'),
(297, '/admin/case-studies', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:15:33', '2026-03-10 04:15:33'),
(298, '/admin/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:15:52', '2026-03-10 04:15:52'),
(299, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:16:04', '2026-03-10 04:16:04'),
(300, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:21:24', '2026-03-10 04:21:24'),
(301, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:21:38', '2026-03-10 04:21:38'),
(302, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:21:45', '2026-03-10 04:21:45'),
(303, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:34:35', '2026-03-10 04:34:35'),
(304, '/admin/services', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:38:43', '2026-03-10 04:38:43'),
(305, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:39:01', '2026-03-10 04:39:01'),
(306, '/admin/settings', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:39:47', '2026-03-10 04:39:47'),
(307, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 04:40:19', '2026-03-10 04:40:19'),
(308, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 06:16:28', '2026-03-10 06:16:28'),
(309, '/insights', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 06:16:59', '2026-03-10 06:16:59'),
(310, '/consultation', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 06:17:19', '2026-03-10 06:17:19'),
(311, '/contact', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 06:17:27', '2026-03-10 06:17:27'),
(312, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 06:18:21', '2026-03-10 06:18:21'),
(313, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 06:25:55', '2026-03-10 06:25:55'),
(314, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 06:25:55', '2026-03-10 06:25:55'),
(315, '/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 09:20:52', '2026-03-10 09:20:52'),
(316, '/admin/dashboard', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 09:28:31', '2026-03-10 09:28:31'),
(317, '/admin/login', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 09:28:31', '2026-03-10 09:28:31'),
(318, '/admin/dashboard', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 09:29:15', '2026-03-10 09:29:15'),
(319, '/admin/dashboard', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 09:36:40', '2026-03-10 09:36:40'),
(320, '/admin/dashboard', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 09:50:37', '2026-03-10 09:50:37'),
(321, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 16:47:04', '2026-03-10 16:47:04'),
(322, '/', 'http://localhost:3000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '127.0.0.1', NULL, '2026-03-10 16:56:58', '2026-03-10 16:56:58'),
(323, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 22:53:25', '2026-03-10 22:53:25'),
(324, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 22:53:26', '2026-03-10 22:53:26'),
(325, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 22:54:08', '2026-03-10 22:54:08'),
(326, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 22:54:17', '2026-03-10 22:54:17'),
(327, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 22:58:35', '2026-03-10 22:58:35'),
(328, '/services/route-to-market-contracting', 'https://nissi-insights.com/services/route-to-market-contracting', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:00:33', '2026-03-10 23:00:33'),
(329, '/case-studies', 'https://nissi-insights.com/case-studies', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:00:52', '2026-03-10 23:00:52'),
(330, '/client-impact', 'https://nissi-insights.com/client-impact', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:01:02', '2026-03-10 23:01:02'),
(331, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:01:06', '2026-03-10 23:01:06'),
(332, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:01:20', '2026-03-10 23:01:20'),
(333, '/consultation', 'https://nissi-insights.com/consultation', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:01:38', '2026-03-10 23:01:38'),
(334, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:04:51', '2026-03-10 23:04:51'),
(335, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:05:01', '2026-03-10 23:05:01'),
(336, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:05:25', '2026-03-10 23:05:25'),
(337, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:05:25', '2026-03-10 23:05:25'),
(338, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:05:38', '2026-03-10 23:05:38'),
(339, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:18', '2026-03-10 23:06:18'),
(340, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:26', '2026-03-10 23:06:26'),
(341, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:28', '2026-03-10 23:06:28'),
(342, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:30', '2026-03-10 23:06:30'),
(343, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:31', '2026-03-10 23:06:31'),
(344, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:48', '2026-03-10 23:06:48'),
(345, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:52', '2026-03-10 23:06:52'),
(346, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:06:55', '2026-03-10 23:06:55'),
(347, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:07:58', '2026-03-10 23:07:58'),
(348, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:08:07', '2026-03-10 23:08:07'),
(349, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:08:26', '2026-03-10 23:08:26'),
(350, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:10:37', '2026-03-10 23:10:37'),
(351, '/services/fintech-ma-transaction-support', 'https://nissi-insights.com/services/fintech-ma-transaction-support', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-10 23:13:12', '2026-03-10 23:13:12'),
(352, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '104.28.82.46', NULL, '2026-03-10 23:27:57', '2026-03-10 23:27:57'),
(353, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '104.28.82.46', NULL, '2026-03-10 23:27:59', '2026-03-10 23:27:59'),
(354, '/insights', 'https://nissi-insights.com/insights', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:39:23', '2026-03-10 23:39:23'),
(355, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:39:45', '2026-03-10 23:39:45'),
(356, '/insights', 'https://nissi-insights.com/insights', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:40:03', '2026-03-10 23:40:03'),
(357, '/insights/future-ppa-structures-europe', 'https://nissi-insights.com/insights/future-ppa-structures-europe', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:40:06', '2026-03-10 23:40:06'),
(358, '/case-studies', 'https://nissi-insights.com/case-studies', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:40:27', '2026-03-10 23:40:27'),
(359, '/case-studies/ppa-structuring-for-250mw-solar-portfolio', 'https://nissi-insights.com/case-studies/ppa-structuring-for-250mw-solar-portfolio', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:40:33', '2026-03-10 23:40:33'),
(360, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:40:40', '2026-03-10 23:40:40'),
(361, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:41:03', '2026-03-10 23:41:03'),
(362, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:41:17', '2026-03-10 23:41:17'),
(363, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:41:51', '2026-03-10 23:41:51'),
(364, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:42:04', '2026-03-10 23:42:04'),
(365, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:42:12', '2026-03-10 23:42:12'),
(366, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:43:27', '2026-03-10 23:43:27'),
(367, '/contact', 'https://nissi-insights.com/contact', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-10 23:43:45', '2026-03-10 23:43:45'),
(368, '/contact', 'https://nissi-insights.com/contact', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 00:07:27', '2026-03-11 00:07:27'),
(369, '/insights', 'https://nissi-insights.com/insights', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '172.224.230.108', NULL, '2026-03-11 00:19:44', '2026-03-11 00:19:44'),
(370, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '172.224.230.108', NULL, '2026-03-11 00:20:21', '2026-03-11 00:20:21'),
(371, '/insights', 'https://nissi-insights.com/insights', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '172.224.230.108', NULL, '2026-03-11 00:21:34', '2026-03-11 00:21:34'),
(372, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 00:24:05', '2026-03-11 00:24:05'),
(373, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 00:24:12', '2026-03-11 00:24:12'),
(374, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '104.28.80.147', NULL, '2026-03-11 09:05:39', '2026-03-11 09:05:39'),
(375, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '104.28.80.147', NULL, '2026-03-11 09:05:39', '2026-03-11 09:05:39'),
(376, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '104.28.80.147', NULL, '2026-03-11 09:05:49', '2026-03-11 09:05:49'),
(377, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '104.28.80.147', NULL, '2026-03-11 09:06:20', '2026-03-11 09:06:20'),
(378, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:17:52', '2026-03-11 12:17:52'),
(379, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:18:14', '2026-03-11 12:18:14'),
(380, '/services', 'https://nissi-insights.com/services?category=Energy%20Advisory', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:18:40', '2026-03-11 12:18:40'),
(381, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:19:14', '2026-03-11 12:19:14'),
(382, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:21:40', '2026-03-11 12:21:40'),
(383, '/services', 'https://nissi-insights.com/services?category=Energy%20Advisory', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:22:01', '2026-03-11 12:22:01'),
(384, '/services/legal-policy', 'https://nissi-insights.com/services/legal-policy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:22:14', '2026-03-11 12:22:14'),
(385, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:28:15', '2026-03-11 12:28:15'),
(386, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:28:15', '2026-03-11 12:28:15'),
(387, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:30:30', '2026-03-11 12:30:30'),
(388, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:30:35', '2026-03-11 12:30:35'),
(389, '/services/legal-policy', 'https://nissi-insights.com/services/legal-policy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:31:39', '2026-03-11 12:31:39'),
(390, '/services/legal-policy', 'https://nissi-insights.com/services/legal-policy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:31:42', '2026-03-11 12:31:42'),
(391, '/services/legal-policy', 'https://nissi-insights.com/services/legal-policy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:34:19', '2026-03-11 12:34:19'),
(392, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-11 12:34:24', '2026-03-11 12:34:24'),
(393, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 12:44:22', '2026-03-11 12:44:22'),
(394, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 12:45:23', '2026-03-11 12:45:23'),
(395, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 12:45:48', '2026-03-11 12:45:48'),
(396, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 12:45:58', '2026-03-11 12:45:58'),
(397, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 13:58:30', '2026-03-11 13:58:30'),
(398, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 17:05:28', '2026-03-11 17:05:28'),
(399, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 17:06:01', '2026-03-11 17:06:01'),
(400, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 17:06:08', '2026-03-11 17:06:08'),
(401, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 17:06:34', '2026-03-11 17:06:34'),
(402, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '102.205.85.170', NULL, '2026-03-11 17:06:53', '2026-03-11 17:06:53'),
(403, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:08:03', '2026-03-11 17:08:03'),
(404, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:08:28', '2026-03-11 17:08:28'),
(405, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:08:48', '2026-03-11 17:08:48'),
(406, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:10:03', '2026-03-11 17:10:03'),
(407, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:10:31', '2026-03-11 17:10:31'),
(408, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:13:20', '2026-03-11 17:13:20'),
(409, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:13:58', '2026-03-11 17:13:58'),
(410, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:15:41', '2026-03-11 17:15:41'),
(411, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:16:31', '2026-03-11 17:16:31'),
(412, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:17:10', '2026-03-11 17:17:10'),
(413, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:17:31', '2026-03-11 17:17:31'),
(414, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:17:41', '2026-03-11 17:17:41'),
(415, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:17:43', '2026-03-11 17:17:43');
INSERT INTO `page_views` (`id`, `path`, `referrer`, `user_agent`, `ip`, `country`, `created_at`, `updated_at`) VALUES
(416, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:18:03', '2026-03-11 17:18:03'),
(417, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:18:40', '2026-03-11 17:18:40'),
(418, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:18:52', '2026-03-11 17:18:52'),
(419, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:19:02', '2026-03-11 17:19:02'),
(420, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:19:05', '2026-03-11 17:19:05'),
(421, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:19:59', '2026-03-11 17:19:59'),
(422, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:20:52', '2026-03-11 17:20:52'),
(423, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 17:23:54', '2026-03-11 17:23:54'),
(424, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:18:24', '2026-03-11 18:18:24'),
(425, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:19:39', '2026-03-11 18:19:39'),
(426, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:19:41', '2026-03-11 18:19:41'),
(427, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:19:43', '2026-03-11 18:19:43'),
(428, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:19:45', '2026-03-11 18:19:45'),
(429, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:19:49', '2026-03-11 18:19:49'),
(430, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:19:51', '2026-03-11 18:19:51'),
(431, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:19:59', '2026-03-11 18:19:59'),
(432, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:00', '2026-03-11 18:20:00'),
(433, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:01', '2026-03-11 18:20:01'),
(434, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:02', '2026-03-11 18:20:02'),
(435, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:03', '2026-03-11 18:20:03'),
(436, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:04', '2026-03-11 18:20:04'),
(437, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:05', '2026-03-11 18:20:05'),
(438, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:06', '2026-03-11 18:20:06'),
(439, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:07', '2026-03-11 18:20:07'),
(440, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:08', '2026-03-11 18:20:08'),
(441, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:09', '2026-03-11 18:20:09'),
(442, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:09', '2026-03-11 18:20:09'),
(443, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:10', '2026-03-11 18:20:10'),
(444, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:11', '2026-03-11 18:20:11'),
(445, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:12', '2026-03-11 18:20:12'),
(446, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:14', '2026-03-11 18:20:14'),
(447, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:17', '2026-03-11 18:20:17'),
(448, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:54', '2026-03-11 18:20:54'),
(449, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:20:59', '2026-03-11 18:20:59'),
(450, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:00', '2026-03-11 18:21:00'),
(451, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:07', '2026-03-11 18:21:07'),
(452, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:08', '2026-03-11 18:21:08'),
(453, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:09', '2026-03-11 18:21:09'),
(454, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:12', '2026-03-11 18:21:12'),
(455, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:13', '2026-03-11 18:21:13'),
(456, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:18', '2026-03-11 18:21:18'),
(457, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:19', '2026-03-11 18:21:19'),
(458, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:21', '2026-03-11 18:21:21'),
(459, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:22', '2026-03-11 18:21:22'),
(460, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:25', '2026-03-11 18:21:25'),
(461, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:26', '2026-03-11 18:21:26'),
(462, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:28', '2026-03-11 18:21:28'),
(463, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:30', '2026-03-11 18:21:30'),
(464, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:34', '2026-03-11 18:21:34'),
(465, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:38', '2026-03-11 18:21:38'),
(466, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:41', '2026-03-11 18:21:41'),
(467, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:46', '2026-03-11 18:21:46'),
(468, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:48', '2026-03-11 18:21:48'),
(469, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:49', '2026-03-11 18:21:49'),
(470, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:50', '2026-03-11 18:21:50'),
(471, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:52', '2026-03-11 18:21:52'),
(472, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:54', '2026-03-11 18:21:54'),
(473, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:55', '2026-03-11 18:21:55'),
(474, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:21:57', '2026-03-11 18:21:57'),
(475, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:09', '2026-03-11 18:22:09'),
(476, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:11', '2026-03-11 18:22:11'),
(477, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:13', '2026-03-11 18:22:13'),
(478, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:15', '2026-03-11 18:22:15'),
(479, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:17', '2026-03-11 18:22:17'),
(480, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:18', '2026-03-11 18:22:18'),
(481, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:19', '2026-03-11 18:22:19'),
(482, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:20', '2026-03-11 18:22:20'),
(483, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:22:37', '2026-03-11 18:22:37'),
(484, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:19', '2026-03-11 18:24:19'),
(485, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:20', '2026-03-11 18:24:20'),
(486, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:25', '2026-03-11 18:24:25'),
(487, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:32', '2026-03-11 18:24:32'),
(488, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:38', '2026-03-11 18:24:38'),
(489, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:40', '2026-03-11 18:24:40'),
(490, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:44', '2026-03-11 18:24:44'),
(491, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:45', '2026-03-11 18:24:45'),
(492, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:46', '2026-03-11 18:24:46'),
(493, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:47', '2026-03-11 18:24:47'),
(494, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:51', '2026-03-11 18:24:51'),
(495, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:24:54', '2026-03-11 18:24:54'),
(496, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:25:04', '2026-03-11 18:25:04'),
(497, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:25:04', '2026-03-11 18:25:04'),
(498, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:31:57', '2026-03-11 18:31:57'),
(499, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:32:02', '2026-03-11 18:32:02'),
(500, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:37:07', '2026-03-11 18:37:07'),
(501, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 18:38:02', '2026-03-11 18:38:02'),
(502, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:33:56', '2026-03-11 20:33:56'),
(503, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:34:50', '2026-03-11 20:34:50'),
(504, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:35:16', '2026-03-11 20:35:16'),
(505, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:35:26', '2026-03-11 20:35:26'),
(506, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:52:29', '2026-03-11 20:52:29'),
(507, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:52:35', '2026-03-11 20:52:35'),
(508, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:52:48', '2026-03-11 20:52:48'),
(509, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:53:21', '2026-03-11 20:53:21'),
(510, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:53:48', '2026-03-11 20:53:48'),
(511, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:53:51', '2026-03-11 20:53:51'),
(512, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:53:55', '2026-03-11 20:53:55'),
(513, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:03', '2026-03-11 20:54:03'),
(514, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:03', '2026-03-11 20:54:03'),
(515, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:05', '2026-03-11 20:54:05'),
(516, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:06', '2026-03-11 20:54:06'),
(517, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:11', '2026-03-11 20:54:11'),
(518, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:15', '2026-03-11 20:54:15'),
(519, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:21', '2026-03-11 20:54:21'),
(520, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:22', '2026-03-11 20:54:22'),
(521, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:23', '2026-03-11 20:54:23'),
(522, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:24', '2026-03-11 20:54:24'),
(523, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:28', '2026-03-11 20:54:28'),
(524, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:30', '2026-03-11 20:54:30'),
(525, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:31', '2026-03-11 20:54:31'),
(526, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:32', '2026-03-11 20:54:32'),
(527, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:33', '2026-03-11 20:54:33'),
(528, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:35', '2026-03-11 20:54:35'),
(529, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:54:36', '2026-03-11 20:54:36'),
(530, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:55:02', '2026-03-11 20:55:02'),
(531, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:55:04', '2026-03-11 20:55:04'),
(532, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:55:05', '2026-03-11 20:55:05'),
(533, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:55:15', '2026-03-11 20:55:15'),
(534, '/services/product-and-go-to-market-advisory', 'https://nissi-insights.com/services/product-and-go-to-market-advisory', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:58:02', '2026-03-11 20:58:02'),
(535, '/services/strategy-commercial-model-design', 'https://nissi-insights.com/services/strategy-commercial-model-design', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 20:58:37', '2026-03-11 20:58:37'),
(536, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-11 21:00:09', '2026-03-11 21:00:09'),
(537, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:32:42', '2026-03-12 08:32:42'),
(538, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:32:42', '2026-03-12 08:32:42'),
(539, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:32:58', '2026-03-12 08:32:58'),
(540, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:33:05', '2026-03-12 08:33:05'),
(541, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:33:18', '2026-03-12 08:33:18'),
(542, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:34:32', '2026-03-12 08:34:32'),
(543, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-12 08:35:07', '2026-03-12 08:35:07'),
(544, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:38:17', '2026-03-12 08:38:17'),
(545, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-12 08:38:58', '2026-03-12 08:38:58'),
(546, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-12 08:39:50', '2026-03-12 08:39:50'),
(547, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-12 08:40:19', '2026-03-12 08:40:19'),
(548, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:40:26', '2026-03-12 08:40:26'),
(549, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-12 08:40:28', '2026-03-12 08:40:28'),
(550, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-12 08:43:23', '2026-03-12 08:43:23'),
(551, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '172.225.158.196', NULL, '2026-03-13 05:55:09', '2026-03-13 05:55:09'),
(552, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '172.225.158.196', NULL, '2026-03-13 05:55:12', '2026-03-13 05:55:12'),
(553, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '172.225.158.196', NULL, '2026-03-13 05:55:15', '2026-03-13 05:55:15'),
(554, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', '172.225.158.196', NULL, '2026-03-13 05:55:17', '2026-03-13 05:55:17'),
(555, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:08:12', '2026-03-13 10:08:12'),
(556, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:08:13', '2026-03-13 10:08:13'),
(557, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:19:06', '2026-03-13 10:19:06'),
(558, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:19:03', '2026-03-13 10:19:03'),
(559, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:33:26', '2026-03-13 10:33:26'),
(560, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:37:41', '2026-03-13 10:37:41'),
(561, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:48:04', '2026-03-13 10:48:04'),
(562, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:48:08', '2026-03-13 10:48:08'),
(563, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:48:55', '2026-03-13 10:48:55'),
(564, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:49:02', '2026-03-13 10:49:02'),
(565, '/services', 'https://nissi-insights.com/services?category=Energy%20Advisory', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:49:05', '2026-03-13 10:49:05'),
(566, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:49:09', '2026-03-13 10:49:09'),
(567, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:49:10', '2026-03-13 10:49:10'),
(568, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:54:10', '2026-03-13 10:54:10'),
(569, '/services/ppa-structuring-negotiation', 'https://nissi-insights.com/services/ppa-structuring-negotiation', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:54:25', '2026-03-13 10:54:25'),
(570, '/services/ppa-structuring-negotiation', 'https://nissi-insights.com/services/ppa-structuring-negotiation', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:55:30', '2026-03-13 10:55:30'),
(571, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:57:20', '2026-03-13 10:57:20'),
(572, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:57:25', '2026-03-13 10:57:25'),
(573, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:57:26', '2026-03-13 10:57:26'),
(574, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:57:36', '2026-03-13 10:57:36'),
(575, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 10:57:41', '2026-03-13 10:57:41'),
(576, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 10:59:42', '2026-03-13 10:59:42'),
(577, '/services/ppa-structuring-negotiation', 'https://nissi-insights.com/services/ppa-structuring-negotiation', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 11:01:39', '2026-03-13 11:01:39'),
(578, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 11:01:43', '2026-03-13 11:01:43'),
(579, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 11:10:44', '2026-03-13 11:10:44'),
(580, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 11:17:43', '2026-03-13 11:17:43'),
(581, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 11:54:10', '2026-03-13 11:54:10'),
(582, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 11:55:22', '2026-03-13 11:55:22'),
(583, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 11:55:36', '2026-03-13 11:55:36'),
(584, '/services/market-price-advisory', 'https://nissi-insights.com/services/market-price-advisory', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 11:56:27', '2026-03-13 11:56:27'),
(585, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:03:18', '2026-03-13 12:03:18'),
(586, '/services/due-diligence-strategy', 'https://nissi-insights.com/services/due-diligence-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:04:23', '2026-03-13 12:04:23'),
(587, '/services/due-diligence-market-entry', 'https://nissi-insights.com/services/due-diligence-market-entry', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:04:30', '2026-03-13 12:04:30'),
(588, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:05:27', '2026-03-13 12:05:27'),
(589, '/services/commercial-advisory', 'https://nissi-insights.com/services/commercial-advisory', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:08:58', '2026-03-13 12:08:58'),
(590, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:09:20', '2026-03-13 12:09:20'),
(591, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:10:15', '2026-03-13 12:10:15'),
(592, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:10:19', '2026-03-13 12:10:19'),
(593, '/services/legal-policy', 'https://nissi-insights.com/services/legal-policy', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:11:09', '2026-03-13 12:11:09'),
(594, '/services/commercial-advisory', 'https://nissi-insights.com/services/commercial-advisory', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-13 12:12:00', '2026-03-13 12:12:00'),
(595, '/services/portfolio-risk-advisory', 'https://nissi-insights.com/services/portfolio-risk-advisory', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:12:34', '2026-03-13 12:12:34'),
(596, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:19:41', '2026-03-13 12:19:41'),
(597, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:19:48', '2026-03-13 12:19:48'),
(598, '/services/energy-storage-grid-solutions', 'https://nissi-insights.com/services/energy-storage-grid-solutions', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:20:34', '2026-03-13 12:20:34'),
(599, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:20:38', '2026-03-13 12:20:38'),
(600, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:21:59', '2026-03-13 12:21:59'),
(601, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:22:10', '2026-03-13 12:22:10'),
(602, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:22:25', '2026-03-13 12:22:25'),
(603, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:22:32', '2026-03-13 12:22:32'),
(604, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:22:41', '2026-03-13 12:22:41'),
(605, '/services', 'https://nissi-insights.com/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:24:00', '2026-03-13 12:24:00'),
(606, '/case-studies', 'https://nissi-insights.com/case-studies', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:24:13', '2026-03-13 12:24:13'),
(607, '/insights', 'https://nissi-insights.com/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:24:14', '2026-03-13 12:24:14');
INSERT INTO `page_views` (`id`, `path`, `referrer`, `user_agent`, `ip`, `country`, `created_at`, `updated_at`) VALUES
(608, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:24:20', '2026-03-13 12:24:20'),
(609, '/contact', 'https://nissi-insights.com/contact', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:24:22', '2026-03-13 12:24:22'),
(610, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:24:29', '2026-03-13 12:24:29'),
(611, '/contact', 'https://nissi-insights.com/contact', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:25:06', '2026-03-13 12:25:06'),
(612, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:25:30', '2026-03-13 12:25:30'),
(613, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-13 12:25:41', '2026-03-13 12:25:41'),
(614, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 12:25:47', '2026-03-13 12:25:47'),
(615, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:36:53', '2026-03-13 18:36:53'),
(616, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:37:04', '2026-03-13 18:37:04'),
(617, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:37:08', '2026-03-13 18:37:08'),
(618, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:38:55', '2026-03-13 18:38:55'),
(619, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:39:00', '2026-03-13 18:39:00'),
(620, '/services/ppa-structuring-negotiation', 'https://nissi-insights.com/services/ppa-structuring-negotiation', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:40:20', '2026-03-13 18:40:20'),
(621, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:40:27', '2026-03-13 18:40:27'),
(622, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:43:11', '2026-03-13 18:43:11'),
(623, '/consultation', 'https://nissi-insights.com/consultation', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-13 18:45:54', '2026-03-13 18:45:54'),
(624, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:49:55', '2026-03-13 18:49:55'),
(625, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:50:52', '2026-03-13 18:50:52'),
(626, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:50:57', '2026-03-13 18:50:57'),
(627, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:51:17', '2026-03-13 18:51:17'),
(628, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:51:19', '2026-03-13 18:51:19'),
(629, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:51:20', '2026-03-13 18:51:20'),
(630, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:51:20', '2026-03-13 18:51:20'),
(631, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:51:22', '2026-03-13 18:51:22'),
(632, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:51:23', '2026-03-13 18:51:23'),
(633, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:52:16', '2026-03-13 18:52:16'),
(634, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:52:18', '2026-03-13 18:52:18'),
(635, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:52:20', '2026-03-13 18:52:20'),
(636, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:52:39', '2026-03-13 18:52:39'),
(637, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:52:42', '2026-03-13 18:52:42'),
(638, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:52:45', '2026-03-13 18:52:45'),
(639, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:52:49', '2026-03-13 18:52:49'),
(640, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:53:29', '2026-03-13 18:53:29'),
(641, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:53:31', '2026-03-13 18:53:31'),
(642, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:53:39', '2026-03-13 18:53:39'),
(643, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '102.205.85.170', NULL, '2026-03-13 18:53:41', '2026-03-13 18:53:41'),
(644, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:10:21', '2026-03-13 22:10:21'),
(645, '/admin/login', 'https://nissi-insights.com/admin/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:10:21', '2026-03-13 22:10:21'),
(646, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:10:28', '2026-03-13 22:10:28'),
(647, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:10:36', '2026-03-13 22:10:36'),
(648, '/admin/insights', 'https://nissi-insights.com/admin/insights', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:01', '2026-03-13 22:11:01'),
(649, '/admin/case-studies', 'https://nissi-insights.com/admin/case-studies', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:05', '2026-03-13 22:11:05'),
(650, '/admin/team', 'https://nissi-insights.com/admin/team', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:10', '2026-03-13 22:11:10'),
(651, '/admin/widgets', 'https://nissi-insights.com/admin/widgets', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:15', '2026-03-13 22:11:15'),
(652, '/admin/rsvps', 'https://nissi-insights.com/admin/rsvps', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:18', '2026-03-13 22:11:18'),
(653, '/admin/requests', 'https://nissi-insights.com/admin/requests', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:22', '2026-03-13 22:11:22'),
(654, '/admin/stats', 'https://nissi-insights.com/admin/stats', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:32', '2026-03-13 22:11:32'),
(655, '/admin/testimonials', 'https://nissi-insights.com/admin/testimonials', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:35', '2026-03-13 22:11:35'),
(656, '/admin/clients', 'https://nissi-insights.com/admin/clients', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:37', '2026-03-13 22:11:37'),
(657, '/admin/subscribers', 'https://nissi-insights.com/admin/subscribers', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:41', '2026-03-13 22:11:41'),
(658, '/admin/email', 'https://nissi-insights.com/admin/email', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:11:45', '2026-03-13 22:11:45'),
(659, '/admin/legal', 'https://nissi-insights.com/admin/legal', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:12:14', '2026-03-13 22:12:14'),
(660, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '41.90.172.19', NULL, '2026-03-13 22:12:19', '2026-03-13 22:12:19'),
(661, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 07:59:27', '2026-03-16 07:59:27'),
(662, '/admin/services', 'https://nissi-insights.com/admin/services', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 08:00:35', '2026-03-16 08:00:35'),
(663, '/admin/settings', 'https://nissi-insights.com/admin/settings', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 15:59:45', '2026-03-16 15:59:45'),
(664, '/admin/content', 'https://nissi-insights.com/admin/content', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 15:59:53', '2026-03-16 15:59:53'),
(665, '/consultation', 'https://nissi-insights.com/consultation', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 15:59:55', '2026-03-16 15:59:55'),
(666, '/services/digital-payments-strategy', 'https://nissi-insights.com/services/digital-payments-strategy', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 16:00:29', '2026-03-16 16:00:29'),
(667, '/insights', 'https://nissi-insights.com/insights', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 16:00:39', '2026-03-16 16:00:39'),
(668, '/contact', 'https://nissi-insights.com/contact', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 16:00:49', '2026-03-16 16:00:49'),
(669, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-16 16:00:51', '2026-03-16 16:00:51'),
(670, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 16:00:53', '2026-03-16 16:00:53'),
(671, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 17:57:00', '2026-03-16 17:57:00'),
(672, '/contact', 'https://nissi-insights.com/contact', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15', '92.21.233.0', NULL, '2026-03-16 17:57:11', '2026-03-16 17:57:11'),
(673, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-16 17:57:48', '2026-03-16 17:57:48'),
(674, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-16 18:00:38', '2026-03-16 18:00:38'),
(675, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-16 18:00:59', '2026-03-16 18:00:59'),
(676, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '154.159.252.209', NULL, '2026-03-16 18:01:41', '2026-03-16 18:01:41'),
(677, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-17 16:58:17', '2026-03-17 16:58:17'),
(678, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-17 16:58:35', '2026-03-17 16:58:35'),
(679, '/contact', 'https://nissi-insights.com/contact', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-17 16:59:25', '2026-03-17 16:59:25'),
(680, '/about', 'https://nissi-insights.com/about', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-17 16:59:38', '2026-03-17 16:59:38'),
(681, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-17 17:00:19', '2026-03-17 17:00:19'),
(682, '/', 'https://nissi-insights.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-17 17:01:06', '2026-03-17 17:01:06'),
(683, '/admin/dashboard', 'https://nissi-insights.com/admin/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '41.90.172.19', NULL, '2026-03-17 17:01:13', '2026-03-17 17:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 1, 'auth_token', '7c9a1b19b9443560eb0f9c9612d9687fb88b4b32d423bf481fb23716779d47e4', '[\"*\"]', NULL, NULL, '2026-02-25 20:02:59', '2026-02-25 20:02:59'),
(3, 'App\\Models\\User', 1, 'auth_token', 'b21b20e870a05a1fa28b2b9d9a57d4ac62f766efaa2a2fb31cf2dbcf8f174fd1', '[\"*\"]', NULL, NULL, '2026-02-25 20:03:53', '2026-02-25 20:03:53'),
(4, 'App\\Models\\User', 1, 'auth_token', 'c8d2019eb0725902eb21e176f9b64737aa4bcd4c1a1a1877891a0d487f556bf9', '[\"*\"]', '2026-02-27 05:18:09', NULL, '2026-02-27 05:07:34', '2026-02-27 05:18:09'),
(5, 'App\\Models\\User', 1, 'auth_token', '1894829ae458eac720d9d7703321c721de938afd04bc19fdfe06da469d1c4f35', '[\"*\"]', '2026-02-27 05:47:50', NULL, '2026-02-27 05:37:36', '2026-02-27 05:47:50'),
(6, 'App\\Models\\User', 1, 'auth_token', '096c2eb551cfd5c95f6486aea4c8cd362d35fde60d8221db0153b1469f0c99a9', '[\"*\"]', '2026-02-27 06:15:59', NULL, '2026-02-27 05:59:01', '2026-02-27 06:15:59'),
(7, 'App\\Models\\User', 1, 'auth_token', '37910a10840779ce5db94382b640626386a3adcc1510e6a2a02170624d3f5ce6', '[\"*\"]', '2026-02-27 07:02:50', NULL, '2026-02-27 06:31:36', '2026-02-27 07:02:50'),
(8, 'App\\Models\\User', 1, 'auth_token', 'c6945cfa1535aecfeaa44926a47496ff80eaa0f55c21dd68045ad17966c575c5', '[\"*\"]', '2026-02-27 07:10:32', NULL, '2026-02-27 07:08:38', '2026-02-27 07:10:32'),
(9, 'App\\Models\\User', 1, 'auth_token', '2146ab93cf9c6d147d7b113799fc190f50283eee6e50eab002889588da0e035a', '[\"*\"]', '2026-02-27 07:39:11', NULL, '2026-02-27 07:22:30', '2026-02-27 07:39:11'),
(14, 'App\\Models\\User', 1, 'auth_token', '8ae67feaa699f05f2e6194672939f3c0b02d44a0bcabd7443118e7ee7c45de13', '[\"*\"]', '2026-03-09 20:37:31', NULL, '2026-03-09 15:49:23', '2026-03-09 20:37:31'),
(12, 'App\\Models\\User', 1, 'auth_token', '2cf3b8bb3bfccb1a0bf2a3af72db64c76c0135f14e01daa74154060fe6a4c2e0', '[\"*\"]', NULL, NULL, '2026-03-09 12:43:19', '2026-03-09 12:43:19'),
(13, 'App\\Models\\User', 1, 'auth_token', '360f57cfcc8e97e43b193ab9cea1e1b86e0ef334eef38cb7ca1d3c457da1ff8f', '[\"*\"]', '2026-03-09 15:39:56', NULL, '2026-03-09 12:43:50', '2026-03-09 15:39:56'),
(15, 'App\\Models\\User', 1, 'auth_token', '80c92c840ffb4fddc0b7698cfc54d6eb84ea1231e24e52dd2d0720a69c273e10', '[\"*\"]', '2026-03-10 06:25:48', NULL, '2026-03-10 01:39:42', '2026-03-10 06:25:48'),
(16, 'App\\Models\\User', 1, 'auth_token', '69f276aade5f7f63644d2e1364c05e1f8cf571840e17796503a36f52c9798c53', '[\"*\"]', '2026-03-10 09:36:41', NULL, '2026-03-10 09:29:13', '2026-03-10 09:36:41'),
(17, 'App\\Models\\User', 1, 'auth_token', 'ce1c0723c6c0ee97e3478b1efab993d90cd98e029a44a4c0c92f7bb6969c24a0', '[\"*\"]', '2026-03-10 09:50:36', NULL, '2026-03-10 09:50:33', '2026-03-10 09:50:36'),
(19, 'App\\Models\\User', 1, 'auth_token', 'bfa9e817f47312dedf04e6df5749b8ea169d966eadf2e804bcde81190fc34bc8', '[\"*\"]', '2026-03-17 17:01:12', NULL, '2026-03-10 23:05:37', '2026-03-17 17:01:12'),
(21, 'App\\Models\\User', 1, 'auth_token', '03e578f90e8386dea916a621babf60424759f67bc104c5db8bf486ff592bb112', '[\"*\"]', '2026-03-11 09:05:49', NULL, '2026-03-11 09:05:48', '2026-03-11 09:05:49'),
(24, 'App\\Models\\User', 1, 'auth_token', '824a684e6647ca293e1e23dba52d72f47d5faf62b3239e56e8fb303effeeff9a', '[\"*\"]', '2026-03-11 20:33:56', NULL, '2026-03-11 17:08:27', '2026-03-11 20:33:56'),
(25, 'App\\Models\\User', 1, 'auth_token', 'b8e7e5d2fa335e820ef0c29aa21dc49584eeb1d25479f14f3ab360abbbb47357', '[\"*\"]', '2026-03-12 08:39:53', NULL, '2026-03-11 20:34:50', '2026-03-12 08:39:53'),
(28, 'App\\Models\\User', 1, 'auth_token', 'c3130a063696a47aaccf4a8865310822091951f752b78e3009e7e0650566f3e5', '[\"*\"]', '2026-03-13 22:11:41', NULL, '2026-03-13 22:10:26', '2026-03-13 22:11:41'),
(27, 'App\\Models\\User', 1, 'auth_token', 'a025e797b441b96ad87e243adce311fc4e2b73d845c04cda6071a8eb881f2413', '[\"*\"]', '2026-03-16 17:56:57', NULL, '2026-03-12 08:40:19', '2026-03-16 17:56:57');

-- --------------------------------------------------------

--
-- Table structure for table `rsvps`
--

CREATE TABLE `rsvps` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sector` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interest` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consent` tinyint(1) NOT NULL DEFAULT '0',
  `newsletter` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `slug`, `category`, `description`, `content`, `icon`, `image`, `video_url`, `is_active`, `created_at`, `updated_at`) VALUES
(7, 'Market & Price Advisory', 'market-price-advisory', 'Energy Advisory', 'Energy market and price advisory spanning wholesale market analysis, power price curves, commodity risk, and price risk management across gas, power, and renewables.', '<p></p><p>Energy markets are volatile, complex, and increasingly interconnected. The ability to read price signals accurately, anticipate market movements, and structure commercial decisions around robust price intelligence is no longer a trading function — it is a strategic one.</p><p>We advise clients on energy market dynamics, price forecasting, commodity price risk, and the commercial implications of market design and regulatory change. Our advisory spans wholesale market analysis, power price curve development, gas and LNG market intelligence, renewable energy value capture, and the structuring of price risk.</p><p></p><p>Whether you are making a long-term investment decision, negotiating an offtake agreement, or managing exposure across a portfolio of energy assets, we give you the market intelligence and analytical rigour to act with confidence — in any market condition.</p>', 'BarChart2', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-03-16 08:24:45'),
(9, 'Strategy & Commercial Model Design', 'strategy-commercial-model-design', 'Fintech', 'We advise fintech clients on strategy and commercial model design — across B2B, B2C, and platform models — from revenue architecture and pricing strategy to go-to-market execution and the commercial innovation that drives sustainable, investable growth', '<p>We advise fintech clients on corporate strategy, business model design, and the commercial frameworks that turn promising propositions into scalable, investable businesses. Whether you are building a B2B payments infrastructure play, a B2C lending product, or a platform model that serves both — we help you design the revenue architecture, pricing strategy, and go-to-market approach that fits your market, your customers, and your growth ambitions.</p><p></p><p>From early-stage positioning and product-market fit to partnership strategy, distribution model design, and competitive differentiation — we challenge assumptions, stress-test models, and build strategies that are bold, grounded, and built to win. We also advise on the evolution from transactional revenue into recurring, platform-based, and ecosystem-driven models that create durable competitive advantage and long-term enterprise value.</p>', 'BarChart2', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-03-16 08:43:08'),
(11, 'Risk, Compliance & Regulation', 'risk-compliance-regulation', 'Fintech', 'Regulatory compliance, risk management frameworks, and licensing strategy for fintech companies.', NULL, 'ShieldCheck', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-02-25 14:39:57'),
(14, 'M&A and Transaction Support', 'ma-and-transaction-support', 'Fintech', 'M&A and transaction support spanning target origination, deal structuring, commercial due diligence, negotiation, and post-transaction integration across energy, fintech, and infrastructure.', '<p>We support clients across every stage of the M&amp;A process — from origination and commercial due diligence to deal structuring, valuation, negotiation, and closing. We don\'t just advise from the sidelines — we get into the detail, challenge the assumptions, and drive the process forward with the discipline and urgency that complex transactions demand.</p><p></p><p>Our sector depth across energy, fintech, and infrastructure means we understand not just the mechanics of a deal, but the market dynamics, regulatory landscape, and strategic context</p>', 'ArrowLeftRight', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-03-16 08:43:34'),
(15, 'Strategic Government & Sovereign Engagement', 'strategic-government-sovereign-engagement', 'International Diplomacy', 'We advise on sovereign and government engagement — from state-to-state deal facilitation and sovereign wealth fund access to the high-level diplomatic relationships that create and protect the most strategically significant commercial opportunities.', '<p>The most consequential opportunities in energy, finance, and infrastructure are increasingly shaped by sovereign decisions — government policy, state investment priorities, and the bilateral relationships between nations. Accessing and influencing these decisions requires more than technical expertise. It requires trust, integrity, and the ability to operate credibly at the highest levels of government.</p><p></p><p>We advise clients on sovereign engagement strategy, government relations, and the structuring of transactions and partnerships that involve state entities, sovereign wealth funds, national oil companies, and government ministries. </p>', 'Globe', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-03-16 08:35:38'),
(16, 'Cross-Border Deal Enablement', 'cross-border-deal-enablement', 'International Diplomacy', 'We enable cross-border deals from end to end — structuring transactions, clearing regulatory and political hurdles, identifying and qualifying counterparties, and applying the diplomatic and commercial leverage that turns complex international negotiations into signed agreements.', '<p>The most valuable transactions in energy and finance rarely happen within a single jurisdiction. They cross borders, regulatory regimes, currencies, and cultures — and the complexity that comes with that is precisely where deals stall, timelines stretch, and value leaks.</p><p></p><p>We advise clients on the end-to-end enablement of cross-border transactions — spanning deal structuring, multi-jurisdictional regulatory clearance, counterparty identification and qualification, and the coordination of legal, financial, and political workstreams that complex international deals demand.</p><p></p><p>Our value lies not just in technical advisory, but in the relationships and access that accelerate deals at every stage. We operate at the intersection of commerce and diplomacy — knowing when to apply commercial pressure and when to engage politically.</p>', 'Globe', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-03-16 08:33:19'),
(17, 'Geopolitical & Policy Risk Advisory', 'geopolitical-policy-risk-advisory', 'International Diplomacy', 'We advise on geopolitical and policy risk — from country risk assessments and political risk mitigation to scenario planning and strategic positioning in markets where the political landscape is as important as the commercial one.', '<p>In today\'s world, the greatest risks to energy and financial investments are not always market-driven — they are political. Sanctions, regime change, trade disputes, resource nationalism, and shifting policy landscapes can reshape the commercial viability of an entire market overnight. The firms that see these risks coming — and position accordingly — are the ones that protect value and seize opportunity when others retreat.</p><p></p><p>We advise clients on geopolitical risk assessment, political risk mitigation, policy scenario planning, and the strategic implications of government and regulatory change. </p><p>From single-country risk assessments to multi-jurisdictional geopolitical strategy, we help clients build resilience into their commercial frameworks.</p>', 'AlertTriangle', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-03-16 08:28:11'),
(18, 'Reputation & Trust Positioning', 'reputation-trust-positioning', 'International Diplomacy', 'We advise on reputation and trust positioning — helping clients build the institutional credibility, stakeholder relationships, and strategic narrative that open doors, protect value, and create lasting commercial advantage.', '<p>We advise on reputation strategy, stakeholder mapping and engagement, trust-building frameworks, and the positioning of organisations and their leadership at the highest levels of government, energy, finance, and industry. Our advisory spans narrative development, crisis preparedness, regulatory reputation management, and the long-term cultivation of the institutional relationships that underpin commercial success.</p><p>In markets where credibility is currency, we help clients earn it deliberately, protect it fiercely, and leverage it strategically.</p>', 'Award', NULL, NULL, 1, '2026-02-25 14:39:57', '2026-03-16 08:30:52'),
(19, 'PPA Structuring & Negotiation', 'ppa-structuring-negotiation', 'Energy Advisory', 'We structure Power Purchase Agreements that are commercially sound, financially bankable, and built for the long term — covering everything from offtake design and pricing strategy to risk allocation and counterparty negotiation', '<p>We advise clients on the design and negotiation of Power Purchase Agreements that balance commercial viability with long-term energy security. Our expertise spans offtake structuring, risk allocation, pricing mechanisms, and counterparty assessment — ensuring agreements are bankable, resilient, and aligned with our clients\' strategic objectives.</p><p></p><p></p><p>From utility-scale renewables to cross-border energy transactions, we bring deep market insight and transactional experience to every deal, guiding clients through complexity with precision and clarity.</p>', 'Zap', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-13 11:56:47'),
(20, 'Due Diligence & Market Entry', 'due-diligence-market-entry', 'Energy Advisory', 'Strategic market entry advisory across emerging markets, regulated industries, and cross-border expansions.', '<p>We provide rigorous due diligence advisory equipping clients with the intelligence needed to make informed, high-stakes decisions. Our process goes beyond surface-level analysis, examining counterparty credibility, market risk, regulatory exposure, and commercial sustainability to surface opportunities and flag vulnerabilities before they become liabilities.</p>', 'Search', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-13 11:54:42'),
(21, 'Carbon Markets, Green certificates  & ESG Advisory', 'carbon-markets-green-certificates-esg-advisory', 'Energy Advisory', 'Carbon market strategy, ESG advisory, and sustainability-linked structuring across energy, finance, and infrastructure.', '<p>We advise clients on carbon market strategy, emissions management, and the integration of ESG frameworks into their core business and investment decisions. As regulatory pressure intensifies and stakeholder expectations evolve, we help clients turn ESG commitments into measurable, commercially viable outcomes.</p><p>Our expertise spans voluntary and compliance carbon markets, carbon credit structuring, renewable energy certificates monetisation and reporting,  ESG due diligence, and sustainability-linked financing. We work across energy, infrastructure, and financial sectors — helping clients stay ahead of policy shifts, access new capital pools, and build credibility in an increasingly transparency-driven global economy.</p>', 'Leaf', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:45:52'),
(22, 'Route to Market Strategy', 'route-to-market-strategy', 'Energy Advisory', 'Route to market advisory for energy developers, technology providers, and investors across renewables, conventional power, and emerging energy solutions.', '<p>We help energy clients identify and execute the most effective commercial pathways to market — whether bringing new generation capacity online, commercialising an energy technology, or scaling operations across new geographies. In a sector shaped by regulation, infrastructure constraints, and evolving buyer structures, getting to market requires more than a commercial plan — it requires strategic precision.</p><p></p><p>Our advisory spans offtake identification, buyer and off-taker mapping, grid connection and regulatory clearance strategy, commercial structuring, and partnership development. We work across renewables, conventional energy, and emerging energy technologies — connecting clients to the right counterparties, channels, and markets at the right time.</p>', 'TrendingUp', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-13 12:12:11'),
(23, 'Energy Storage & Grid Solutions', 'energy-storage-grid-solutions', 'Energy Advisory', 'Energy storage and grid advisory spanning project structuring, investment strategy, and battery pricing — tolls, floors, and hybrid models.', '<p>As grids evolve to accommodate intermittent renewables and decentralised generation, storage and grid flexibility have become core strategic assets.</p><p>Our advisory spans BESS project structuring, grid-scale investment strategy, ancillary services market participation, and regulatory engagement — helping developers, utilities, investors, and governments deploy solutions that are technically sound, financially bankable, and policy-aligned.</p><p></p><p>Central to our advisory is the structuring of revenue and pricing mechanisms that determine a project\'s bankability. We advise across the full spectrum — from toll arrangements that provide fixed capacity payments regardless of dispatch, to floor price structures that establish a revenue baseline while preserving market upside, to hybrid models that blend both. Each structure is tailored to the client\'s risk appetite, asset profile, and market conditions — ensuring it attracts the right capital and positions the project competitively for the long term.</p>', 'Battery', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-13 12:10:10'),
(24, 'Hydrogen & Future Fuels', 'hydrogen-future-fuels', 'Energy Advisory', 'Commercial and strategic advisory across green and blue hydrogen, ammonia, synthetic fuels, and emerging energy transition technologies.', '<p>We advise clients on the commercial, regulatory, and investment dimensions of hydrogen and next-generation fuel technologies — a rapidly evolving sector at the intersection of energy security, industrial decarbonisation, and geopolitical strategy. From green and blue hydrogen to ammonia, synthetic fuels, and beyond, we help clients navigate a landscape where opportunity and complexity are equally abundant.</p><p></p><p>As global hydrogen markets mature and international trade corridors emerge, we also advise on cross-border hydrogen partnerships, export strategy, and the diplomatic frameworks that underpin large-scale fuel transition agreements.</p><p></p><p></p>', 'Flame', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-13 10:41:19'),
(25, 'Energy Regulation & Policy', 'energy-regulation-policy', 'Energy Advisory', 'Energy regulation and policy advisory spanning compliance strategy, regulatory engagement, market design, and government relations across global energy markets.', '<p>We advise clients on the regulatory and policy landscapes that shape energy markets — helping them anticipate change, influence outcomes, and build strategies that are resilient to shifting political and regulatory environments. In a sector where policy decisions can determine the viability of entire asset classes, regulatory intelligence is not a support function — it is a core strategic advantage.</p><p></p><p>Our advisory spans regulatory mapping and compliance strategy, policy engagement and advocacy, licensing and permitting, market design analysis, and the interpretation of evolving legislative frameworks. We work with developers, investors, utilities, and governments — translating complex regulatory environments into clear, actionable guidance</p>', 'Scale', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-13 10:42:39'),
(26, 'Portfolio & Risk Management', 'portfolio-risk-management', 'Energy Advisory', 'Portfolio optimisation and risk management advisory across energy assets, commodity exposure, counterparty risk, and regulatory and political risk frameworks.', '<p>We advise clients on the structured management of energy portfolios and the identification, quantification, and mitigation of commercial and financial risk. In an environment of price volatility, regulatory uncertainty, and accelerating energy transition, robust portfolio and risk management is essential to protecting value and sustaining long-term performance.</p><p></p><p>Our advisory spans portfolio optimisation, hedging strategy, counterparty risk assessment, commodity price risk management, and the structuring of risk mitigation instruments. We work with energy producers, traders, utilities, and investors — helping them build portfolios that are balanced, resilient, and aligned with their broader commercial and financial objectives.</p>', 'Shield', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-13 10:45:23'),
(27, 'Digital Payments Strategy', 'digital-payments-strategy', 'Fintech', 'EDigital payments and fintech strategy advisory spanning market entry, regulatory compliance, payment system design, and cross-border financial structuring.', '<p>We advise clients on the strategic, commercial, and regulatory dimensions of digital payments and financial technology — a sector reshaping how value moves across borders, institutions, and economies. As payment infrastructure evolves and new entrants challenge established financial models, the ability to navigate this landscape with clarity and conviction is a decisive competitive advantage.</p><p></p><p>Our advisory spans digital payments strategy, payment system architecture and vendor assessment, licensing and regulatory compliance, cross-border payment structuring, and fintech market entry. We work with financial institutions, payment service providers, technology companies, and investors — helping them design strategies that are commercially sound, regulatory-ready, and built for scale.</p><p></p><p>We also advise on the intersection of digital payments and broader financial policy — including central bank digital currencies, open banking frameworks, and the evolving role of fintech in financial inclusion and international development. For clients operating across multiple jurisdictions, we bring both the regulatory intelligence and the diplomatic networks to navigate complex, multi-stakeholder environments with confidence</p>', 'CreditCard', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:41:12'),
(28, 'Embedded Finance & Lending', 'embedded-finance-lending', 'Fintech', 'Embedded finance and lending advisory — product design, credit structuring, regulatory licensing, and platform partnerships.', '<p>The most powerful financial products are no longer built by banks — they are embedded into the platforms people already use. We advise clients on how to design, structure, and deploy embedded finance and lending solutions that create real commercial value, fast.</p><p></p><p>Our advisory covers embedded finance strategy, lending product design, credit risk frameworks, regulatory licensing, and the structuring of partnerships between technology platforms and financial institutions. Whether you are a fintech scaling a credit product, a bank building platform partnerships, or a retailer monetising your customer base — we help you move from concept to market with precision.</p><p></p><p>We also advise on balance sheet structuring, funding strategy, and the governance frameworks required to operate at the intersection of technology and regulated financial services — ensuring your proposition is not only compelling, but built to last.</p>', 'Landmark', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:10:43'),
(29, 'Regulatory & Compliance Advisory', 'regulatory-compliance-advisory', 'Fintech', 'We turn regulatory complexity into competitive advantage — advising on licensing, AML/KYC frameworks, cross-border compliance, and regulator engagement so clients can move decisively in regulated markets.', '<p>Regulation is not the finish line — it is the starting gun. The firms that treat compliance as a strategic asset move faster, close more deals, and build lasting credibility with the regulators and partners that matter most.</p><p></p><p>We cut through regulatory complexity to give clients a clear path forward. Our advisory covers licensing, AML and KYC framework design, compliance programme development, cross-border regulatory structuring, and direct engagement with financial regulators and policymakers. We work with fintechs, financial institutions, and payment service providers — from first licence application to full-scale multi-jurisdictional compliance.</p>', 'FileCheck', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:12:19'),
(30, 'Blockchain & Digital Assets', 'blockchain-digital-assets', 'Fintech', 'We advise clients on blockchain strategy and digital assets — from token design, tokenisation, and DeFi models to the custody frameworks and regulatory structures needed to operate compliantly and competitively in a fast-moving market.', '<p>The rules of finance are being rewritten — on-chain, in real time, across every asset class. Those who understand the technology, the economics, and the regulation will define what comes next. We make sure our clients are among them.</p><p></p><p>We advise on the full spectrum of blockchain and digital asset strategy — token design and issuance, digital asset custody frameworks, tokenisation of real-world assets, DeFi and Web3 commercial models, and the regulatory and compliance architecture required to operate in this space with credibility and staying power.</p><p></p><p>From established financial institutions entering the digital asset space to native Web3 businesses scaling globally, we bring the strategic, commercial, and regulatory expertise to turn ambition into execution.</p>', 'Link', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:13:45'),
(31, 'Capital Raising & Investor Relations', 'capital-raising-investor-relations', 'Fintech', 'Capital raising and investor relations advisory across energy, fintech, and infrastructure — strategy, structuring, targeting, and long-term investor engagement.', '<p>Access to the right capital — at the right time, on the right terms — is the difference between a good idea and a great business. We advise clients on capital raising strategy and investor relations across energy, fintech, and infrastructure, connecting them with the investors, institutions, and funding structures that align with their commercial objectives and growth trajectory.</p><p></p><p>Our advisory spans capital raising strategy, investor targeting and positioning, pitch and information memorandum development, deal structuring, and the ongoing management of investor relationships. Whether raising early-stage growth capital, structuring project finance, or preparing for a strategic transaction, we help clients present with conviction and negotiate with strength.</p><p></p><p>Beyond the raise, we advise on investor relations frameworks that build long-term credibility — ensuring clients communicate performance, strategy, and risk in a way that retains existing investors and continuously attracts new ones.</p>', 'TrendingUp', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:40:04'),
(32, 'Data & Payment Infrastructure', 'data-payment-infrastructure', 'Fintech', 'Data and payment infrastructure advisory spanning system design, API integration, vendor assessment, data governance, and regulatory compliance.', '<p>The backbone of every successful financial service is the infrastructure that powers it. As payment systems grow more complex and data becomes the most valuable asset in financial services, the quality, resilience, and strategic design of your infrastructure is no longer an operational consideration — it is a boardroom one.</p><p></p><p>We advise clients on the architecture, procurement, and optimisation of data and payment infrastructure — spanning payment system design, data strategy and governance, API and open banking integration, infrastructure vendor assessment, and the regulatory requirements that underpin compliant, scalable operations.</p><p></p><p>Whether you are building from the ground up, modernising a legacy system, or scaling across new markets and jurisdictions, we help clients make infrastructure decisions that are commercially sound, technically robust, and built to support the next phase of growth.</p>', 'Database', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:38:30'),
(33, 'Strategic Government Engagement', 'strategic-government-engagement', 'International Diplomacy', 'Strategic government engagement and international relations advisory — diplomatic strategy, bilateral and multilateral negotiations, geopolitical risk, and public-private partnership structuring.', '<p>The most consequential deals in energy and finance are not closed in boardrooms alone — they are shaped by the relationships, trust, and diplomatic capital built long before a contract is signed. We advise clients on how to engage governments, multilateral institutions, and international bodies strategically — turning political complexity into commercial opportunity.</p><p></p><p>Our advisory spans government relations strategy, high-level diplomatic engagement, bilateral and multilateral negotiation support, public-private partnership structuring, and the navigation of geopolitical risk. We work with corporates, investors, sovereign entities, and development finance institutions — helping them build the institutional relationships and political credibility that underpin large-scale, cross-border transactions.</p><p></p><p>In an era where energy security, financial regulation, and trade policy are inseparable from geopolitics, we bring the networks, the nuance, and the experience to operate at the highest levels of government and international diplomacy — where the real decisions are made.</p>', 'Users', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:40:11'),
(34, 'Multilateral & Development Finance', 'multilateral-development-finance', 'International Diplomacy', 'We advise on multilateral and development finance — from MDB and DFI engagement and project preparation to blended finance structures that combine development mandates with commercial returns.', '<p>Multilateral development banks, development finance institutions, and international funding bodies exist to move capital into markets and sectors where it matters most.</p><p></p><p>Our advisory covers MDB and DFI engagement strategy, project preparation, funding structuring, blended finance design, and the governance and compliance frameworks these institutions demand. </p><p></p><p>Where commercial capital meets development mandate, we build the structures that satisfy both — closing the gap between ambition and execution in the markets that need it most.</p>', 'Building', NULL, NULL, 1, '2026-02-25 17:40:19', '2026-03-16 08:40:19');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('tIJx6oA6RMvaRmwXXfapqGHMJYQSVVy3irkLbX5s', NULL, '45.114.243.179', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1A1eGp2b202QXhpMTlVcGpoV1puZmdYSlJVbmdOckhMWFA2SWJpOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773758846),
('yPyiCmyDY39EBYd0TAQ6VhYsnXg6JNtPAkfOagmm', NULL, '152.39.219.167', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGR3dHdGTDIwTGpjODdwMUV1SVJCRU9DbDgxaVc3b2xCSGRvMm9ueCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758846),
('jVucd7YTR7K7CIy6Wyow6jUSkiaoTHokQdKIh9jm', NULL, '103.196.9.111', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2kxbWx2dzFEbm13cnd1RVdnZG5jZDd2U2FEVERjZVF4eURac3lrdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773758846),
('paET8fItpgT7Ov02OYywAMD675Gk4cddEJ8fNBp6', NULL, '167.99.210.137', 'Mozilla/5.0 (l9scan/2.0.3383e2834313e28333e24353; +https://leakix.net)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVjluVzZHeUd3a1FvTXI1Q2hIbUdBb2tTTTJVMlNiVFBibHQ5cVA2SCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Njc6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbS8/cmVzdF9yb3V0ZT0lMkZ3cCUyRnYyJTJGdXNlcnMlMkYiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773758838),
('xMiFHW4XvCYNTgpqH7dvLIYqVR3HrNWT5fhs5LQx', NULL, '34.226.142.252', 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlFMN0pJdks1YUxZQ0ZZTk43dGh1MDhleHg3cXVpOHhqNkRUUk5GQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758777),
('N4Ff5nEZrV2PSsF3QMnOKxIe6fThnNrXkksdD0nw', NULL, '54.81.193.168', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRHFMTWdvMEJRb1N2Yk8xRGZNYWxTZ1J4ZlB5OG1wWVFRZWVIUllvTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758781),
('PT3j2TiRcukNZSsdSf1me9vZePbJnIzXqyoV7fwh', NULL, '54.86.207.248', 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUJHMExzYnNhYXh3emV3YnNxNlFmZlh3Yk82Z291S05Pa3NJVDVtNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758797),
('ykW3oMjS4xUxOgNjdEF6lDRsovu94lUxhYFJij7N', NULL, '54.197.5.175', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWTFBZkt6TjhqRHFITmpSWDZGN3NrUTJva1hibVREVzVtdXhsWW5CYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758801),
('T3Mm4AgVss8TN1jZFOziMN8C8qeLM5oZfB8nn68g', NULL, '167.99.210.137', 'Mozilla/5.0 (l9scan/2.0.3383e2834313e28333e24353; +https://leakix.net)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTDZFUXZmMnpmVGJjQVJnbDloTkYxMFcwQ3lzUTgzMW5xUzQwSWhkZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758802),
('6Cs55beQwF80yZhXfznkbaDVsKt86IYcQMCaG7KH', NULL, '107.173.172.150', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.35/36 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiOUtINFpLSXFZTUZvbHFRRUczdVdHcmJsWmQ3bE5jaUZ6Nkp4dE1GbiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773758834),
('pYUmhYqERaSOgicadFK0WMcGK47lskRmuMMmrEgS', NULL, '104.168.71.144', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZjBPbFJhandZRWdTS3pIQkNmMlpxYmpiT0l5VUd3dHpzTUZjdE44YyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758846),
('o6xSqTfaDSmNKDC839EakMXSriuzW0jOPZLbjNw2', NULL, '34.122.147.229', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUnRDZTlodmNrcTV2SWhHQnRhbWIxWnVjaW80Vk1LSmpEV3hSUDVYOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773758886),
('31o5Ryu4NCyQUHhqu8RKeCXFhgSm1zIfvP6B7UXR', NULL, '195.221.56.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUnl0Y0JsRzJZSE1ucFFCMHh2ZW5mSzJ0dTh6Q0JqMEd2NllBVXE0OCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773758977),
('9BoGZUrDX4MvFkVqHjQALrTB8XPArGBi0M09ElcM', NULL, '195.221.56.3', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNDR0dXhReUVWQjNpV1RrN0xEZVhMd3pRTkpxRzdyYm9XdkJIMVZOcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758978),
('8M9bg1BcSLpBjycB6hOyfpA5KXadN6V8Y0ur3kh3', NULL, '79.127.175.74', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUldHWVd1blBxTDNLSVlVdk01aGlNaUZOZUtqZTZUMEdtdW1HQUVlRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773758992),
('8oSJKgHTn8cvyjs2271R7uthttehIbkkyrU8RrMt', NULL, '31.97.153.61', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3FlSU1IZU4zMUtPemE1S1NCTVNTMXVLclVjbXRoVkNweXUxZWplWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773759140),
('cGOkHEeas8EayurhnciIRbvkQttgQbVPOW0Zrt9Y', NULL, '31.97.153.61', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.3300.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRkVtb09ib3lQQXhJR09SQkVObGwyeExvZDBCVVBZQUxFUnZaQ0xGYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773759139),
('79Vj5PQasbARN77PqNt7LQBhEtr0c4Udk2UmXvvW', NULL, '107.172.160.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2JPSjVXVEJYMmxnMnV6V3VZeDJwN0tKM0pqVTJrbDBXSGNoYkZRaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773759350),
('zvMjiBi7aoXaJi6JT6GC3fGfBTxtNc5NDeTY7Jfx', NULL, '152.163.186.194', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSEpzMW5wYWJmNG42OTJUc1B5cGNnQXk0ejJYVzNBYlVneHZHNnpkTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773759355),
('c1SR7wWJ3rq8X5s4RgwqDQ3QQroqoLWV4U9oY2wF', NULL, '34.34.64.191', 'Scrapy/2.13.4 (+https://scrapy.org)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHpub0lGOGgzYU50ajhMYUhWYVZ0cjQ5WkFGWTRRd3dkVzZPaDBKbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773759487),
('VmK6Vsqhe3u7M3PHaLwVn1wyZmubffzYRKVuPZqL', NULL, '34.147.22.160', 'Scrapy/2.13.4 (+https://scrapy.org)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ21wZ2ZsR0I0alRHRGxLWnRxZFlMOUhDbkt5ZThYNmI2Q0tBRlJYNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773759487),
('OaSX3FKr5elOsF3SEjmB4F1BeAJjXmmTMVgFp7Lw', NULL, '81.29.142.6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 YaBrowser/21.6.4.786 Yowser/2.5 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZGhMMXJGSURIbEtYcklQYmhJWWtDWFFLTjlkVzRHRGlldDBuZTE0eSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773759740),
('MTIwpKxaYWTrUgRyHswVzEB7xKzHlKnJcNs7igkE', NULL, '81.29.142.6', 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGxvTVBMalJxN09sS01ZdzgwbDhsZ2FWbm9sTUJKbG1rZ3BqRlhvYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773759740),
('LxL54f1nJ8kTbtYTnw0cRhbG6VN4oZfHteC6E8Se', NULL, '91.231.89.97', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkx4eWVhUTJ4Vm4wd1hWTEZFVm9YZGpXbEk4S1RpZ2xXUHN0bzNPRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773760647),
('sLFbhDvNpd7dYCCKFeI5Z0Yao8Jewi2IlvA71GI3', NULL, '91.231.89.101', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGlWcVdvc3ZLMlFRRkZOdkdmUmlUSW9XemcySnd2VDNKMGdiTm9sYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773760661),
('YYcTKMRbDushCjHLcJPB0YKnAHu4hgpfOnGeToPf', NULL, '64.15.129.111', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGJ6QU1MZlJ0MTVTdTVzRWpUZ3lLbnB5TGdNMjFxYTBQZXh2NjlFbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773760714),
('qC0OT2xIrdAdf0GJTMh4LqoZ0NARfNHbqDUwjFAQ', NULL, '192.175.111.236', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM1R6MmxFTFYyOTNTV0FXaG9oYnR4TXpybTdpZTZWTThhSG5Lc2lDWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773760717),
('0zWuVYqPQuZeU01d0DR1t4DfJKiHvw4bbEY0yPt8', NULL, '192.175.111.246', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNW5ibzlNUmlKYWVvMTZsMW9rSFlzdVVqRVhPN1hvenNBR01JODM0YSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773760724),
('sIm7riRCFac02fXoc4dpRq4yl8SbPTyYat0jhf4X', NULL, '192.175.111.231', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOEFiT3Y2c2lLS05vTDkxdGFHTEduaFF0bGI2ZGNPU3FMa2pzZGh5MyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773760727),
('cgayuZarZ55wKAyY0jebIDuCqAH7sznHtQvIZFZf', NULL, '64.15.129.115', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFNOQlZDUktQa1JoUWlsNGZWemFWb2E4enE0QUg5RUVva3FmaGhLUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773760730),
('SUtizSZpmZqgTvAjHjIrEX3QApsGWakV2Cz85xHA', NULL, '64.15.129.116', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUhEMzJRTDdjTVlyVzU3WmlueDZjYlFHMXNpN2JaTHM0RkZhendZcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773760733),
('I05FAu6FjesXbRyhRuc0BW6loZT4sTQkfIKT3gk4', NULL, '64.15.129.114', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidzVRTm9WcFpBNEpvY3d2SzMzYk9zR2VwSU5VSjhVZmN3d21mUmlxcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773760737),
('BFTxIuFefu9p935knFt2TJmNvSMrFs4JLQ4qe4mW', NULL, '192.175.111.235', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYlVsUE80WHM0dHBsWHB3ZnNpcVlOa1dBSTFBTFl5R21pRUFtMXN0RyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773760743),
('Al9ZiSHYx7gVCyCrZn7EIcjyNmmwjRdFI6FokVbp', NULL, '192.175.111.233', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0tlcWNtOG54alJ0TXplcEp4aVN4dVBWc251TWxvcXpxd2dBQ2Y0SiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773760745),
('BwcglPAkrwa7o4DRlZdMbMCXXjDzfkxakiWShomE', NULL, '64.15.129.109', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSUZNaXhXalBvdmNGOTdXcDZQWXptNElhQ1VyckRaMUxOR0xZV2U4cCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773760746),
('mzcpHupQHV3fIvTNqB11NmROGjE5quWpPnvbLszL', NULL, '91.231.89.103', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0g0ckRnS084Ymkzd2hZVkN5bmlYcFdGVGY1SUxKZzFjaTBNSjRLUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773760756),
('IXdMs0ZSNx99Hv164CqyWIR06jW9qMYIS3fkJq4W', NULL, '91.231.89.16', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDk2Y1lFWElYS0c0R0p1RHp3RXFYVTdZUzB4UFcwV3BMVU1TYWpzdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773760881),
('nFdChTn4l1Za31hQjzTljicJqU0UhLTEcDIJG8QI', NULL, '199.91.220.117', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkVSUFdCendZQW9aak1GNkVFNk5ndEJ5eUpzQjVzeUdyT0RYUThPdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773762398),
('8L9kEQ7FCmd4hmTXL537JwNGDi2oOly7SCRY9tj0', NULL, '91.231.89.32', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUFNUTHM5cmhZaHRlMHI4UlFaTXpsb2RCd1pMTjNXNjdwY0hFNldGTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773763596),
('WF4l0yrvbBOBCPAYSC7rDHUAiPfWI6WuOMdoh7G2', NULL, '91.231.89.35', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0xDZmNzdXBUVzVHTlgwd1hGWE1IYlR4UE9qV3ZsRGJpUU93aFFPSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly93d3cuYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773763643),
('SRP2wSLInheeFINbTE6ZV0JpSBjchbf0QjHMfwBS', NULL, '91.231.89.37', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHNZaWpZTGxPNjl2WGlVNjRZQU5LZ2NOcGJwYkprVVExVXdybXlzYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773763707),
('4TuCeyBy5dsiUqK3eVakSwFwxKNYd4azrxUkJKVw', NULL, '91.231.89.126', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSkdGQWd5Zm82OFZjejhsVE0xT3pveE0xbUd4cVVtRGNITUljb0VZdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773763885),
('lrCQOTLAUAHOjEtW51h9rtJp1CCtd7BYdkgMMerS', NULL, '216.73.216.102', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibTIyVWgzNEJmS2VaeWd2VlVMTmFhVUVGRkszbE9UbUxESE1VeFVCeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773764169),
('8BFK4hOQgdb2LI7rUvLzgLaoXy2gc568cbd5Yd9B', NULL, '137.184.47.41', 'vercel-screenshot/1.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmxzTEtHVFFxUkZTS3ZBT2dhbXVzZkJENEVFdDNVWGVFOUVaMTVtRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773764275),
('t7g56WpJpg16el6c2O3a7xEiPETYzLT4C6CHiFUD', NULL, '64.23.206.58', 'vercel-screenshot/1.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaXk3aHZRVkE5SkdMUXVBRmxNaE5CR1UwMXRpQVRsQTAyMXd6WDVleCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773764275),
('zZfIvm5VrA45MOEJtqv0TVoraouwx5OzQQSQdLJz', NULL, '216.73.216.102', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiekJLWVFYUWlBSVliQUNUb2lEOWs0ZzlhdW5aTXJuZ29kZzRFNVpGTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHBzOi8vd3d3LmFwaS5uaXNzaS1pbnNpZ2h0cy5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1773764439),
('Zn9Me6LL6ASCoih3uxhOk1CWF6uwdSP2LTKrEMez', NULL, '178.22.106.230', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYU1mZWFjc2x4VjlBR0xtcGQ3QkIzQmJhTURDV25Nekp2Y0x1aVN1YiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773764896),
('StGFVihec30F0dlDQZczN8A7qde8zOxtOwJMdvJU', NULL, '2a06:98c0:3600::103', '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZTJRMUZOSnh4TzBCOERmUEh3Vjc4YXU0aEFSZ0I2TVE5dUFJOEF4WSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHBzOi8vYXBpLm5pc3NpLWluc2lnaHRzLmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1773765306),
('Iwk2P1Y1YQXPdnVugeI4mKTdZTuwf1tRJvHnnYmY', NULL, '35.202.5.96', 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.17 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDJiUHd1czRHMllaRXRpRHI1SHhvellwSVpIMGdqbkFlM2pKNUYyTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773765557),
('D64tgSG4oeDuKpkSbDlQ3H1fEZHqom0Jky1dnnmf', NULL, '52.12.22.5', 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUFON0NrM3FJU2NnTXQydU5rVTRIbWg3SVdLS1Jua1ZGU3d6b0xGMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773768430),
('rH85inRtWdFrZpHfSBUHVDQd96kArpPEAtYzPGSO', NULL, '52.12.22.5', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWlJBMGI3S1VBQU1oeVBMTnZLTHY2NFdKbHpQSDFjdUFpbjZIRDJrQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjk6Imh0dHA6Ly9hcGkubmlzc2ktaW5zaWdodHMuY29tIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773768430);

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `group` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `key`, `value`, `type`, `group`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'Nissi Insights', 'text', 'general', '2026-02-25 11:43:39', '2026-02-25 11:43:39'),
(2, 'logo_light', 'https://nissi-insights.com/api/storage/uploads/4fmvWUuKoEASNwDKMihsClQ3AQOXKfVXCYlMB66k.png', 'image', 'branding', '2026-02-25 11:43:39', '2026-03-11 12:34:01'),
(3, 'logo_dark', 'https://nissi-insights.com/api/storage/uploads/NnekJW2fnl6xFfUTofXlv2agtVquHtrGgSgZMQcU.png', 'image', 'branding', '2026-02-25 11:43:39', '2026-03-11 12:34:01'),
(4, 'favicon', '/assets/favicons/favicon.png', 'image', 'branding', '2026-02-25 11:43:39', '2026-03-10 00:47:06'),
(5, 'dashboard_favicon', '/assets/favicons/dashboard-favicon.png', 'image', 'branding', '2026-02-25 11:43:39', '2026-03-10 00:47:06'),
(6, 'hero_title', 'Intelligence for the future of energy', 'text', 'homepage', '2026-02-25 11:43:39', '2026-03-10 00:47:06'),
(32, 'about_story', 'Nissi Insights was founded on the principle that market intelligence should be accessible, actionable, and rigorous. We connect decision-makers with the data they need to navigate the world\'s most complex energy and financial landscapes.', 'textarea', 'about', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(31, 'about_tagline', 'Our Mission & Vision', 'text', 'about', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(30, 'about_title', 'Intelligence for the Future', 'text', 'about', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(7, 'nissi_assistant_enabled', '1', 'boolean', 'widgets', '2026-03-09 13:39:10', '2026-03-09 13:39:10'),
(8, 'nissi_assistant_id', 'cl-...', 'text', 'widgets', '2026-03-09 13:39:11', '2026-03-10 00:47:06'),
(9, 'whatsapp_enabled', '1', 'boolean', 'widgets', '2026-03-09 13:39:11', '2026-03-09 13:39:11'),
(10, 'whatsapp_number', '+447000000000', 'text', 'widgets', '2026-03-09 13:39:11', '2026-03-09 13:39:11'),
(11, 'whatsapp_message', 'Hello, I have a question about Nissi Insights.', 'text', 'widgets', '2026-03-09 13:39:11', '2026-03-09 13:39:11'),
(12, 'main_nav_links', '[{\"name\":\"Insights\",\"href\":\"/insights\"},{\"name\":\"Case Studies\",\"href\":\"/case-studies\"},{\"name\":\"Client Impact\",\"href\":\"/client-impact\"},{\"name\":\"About\",\"href\":\"/about\"},{\"name\":\"Contact\",\"href\":\"/contact\"}]', 'text', 'general', '2026-03-09 13:49:39', '2026-03-10 01:41:57'),
(13, 'chatbot_faq_data', '[{\"keywords\":[\"energy\",\"advisory\",\"ppa\",\"renewable\",\"power\"],\"answer\":\"Our Energy Advisory practice covers PPA structuring, due diligence, carbon markets, route-to-market strategy, and portfolio risk management. We work with developers, investors, and governments across renewable energy, storage, and hydrogen projects.\"},{\"keywords\":[\"fintech\",\"payments\",\"digital\",\"blockchain\",\"lending\"],\"answer\":\"Our Fintech advisory covers digital payments strategy, embedded lending, regulatory compliance, blockchain & digital assets, and capital raising. We help fintech companies navigate complex regulatory landscapes and scale their operations.\"},{\"keywords\":[\"diplomacy\",\"government\",\"geopolitical\",\"cross-border\",\"political\"],\"answer\":\"Our International Diplomacy practice provides strategic government engagement, cross-border deal enablement, geopolitical risk advisory, and reputation management. We help organisations navigate complex political landscapes.\"},{\"keywords\":[\"contact\",\"reach\",\"email\",\"phone\",\"office\",\"talk\"],\"answer\":\"You can reach us through our Contact page at \\/contact, or request a consultation directly. Our team typically responds within 24 hours.\"},{\"keywords\":[\"service\",\"offer\",\"provide\",\"do\",\"help\",\"what\"],\"answer\":\"Nissi Insights operates across three pillars: Energy Advisory, Fintech, and International Diplomacy. Each pillar offers specialised advisory services. Visit our Services page to explore our full range of offerings.\"},{\"keywords\":[\"case\",\"study\",\"project\",\"work\",\"portfolio\",\"example\"],\"answer\":\"We showcase our advisory impact through detailed case studies across all practice areas. Visit our Case Studies page to explore projects including PPA portfolio structuring, fintech market entry, and government engagement programmes.\"},{\"keywords\":[\"insight\",\"report\",\"analysis\",\"research\",\"publish\",\"article\"],\"answer\":\"Our Insights hub features thought leadership on energy markets, fintech trends, and geopolitical analysis. We regularly publish reports, market analyses, and strategic commentary. Visit our Insights page for the latest publications.\"},{\"keywords\":[\"about\",\"who\",\"team\",\"nissi\",\"company\",\"background\"],\"answer\":\"Nissi Insights is a strategic advisory firm specialising in energy, fintech, and international diplomacy. We provide intelligence and advisory services that help decision-makers navigate complexity with confidence.\"},{\"keywords\":[\"consult\",\"book\",\"meeting\",\"schedule\",\"appointment\"],\"answer\":\"You can request a consultation through our Consultation page. Simply fill in your details and our team will arrange a convenient time to discuss your requirements.\"}]', 'text', 'widgets', '2026-03-09 14:01:19', '2026-03-09 14:01:19'),
(14, 'chatbot_quick_replies', '[\"What services do you offer?\",\"Tell me about Energy Advisory\",\"How can I contact you?\",\"Show me case studies\"]', 'text', 'widgets', '2026-03-09 14:01:19', '2026-03-09 14:01:19'),
(15, 'hero_home_video_1', '/assets/videos/hero/01-energy.mp4', 'video', 'homepage', '2026-03-09 14:31:51', '2026-03-09 14:31:51'),
(16, 'hero_home_video_2', '/assets/videos/hero/02-fintech.mp4', 'video', 'homepage', '2026-03-09 14:31:51', '2026-03-09 14:31:51'),
(17, 'hero_home_video_3', '/assets/videos/hero/03-diplomacy.mp4', 'video', 'homepage', '2026-03-09 14:31:51', '2026-03-09 14:31:51'),
(18, 'hero_about_media', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1920&q=80', 'image', 'about', '2026-03-09 14:31:51', '2026-03-09 16:30:12'),
(19, 'hero_services_media', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80', 'image', 'services', '2026-03-09 14:31:51', '2026-03-09 16:30:12'),
(20, 'hero_insights_media', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80', 'image', 'insights', '2026-03-09 14:31:52', '2026-03-09 16:30:12'),
(21, 'hero_case_studies_media', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80', 'image', 'case_studies', '2026-03-09 14:31:52', '2026-03-09 16:30:12'),
(22, 'hero_client_impact_media', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1920&q=80', 'image', 'client_impact', '2026-03-09 14:31:52', '2026-03-09 16:30:12'),
(23, 'hero_contact_media', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80', 'image', 'contact', '2026-03-09 14:31:52', '2026-03-09 16:30:12'),
(24, 'hero_consultation_media', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80', 'image', 'consultation', '2026-03-09 14:31:52', '2026-03-09 16:30:12'),
(25, 'privacy_policy', '<h1><strong>1. Introduction</strong></h1><p></p><p>Nissi Insights (\"we\", \"our\", or \"us\") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website <strong>nissi-insights.com</strong> (the \"Site\") and use our advisory, consulting, and market intelligence services (the \"Services\").</p><p>By accessing or using our Site and Services, you agree to the terms of this Privacy Policy. If you do not agree with the practices described herein, please do not use our Site or Services.</p><p></p><h2><strong>2. Information We Collect</strong></h2><p></p><h2><strong><em>2.1 Information You Provide Directly</em></strong></h2><p>We may collect the following categories of personal information when you interact with us:</p><ol><li><p><strong>Contact Information:</strong> First name, last name, email address, phone number, and company/organisation name, provided when you submit a consultation request, contact form, or newsletter subscription.</p></li><li><p><strong>Professional Information:</strong> Job title, sector of interest, organisation name, and preferred engagement timeframe, provided during consultation requests.</p></li><li><p><strong>Communication Content:</strong> The subject and body of messages you send to us through our forms or email.</p></li><li><p><strong>Account Information:</strong> Login credentials if you register for an account on our platform.</p></li></ol><h3>2.2 Information Collected Automatically</h3><p>When you visit our Site, we may automatically collect certain technical information, including:</p><ul><li><p><strong>Device Information:</strong> Browser type, operating system, device type, and screen resolution.</p></li><li><p><strong>Usage Data:</strong> Pages visited, time spent on pages, referring URLs, click patterns, and navigation paths.</p></li><li><p><strong>Network Information:</strong> IP address, approximate geographic location (city/country level), and internet service provider.</p></li><li><p><strong>Cookies and Tracking Technologies:</strong> Information collected via cookies, web beacons, and similar technologies as described in our <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"text-primary hover:underline cursor-pointer\" href=\"/cookies\">Cookie Policy</a>.</p></li><li><p></p></li></ul><h2><strong>3. How We Use Your Information</strong></h2><p>We use your personal information for the following purposes:</p><ul><li><p><strong>Service Delivery:</strong> To respond to your consultation requests, provide advisory services, and deliver market intelligence reports.</p></li><li><p><strong>Communication:</strong> To send you confirmation emails, respond to enquiries, provide updates on your requests, and send relevant industry insights you have opted into.</p></li><li><p><strong>Site Improvement:</strong> To analyse usage patterns and improve our Site\'s performance, content, and user experience.</p></li><li><p><strong>Security:</strong> To detect, prevent, and address technical issues, fraud, or security threats.</p></li><li><p><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</p></li><li><p><strong>Marketing:</strong> With your consent, to send newsletters and information about our services, events, and publications that may be of interest to you.</p></li><li><p></p></li></ul><h2><strong>4. Legal Basis for Processing (GDPR)</strong></h2><p>If you are located in the United Kingdom or European Economic Area, we process your personal data under the following legal bases:</p><ul><li><p><strong>Consent:</strong> Where you have given explicit consent (e.g., subscribing to our newsletter).</p></li><li><p><strong>Contractual Necessity:</strong> Where processing is necessary to perform a contract or respond to a pre-contractual request (e.g., consultation submissions).</p></li><li><p><strong>Legitimate Interests:</strong> Where processing is necessary for our legitimate business interests (e.g., analytics, site security, service improvement), provided these do not override your rights.</p></li><li><p><strong>Legal Obligation:</strong> Where processing is required to comply with applicable law.</p></li><li><p></p></li></ul><h2><strong>5. Data Sharing and Disclosure</strong></h2><p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:</p><ul><li><p><strong>Service Providers:</strong> We may engage trusted third-party service providers who assist us in operating our Site, conducting our business, or servicing you (e.g., email delivery services, hosting providers, analytics platforms). These providers are contractually obligated to protect your data.</p></li><li><p><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law, court order, or governmental authority, or if we believe disclosure is necessary to protect our rights, safety, or property.</p></li><li><p><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p></li><li><p></p></li></ul><h2><strong>6. Data Retention</strong></h2><p>We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including satisfying legal, accounting, or reporting requirements. Consultation request data is typically retained for <strong>24 months</strong> from the date of submission unless a longer retention period is required by law or an ongoing business relationship.</p><p></p><h2><strong>7. Your Rights</strong></h2><p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p><ol><li><p><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</p></li><li><p><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</p></li><li><p><strong>Right to Erasure:</strong> Request deletion of your personal data where there is no compelling reason for continued processing.</p></li><li><p><strong>Right to Restrict Processing:</strong> Request that we limit the processing of your data in certain circumstances.</p></li><li><p><strong>Right to Data Portability:</strong> Request a machine-readable copy of your data for transfer to another service.</p></li><li><p><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</p></li><li><p><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, withdraw your consent at any time.</p></li></ol><p>To exercise any of these rights, please contact us at <strong>legal@nissi-insights.com</strong>. We will respond within 30 days of receiving your request.</p><p></p><h2><strong>8. International Data Transfers</strong></h2><p>Your information may be transferred to and processed in countries outside of your country of residence, including countries that may not provide the same level of data protection. Where such transfers occur, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the relevant regulatory authorities.</p><p></p><h2><strong>9. Data Security</strong></h2><p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These measures include encryption of data in transit (TLS/SSL), secure server infrastructure, access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p><p></p><h2><strong>10. Children\'s Privacy</strong></h2><p>Our Site and Services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected personal data from a child, we will take steps to delete such information promptly.</p><p></p><h2><strong>11. Third-Party Links</strong></h2><p>Our Site may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p><p></p><h2><strong>12. Changes to This Policy</strong></h2><p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. The updated policy will be posted on this page with a revised \"Last Updated\" date. We encourage you to review this policy periodically. Material changes will be communicated via email or a prominent notice on our Site.</p><p></p><h2><strong>13. Contact Us</strong></h2><p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p><ul><li><p><strong>Email:</strong> legal@nissi-insights.com</p></li><li><p><strong>Address:</strong> Nissi Insights, One Canary Wharf, London, E14 5AB, United Kingdom</p></li></ul><p>If you are not satisfied with our response, you have the right to lodge a complaint with the <strong>Information Commissioner\'s Office (ICO)</strong> at <a target=\"_blank\" rel=\"noopener\" class=\"text-primary hover:underline cursor-pointer\" href=\"https://ico.org.uk\">ico.org.uk</a>.</p>', 'rich-text', 'legal', '2026-03-09 15:14:56', '2026-03-10 03:26:03'),
(26, 'terms_of_service', '<h2><strong>1. Acceptance of Terms</strong></h2><p>These Terms of Service (\"Terms\") govern your access to and use of the Nissi Insights website at <strong>nissi-insights.com</strong> (the \"Site\") and all related services, content, and functionality offered by Nissi Insights (\"we\", \"our\", or \"us\"). By accessing or using our Site, you agree to be bound by these Terms. If you do not agree, you must not use our Site or Services.</p><p></p><h2><strong>2. Description of Services</strong></h2><p>Nissi Insights provides professional advisory, strategic consulting, and market intelligence services focused on the energy sector, financial technology, international diplomacy, and related industries (the \"Services\"). Our Services include but are not limited to:</p><ul><li><p>Strategic advisory and consultation sessions</p></li><li><p>Market intelligence reports and analysis</p></li><li><p>Industry insights, articles, and publications</p></li><li><p>Case study documentation and best-practice frameworks</p></li></ul><p>The specific scope, deliverables, and terms of any engagement will be defined in a separate service agreement or statement of work between you and Nissi Insights.</p><p></p><h2><strong>3. User Eligibility</strong></h2><p>You must be at least 18 years of age and have the legal capacity to enter into a binding agreement to use our Site and Services. By using our Site, you represent and warrant that you meet these requirements.</p><p></p><h2><strong>4. User Accounts</strong></h2><p>Certain features of our Site may require you to create an account. You are responsible for:</p><ul><li><p>Maintaining the confidentiality of your account credentials.</p></li><li><p>All activities that occur under your account.</p></li><li><p>Notifying us immediately of any unauthorised access or use of your account.</p></li></ul><p>We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe are being used for fraudulent or unauthorised purposes.</p><p></p><h2><strong>5. Intellectual Property</strong></h2><h3>5.1 Our Content</h3><p>All content on our Site, including but not limited to text, graphics, logos, images, data compilations, reports, case studies, software, and the overall design and layout (collectively, \"Our Content\"), is the property of Nissi Insights or its licensors and is protected by United Kingdom and international copyright, trademark, and intellectual property laws.</p><h3>5.2 Limited Licence</h3><p>We grant you a limited, non-exclusive, non-transferable, revocable licence to access and use our Site and Our Content for your personal, non-commercial use, subject to these Terms. You may not:</p><ul><li><p>Reproduce, distribute, modify, create derivative works of, publicly display, or publicly perform Our Content without prior written consent.</p></li><li><p>Use Our Content for commercial purposes, including resale, redistribution, or incorporation into competing products or services.</p></li><li><p>Remove, alter, or obscure any copyright, trademark, or proprietary notices.</p></li><li><p>Use data mining, scraping, or similar automated methods to extract content from our Site.</p></li></ul><h3>5.3 Your Content</h3><p>By submitting content to us (e.g., through consultation forms, feedback, or communications), you grant us a non-exclusive, worldwide, royalty-free licence to use, process, and store such content as reasonably necessary to provide our Services and operate our business.</p><p></p><h2><strong>6. Consultation Requests and Submissions</strong></h2><p>When you submit a consultation request or contact form through our Site:</p><ul><li><p>You agree to provide accurate and complete information.</p></li><li><p>Submission of a request does not create a binding contract for services; it constitutes an expression of interest.</p></li><li><p>We will endeavour to respond to your request within 24–48 business hours, but response times may vary.</p></li><li><p>Any subsequent engagement will be formalised through a separate written agreement.</p></li><li><p></p></li></ul><h2><strong>7. Newsletter and Communications</strong></h2><p>By subscribing to our newsletter, you consent to receive periodic emails containing industry insights, company updates, and promotional content. You may unsubscribe at any time by clicking the \"unsubscribe\" link in any email or by contacting us directly. We process newsletter subscriptions in accordance with our <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"text-primary hover:underline cursor-pointer\" href=\"/privacy\">Privacy Policy</a>.</p><p></p><h2><strong>8. Disclaimers</strong></h2><h3>8.1 General Advisory Disclaimer</h3><p>The information, insights, and content published on our Site are provided for general informational purposes only. They do not constitute professional advice (financial, legal, investment, or otherwise). You should not act upon any information provided on this Site without seeking independent professional advice tailored to your specific circumstances.</p><h3>8.2 No Warranty</h3><p>Our Site and Services are provided on an <strong>\"as is\"</strong> and <strong>\"as available\"</strong> basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement. We do not warrant that:</p><ul><li><p>The Site will be uninterrupted, error-free, or secure.</p></li><li><p>Any information or content is accurate, complete, or current.</p></li><li><p>Any defects will be corrected in a timely manner.</p></li><li><p></p></li></ul><h2><strong>9. Limitation of Liability</strong></h2><p>To the maximum extent permitted by applicable law, Nissi Insights, its directors, officers, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill, arising out of or in connection with your use of the Site or Services, whether based on warranty, contract, tort, negligence, or any other legal theory.</p><p>Our total aggregate liability for any claims arising from or related to these Terms or our Site shall not exceed the amount you have paid to us (if any) in the twelve (12) months preceding the event giving rise to the claim.</p><p></p><h2><strong>10. Indemnification</strong></h2><p>You agree to indemnify, defend, and hold harmless Nissi Insights and its directors, officers, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or related to your use of the Site, violation of these Terms, or infringement of any third-party rights.</p><p></p><h2><strong>11. Third-Party Links and Services</strong></h2><p>Our Site may contain links to third-party websites, applications, or services that are not owned or controlled by us. We assume no responsibility for the content, privacy policies, or practices of any third-party sites. You access such sites at your own risk.</p><p></p><h2><strong>12. Termination</strong></h2><p>We reserve the right to suspend or terminate your access to our Site at any time, with or without notice, for any reason, including but not limited to violation of these Terms. Upon termination, your right to use the Site ceases immediately. Provisions of these Terms that by their nature should survive termination shall remain in effect.</p><p></p><h2><strong>13. Governing Law and Jurisdiction</strong></h2><p>These Terms shall be governed by and construed in accordance with the laws of <strong>England and Wales</strong>. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales. Nothing in these Terms affects your statutory rights as a consumer.</p><p></p><h2><strong>14. Severability</strong></h2><p>If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.</p><p></p><h2><strong>15. Entire Agreement</strong></h2><p>These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Nissi Insights regarding the use of our Site and supersede all prior agreements, understandings, and communications, whether written or oral.</p><p></p><h2><strong>16. Changes to These Terms</strong></h2><p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Site following any changes constitutes acceptance of the revised Terms. We encourage you to review these Terms periodically.</p><p></p><h2><strong>17. Contact Us</strong></h2><p>If you have any questions about these Terms of Service, please contact us:</p><p></p><ul><li><p><strong>Email:</strong> legal@nissi-insights.com</p></li><li><p><strong>Address:</strong> Nissi Insights, One Canary Wharf, London, E14 5AB, United Kingdom</p></li></ul><p></p>', 'rich-text', 'legal', '2026-03-09 15:14:56', '2026-03-10 03:26:03'),
(27, 'cookie_policy', '<h2><strong>1. What Are Cookies?</strong></h2><p>Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to site owners. Cookies can be \"persistent\" (remaining on your device until they expire or you delete them) or \"session\" cookies (deleted when you close your browser).</p><p></p><h2><strong>2. How We Use Cookies</strong></h2><p>Nissi Insights uses cookies and similar tracking technologies on <strong>nissi-insights.com</strong> (the \"Site\") for the following purposes:</p><h3>2.1 Strictly Necessary Cookies</h3><p>These cookies are essential for the operation of our Site. They enable core functionality such as security, authentication, and session management. Without these cookies, the Site cannot function properly.</p><p>Cookie NamePurposeDurationXSRF-TOKENPrevents cross-site request forgery attacksSessionlaravel_sessionMaintains user authentication state2 hourscookie_consentStores your cookie consent preferences12 months</p><h3>2.2 Analytics and Performance Cookies</h3><p>These cookies help us understand how visitors interact with our Site by collecting and reporting information anonymously. This data allows us to improve our Site\'s layout, content, and performance.</p><p>Cookie NamePurposeDuration_gaGoogle Analytics — Distinguishes unique visitors2 years_ga_*Google Analytics — Maintains session state2 years_gidGoogle Analytics — Distinguishes visitors within 24h24 hours_gatGoogle Analytics — Throttles request rate1 minute</p><h3>2.3 Functional Cookies</h3><p>These cookies allow the Site to remember choices you make (such as your preferred language, region, or display settings) and provide enhanced, personalised features.</p><p>Cookie NamePurposeDurationtheme_preferenceStores your light/dark mode preference12 monthslocaleStores your language/region preference12 months</p><h3>2.4 Marketing and Targeting Cookies</h3><p>We may use these cookies to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and to measure the effectiveness of advertising campaigns. These cookies are typically placed by third-party advertising networks with our permission.</p><p>At present, Nissi Insights does not deploy third-party marketing cookies. Should this change, this policy will be updated and your consent will be requested.</p><p></p><h2><strong>3. Third-Party Cookies</strong></h2><p>Some cookies on our Site are placed by third-party services that appear on our pages. We do not control the setting of these cookies. The third parties include:</p><ul><li><p><strong>Google Analytics:</strong> For website usage analysis. <a target=\"_blank\" rel=\"noopener\" class=\"text-primary hover:underline cursor-pointer\" href=\"https://policies.google.com/privacy\">Google Privacy Policy</a></p></li><li><p><strong>Google Fonts:</strong> For typography delivery. May set cookies related to font caching.</p></li><li><p></p></li></ul><h2><strong>4. Managing Your Cookie Preferences</strong></h2><p>You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences in the following ways:</p><h3>4.1 Browser Settings</h3><p>Most web browsers allow you to control cookies through their settings. You can typically find these settings in the \"Options\", \"Settings\", or \"Preferences\" menu of your browser. The following links provide instructions for common browsers:</p><ul><li><p><a target=\"_blank\" rel=\"noopener\" class=\"text-primary hover:underline cursor-pointer\" href=\"https://support.google.com/chrome/answer/95647\">Google Chrome</a></p></li><li><p><a target=\"_blank\" rel=\"noopener\" class=\"text-primary hover:underline cursor-pointer\" href=\"https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer\">Mozilla Firefox</a></p></li><li><p><a target=\"_blank\" rel=\"noopener\" class=\"text-primary hover:underline cursor-pointer\" href=\"https://support.apple.com/en-gb/guide/safari/sfri11471\">Apple Safari</a></p></li><li><p><a target=\"_blank\" rel=\"noopener\" class=\"text-primary hover:underline cursor-pointer\" href=\"https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09\">Microsoft Edge</a></p></li></ul><h3>4.2 Opt-Out Tools</h3><p>You can opt out of Google Analytics tracking by installing the <a target=\"_blank\" rel=\"noopener\" class=\"text-primary hover:underline cursor-pointer\" href=\"https://tools.google.com/dlpage/gaoptout\">Google Analytics Opt-Out Browser Add-On</a>.</p><h3>4.3 Impact of Disabling Cookies</h3><p>Please be aware that disabling or blocking certain cookies may affect the functionality of our Site. Strictly necessary cookies cannot be disabled as they are essential for the Site to operate. If you disable other cookies, some features and services may not function as intended.</p><p></p><h2><strong>5. Do Not Track Signals</strong></h2><p>Some browsers include a \"Do Not Track\" (DNT) feature that signals to websites that you do not want your online activity tracked. There is currently no universally accepted standard for how companies should respond to DNT signals. At this time, our Site does not respond to DNT signals, but we respect your privacy choices through the cookie management options described above.</p><p></p><h2><strong>6. Updates to This Cookie Policy</strong></h2><p>We may update this Cookie Policy from time to time to reflect changes in the cookies we use, changes in technology, or changes in applicable law. Any updates will be posted on this page with a revised \"Last Updated\" date. We encourage you to check this page periodically to stay informed about our use of cookies.</p><p></p><h2><strong>7. Contact Us</strong></h2><p>If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p><ul><li><p><strong>Email:</strong> legal@nissi-insights.com</p></li><li><p><strong>Address:</strong> Nissi Insights, One Canary Wharf, London, E14 5AB, United Kingdom</p></li></ul><p></p>', 'rich-text', 'legal', '2026-03-09 15:14:56', '2026-03-10 03:26:03'),
(28, 'email_template_admin', '<div class=\"badge\" style=\"background-color: #3b82f6; color: #ffffff;\">New Action Required</div>\r\n<h1>New Consultation Request</h1>\r\n<p>A new consultation request has been submitted through the Nissi Insights website.</p>\r\n\r\n<div style=\"background-color: #050a1b; padding: 25px; border-radius: 8px; border: 1px solid #1e293b; margin: 20px 0;\">\r\n    <h3 style=\"color: #3b82f6; margin-top: 0;\">Request Details:</h3>\r\n    <table style=\"width: 100%; font-size: 14px; border-collapse: collapse;\">\r\n        <tr>\r\n            <td style=\"padding: 8px 0; color: #64748b; width: 120px;\">Name:</td>\r\n            <td style=\"padding: 8px 0; font-weight: bold; color: #ffffff;\">{{ $requestData->first_name }} {{ $requestData->last_name }}</td>\r\n        </tr>\r\n        <tr>\r\n            <td style=\"padding: 8px 0; color: #64748b;\">Email:</td>\r\n            <td style=\"padding: 8px 0; font-weight: bold; color: #3b82f6;\">{{ $requestData->email }}</td>\r\n        </tr>\r\n        <tr>\r\n            <td style=\"padding: 8px 0; color: #64748b;\">Subject:</td>\r\n            <td style=\"padding: 8px 0; color: #ffffff;\">{{ $requestData->subject ?? \'N/A\' }}</td>\r\n        </tr>\r\n        <tr>\r\n            <td style=\"padding: 8px 0; color: #64748b; vertical-align: top;\">Message:</td>\r\n            <td style=\"padding: 8px 0; color: #cbd5e1; line-height: 1.5;\">{{ $requestData->message }}</td>\r\n        </tr>\r\n    </table>\r\n</div>\r\n\r\n<a href=\"{{ config(\'app.frontend_url\') }}/admin/requests\" class=\"button\">View in Dashboard</a>\r\n\r\n<p style=\"margin-top: 30px; font-size: 12px; color: #64748b;\">This is an automated notification from the Nissi Insights CMS.</p>', 'code', 'email', '2026-03-09 15:14:56', '2026-03-09 16:08:29'),
(29, 'email_template_user', '<div class=\"badge\">Request Received</div>\r\n<h1>Hello, {{ $requestData->first_name }}!</h1>\r\n<p>Thank you for reaching out to Nissi Insights. We have successfully received your request for a consultation regarding <strong>&ldquo;{{ $requestData->subject ?? \'General Inquiry\' }}&rdquo;</strong>.</p>\r\n\r\n<p>Our advisory team is currently reviewing your details and will get back to you within 24-48 business hours to discuss your requirements and schedule a session.</p>\r\n\r\n<div style=\"background-color: #050a1b; padding: 20px; border-radius: 8px; margin: 20px 0;\">\r\n    <h3 style=\"margin-bottom: 10px; color: #3b82f6;\">Your Message Summary:</h3>\r\n    <p style=\"font-style: italic; margin: 0;\">&ldquo;{{ $requestData->message }}&rdquo;</p>\r\n</div>\r\n\r\n<p>In the meantime, feel free to explore our latest market intelligence and insights:</p>\r\n\r\n<a href=\"{{ config(\'app.frontend_url\') }}/insights\" class=\"button\">View Latest Insights</a>\r\n\r\n<p style=\"margin-top: 30px; font-size: 14px;\">Best regards,<br>The Nissi Insights Team</p>', 'code', 'email', '2026-03-09 15:14:56', '2026-03-09 15:14:56'),
(33, 'about_image', '/NI-Digital-Assets/international-diplomacy.jpg', 'image', 'about', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(34, 'contact_email', 'info@nissi-insights.com', 'text', 'contact', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(35, 'contact_phone', '+44 20 7946 0000', 'text', 'contact', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(36, 'contact_address', 'One Canary Wharf, London, E14 5AB', 'text', 'contact', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(37, 'contact_map_url', 'https://www.google.com/maps/embed?...', 'text', 'contact', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(38, 'rsvp_active', '0', 'boolean', 'launch', '2026-03-10 00:47:06', '2026-03-16 17:56:52'),
(39, 'rsvp_date', '2026-03-20 19:00:00', 'text', 'launch', '2026-03-10 00:47:06', '2026-03-11 17:33:07'),
(40, 'rsvp_title', 'The Future of Energy Intelligence', 'text', 'launch', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(41, 'rsvp_description', 'Combining sharp market intelligence with practical insight to inform smarter decisions and unlock value.', 'textarea', 'launch', '2026-03-10 00:47:06', '2026-03-11 18:37:00'),
(42, 'rsvp_media', '/assets/videos/hero.mp4', 'image', 'launch', '2026-03-10 00:47:06', '2026-03-10 00:47:06'),
(43, 'hero_tagline', 'Test A', 'text', 'hero', '2026-03-12 08:34:24', '2026-03-12 08:37:58'),
(44, 'hero_title_line1', 'Test B', 'text', 'hero', '2026-03-12 08:34:24', '2026-03-12 08:37:58'),
(45, 'hero_rotating_words', 'Test 1,Test 2,Test 3', 'text', 'hero', '2026-03-12 08:34:24', '2026-03-12 08:34:24'),
(46, 'hero_title_line2', 'Test C', 'text', 'hero', '2026-03-12 08:34:24', '2026-03-12 08:37:59'),
(47, 'hero_subtitle', 'Subtitle', 'text', 'hero', '2026-03-12 08:34:24', '2026-03-12 08:37:59');

-- --------------------------------------------------------

--
-- Table structure for table `stats`
--

CREATE TABLE `stats` (
  `id` bigint UNSIGNED NOT NULL,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stats`
--

INSERT INTO `stats` (`id`, `label`, `value`, `icon`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Projects Delivered', '250+', 'Briefcase', 1, '2026-02-25 16:44:22', '2026-02-25 16:44:22'),
(2, 'Countries Served', '40+', 'Globe', 2, '2026-02-25 16:44:22', '2026-02-25 16:44:22'),
(3, 'Client Retention', '96%', 'TrendingUp', 3, '2026-02-25 16:44:22', '2026-02-25 16:44:22'),
(4, 'Capital Advised', '$2.5B+', 'DollarSign', 4, '2026-02-25 16:44:22', '2026-02-25 16:44:22');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'footer',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `qualifications` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `role`, `bio`, `qualifications`, `linkedin`, `image`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Pauline Hutu', 'Director of Strategy & Operations', 'Pauline Hutu is an Advocate of the High Court of Kenya with experience in legal advisory and regulatory research. As Director, Strategy & Operations, she plays a key role in supporting the firm’s strategic direction, coordinating project delivery and engaging with stakeholders across advisory work in energy, finance and international policy.\n\nPauline’s professional background spans litigation, governance initiatives and policy-focused program work within legislative and civil society environments.\n\nShe holds a Bachelor of Laws (LL.B) from Africa Nazarene University and completed the Advocates Training Programme at the Kenya School of Law.', NULL, 'https://ke.linkedin.com/in/pauline-hutu', 'http://localhost:8000/storage/uploads/w1fiPUfd3PDpxaHQJUWt59dtRbTyVhPwePt8YaZc.jpg', 1, '2026-03-09 13:30:55', '2026-03-09 13:30:55'),
(2, 'Marvine Chrispine', 'Managing Director', 'Articulate, tenacious and results- driven Common Law Qualified Lawyer with a sharp acumen for Corporate and Commercial practice within the Energy, Infrastructure and Projects sector. Currently based in United Kingdom focusing on Energy Origination, Commodity Trading and Energy Contracts at SSE plc.', NULL, 'https://www.linkedin.com/in/chrispine-marvine-89820010a/', 'http://localhost:8000/storage/uploads/wV8U9tpxSGkF5qEjWbPPZcO7cizXCAUXH0UWpL9T.jpg', 2, '2026-03-09 13:34:12', '2026-03-09 13:43:49');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint UNSIGNED NOT NULL,
  `client_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quote` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `client_name`, `role`, `company`, `quote`, `avatar`, `rating`, `is_featured`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Sarah Mitchell', 'Chief Investment Officer', 'Nordic Energy Fund', 'Nissi Insights provided the rigorous due diligence and market intelligence that gave our board the confidence to commit £300M to the North Sea wind portfolio. Their sector depth is unmatched.', NULL, 5, 1, 1, '2026-02-25 16:44:38', '2026-02-25 16:44:38'),
(2, 'James Okonkwo', 'CEO', 'AfriPay Technologies', 'Their fintech regulatory mapping across 5 African markets saved us 12 months of research and helped us launch ahead of schedule. A true strategic partner.', NULL, 5, 1, 2, '2026-02-25 16:44:38', '2026-02-25 16:59:08'),
(3, 'Ambassador Elena Vasquez', 'Senior Diplomatic Advisor', 'Gulf Cooperation Council', 'Their stakeholder mapping and sovereign engagement strategy was exceptional. Nissi navigated complex bilateral dynamics with precision and discretion.', NULL, 5, 1, 3, '2026-02-25 16:44:38', '2026-02-25 16:44:38'),
(4, 'Dr. Michael Chen', 'Managing Director', 'Asia Pacific Infrastructure Partners', 'We rely on Nissi for market-entry intelligence across Southeast Asia. Their on-the-ground networks and regulatory mapping are invaluable for our portfolio decisions.', NULL, 5, 0, 4, '2026-02-25 16:44:38', '2026-02-25 16:44:38'),
(5, 'Fatima Al-Rashid', 'Head of Strategy', 'Gulf Sovereign Partners', 'Their cross-border treaty negotiation support was instrumental in unlocking $500M in co-investment opportunities for our fund.', NULL, 5, 1, 5, '2026-02-25 16:44:38', '2026-02-25 16:59:08'),
(6, 'Dr. Sarah Mitchell', 'Chief Investment Officer', 'Nordic Energy Capital', 'Nissi Insights delivered an exceptional due diligence report that gave our board full confidence to proceed with a £200M offshore wind investment. Their sector expertise is unmatched.', NULL, 5, 1, 1, '2026-02-25 16:59:08', '2026-02-25 16:59:08'),
(7, 'Ambassador Helena Voss', 'Senior Diplomatic Advisor', 'European External Action Service', 'The team\'s understanding of sovereign stakeholder dynamics is remarkable. They facilitated connections that would have taken years to build through traditional channels.', NULL, 5, 1, 3, '2026-02-25 16:59:08', '2026-02-25 16:59:08'),
(8, 'Richard Chen', 'Managing Director', 'Pacific Infrastructure Fund', 'We\'ve engaged Nissi Insights on three separate transactions. Their commercial advisory consistently identifies value others miss.', NULL, 5, 1, 4, '2026-02-25 16:59:08', '2026-02-25 16:59:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@nissiinsights.com', '2026-02-25 11:43:39', '$2y$12$9dgZ8LR.QoP9EWeO.gythu2gXlVHbwMxn.n8YVqpG8etxdz.lafBu', 'jTpEOzP07A', '2026-02-25 11:43:39', '2026-03-09 11:33:12');

-- --------------------------------------------------------

--
-- Table structure for table `values`
--

CREATE TABLE `values` (
  `id` bigint UNSIGNED NOT NULL,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `case_studies`
--
ALTER TABLE `case_studies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `case_studies_slug_unique` (`slug`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `consultation_requests`
--
ALTER TABLE `consultation_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `insights`
--
ALTER TABLE `insights`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `insights_slug_unique` (`slug`),
  ADD KEY `insights_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_views`
--
ALTER TABLE `page_views`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `rsvps`
--
ALTER TABLE `rsvps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rsvps_email_unique` (`email`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `services_slug_unique` (`slug`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_key_unique` (`key`);

--
-- Indexes for table `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscribers_email_unique` (`email`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `values`
--
ALTER TABLE `values`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `case_studies`
--
ALTER TABLE `case_studies`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `consultation_requests`
--
ALTER TABLE `consultation_requests`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `insights`
--
ALTER TABLE `insights`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `page_views`
--
ALTER TABLE `page_views`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=684;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `rsvps`
--
ALTER TABLE `rsvps`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `stats`
--
ALTER TABLE `stats`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `values`
--
ALTER TABLE `values`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
