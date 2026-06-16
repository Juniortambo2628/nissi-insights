import React from 'react'
import KnowledgeBaseClient from './KnowledgeBaseClient'

export const metadata = {
    title: 'Knowledge Hub & Resources | Nissi Insights',
    description: 'Access the Nissi Insights library of energy reports, white papers, market publications, and financial technology case studies.',
    keywords: [
        'Energy transition white papers',
        'Fintech industry reports',
        'Market intelligence library',
        'Nissi Insights publications',
        'Nissi Insights research hub'
    ],
    openGraph: {
        title: 'Knowledge Hub & Resources | Nissi Insights',
        description: 'Access the Nissi Insights library of energy reports, white papers, market publications, and financial technology case studies.',
        type: 'website',
        url: 'https://nissi-insights.com/knowledge-base',
    }
}

export default function KnowledgeBasePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://nissi-insights.com/knowledge-base/#webpage",
                "url": "https://nissi-insights.com/knowledge-base",
                "name": "Knowledge Hub & Resources | Nissi Insights",
                "description": "Comprehensive library of industry publications, energy briefs, and financial technology reports.",
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
            <KnowledgeBaseClient />
        </>
    )
}
