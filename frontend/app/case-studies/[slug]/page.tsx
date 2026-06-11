import React from 'react'
import CaseStudyDetailClient from '@/components/CaseStudyDetailClient'

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
    
    if (!caseStudy) {
        return {
            title: 'Case Study Not Found | Nissi Insights',
            description: 'The requested case study could not be found.'
        }
    }
    
    const descriptionText = caseStudy.client_name ? 
        `Case study for ${caseStudy.client_name}: ${caseStudy.title}` : 
        `${caseStudy.title} - Advisory case study.`

    return {
        title: `${caseStudy.title} | Nissi Insights`,
        description: descriptionText.substring(0, 160),
        openGraph: {
            title: `${caseStudy.title} | Nissi Insights`,
            description: descriptionText.substring(0, 160),
            images: caseStudy.image ? [{ url: caseStudy.image }] : [],
        }
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchCaseStudy(slug)
    
    return <CaseStudyDetailClient initialData={initialData} slug={slug} />
}
