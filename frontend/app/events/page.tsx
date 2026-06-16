import React from 'react'
import EventsClient from './EventsClient'

export const metadata = {
    title: 'Global Events & Intelligence Briefings | Nissi Insights',
    description: 'Join Nissi Insights executive events, webinars, and roundtable discussions on global energy transition, financial technology, and sovereign diplomacy.',
    keywords: [
        'Energy transition webinars',
        'Fintech events',
        'Sovereign intelligence briefings',
        'Executive roundtable discussions',
        'Nissi Insights events'
    ],
    alternates: {
        canonical: 'https://nissi-insights.com/events',
    },
    openGraph: {
        title: 'Global Events & Intelligence Briefings | Nissi Insights',
        description: 'Join Nissi Insights executive events, webinars, and roundtable discussions on global energy transition, financial technology, and sovereign diplomacy.',
        type: 'website',
        url: 'https://nissi-insights.com/events',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Global Events & Intelligence Briefings | Nissi Insights',
        description: 'Executive events, webinars, and roundtable discussions from Nissi Insights.',
    },
}

export default function EventsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://nissi-insights.com/events/#webpage",
                "url": "https://nissi-insights.com/events",
                "name": "Global Events & Intelligence Briefings | Nissi Insights",
                "description": "Executive briefings and events on energy transition, fintech, and diplomacy.",
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
            <EventsClient />
        </>
    )
}
