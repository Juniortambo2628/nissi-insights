import React from 'react'
import InsightDetailClient from '@/components/InsightDetailClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

async function fetchInsight(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/insights/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching insight on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const insight = await fetchInsight(slug)
    
    if (!insight) {
        return {
            title: 'Article Not Found | Nissi Insights',
            description: 'The requested article could not be found.'
        }
    }
    
    // Clean description from HTML if present
    const descriptionText = insight.excerpt || 
        (insight.content ? insight.content.substring(0, 160).replace(/<[^>]*>?/gm, '') : 'Nissi Insights strategic analysis and advisory highlights.')

    return {
        title: `${insight.title} | Nissi Insights`,
        description: descriptionText,
        openGraph: {
            title: `${insight.title} | Nissi Insights`,
            description: descriptionText,
            images: insight.image ? [{ url: insight.image }] : [],
        }
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchInsight(slug)
    
    return <InsightDetailClient initialData={initialData} slug={slug} />
}
