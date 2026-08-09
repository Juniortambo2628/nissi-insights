import React from 'react'
import PillarDetailClient from '@/components/PillarDetailClient'
import { buildDynamicMetadata } from '@/lib/seo'
import { fetchEntity } from '@/lib/api'
import type { Pillar } from '@/lib/types'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const pillar = await fetchEntity<Pillar>(slug, 'pillars')

    return buildDynamicMetadata(pillar, {
        path: `/pillars/${slug}`,
        fallbackTitle: 'Pillar Not Found | Nissi Insights',
        fallbackDescription: 'The requested strategic pillar could not be found.',
        type: 'website',
    })
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const initialData = await fetchEntity<Pillar>(slug, 'pillars')

    return (
        <>
            <PillarDetailClient initialData={initialData} slug={slug} />
        </>
    )
}
