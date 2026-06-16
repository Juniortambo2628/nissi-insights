import React from 'react'
import CaseStudiesClient from './CaseStudiesClient'

export const metadata = {
    title: 'Case Studies | Advisory Portfolio & Client Success Stories | Nissi Insights',
    description: 'Explore Nissi Insights case studies showcasing real-world advisory impact across energy transition, fintech, and international diplomacy. Measurable outcomes delivered.',
    keywords: [
        'Nissi Insights case studies',
        'Energy advisory case study',
        'Fintech consulting results',
        'International diplomacy advisory',
        'Advisory portfolio',
        'Client success stories',
        'Energy transition projects',
        'Kenya energy advisory',
    ],
    openGraph: {
        title: 'Case Studies | Advisory Portfolio & Client Success Stories | Nissi Insights',
        description: 'Explore Nissi Insights case studies showcasing real-world advisory impact across energy transition, fintech, and international diplomacy.',
        type: 'website',
        url: 'https://nissi-insights.com/case-studies',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Case Studies | Nissi Insights',
        description: 'Explore advisory case studies with measurable impact across energy, fintech, and diplomacy.',
    },
    alternates: {
        canonical: 'https://nissi-insights.com/case-studies',
    },
}

export default function CaseStudiesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": "https://nissi-insights.com/case-studies/#webpage",
                "url": "https://nissi-insights.com/case-studies",
                "name": "Case Studies | Nissi Insights",
                "description": "Advisory case studies showcasing measurable impact across energy transition, fintech, and international diplomacy.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://nissi-insights.com/#website",
                    "url": "https://nissi-insights.com",
                    "name": "Nissi Insights"
                }
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CaseStudiesClient />
        </>
    )
}
