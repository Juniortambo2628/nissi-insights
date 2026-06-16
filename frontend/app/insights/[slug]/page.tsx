import React from 'react'
import InsightDetailClient from '@/components/InsightDetailClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

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
    
    // Use custom SEO fields if set, otherwise auto-generate
    const title = insight.meta_title || `${insight.title} | Nissi Insights`
    const descriptionText = (
        insight.meta_description ||
        insight.excerpt ||
        (insight.content ? insight.content.substring(0, 160).replace(/<[^>]*>?/gm, '') : '')
        || `${insight.title} — Strategic analysis and advisory from Nissi Insights.`
    ).substring(0, 160)

    // Build keywords from tags + auto-generated terms
    const keywordsList = [
        ...(insight.tags || []),
        insight.title,
        'Nissi Insights',
        insight.category,
        'energy advisory',
        'market intelligence',
        'Kenya',
    ].filter(Boolean)

    return {
        title,
        description: descriptionText,
        keywords: keywordsList.join(', '),
        alternates: {
            canonical: `${appUrl}/insights/${slug}`,
        },
        openGraph: {
            type: 'article',
            title,
            description: descriptionText,
            url: `${appUrl}/insights/${slug}`,
            siteName: 'Nissi Insights',
            images: insight.image ? [{ url: insight.image }] : [],
            publishedTime: insight.created_at,
            modifiedTime: insight.updated_at || insight.created_at,
            tags: insight.tags || [],
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
    const initialData = await fetchInsight(slug)

    const jsonLd = initialData ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: initialData.meta_title || initialData.title,
        description: initialData.meta_description || initialData.excerpt || initialData.content?.substring(0, 300)?.replace(/<[^>]*>?/gm, '') || '',
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
            '@id': `${appUrl}/insights/${slug}`,
        },
        ...(initialData.image && { image: initialData.image }),
        ...(initialData.category && { articleSection: initialData.category }),
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
            <InsightDetailClient initialData={initialData} slug={slug} />
        </>
    )
}
