import React from 'react'
import EventDetailsClient from '@/components/EventDetailsClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

async function fetchEvent(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/events/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching event on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const event = await fetchEvent(slug)
    
    if (!event) {
        return {
            title: 'Event Not Found | Nissi Insights',
            description: 'The requested event could not be found.'
        }
    }

    const descriptionText = (
        event.description?.substring(0, 160) || `${event.title} — Nissi Insights event.`
    )
    
    return {
        title: `${event.title} | Nissi Insights Events`,
        description: descriptionText,
        keywords: [
            event.title,
            'Nissi Insights',
            'event',
            'energy advisory',
            'market intelligence',
            'Kenya',
        ].filter(Boolean).join(', '),
        alternates: {
            canonical: `${appUrl}/events/${slug}`,
        },
        openGraph: {
            type: 'article',
            title: `${event.title} | Nissi Insights`,
            description: descriptionText,
            url: `${appUrl}/events/${slug}`,
            siteName: 'Nissi Insights',
            images: event.image ? [{ url: event.image }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${event.title} | Nissi Insights`,
            description: descriptionText,
        },
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEvent(slug)

    const jsonLd = initialData ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: initialData.title,
        description: initialData.description || '',
        ...(initialData.event_date && { startDate: initialData.event_date }),
        ...(initialData.location && {
            location: {
                '@type': 'Place',
                name: initialData.location,
            },
        }),
        organizer: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: appUrl,
        },
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
            <EventDetailsClient initialData={initialData} slug={slug} />
        </>
    )
}
