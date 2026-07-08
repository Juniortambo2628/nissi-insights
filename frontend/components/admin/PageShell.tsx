"use client"

import React from 'react'

interface PageShellProps {
    title: React.ReactNode
    subtitle?: React.ReactNode
    action?: React.ReactNode
    children: React.ReactNode
}

export function PageShell({ title, subtitle, action, children }: PageShellProps) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                    {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
                </div>
                {action && <div className="flex items-center gap-3">{action}</div>}
            </div>
            {children}
        </div>
    )
}
