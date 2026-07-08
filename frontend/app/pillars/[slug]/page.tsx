import React from 'react'
import PillarDetailClient from '@/components/PillarDetailClient'
import { buildDynamicMetadata, buildArticleJsonLd, buildCanonical } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

async function fetchPillar(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/pillars/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching pillar on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const pillar = await fetchPillar(slug)

    return buildDynamicMetadata(pillar, {
        path: `/pillars/${slug}`,
        fallbackTitle: 'Pillar Not Found | Nissi Insights',
        fallbackDescription: 'The requested strategic pillar could not be found.',
        type: 'website',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchPillar(slug)
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
