import React from 'react'
import AboutClient from './AboutClient'

export const metadata = {
    title: 'About Us | Nissi Insights | Energy Advisory & Market Intelligence',
    description: 'Learn about Nissi Insights, our mission, vision, core values, and team of experts providing trusted advisory across energy, fintech, and diplomacy.',
    keywords: [
        'Nissi Insights team',
        'About Nissi Insights',
        'Energy Advisory',
        'Fintech Strategy',
        'Sovereign Engagement',
        'Market Intelligence',
        'Energy Transition',
        'Go-to-market strategy'
    ],
    alternates: {
        canonical: 'https://nissi-insights.com/about',
    },
    openGraph: {
        title: 'About Us | Nissi Insights | Energy Advisory & Market Intelligence',
        description: 'Learn about Nissi Insights, our mission, vision, core values, and team of experts providing trusted advisory across energy, fintech, and diplomacy.',
        type: 'website',
        url: 'https://nissi-insights.com/about',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us | Nissi Insights',
        description: 'Learn about Nissi Insights, our mission, vision, core values, and team of experts.',
    },
}

export default function AboutPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": "https://nissi-insights.com/about/#webpage",
                "url": "https://nissi-insights.com/about",
                "name": "About Us | Nissi Insights",
                "description": "Learn about Nissi Insights, our mission, vision, core values, and team of experts.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://nissi-insights.com/#website",
                    "url": "https://nissi-insights.com",
                    "name": "Nissi Insights"
                }
            },
            {
                "@type": "Organization",
                "@id": "https://nissi-insights.com/#organization",
                "name": "Nissi Insights",
                "url": "https://nissi-insights.com",
                "logo": "https://nissi-insights.com/favicon.png",
                "sameAs": [
                    "https://www.linkedin.com/company/nissi-insights"
                ]
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutClient />
        </>
    )
}
