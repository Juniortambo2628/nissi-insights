"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, RefreshCw, Rocket } from 'lucide-react'
import { format } from 'date-fns'

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
    created_at: string
}

export default function AdminRsvpsPage() {
    const { data: rsvps, isLoading, mutate } = useApi<Rsvp[]>('/rsvps')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredRsvps = rsvps?.filter(rsvp => {
        const query = searchQuery.toLowerCase()
        return rsvp.name.toLowerCase().includes(query) || 
               rsvp.email.toLowerCase().includes(query) ||
               (rsvp.company && rsvp.company.toLowerCase().includes(query))
    })

    const handleExport = () => {
        if (!rsvps) return
        
        const headers = ['Name', 'Email', 'Organization', 'Role', 'Sector', 'Interest', 'Newsletter', 'Date Registered']
        const csvContent = [
            headers.join(','),
            ...rsvps.map(r => [
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

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
                            <Rocket className="text-primary h-8 w-8" />
                            Launch RSVPs
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage early access registrations for the platform launch.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => mutate()} disabled={isLoading} className="gap-2">
                            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button onClick={handleExport} disabled={!rsvps?.length} className="gap-2">
                            <Download size={16} />
                            Export CSV
                        </Button>
                    </div>
                </div>

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
                        {isLoading ? (
                            <div className="p-8 flex justify-center items-center">
                                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredRsvps?.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                {searchQuery ? "No RSVPs match your search." : "No RSVPs received yet."}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-secondary/20">
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead className="font-semibold">Name</TableHead>
                                        <TableHead className="font-semibold">Email</TableHead>
                                        <TableHead className="font-semibold hidden md:table-cell">Organization</TableHead>
                                        <TableHead className="font-semibold hidden lg:table-cell">Role</TableHead>
                                        <TableHead className="font-semibold hidden xl:table-cell">Sector</TableHead>
                                        <TableHead className="font-semibold hidden xl:table-cell">Interest</TableHead>
                                        <TableHead className="font-semibold text-right">Registered</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRsvps?.map((rsvp) => (
                                        <TableRow key={rsvp.id} className="border-border/50 group hover:bg-secondary/10">
                                            <TableCell className="font-medium text-foreground/90">{rsvp.name}</TableCell>
                                            <TableCell>
                                                <a href={`mailto:${rsvp.email}`} className="text-primary hover:underline underline-offset-4">
                                                    {rsvp.email}
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground hidden md:table-cell">{rsvp.company || '-'}</TableCell>
                                            <TableCell className="text-muted-foreground hidden lg:table-cell">{rsvp.job_title || '-'}</TableCell>
                                            <TableCell className="text-muted-foreground hidden xl:table-cell capitalize flex items-center gap-1">
                                                {rsvp.sector || '-'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground hidden xl:table-cell capitalize">
                                                {rsvp.interest ? rsvp.interest.replace('_', ' ') : '-'}
                                                {rsvp.newsletter && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary" title="Subscribed to Newsletter" />}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                                                {format(new Date(rsvp.created_at), 'MMM d, yyyy')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
