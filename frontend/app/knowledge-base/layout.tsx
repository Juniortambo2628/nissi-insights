import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Knowledge Hub | Nissi Insights',
    description: 'Access white papers, industry reports, and strategic intelligence resources from Nissi Insights. Download expert analysis on energy markets, fuel prices, and advisory insights for Africa.',
    keywords: 'Nissi Insights, knowledge hub, white papers, industry reports, energy advisory, market intelligence, Kenya, fuel prices, strategic insights',
    openGraph: {
        type: 'website',
        title: 'Knowledge Hub | Nissi Insights',
        description: 'Access white papers, industry reports, and strategic intelligence resources from Nissi Insights.',
        siteName: 'Nissi Insights',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Knowledge Hub | Nissi Insights',
        description: 'Access white papers, industry reports, and strategic intelligence resources from Nissi Insights.',
    },
}

export default function KnowledgeBaseLayout({ children }: { children: React.ReactNode }) {
    return children
}
