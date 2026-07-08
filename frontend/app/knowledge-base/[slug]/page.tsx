import React from 'react'
import ResourceDetailsClient from '@/components/ResourceDetailsClient'
import { buildDynamicMetadata, buildArticleJsonLd } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

async function fetchResource(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/resources/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching resource on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const resource = await fetchResource(slug)

    return buildDynamicMetadata(resource, {
        path: `/knowledge-base/${slug}`,
        fallbackTitle: 'Resource Not Found | Nissi Insights',
        fallbackDescription: 'The requested resource could not be found.',
        type: 'article',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchResource(slug)
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
