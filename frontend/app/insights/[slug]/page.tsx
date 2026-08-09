import React from 'react'
import InsightDetailClient from '@/components/InsightDetailClient'
import { buildDynamicMetadata, buildArticleJsonLd } from '@/lib/seo'
import { fetchEntity } from '@/lib/api'
import type { Insight } from '@/lib/types'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const insight = await fetchEntity<Insight>(slug, 'insights')

    return buildDynamicMetadata(insight, {
        path: `/insights/${slug}`,
        fallbackTitle: 'Article Not Found | Nissi Insights',
        fallbackDescription: 'The requested article could not be found.',
        type: 'article',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEntity<Insight>(slug, 'insights')
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
