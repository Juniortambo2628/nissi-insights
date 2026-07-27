"use client"

import React, { useState, Suspense, useCallback, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import {
    CheckCircle,
    XCircle,
    Download,
    Search,
    Filter,
    RefreshCw,
    ExternalLink,
    Mail,
    Loader2,
    Send,
    Users,
    CheckCheck,
    Undo2,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'
import { format } from 'date-fns'
import { useSearchParams, useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PageShell } from '@/components/admin/PageShell'
import { DataTable } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface Event {
    id: number
    title: string
    date: string
}

interface Registration {
    id: number
    event_id: number
    name: string
    email: string
    phone: string | null
    organization: string | null
    attended: boolean
    created_at: string
}

interface EmailTemplate {
    id: number
    key: string
    name: string
    subject: string
    is_active: boolean
}

const AdminRegistrationsContent = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const eventId = searchParams.get('event_id')
    const { data: registrations, isLoading, mutate } = useApi<Registration[]>(`/event-registrations${eventId ? `?event_id=${eventId}` : ''}`)
    const { data: events } = useApi<Event[]>('/events?all=true')
    const { data: emailTemplates } = useApi<EmailTemplate[]>('/email-templates')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('')
    const [isSendingEmails, setIsSendingEmails] = useState(false)
    const [isBulkUpdating, setIsBulkUpdating] = useState(false)

    const filteredRegistrations = useMemo(() =>
        registrations?.filter((reg) =>
            reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        ) ?? [],
        [registrations, searchTerm]
    )

    const eventTemplates = useMemo(() =>
        emailTemplates?.filter(t =>
            t.key.startsWith('event_') && t.is_active
        ) ?? [],
        [emailTemplates]
    )

    const allFilteredSelected = filteredRegistrations.length > 0 &&
        filteredRegistrations.every(reg => selectedIds.has(reg.id))

    const toggleSelectAll = useCallback(() => {
        if (allFilteredSelected) {
            setSelectedIds(prev => {
                const next = new Set(prev)
                filteredRegistrations.forEach(reg => next.delete(reg.id))
                return next
            })
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev)
                filteredRegistrations.forEach(reg => next.add(reg.id))
                return next
            })
        }
    }, [allFilteredSelected, filteredRegistrations])

    const toggleSelectOne = useCallback((id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])

    const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

    const toggleAttendance = async (reg: Registration) => {
        try {
            await api.put(`/event-registrations/${reg.id}`, { attended: !reg.attended })
            toast({ title: "Updated", description: `Marked ${reg.name} as ${!reg.attended ? 'attended' : 'not attended'}.` })
            mutate()
        } catch {
            toast({ title: "Error", description: "Failed to update attendance.", variant: "destructive" })
        }
    }

    const bulkToggleAttendance = async (attended: boolean) => {
        if (selectedIds.size === 0) return
        setIsBulkUpdating(true)
        const ids = Array.from(selectedIds)
        let succeeded = 0
        let failed = 0

        try {
            await Promise.allSettled(
                ids.map(id =>
                    api.put(`/event-registrations/${id}`, { attended }).then(() => succeeded++).catch(() => failed++)
                )
            )
            toast({
                title: "Bulk Update",
                description: `${succeeded} registrant(s) marked as ${attended ? 'attended' : 'not attended'}${failed > 0 ? `, ${failed} failed` : ''}.`,
            })
            setSelectedIds(new Set())
            mutate()
        } finally {
            setIsBulkUpdating(false)
        }
    }

    const sendBulkEmail = async () => {
        if (selectedIds.size === 0) {
            toast({ title: "No Selection", description: "Please select at least one registrant.", variant: "destructive" })
            return
        }
        if (!selectedTemplateKey) {
            toast({ title: "Select Template", description: "Please choose an email template to send.", variant: "destructive" })
            return
        }
        if (!eventId) {
            toast({ title: "Select an Event", description: "Please filter by a specific event first.", variant: "destructive" })
            return
        }

        setIsSendingEmails(true)
        try {
            const response = await api.post('/event-registrations/send-reminder', {
                event_id: parseInt(eventId),
                registration_ids: Array.from(selectedIds),
                template_key: selectedTemplateKey,
            })
            const { sent, failed } = response.data
            toast({
                title: "Emails Sent",
                description: `${sent} email(s) sent successfully${failed > 0 ? `, ${failed} failed` : ''}.`,
            })
            setSelectedIds(new Set())
        } catch (error: unknown) {
            const errObj = error as { response?: { data?: { error?: string } } }
            toast({
                title: "Error",
                description: errObj?.response?.data?.error || "Failed to send emails.",
                variant: "destructive"
            })
        } finally {
            setIsSendingEmails(false)
        }
    }

    const exportToCsv = () => {
        if (!filteredRegistrations.length) return

        const headers = ['Name', 'Email', 'Phone', 'Organization', 'Event', 'Attended', 'Registered At']
        const csvContent = [
            headers.join(','),
            ...filteredRegistrations.map((reg) => {
                const event = events?.find((e) => e.id === reg.event_id)
                return [
                    `"${reg.name}"`,
                    `"${reg.email}"`,
                    `"${reg.phone || ''}"`,
                    `"${reg.organization || ''}"`,
                    `"${event?.title || 'Unknown'}"`,
                    reg.attended ? 'Yes' : 'No',
                    format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm')
                ].join(',')
            })
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `registrations_${format(new Date(), 'yyyyMMdd')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getEvent = (eventId: number) => events?.find((e) => e.id === eventId)

    const columns = [
        {
            key: 'select',
            header: (
                <button
                    onClick={toggleSelectAll}
                    className="flex items-center justify-center w-5 h-5 rounded border border-border/60 bg-secondary/20 hover:bg-primary/20 transition-colors"
                >
                    {allFilteredSelected ? (
                        <CheckCircle size={14} className="text-primary" />
                    ) : filteredRegistrations.length > 0 && filteredRegistrations.some(reg => selectedIds.has(reg.id)) ? (
                        <div className="w-2 h-2 rounded-sm bg-primary" />
                    ) : null}
                </button>
            ),
            cell: (reg: Registration) => (
                <button
                    onClick={() => toggleSelectOne(reg.id)}
                    className={`flex items-center justify-center w-5 h-5 rounded border transition-colors ${
                        selectedIds.has(reg.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border/60 bg-secondary/20 hover:bg-primary/20'
                    }`}
                >
                    {selectedIds.has(reg.id) && <CheckCircle size={12} />}
                </button>
            ),
            className: 'w-12',
        },
        {
            key: 'participant',
            header: 'Participant',
            cell: (reg: Registration) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground">{reg.name}</span>
                    <span className="text-xs text-muted-foreground">{reg.email}</span>
                    {reg.phone && <span className="text-[10px] text-primary/60">{reg.phone}</span>}
                </div>
            ),
        },
        {
            key: 'organization',
            header: 'Organization',
            hide: 'md' as const,
            cell: (reg: Registration) => <span className="text-sm text-foreground/80">{reg.organization || '—'}</span>,
        },
        {
            key: 'event',
            header: 'Event',
            cell: (reg: Registration) => {
                const event = getEvent(reg.event_id)
                return (
                    <div>
                        <span className="text-sm font-medium text-foreground line-clamp-1">{event?.title || 'Unknown Event'}</span>
                        <span className="text-[10px] text-muted-foreground">{event ? format(new Date(event.date), 'MMM d, yyyy') : ''}</span>
                    </div>
                )
            },
        },
        {
            key: 'status',
            header: 'Status',
            cell: (reg: Registration) => (
                <StatusBadge
                    variant={reg.attended ? 'success' : 'muted'}
                    icon={reg.attended ? <CheckCircle size={10} /> : <XCircle size={10} />}
                >
                    {reg.attended ? 'Attended' : 'Registered'}
                </StatusBadge>
            ),
        },
        {
            key: 'actions',
            header: <span className="text-right block">Actions</span>,
            cell: (reg: Registration) => (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${reg.attended ? 'text-slate-400' : 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                        onClick={() => toggleAttendance(reg)}
                    >
                        {reg.attended ? 'Undo Attendance' : 'Mark Attended'}
                    </Button>
                </div>
            ),
        },
    ]

    const hasSelection = selectedIds.size > 0

    return (
        <AdminLayout>
            <PageShell
                title="Event Registrations"
                subtitle="Track participants and manage attendance for your events."
                action={
                    <div className="flex gap-2">
                        <Button onClick={exportToCsv} variant="outline" className="gap-2 border-border text-foreground hover:bg-secondary">
                            <Download size={18} />
                            Export to CSV
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search by name, email, or organization..."
                            className="pl-10 bg-secondary/10 border-border"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {eventId && (
                            <Button variant="ghost" className="text-xs" onClick={() => window.history.pushState({}, '', '/admin/registrations')}>
                                Clear Event Filter
                            </Button>
                        )}
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredRegistrations}
                    isLoading={isLoading}
                    keyExtractor={(reg) => reg.id}
                    emptyMessage="No registrations found."
                />
            </PageShell>

            {/* Bulk Action Toolbar - appears when items are selected */}
            {hasSelection && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-50">
                    <div className="bg-background/95 backdrop-blur-md border border-primary/30 shadow-2xl shadow-primary/15 rounded-2xl p-4">
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{selectedIds.size} registrant{selectedIds.size !== 1 ? 's' : ''} selected</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bulk Actions</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                onClick={clearSelection}
                            >
                                <X size={16} />
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Email Template Selector + Send */}
                            <div className="flex items-center gap-2 flex-1">
                                <div className="flex-1">
                                    <Select value={selectedTemplateKey} onValueChange={setSelectedTemplateKey}>
                                        <SelectTrigger className="bg-secondary/10 border-border text-sm h-10">
                                            <SelectValue placeholder="Choose email template..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border-border max-h-64">
                                            {eventTemplates.length === 0 ? (
                                                <SelectItem value="none" disabled>No event templates available</SelectItem>
                                            ) : (
                                                eventTemplates.map(t => (
                                                    <SelectItem key={t.key} value={t.key}>{t.name}</SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={sendBulkEmail}
                                    disabled={isSendingEmails || !selectedTemplateKey || !eventId}
                                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                                >
                                    {isSendingEmails ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    Send
                                </Button>
                            </div>

                            <div className="h-px sm:h-8 sm:w-px bg-border/50" />

                            {/* Attendance Bulk Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-xs border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                    onClick={() => bulkToggleAttendance(true)}
                                    disabled={isBulkUpdating}
                                >
                                    {isBulkUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
                                    Mark Attended
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-xs border-slate-400/30 text-slate-400 hover:bg-slate-400/10"
                                    onClick={() => bulkToggleAttendance(false)}
                                    disabled={isBulkUpdating}
                                >
                                    {isBulkUpdating ? <Loader2 size={14} className="animate-spin" /> : <Undo2 size={14} />}
                                    Unmark
                                </Button>
                            </div>
                        </div>

                        {!eventId && (
                            <p className="text-[10px] text-amber-500 mt-2 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-amber-500" />
                                Filter by an event to send emails
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Event Context Switcher Toolbar */}
            {!hasSelection && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                    <div className="bg-background/80 backdrop-blur-md border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Filter size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Context</p>
                                <Select
                                    value={eventId || 'all'}
                                    onValueChange={(val) => {
                                        const params = new URLSearchParams(window.location.search)
                                        if (val === 'all') params.delete('event_id')
                                        else params.set('event_id', val)
                                        router.push(`/admin/registrations?${params.toString()}`)
                                    }}
                                >
                                    <SelectTrigger className="border-none bg-transparent p-0 h-auto shadow-none focus:ring-0 text-sm font-bold text-foreground">
                                        <SelectValue placeholder="Select Event" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-border">
                                        <SelectItem value="all">All Events</SelectItem>
                                        {events?.map((e) => (
                                            <SelectItem key={e.id} value={e.id.toString()}>{e.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-border/50" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block mr-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Registrations</p>
                                <p className="text-sm font-bold text-primary">{filteredRegistrations.length || 0}</p>
                            </div>
                            <div className="flex gap-1 bg-secondary/20 p-1 rounded-xl">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-9 w-9 rounded-lg hover:bg-primary/10 text-primary transition-all ${isLoading ? 'animate-spin opacity-50' : ''}`}
                                    onClick={() => {
                                        mutate()
                                        toast({ title: "Refreshing", description: "Updating registration data..." })
                                    }}
                                    title="Refresh Data"
                                >
                                    <RefreshCw size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-lg hover:bg-primary/10 text-primary"
                                    onClick={() => router.push('/admin/events')}
                                    title="Manage Events"
                                >
                                    <ExternalLink size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

const AdminRegistrationsPage = () => {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="space-y-8 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-medium">Loading registrations...</p>
                    </div>
                </div>
            </AdminLayout>
        }>
            <AdminRegistrationsContent />
        </Suspense>
    )
}

export default AdminRegistrationsPage
