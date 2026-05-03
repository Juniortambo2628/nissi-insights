"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { 
    Calendar, 
    User, 
    Mail, 
    Phone, 
    Building, 
    CheckCircle, 
    XCircle,
    Download,
    Search,
    Filter,
    RefreshCw,
    ExternalLink
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

const AdminRegistrationsPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const eventId = searchParams.get('event_id')
    const { data: registrations, isLoading, mutate } = useApi(`/event-registrations${eventId ? `?event_id=${eventId}` : ''}`)
    const { data: events } = useApi('/events?all=true')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')

    const filteredRegistrations = registrations?.filter((reg: any) => 
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const toggleAttendance = async (reg: any) => {
        try {
            await api.put(`/event-registrations/${reg.id}`, { attended: !reg.attended })
            toast({ title: "Updated", description: `Marked ${reg.name} as ${!reg.attended ? 'attended' : 'not attended'}.` })
            mutate()
        } catch (error) {
            toast({ title: "Error", description: "Failed to update attendance.", variant: "destructive" })
        }
    }

    const exportToCsv = () => {
        if (!filteredRegistrations?.length) return
        
        const headers = ['Name', 'Email', 'Phone', 'Organization', 'Event', 'Attended', 'Registered At']
        const csvContent = [
            headers.join(','),
            ...filteredRegistrations.map((reg: any) => [
                `"${reg.name}"`,
                `"${reg.email}"`,
                `"${reg.phone || ''}"`,
                `"${reg.organization || ''}"`,
                `"${events?.find((e: any) => e.id === reg.event_id)?.title || 'Unknown'}"`,
                reg.attended ? 'Yes' : 'No',
                format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm')
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `registrations_${format(new Date(), 'yyyyMMdd')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Event Registrations</h1>
                        <p className="text-muted-foreground text-sm">Track participants and manage attendance for your events.</p>
                    </div>
                    <Button onClick={exportToCsv} variant="outline" className="gap-2 border-border text-foreground hover:bg-secondary">
                        <Download size={18} />
                        Export to CSV
                    </Button>
                </div>

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

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-secondary/10 animate-pulse rounded-lg" />)}
                    </div>
                ) : (
                    <div className="bg-secondary/10 border border-border/50 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4">Participant</th>
                                        <th className="px-6 py-4">Organization</th>
                                        <th className="px-6 py-4">Event</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {filteredRegistrations?.map((reg: any) => {
                                        const event = events?.find((e: any) => e.id === reg.event_id)
                                        return (
                                            <tr key={reg.id} className="hover:bg-secondary/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground">{reg.name}</span>
                                                        <span className="text-xs text-muted-foreground">{reg.email}</span>
                                                        {reg.phone && <span className="text-[10px] text-primary/60">{reg.phone}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-foreground/80">{reg.organization || '—'}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-foreground line-clamp-1">{event?.title || 'Unknown Event'}</span>
                                                    <span className="text-[10px] text-muted-foreground">{event ? format(new Date(event.date), 'MMM d, yyyy') : ''}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${reg.attended ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-400'}`}>
                                                        {reg.attended ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                        {reg.attended ? 'Attended' : 'Registered'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className={`text-xs ${reg.attended ? 'text-slate-400' : 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                                                        onClick={() => toggleAttendance(reg)}
                                                    >
                                                        {reg.attended ? 'Undo Attendance' : 'Mark Attended'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    {filteredRegistrations?.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                                No registrations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Event Context Switcher Toolbar */}
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
                                    {events?.map((e: any) => (
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
                            <p className="text-sm font-bold text-primary">{filteredRegistrations?.length || 0}</p>
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
        </AdminLayout>
    )
}

export default AdminRegistrationsPage
