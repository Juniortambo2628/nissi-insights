import React from 'react'
import EventDetailsClient from '@/components/EventDetailsClient'
import { buildDynamicMetadata, buildEventJsonLd } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

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

    return buildDynamicMetadata(event, {
        path: `/events/${slug}`,
        fallbackTitle: 'Event Not Found | Nissi Insights',
        fallbackDescription: 'The requested event could not be found.',
        type: 'event',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEvent(slug)
    const jsonLd = buildEventJsonLd(initialData, `/events/${slug}`)

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
