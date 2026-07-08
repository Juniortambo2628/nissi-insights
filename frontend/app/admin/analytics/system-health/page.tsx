"use client"

import React, { useState, Suspense } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { PageShell } from '@/components/admin/PageShell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Database, Server, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface SystemHealthData {
    database: {
        healthy: boolean
        message: string
        max_connections: string | null
        current_connections: number | null
    }
    cache_store: string
    session_driver: string
    queue_connection: string
    recommendations: string[]
}

const AdminSystemHealthContent = () => {
    const { data: health, isLoading, mutate } = useApi<SystemHealthData>('/analytics/system-health')

    const isDbOptimized = health?.cache_store !== 'database' && health?.session_driver !== 'database'

    return (
        <AdminLayout>
            <PageShell
                title="System Health"
                subtitle="Monitor database load, cache/session configuration, and performance recommendations."
                action={
                    <Button variant="outline" className="gap-2" onClick={() => mutate()}>
                        <RefreshCw size={18} />
                        Refresh
                    </Button>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-secondary/5 border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Database size={16} className="text-primary" />
                                Database
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-8 bg-secondary/20 rounded animate-pulse" />
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {health?.database.healthy ? (
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        ) : (
                                            <AlertTriangle size={18} className="text-red-500" />
                                        )}
                                        <span className="font-medium text-foreground">
                                            {health?.database.healthy ? 'Healthy' : 'Issue Detected'}
                                        </span>
                                    </div>
                                    {health?.database.current_connections !== null && health?.database.current_connections !== undefined && (
                                        <div className="text-sm text-muted-foreground">
                                            Connections: <strong className="text-foreground">{health?.database.current_connections}</strong>
                                            {health?.database.max_connections && (
                                                <span> / {health?.database.max_connections}</span>
                                            )}
                                        </div>
                                    )}
                                    {!health?.database.healthy && (
                                        <p className="text-xs text-red-500">{health?.database.message}</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/5 border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Server size={16} className="text-primary" />
                                Cache & Session
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-8 bg-secondary/20 rounded animate-pulse" />
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Cache</span>
                                        <Badge variant={health?.cache_store === 'database' ? 'destructive' : 'default'} className="text-[10px]">
                                            {health?.cache_store}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Session</span>
                                        <Badge variant={health?.session_driver === 'database' ? 'destructive' : 'default'} className="text-[10px]">
                                            {health?.session_driver}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Queue</span>
                                        <Badge variant="outline" className="text-[10px]">
                                            {health?.queue_connection}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/5 border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Mail size={16} className="text-primary" />
                                Optimization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-8 bg-secondary/20 rounded animate-pulse" />
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {isDbOptimized ? (
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        ) : (
                                            <AlertTriangle size={18} className="text-amber-500" />
                                        )}
                                        <span className="font-medium text-foreground text-sm">
                                            {isDbOptimized ? 'DB Load Reduced' : 'DB Load High'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {isDbOptimized
                                            ? 'Cache and session are not using the database.'
                                            : 'Switch CACHE_STORE and SESSION_DRIVER to file in .env to reduce connections.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-secondary/5 border-border">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <AlertTriangle size={16} className="text-amber-500" />
                            Recommendations
                        </CardTitle>
                        <CardDescription className="text-xs">Actions to improve stability and performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="h-4 bg-secondary/20 rounded animate-pulse" />
                                <div className="h-4 bg-secondary/20 rounded animate-pulse" />
                                <div className="h-4 bg-secondary/20 rounded animate-pulse" />
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {health?.recommendations.map((rec, i) => (
                                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </PageShell>
        </AdminLayout>
    )
}

const AdminSystemHealthPage = () => {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="space-y-8 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-medium">Loading system health...</p>
                    </div>
                </div>
            </AdminLayout>
        }>
            <AdminSystemHealthContent />
        </Suspense>
    )
}

export default AdminSystemHealthPage
