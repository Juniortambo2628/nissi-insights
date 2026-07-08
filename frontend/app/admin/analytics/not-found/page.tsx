"use client"

import React, { useState, Suspense } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import {
    Search,
    RefreshCw,
    Globe,
    Monitor,
    Calendar,
    AlertTriangle,
    Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageShell } from '@/components/admin/PageShell'
import { DataTable } from '@/components/admin/DataTable'
import { RedirectFormDialog, RedirectFormData } from '@/components/admin/RedirectFormDialog'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'
import { format } from 'date-fns'

interface NotFoundLog {
    id: number
    path: string
    referrer: string | null
    user_agent: string | null
    ip_address: string | null
    created_at: string
}

interface NotFoundSummary {
    total: number
    today: number
    top_paths: { path: string; count: number }[]
}

const AdminNotFoundContent = () => {
    const { data: logsData, isLoading, mutate } = useApi<{ data: NotFoundLog[] }>('/analytics/not-found-logs')
    const { data: summary } = useApi<NotFoundSummary>('/analytics/not-found-summary')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [selectedPath, setSelectedPath] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const logs = logsData?.data ?? []

    const handleCreateRedirect = async (form: RedirectFormData) => {
        setIsSaving(true)
        try {
            await api.post('/redirects', form)
            toast({ title: 'Redirect created', description: `${form.from_path} now redirects to ${form.to}.` })
            setShowForm(false)
            setSelectedPath(null)
            mutate()
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to create redirect.' })
        } finally {
            setIsSaving(false)
        }
    }

    const filteredLogs = logs.filter((log) =>
        log.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.referrer?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (log.user_agent?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )

    const columns = [
        {
            key: 'path',
            header: 'Path',
            cell: (log: NotFoundLog) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{log.path}</span>
                    {log.referrer && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-xs">
                            from {log.referrer}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'source',
            header: 'Source',
            hide: 'md' as const,
            cell: (log: NotFoundLog) => (
                <div className="flex flex-col text-xs text-muted-foreground">
                    {log.ip_address && (
                        <span className="flex items-center gap-1">
                            <Globe size={10} />
                            {log.ip_address}
                        </span>
                    )}
                    {log.user_agent && (
                        <span className="flex items-center gap-1 truncate max-w-xs" title={log.user_agent}>
                            <Monitor size={10} />
                            {log.user_agent}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'when',
            header: 'When',
            className: 'w-40',
            cell: (log: NotFoundLog) => (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} />
                    {format(new Date(log.created_at), 'MMM d, HH:mm')}
                </span>
            ),
        },
        {
            key: 'actions',
            header: <span className="text-right block">Actions</span>,
            className: 'w-40',
            cell: (log: NotFoundLog) => (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => { setSelectedPath(log.path); setShowForm(true); }}
                    >
                        <Plus size={14} />
                        Redirect
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <AdminLayout>
            <PageShell
                title="404 Logs"
                subtitle="Track missing pages reported by visitors and search engines so you can add redirects or restore content."
                action={
                    <Button variant="outline" className="gap-2" onClick={() => mutate()}>
                        <RefreshCw size={18} />
                        Refresh
                    </Button>
                }
            >
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/10 border border-border/50 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total 404s</p>
                        <p className="text-2xl font-bold text-foreground">{summary?.total ?? 0}</p>
                    </div>
                    <div className="bg-secondary/10 border border-border/50 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today</p>
                        <p className="text-2xl font-bold text-foreground">{summary?.today ?? 0}</p>
                    </div>
                    <div className="bg-secondary/10 border border-border/50 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Missing Path</p>
                        <p className="text-sm font-bold text-foreground truncate">
                            {summary?.top_paths?.[0]?.path ?? '—'}
                        </p>
                        {summary?.top_paths?.[0] && (
                            <p className="text-xs text-muted-foreground">{summary.top_paths[0].count} hits</p>
                        )}
                    </div>
                </div>

                {/* Top Paths */}
                {summary && summary.top_paths.length > 0 && (
                    <div className="bg-secondary/10 border border-border/50 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                            <AlertTriangle size={16} className="text-amber-500" />
                            Most Requested Missing Paths
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {summary.top_paths.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => { setSelectedPath(item.path); setShowForm(true); }}
                                    className="flex items-center gap-2 bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-lg px-3 py-1.5 text-xs transition-colors"
                                >
                                    <span className="font-medium text-foreground">{item.path}</span>
                                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{item.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search + Table */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search by path, referrer, or user agent..."
                            className="pl-10 bg-secondary/10 border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredLogs}
                    isLoading={isLoading}
                    keyExtractor={(log) => log.id}
                    emptyMessage="No 404 logs found."
                />
            </PageShell>

            <RedirectFormDialog
                open={showForm}
                onOpenChange={setShowForm}
                title="Create Redirect from 404"
                initialData={selectedPath ? { from_path: selectedPath, to: '', status_code: 301, is_active: true, priority: 100, notes: 'Created from 404 log' } : undefined}
                isLoading={isSaving}
                onSubmit={handleCreateRedirect}
                onCancel={() => { setShowForm(false); setSelectedPath(null); }}
            />
        </AdminLayout>
    )
}

const AdminNotFoundPage = () => {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="space-y-8 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-medium">Loading 404 logs...</p>
                    </div>
                </div>
            </AdminLayout>
        }>
            <AdminNotFoundContent />
        </Suspense>
    )
}

export default AdminNotFoundPage
