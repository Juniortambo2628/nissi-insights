import React from 'react'
import ServiceDetailClient from '@/components/ServiceDetailClient'
import { buildDynamicMetadata } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

async function fetchService(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/services/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching service on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const service = await fetchService(slug)

    return buildDynamicMetadata(service, {
        path: `/services/${slug}`,
        fallbackTitle: 'Service Not Found | Nissi Insights',
        fallbackDescription: 'The requested advisory service could not be found.',
        type: 'website',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchService(slug)

    const jsonLd = initialData ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: initialData.title,
        description: initialData.description || `${initialData.title} — Advisory service from Nissi Insights.`,
        provider: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com',
            logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'}/favicon.png`,
            },
        },
        ...(initialData.category && { serviceType: initialData.category }),
        ...(initialData.image && { image: initialData.image }),
    } : null

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ServiceDetailClient initialData={initialData} slug={slug} />
        </>
    )
}
