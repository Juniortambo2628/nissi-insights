"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    const pathname = usePathname()

    useEffect(() => {
        if (!pathname) return

        // Log the 404 path to the backend for Search Console reconciliation
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        fetch(`${apiUrl}/analytics/track-404`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: pathname, source: 'client_not_found' }),
        }).catch(() => {
            // Silent fail — 404 logging is best-effort
        })
    }, [pathname])

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="max-w-xl w-full text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-8xl font-bold text-primary/20">404</h1>
                    <h2 className="text-3xl font-bold text-foreground">Page not found</h2>
                    <p className="text-muted-foreground text-lg">
                        We couldn&apos;t find the page you were looking for. It may have been moved, renamed, or removed.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild className="gap-2">
                        <Link href="/">
                            <Home size={18} />
                            Back to Home
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/insights">
                            <Search size={18} />
                            Explore Insights
                        </Link>
                    </Button>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={16} />
                    Go back to previous page
                </button>
            </div>
        </main>
    )
}
