import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Insights & Research | Nissi Insights',
    description: 'Read the latest strategic analysis, market intelligence, and advisory insights from Nissi Insights. Expert commentary on energy markets, due diligence, and industry trends in Africa.',
    keywords: 'Nissi Insights, insights, research, energy analysis, market intelligence, advisory, Kenya, Africa, industry trends',
    openGraph: {
        type: 'website',
        title: 'Insights & Research | Nissi Insights',
        description: 'Read the latest strategic analysis, market intelligence, and advisory insights from Nissi Insights.',
        siteName: 'Nissi Insights',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Insights & Research | Nissi Insights',
        description: 'Read the latest strategic analysis, market intelligence, and advisory insights from Nissi Insights.',
    },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
    return children
}
