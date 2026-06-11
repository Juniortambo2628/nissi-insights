import React from 'react'
import EventDetailsClient from '@/components/EventDetailsClient'

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
    
    if (!event) {
        return {
            title: 'Event Not Found | Nissi Insights',
            description: 'The requested event could not be found.'
        }
    }
    
    return {
        title: `${event.title} | Nissi Insights`,
        description: event.description?.substring(0, 160) || `${event.title} - Nissi Insights event.`,
        openGraph: {
            title: `${event.title} | Nissi Insights`,
            description: event.description?.substring(0, 160) || `${event.title} - Nissi Insights event.`,
            images: event.image ? [{ url: event.image }] : [],
        }
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEvent(slug)
    
    return <EventDetailsClient initialData={initialData} slug={slug} />
}
