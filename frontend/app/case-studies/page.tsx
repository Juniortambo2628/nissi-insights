import React from 'react'
import CaseStudiesClient from './CaseStudiesClient'
import { appUrl } from '@/lib/seo'

const pageUrl = `${appUrl}/case-studies`
const title = 'Case Studies | Advisory Portfolio & Client Success Stories | Nissi Insights'
const description = 'Explore Nissi Insights case studies showcasing real-world advisory impact across energy transition, fintech, and international diplomacy. Measurable outcomes delivered.'

export const metadata = {
    title,
    description,
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
        title,
        description,
        type: 'website',
        url: pageUrl,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Case Studies | Nissi Insights',
        description: 'Explore advisory case studies with measurable impact across energy, fintech, and diplomacy.',
    },
    alternates: {
        canonical: pageUrl,
    },
}

export default function CaseStudiesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${pageUrl}/#webpage`,
                "url": pageUrl,
                "name": "Case Studies | Nissi Insights",
                "description": "Advisory case studies showcasing measurable impact across energy transition, fintech, and international diplomacy.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${appUrl}/#website`,
                    "url": appUrl,
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
