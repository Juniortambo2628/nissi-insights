import React from 'react'
import ClientImpactClient from './ClientImpactClient'

export const metadata = {
    title: 'Client Impact & Case Studies | Nissi Insights | Proven Results',
    description: 'Read Nissi Insights case studies and testimonials from clients across energy transition, fintech, and international trade sectors.',
    keywords: [
        'Nissi Insights case studies',
        'Client success stories',
        'Advisory project results',
        'Fintech consulting case study',
        'Energy advisory testimonials'
    ],
    alternates: {
        canonical: 'https://nissi-insights.com/client-impact',
    },
    openGraph: {
        title: 'Client Impact & Case Studies | Nissi Insights | Proven Results',
        description: 'Read Nissi Insights case studies and testimonials from clients across energy transition, fintech, and international trade sectors.',
        type: 'website',
        url: 'https://nissi-insights.com/client-impact',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Client Impact | Nissi Insights',
        description: 'Case studies and testimonials from Nissi Insights advisory clients.',
    },
}

export default function ClientImpactPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://nissi-insights.com/client-impact/#webpage",
                "url": "https://nissi-insights.com/client-impact",
                "name": "Client Impact & Case Studies | Nissi Insights",
                "description": "Discover how we help organizations achieve their strategic goals through advisory services.",
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
            <ClientImpactClient />
        </>
    )
}
