import React from 'react'
import EventDetailsClient from '@/components/EventDetailsClient'
import { buildDynamicMetadata, buildEventJsonLd } from '@/lib/seo'
import { fetchEntity } from '@/lib/api'
import type { Event } from '@/lib/types'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const event = await fetchEntity<Event>(slug, 'events')

    return buildDynamicMetadata(event, {
        path: `/events/${slug}`,
        fallbackTitle: 'Event Not Found | Nissi Insights',
        fallbackDescription: 'The requested event could not be found.',
        type: 'event',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEntity<Event>(slug, 'events')
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
