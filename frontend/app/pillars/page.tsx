import React from 'react'
import PillarsClient from './PillarsClient'
import { appUrl } from '@/lib/seo'

const pageUrl = `${appUrl}/pillars`
const title = 'Our Strategic Pillars | Energy, Fintech & Diplomacy | Nissi Insights'
const description = 'Explore the core pillars of Nissi Insights advisory: Energy Advisory, Fintech Strategy, and International Diplomacy. Three domains of expertise delivering comprehensive solutions.'

export const metadata = {
    title,
    description,
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        title,
        description,
        type: 'website',
        url: pageUrl,
    },
}

export default function PillarsPage() {
    return <PillarsClient />
}
