import React from 'react'
import ResourceDetailsClient from '@/components/ResourceDetailsClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

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

    const title = resource.meta_title || `${resource.title} | Nissi Insights Knowledge Hub`
    const descriptionText = (
        resource.meta_description ||
        resource.description ||
        resource.content?.substring(0, 160)?.replace(/<[^>]*>?/gm, '') ||
        `${resource.title} — Strategic intelligence resource from Nissi Insights.`
    ).substring(0, 160)

    const keywordsList = [
        ...(resource.tags || []),
        resource.title,
        'Nissi Insights',
        resource.type || 'Report',
        'energy advisory',
        'market intelligence',
        'Kenya',
    ].filter(Boolean)

    return {
        title,
        description: descriptionText,
        keywords: keywordsList.join(', '),
        alternates: {
            canonical: `${appUrl}/knowledge-base/${slug}`,
        },
        openGraph: {
            type: 'article',
            title,
            description: descriptionText,
            url: `${appUrl}/knowledge-base/${slug}`,
            siteName: 'Nissi Insights',
            images: resource.thumbnail ? [{ url: resource.thumbnail }] : [],
            publishedTime: resource.created_at,
            modifiedTime: resource.updated_at || resource.created_at,
            tags: resource.tags || [],
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
    const initialData = await fetchResource(slug)

    // JSON-LD structured data for search engine discoverability
    const jsonLd = initialData ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: initialData.meta_title || initialData.title,
        description: initialData.meta_description || initialData.description || initialData.content?.substring(0, 300)?.replace(/<[^>]*>?/gm, '') || '',
        datePublished: initialData.created_at,
        dateModified: initialData.updated_at || initialData.created_at,
        author: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: appUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Nissi Insights',
            url: appUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${appUrl}/favicon.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${appUrl}/knowledge-base/${slug}`,
        },
        ...(initialData.thumbnail && { image: initialData.thumbnail }),
        ...(initialData.tags && initialData.tags.length > 0 && { keywords: initialData.tags.join(', ') }),
    } : null
    
    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ResourceDetailsClient initialData={initialData} slug={slug} />
        </>
    )
}
