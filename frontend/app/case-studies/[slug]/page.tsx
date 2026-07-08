import React from 'react'
import CaseStudyDetailClient from '@/components/CaseStudyDetailClient'
import { buildDynamicMetadata, buildArticleJsonLd } from '@/lib/seo'

interface PageProps {
    params: Promise<{ slug: string }>
}

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

    return buildDynamicMetadata(caseStudy, {
        path: `/case-studies/${slug}`,
        fallbackTitle: 'Case Study Not Found | Nissi Insights',
        fallbackDescription: 'The requested case study could not be found.',
        type: 'article',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchCaseStudy(slug)
    const jsonLd = buildArticleJsonLd(initialData, `/case-studies/${slug}`)

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
