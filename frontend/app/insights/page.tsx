import React from 'react'
import InsightsClient from './InsightsClient'
import { appUrl } from '@/lib/seo'

const pageUrl = `${appUrl}/insights`
const title = 'Insights & Research | Energy, Fintech & Market Intelligence | Nissi Insights'
const description = 'Thought leadership, analysis, and research from Nissi Insights. Deep dives into the trends shaping energy transition, fintech, and global markets.'

export const metadata = {
    title,
    description,
    keywords: [
        'Energy insights',
        'Fintech research',
        'Sovereign intelligence analysis',
        'Market intelligence reports',
        'Nissi Insights analysis',
        'Energy policy research'
    ],
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        title,
        description,
        type: 'website',
        url: pageUrl,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Insights & Research | Nissi Insights',
        description,
    },
}

export default function InsightsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${pageUrl}/#webpage`,
                "url": pageUrl,
                "name": "Insights & Research | Nissi Insights",
                "description": "Analysis, commentary, and research from our advisory team on energy, fintech, and global markets.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${appUrl}/#website`,
                    "url": appUrl,
                    "name": "Nissi Insights"
                }
            },
            {
                "@type": "Blog",
                "@id": `${pageUrl}/#blog`,
                "name": "Nissi Insights Blog",
                "description": "Advisory insights on the energy transition, financial technology, and international diplomacy.",
                "publisher": {
                    "@type": "Organization",
                    "name": "Nissi Insights",
                    "logo": `${appUrl}/favicon.png`
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
            <InsightsClient />
        </>
    )
}
