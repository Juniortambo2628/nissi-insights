"use client"

import React, { useState, Suspense } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    RefreshCw,
    ExternalLink,
    ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'
import { PageShell } from '@/components/admin/PageShell'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { RedirectFormDialog, RedirectFormData } from '@/components/admin/RedirectFormDialog'

interface Redirect {
    id: number
    from_path: string
    to: string
    status_code: number
    is_active: boolean
    priority: number
    notes: string | null
    created_at: string
    updated_at: string
}

const AdminRedirectsContent = () => {
    const { data: redirects, isLoading, mutate } = useApi<Redirect[]>('/redirects?all=true')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleSave = async (form: RedirectFormData) => {
        setIsSaving(true)
        try {
            if (editingRedirect) {
                await api.put(`/redirects/${editingRedirect.id}`, form)
            } else {
                await api.post('/redirects', form)
            }
            toast({ title: 'Success', description: `Redirect ${editingRedirect ? 'updated' : 'created'} successfully.` })
            mutate()
            setShowForm(false)
            setEditingRedirect(null)
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to save redirect.' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            await api.delete(`/redirects/${deleteId}`)
            toast({ title: 'Deleted', description: 'Redirect removed.' })
            mutate()
            setDeleteId(null)
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete redirect.' })
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredRedirects = redirects?.filter((r) =>
        r.from_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    ) ?? []

    const columns = [
        {
            key: 'from_path',
            header: 'From Path',
            cell: (r: Redirect) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{r.from_path}</span>
                    {r.notes && <span className="text-[10px] text-muted-foreground line-clamp-1">{r.notes}</span>}
                </div>
            ),
        },
        {
            key: 'to',
            header: 'To',
            cell: (r: Redirect) => (
                <a
                    href={r.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                    {r.to}
                    <ExternalLink size={12} />
                </a>
            ),
        },
        {
            key: 'status',
            header: 'Status Code',
            className: 'w-32',
            cell: (r: Redirect) => (
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <ArrowRight size={14} className="text-muted-foreground" />
                    {r.status_code}
                </div>
            ),
        },
        {
            key: 'state',
            header: 'State',
            className: 'w-24',
            cell: (r: Redirect) => (
                <StatusBadge variant={r.is_active ? 'success' : 'muted'}>
                    {r.is_active ? 'Active' : 'Inactive'}
                </StatusBadge>
            ),
        },
        {
            key: 'priority',
            header: 'Priority',
            className: 'w-24 hidden md:table-cell',
            cell: (r: Redirect) => <span className="text-sm text-muted-foreground">{r.priority}</span>,
        },
        {
            key: 'actions',
            header: <span className="text-right block">Actions</span>,
            className: 'w-32',
            cell: (r: Redirect) => (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingRedirect(r); setShowForm(true); }}>
                        <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(r.id)}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <AdminLayout>
            <PageShell
                title="Redirects"
                subtitle="Manage URL redirects to fix broken inbound links and consolidate duplicate paths."
                action={
                    <Button className="gap-2" onClick={() => { setEditingRedirect(null); setShowForm(true); }}>
                        <Plus size={18} /> Add Redirect
                    </Button>
                }
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search by from path, destination, or note..."
                            className="pl-10 bg-secondary/10 border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className={`${isLoading ? 'animate-spin opacity-50' : ''}`}
                        onClick={() => mutate()}
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredRedirects}
                    isLoading={isLoading}
                    keyExtractor={(r) => r.id}
                    emptyMessage="No redirects found."
                />
            </PageShell>

            <RedirectFormDialog
                open={showForm}
                onOpenChange={setShowForm}
                title={editingRedirect ? 'Edit Redirect' : 'New Redirect'}
                initialData={editingRedirect ? {
                    from_path: editingRedirect.from_path,
                    to: editingRedirect.to,
                    status_code: editingRedirect.status_code,
                    is_active: editingRedirect.is_active,
                    priority: editingRedirect.priority,
                    notes: editingRedirect.notes || '',
                } : undefined}
                isLoading={isSaving}
                onSubmit={handleSave}
                onCancel={() => { setShowForm(false); setEditingRedirect(null); }}
            />

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
                title="Delete Redirect"
                description="Are you sure you want to delete this redirect? Inbound traffic to the old path will no longer be forwarded."
                confirmLabel="Delete"
                onConfirm={handleDelete}
                isLoading={isDeleting}
                variant="destructive"
            />
        </AdminLayout>
    )
}

const AdminRedirectsPage = () => {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="space-y-8 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-medium">Loading redirects...</p>
                    </div>
                </div>
            </AdminLayout>
        }>
            <AdminRedirectsContent />
        </Suspense>
    )
}

export default AdminRedirectsPage
