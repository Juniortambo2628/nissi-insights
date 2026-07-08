import React from 'react'
import KnowledgeBaseClient from './KnowledgeBaseClient'
import { appUrl } from '@/lib/seo'

const pageUrl = `${appUrl}/knowledge-base`
const title = 'Knowledge Hub & Resources | Nissi Insights'
const description = 'Access the Nissi Insights library of energy reports, white papers, market publications, and financial technology case studies.'

export const metadata = {
    title,
    description,
    keywords: [
        'Energy transition white papers',
        'Fintech industry reports',
        'Market intelligence library',
        'Nissi Insights publications',
        'Nissi Insights research hub'
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
        title: 'Knowledge Hub & Resources | Nissi Insights',
        description: 'Access energy reports, white papers, and market publications from Nissi Insights.',
    },
}

export default function KnowledgeBasePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${pageUrl}/#webpage`,
                "url": pageUrl,
                "name": "Knowledge Hub & Resources | Nissi Insights",
                "description": "Comprehensive library of industry publications, energy briefs, and financial technology reports.",
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
            <KnowledgeBaseClient />
        </>
    )
}
