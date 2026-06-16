import React from 'react'
import CaseStudyDetailClient from '@/components/CaseStudyDetailClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nissi-insights.com'

async function fetchCaseStudy(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    try {
        const res = await fetch(`${apiUrl}/case-studies/${slug}`, { next: { revalidate: 60 } })
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.error("Error fetching case study on server:", error)
    }
    return null
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const caseStudy = await fetchCaseStudy(slug)
    
    if (!caseStudy) {
        return {
            title: 'Case Study Not Found | Nissi Insights',
            description: 'The requested case study could not be found.'
        }
    }
    
    const descriptionText = (
        caseStudy.client_name ? 
            `Case study for ${caseStudy.client_name}: ${caseStudy.title}` : 
            `${caseStudy.title} — Advisory case study from Nissi Insights.`
    ).substring(0, 160)

    return {
        title: `${caseStudy.title} | Nissi Insights Case Studies`,
        description: descriptionText,
        keywords: [
            caseStudy.title,
            'Nissi Insights',
            caseStudy.client_name,
            'case study',
            'energy advisory',
            'market intelligence',
            'Kenya',
        ].filter(Boolean).join(', '),
        alternates: {
            canonical: `${appUrl}/case-studies/${slug}`,
        },
        openGraph: {
            type: 'article',
            title: `${caseStudy.title} | Nissi Insights`,
            description: descriptionText,
            url: `${appUrl}/case-studies/${slug}`,
            siteName: 'Nissi Insights',
            images: caseStudy.image ? [{ url: caseStudy.image }] : [],
            publishedTime: caseStudy.created_at,
            modifiedTime: caseStudy.updated_at || caseStudy.created_at,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${caseStudy.title} | Nissi Insights`,
            description: descriptionText,
        },
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchCaseStudy(slug)

    const jsonLd = initialData ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: initialData.title,
        description: initialData.client_name ? 
            `Case study for ${initialData.client_name}: ${initialData.title}` :
            `${initialData.title} — Advisory case study.`,
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
            '@id': `${appUrl}/case-studies/${slug}`,
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
            <CaseStudyDetailClient initialData={initialData} slug={slug} />
        </>
    )
}
