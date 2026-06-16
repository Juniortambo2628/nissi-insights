import React from 'react'
import ServicesClient from './ServicesClient'

export const metadata = {
    title: 'Our Advisory Services | Energy, Fintech & Diplomacy | Nissi Insights',
    description: 'Explore Nissi Insights advisory services. Specialized guidance across Energy Advisory, Fintech Go-To-Market strategy, and Geopolitical Diplomacy.',
    keywords: [
        'Energy transition advisory',
        'Fintech commercial models',
        'Sovereign engagement strategy',
        'Geopolitical risk advisory',
        'Energy due diligence',
        'Market intelligence services'
    ],
    openGraph: {
        title: 'Our Advisory Services | Energy, Fintech & Diplomacy | Nissi Insights',
        description: 'Explore Nissi Insights advisory services. Specialized guidance across Energy Advisory, Fintech Go-To-Market strategy, and Geopolitical Diplomacy.',
        type: 'website',
        url: 'https://nissi-insights.com/services',
    }
}

export default function ServicesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://nissi-insights.com/services/#webpage",
                "url": "https://nissi-insights.com/services",
                "name": "Our Advisory Services | Nissi Insights",
                "description": "Professional advisory services covering Energy Advisory, Fintech, and International Diplomacy.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://nissi-insights.com/#website",
                    "url": "https://nissi-insights.com",
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
