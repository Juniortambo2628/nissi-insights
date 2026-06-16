import React from 'react'
import InsightsClient from './InsightsClient'

export const metadata = {
    title: 'Insights & Research | Energy, Fintech & Market Intelligence | Nissi Insights',
    description: 'Thought leadership, analysis, and research from Nissi Insights. Deep dives into the trends shaping energy transition, fintech, and global markets.',
    keywords: [
        'Energy insights',
        'Fintech research',
        'Sovereign intelligence analysis',
        'Market intelligence reports',
        'Nissi Insights analysis',
        'Energy policy research'
    ],
    alternates: {
        canonical: 'https://nissi-insights.com/insights',
    },
    openGraph: {
        title: 'Insights & Research | Energy, Fintech & Market Intelligence | Nissi Insights',
        description: 'Thought leadership, analysis, and research from Nissi Insights. Deep dives into the trends shaping energy transition, fintech, and global markets.',
        type: 'website',
        url: 'https://nissi-insights.com/insights',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Insights & Research | Nissi Insights',
        description: 'Thought leadership, analysis, and research from Nissi Insights.',
    },
}

export default function InsightsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://nissi-insights.com/insights/#webpage",
                "url": "https://nissi-insights.com/insights",
                "name": "Insights & Research | Nissi Insights",
                "description": "Analysis, commentary, and research from our advisory team on energy, fintech, and global markets.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://nissi-insights.com/#website",
                    "url": "https://nissi-insights.com",
                    "name": "Nissi Insights"
                }
            },
            {
                "@type": "Blog",
                "@id": "https://nissi-insights.com/insights/#blog",
                "name": "Nissi Insights Blog",
                "description": "Advisory insights on the energy transition, financial technology, and international diplomacy.",
                "publisher": {
                    "@type": "Organization",
                    "name": "Nissi Insights",
                    "logo": "https://nissi-insights.com/favicon.png"
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
