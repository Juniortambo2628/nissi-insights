import React from 'react'
import InsightDetailClient from '@/components/InsightDetailClient'
import { buildDynamicMetadata, buildArticleJsonLd } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

async function fetchInsight(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/insights/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching insight on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const insight = await fetchInsight(slug)

    return buildDynamicMetadata(insight, {
        path: `/insights/${slug}`,
        fallbackTitle: 'Article Not Found | Nissi Insights',
        fallbackDescription: 'The requested article could not be found.',
        type: 'article',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchInsight(slug)
    const jsonLd = buildArticleJsonLd(initialData, `/insights/${slug}`)

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <InsightDetailClient initialData={initialData} slug={slug} />
        </>
    )
}
