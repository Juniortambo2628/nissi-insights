import React from 'react'
import ServiceDetailClient from '@/components/ServiceDetailClient'
import { buildDynamicMetadata } from '@/lib/seo'
import { fetchEntity, appUrl } from '@/lib/api'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const service = await fetchEntity(slug, 'services')

    return buildDynamicMetadata(service, {
        path: `/services/${slug}`,
        fallbackTitle: 'Service Not Found | Nissi Insights',
        fallbackDescription: 'The requested advisory service could not be found.',
        type: 'website',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEntity(slug, 'services')

    const jsonLd = initialData ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: initialData.title,
        description: initialData.description || `${initialData.title} — Advisory service from Nissi Insights.`,
        provider: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: appUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${appUrl}/favicon.png`,
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
