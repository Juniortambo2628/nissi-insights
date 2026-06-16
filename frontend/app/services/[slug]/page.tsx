import React from 'react'
import ServiceDetailClient from '@/components/ServiceDetailClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

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
    
    if (!service) {
        return {
            title: 'Service Not Found | Nissi Insights',
            description: 'The requested advisory service could not be found.'
        }
    }
    
    const title = `${service.title} | Nissi Insights Advisory Services`
    const descriptionText = (
        service.description?.substring(0, 160) || 
        `${service.title} - Expert advisory service from Nissi Insights.`
    )

    return {
        title,
        description: descriptionText,
        keywords: [
            service.title,
            'Nissi Insights',
            service.category,
            'advisory service',
            'energy advisory',
            'consulting',
            'Kenya',
        ].filter(Boolean).join(', '),
        alternates: {
            canonical: `${appUrl}/services/${slug}`,
        },
        openGraph: {
            title,
            description: descriptionText,
            url: `${appUrl}/services/${slug}`,
            siteName: 'Nissi Insights',
            type: 'website',
            images: service.image ? [{ url: service.image }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: descriptionText,
        },
    }
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
