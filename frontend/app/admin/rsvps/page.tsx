"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, RefreshCw, Rocket, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { PageShell } from '@/components/admin/PageShell'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { cn } from '@/lib/utils'

interface Rsvp {
    id: number
    name: string
    email: string
    company: string | null
    job_title: string | null
    sector: string | null
    interest: string | null
    consent: boolean
    newsletter: boolean
    type: 'rsvp' | 'early_access'
    attendance: 'accept' | 'decline' | null
    created_at: string
}

export default function AdminRsvpsPage() {
    const { data: rsvps, isLoading, mutate } = useApi<Rsvp[]>('/rsvps')
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [deletingRsvp, setDeletingRsvp] = useState<Rsvp | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const filteredRsvps = rsvps?.filter((rsvp) => {
        const query = searchQuery.toLowerCase()
        return rsvp.name.toLowerCase().includes(query) ||
            rsvp.email.toLowerCase().includes(query) ||
            (rsvp.company && rsvp.company.toLowerCase().includes(query))
    }) ?? []

    const updateAttendance = async (rsvp: Rsvp, attendance: 'accept' | 'decline' | null) => {
        try {
            await api.put(`/rsvps/${rsvp.id}`, { attendance })
            toast({ title: "Updated", description: `${rsvp.name} marked as ${attendance || 'pending'}.` })
            mutate()
        } catch (error) {
            toast({ title: "Error", description: "Failed to update RSVP.", variant: "destructive" })
        }
    }

    const handleDelete = async () => {
        if (!deletingRsvp) return
        setIsDeleting(true)
        try {
            await api.delete(`/rsvps/${deletingRsvp.id}`)
            toast({ title: "Deleted", description: `${deletingRsvp.name} has been removed.` })
            mutate()
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete RSVP.", variant: "destructive" })
        } finally {
            setIsDeleting(false)
            setDeletingRsvp(null)
        }
    }

    const handleExport = () => {
        if (!rsvps) return

        const headers = ['Type', 'Attendance', 'Name', 'Email', 'Organization', 'Role', 'Sector', 'Interest', 'Newsletter', 'Date Registered']
        const csvContent = [
            headers.join(','),
            ...rsvps.map((r) => [
                `"${r.type === 'rsvp' ? 'Dinner RSVP' : 'Early Access'}"`,
                `"${r.type === 'rsvp' ? (r.attendance || 'Pending') : 'N/A'}"`,
                `"${r.name}"`,
                `"${r.email}"`,
                `"${r.company || ''}"`,
                `"${r.job_title || ''}"`,
                `"${r.sector || ''}"`,
                `"${r.interest || ''}"`,
                `"${r.newsletter ? 'Yes' : 'No'}"`,
                `"${format(new Date(r.created_at), 'PPP')}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `nissi-launch-rsvps-${format(new Date(), 'yyyy-MM-dd')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const columns = [
        {
            key: 'type',
            header: 'Type',
            cell: (rsvp: Rsvp) => (
                <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    rsvp.type === 'rsvp'
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                )}>
                    {rsvp.type === 'rsvp' ? 'Dinner' : 'Access'}
                </span>
            ),
        },
        {
            key: 'name',
            header: 'Status/Name',
            cell: (rsvp: Rsvp) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground/90">{rsvp.name}</span>
                    {rsvp.type === 'rsvp' && (
                        <StatusBadge
                            variant={rsvp.attendance === 'accept' ? 'success' : rsvp.attendance === 'decline' ? 'danger' : 'muted'}
                            className="w-fit mt-1"
                        >
                            {rsvp.attendance === 'accept' ? 'Accepted' : rsvp.attendance === 'decline' ? 'Declined' : 'Pending'}
                        </StatusBadge>
                    )}
                </div>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            cell: (rsvp: Rsvp) => (
                <a href={`mailto:${rsvp.email}`} className="text-sm text-primary hover:underline underline-offset-4">
                    {rsvp.email}
                </a>
            ),
        },
        {
            key: 'company',
            header: 'Organization',
            hide: 'md' as const,
            cell: (rsvp: Rsvp) => <span className="text-muted-foreground text-sm">{rsvp.company || '-'}</span>,
        },
        {
            key: 'role',
            header: 'Role',
            hide: 'lg' as const,
            cell: (rsvp: Rsvp) => <span className="text-muted-foreground text-sm">{rsvp.job_title || '-'}</span>,
        },
        {
            key: 'sector',
            header: 'Sector/Interest',
            hide: 'xl' as const,
            cell: (rsvp: Rsvp) => (
                <div className="flex flex-col text-sm">
                    <span className="capitalize text-muted-foreground">{rsvp.sector || '-'}</span>
                    <span className="text-[10px] text-muted-foreground/70 capitalize">
                        {rsvp.interest ? rsvp.interest.replace(/_/g, ' ') : '-'}
                    </span>
                </div>
            ),
        },
        {
            key: 'registered',
            header: <span className="text-right block">Registered</span>,
            cell: (rsvp: Rsvp) => (
                <span className="text-right block text-muted-foreground whitespace-nowrap text-xs">
                    {format(new Date(rsvp.created_at), 'MMM d, yyyy')}
                </span>
            ),
        },
        {
            key: 'actions',
            header: <span className="text-right block">Actions</span>,
            cell: (rsvp: Rsvp) => (
                <div className="flex items-center justify-end gap-1">
                    {rsvp.type === 'rsvp' && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                onClick={() => updateAttendance(rsvp, 'accept')}
                                title="Accept"
                                disabled={rsvp.attendance === 'accept'}
                            >
                                <CheckCircle size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => updateAttendance(rsvp, 'decline')}
                                title="Decline"
                                disabled={rsvp.attendance === 'decline'}
                            >
                                <XCircle size={16} />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingRsvp(rsvp)}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <AdminLayout>
            <PageShell
                title={
                    <span className="flex items-center gap-2">
                        <Rocket className="text-primary h-8 w-8" />
                        Launch RSVPs
                    </span>
                }
                subtitle="Manage early access registrations for the platform launch."
                action={
                    <>
                        <Button variant="outline" onClick={() => mutate()} disabled={isLoading} className="gap-2">
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button onClick={handleExport} disabled={!rsvps?.length} className="gap-2">
                            <Download size={16} />
                            Export CSV
                        </Button>
                    </>
                }
            >
                <Card className="bg-secondary/10 border-border/50">
                    <CardHeader className="border-b border-border/50 bg-secondary/5 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Registered Users</CardTitle>
                                <CardDescription>Total of {rsvps?.length || 0} interested users.</CardDescription>
                            </div>
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or company..."
                                    className="pl-9 bg-background/50 border-border/50 h-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            columns={columns}
                            data={filteredRsvps}
                            isLoading={isLoading}
                            keyExtractor={(rsvp) => rsvp.id}
                            emptyMessage={searchQuery ? "No RSVPs match your search." : "No RSVPs received yet."}
                        />
                    </CardContent>
                </Card>
            </PageShell>

            <ConfirmDialog
                open={!!deletingRsvp}
                onOpenChange={(open) => !open && setDeletingRsvp(null)}
                title="Delete RSVP"
                description={<>Are you sure you want to delete the RSVP for <strong>{deletingRsvp?.name}</strong>? This cannot be undone.</>}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                isLoading={isDeleting}
                variant="destructive"
            />
        </AdminLayout>
    )
}
