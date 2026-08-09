import React from 'react'
import PillarDetailClient from '@/components/PillarDetailClient'
import { buildDynamicMetadata, buildArticleJsonLd } from '@/lib/seo'
import { fetchEntity } from '@/lib/api'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const pillar = await fetchEntity(slug, 'pillars')

    return buildDynamicMetadata(pillar, {
        path: `/pillars/${slug}`,
        fallbackTitle: 'Pillar Not Found | Nissi Insights',
        fallbackDescription: 'The requested strategic pillar could not be found.',
        type: 'website',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEntity(slug, 'pillars')
    const jsonLd = buildArticleJsonLd(initialData, `/pillars/${slug}`)

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <PillarDetailClient initialData={initialData} slug={slug} />
        </>
    )
}
