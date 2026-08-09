import React from 'react'
import ResourceDetailsClient from '@/components/ResourceDetailsClient'
import { buildDynamicMetadata, buildArticleJsonLd } from '@/lib/seo'
import { fetchEntity } from '@/lib/api'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const resource = await fetchEntity(slug, 'resources')

    return buildDynamicMetadata(resource, {
        path: `/knowledge-base/${slug}`,
        fallbackTitle: 'Resource Not Found | Nissi Insights',
        fallbackDescription: 'The requested resource could not be found.',
        type: 'article',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEntity(slug, 'resources')
    const jsonLd = buildArticleJsonLd(initialData, `/knowledge-base/${slug}`)

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ResourceDetailsClient initialData={initialData} slug={slug} />
        </>
    )
}
