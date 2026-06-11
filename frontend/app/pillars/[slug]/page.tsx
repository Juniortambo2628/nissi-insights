import React from 'react'
import PillarDetailClient from '@/components/PillarDetailClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

async function fetchPillar(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/pillars/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching pillar on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const pillar = await fetchPillar(slug)
    
    if (!pillar) {
        return {
            title: 'Pillar Not Found | Nissi Insights',
            description: 'The requested strategic pillar could not be found.'
        }
    }
    
    return {
        title: `${pillar.title} | Nissi Insights`,
        description: pillar.overview?.substring(0, 160) || `${pillar.title} - Nissi Insights strategic pillar.`,
        openGraph: {
            title: `${pillar.title} | Nissi Insights`,
            description: pillar.overview?.substring(0, 160) || `${pillar.title} - Nissi Insights strategic pillar.`,
            images: pillar.image ? [{ url: pillar.image }] : [],
        }
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchPillar(slug)
    
    return <PillarDetailClient initialData={initialData} slug={slug} />
}
