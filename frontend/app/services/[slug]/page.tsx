import React from 'react'
import ServiceDetailClient from '@/components/ServiceDetailClient'

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
    
    if (!service) {
        return {
            title: 'Service Not Found | Nissi Insights',
            description: 'The requested advisory service could not be found.'
        }
    }
    
    return {
        title: `${service.title} | Nissi Insights`,
        description: service.description?.substring(0, 160) || `${service.title} - Nissi Insights advisory service.`,
        openGraph: {
            title: `${service.title} | Nissi Insights`,
            description: service.description?.substring(0, 160) || `${service.title} - Nissi Insights advisory service.`,
        }
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchService(slug)
    
    return <ServiceDetailClient initialData={initialData} slug={slug} />
}
