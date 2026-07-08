import React from 'react'
import ServicesClient from './ServicesClient'
import { appUrl } from '@/lib/seo'

const pageUrl = `${appUrl}/services`
const title = 'Our Advisory Services | Energy, Fintech & Diplomacy | Nissi Insights'
const description = 'Explore Nissi Insights advisory services. Specialized guidance across Energy Advisory, Fintech Go-To-Market strategy, and Geopolitical Diplomacy.'

export const metadata = {
    title,
    description,
    keywords: [
        'Energy transition advisory',
        'Fintech commercial models',
        'Sovereign engagement strategy',
        'Geopolitical risk advisory',
        'Energy due diligence',
        'Market intelligence services'
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
        title: 'Our Advisory Services | Nissi Insights',
        description,
    },
}

export default function ServicesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${pageUrl}/#webpage`,
                "url": pageUrl,
                "name": "Our Advisory Services | Nissi Insights",
                "description": "Professional advisory services covering Energy Advisory, Fintech, and International Diplomacy.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${appUrl}/#website`,
                    "url": appUrl,
                    "name": "Nissi Insights"
                }
            },
            {
                "@type": "Service",
                "name": "Energy Advisory",
                "provider": {
                    "@type": "Organization",
                    "name": "Nissi Insights"
                },
                "description": "Comprehensive advisory across due diligence, commercial strategy, route-to-market, legal & policy, transaction support, and market intelligence for the energy sector."
            },
            {
                "@type": "Service",
                "name": "Fintech Strategy",
                "provider": {
                    "@type": "Organization",
                    "name": "Nissi Insights"
                },
                "description": "Strategic advisory for financial technology companies covering commercial model design, go-to-market, regulatory compliance, capital raising, and M&A support."
            },
            {
                "@type": "Service",
                "name": "International Diplomacy & Sovereign Engagement",
                "provider": {
                    "@type": "Organization",
                    "name": "Nissi Insights"
                },
                "description": "Enabling sovereign engagement, cross-border deals, geopolitical risk management, and reputation positioning for governments and multinationals."
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ServicesClient />
        </>
    )
}
