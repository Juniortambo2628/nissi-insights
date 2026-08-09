import React from 'react'
import CaseStudyDetailClient from '@/components/CaseStudyDetailClient'
import { buildDynamicMetadata, buildArticleJsonLd } from '@/lib/seo'
import { fetchEntity } from '@/lib/api'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const caseStudy = await fetchEntity(slug, 'case-studies')

    return buildDynamicMetadata(caseStudy, {
        path: `/case-studies/${slug}`,
        fallbackTitle: 'Case Study Not Found | Nissi Insights',
        fallbackDescription: 'The requested case study could not be found.',
        type: 'article',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEntity(slug, 'case-studies')
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
