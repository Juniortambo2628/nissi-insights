import React from 'react'
import EventsClient from './EventsClient'
import { appUrl } from '@/lib/seo'

const pageUrl = `${appUrl}/events`
const title = 'Global Events & Intelligence Briefings | Nissi Insights'
const description = 'Join Nissi Insights executive events, webinars, and roundtable discussions on global energy transition, financial technology, and sovereign diplomacy.'

export const metadata = {
    title,
    description,
    keywords: [
        'Energy transition webinars',
        'Fintech events',
        'Sovereign intelligence briefings',
        'Executive roundtable discussions',
        'Nissi Insights events'
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
                "@id": `${pageUrl}/#webpage`,
                "url": pageUrl,
                "name": "Global Events & Intelligence Briefings | Nissi Insights",
                "description": "Executive briefings and events on energy transition, fintech, and diplomacy.",
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
            <EventsClient />
        </>
    )
}
