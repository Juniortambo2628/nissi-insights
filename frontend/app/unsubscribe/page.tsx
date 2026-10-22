import React from 'react'
import UnsubscribeClient from './UnsubscribeClient'

export const metadata = {
    title: 'Unsubscribe | Nissi Insights',
    description: 'Unsubscribe from Nissi Insights newsletters and email campaigns.',
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: 'https://nissi-insights.com/unsubscribe',
    },
}

export default function UnsubscribePage() {
    return (
        <React.Suspense
            fallback={
                <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground/50">
                    Loading...
                </div>
            }
        >
            <UnsubscribeClient />
        </React.Suspense>
    )
}
