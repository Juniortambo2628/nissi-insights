import React from 'react'
import ResourceDetailsClient from '@/components/ResourceDetailsClient'

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
    
    if (!resource) {
        return {
            title: 'Resource Not Found | Nissi Insights',
            description: 'The requested resource could not be found.'
        }
    }
    
    return {
        title: `${resource.title} | Nissi Insights`,
        description: resource.description || resource.content?.substring(0, 160) || 'Strategic intelligence and market advisory resource.',
        openGraph: {
            title: `${resource.title} | Nissi Insights`,
            description: resource.description || resource.content?.substring(0, 160) || 'Strategic intelligence and market advisory resource.',
            images: resource.thumbnail ? [{ url: resource.thumbnail }] : [],
        }
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchResource(slug)
    
    return <ResourceDetailsClient initialData={initialData} slug={slug} />
}
