"use client"

import React, { useEffect, useMemo, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Loader2, Search, Send, Users, UserX, Contact } from 'lucide-react'
import api from '@/lib/api'
import { useApi } from '@/hooks/use-api'
import { useToast } from '@/hooks/use-toast'
import { Campaign, Newsletter, Subscriber, EmailContact, CampaignSendResult } from '@/types/api'

interface CampaignSendDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsletters: Newsletter[]
    preselectedNewsletterId?: number | null
    existingCampaign?: Campaign | null
    onSent: () => void
}

const CampaignSendDialog = ({
    open,
    onOpenChange,
    newsletters,
    preselectedNewsletterId,
    existingCampaign,
    onSent,
}: CampaignSendDialogProps) => {
    const { toast } = useToast()
    const { data: subscribers } = useApi<Subscriber[]>(open ? '/subscribers' : null)
    const { data: contacts } = useApi<EmailContact[]>(open ? '/email-contacts' : null)

    const [name, setName] = useState('')
    const [subject, setSubject] = useState('')
    const [newsletterId, setNewsletterId] = useState('')
    const [mode, setMode] = useState<'all' | 'selected'>('all')
    const [selectedSubscriberIds, setSelectedSubscriberIds] = useState<Set<number>>(new Set())
    const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')
    const [isSending, setIsSending] = useState(false)

    const eligibleSubscribers = useMemo(
        () => subscribers?.filter((s) => s.is_active && !s.is_opted_out) || [],
        [subscribers]
    )
    const eligibleContacts = useMemo(
        () => contacts?.filter((c) => !c.is_opted_out) || [],
        [contacts]
    )
    const optedOutSubscribers = useMemo(
        () => subscribers?.filter((s) => s.is_opted_out) || [],
        [subscribers]
    )
    const optedOutContacts = useMemo(
        () => contacts?.filter((c) => c.is_opted_out) || [],
        [contacts]
    )

    const totalEligible = eligibleSubscribers.length + eligibleContacts.length
    const totalOptedOut = optedOutSubscribers.length + optedOutContacts.length
    const totalSelected = selectedSubscriberIds.size + selectedContactIds.size

    useEffect(() => {
        if (!open) return
        setSelectedSubscriberIds(new Set())
        setSelectedContactIds(new Set())
        setSearchTerm('')
        setMode('all')

        if (existingCampaign) {
            setName(existingCampaign.name)
            setSubject(existingCampaign.subject || '')
            setNewsletterId(String(existingCampaign.newsletter_id))
        } else if (preselectedNewsletterId) {
            const newsletter = newsletters.find((n) => n.id === preselectedNewsletterId)
            setName(newsletter ? `Share: ${newsletter.title}` : '')
            setSubject(newsletter?.subject || '')
            setNewsletterId(String(preselectedNewsletterId))
        } else {
            setName('')
            setSubject('')
            setNewsletterId('')
        }
    }, [open, existingCampaign, preselectedNewsletterId, newsletters])

    const filteredSubscribers = useMemo(() => {
        if (!subscribers) return []
        const term = searchTerm.toLowerCase()
        return subscribers.filter(
            (s) =>
                s.email.toLowerCase().includes(term) ||
                (s.name && s.name.toLowerCase().includes(term))
        )
    }, [subscribers, searchTerm])

    const filteredContacts = useMemo(() => {
        if (!contacts) return []
        const term = searchTerm.toLowerCase()
        return contacts.filter(
            (c) =>
                c.email.toLowerCase().includes(term) ||
                (c.name && c.name.toLowerCase().includes(term))
        )
    }, [contacts, searchTerm])

    const toggleSubscriber = (id: number) => {
        setSelectedSubscriberIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleContact = (id: number) => {
        setSelectedContactIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleSend = async () => {
        if (!newsletterId) {
            toast({ variant: 'destructive', title: 'Newsletter required', description: 'Choose a newsletter to share.' })
            return
        }
        if (!existingCampaign && !name.trim()) {
            toast({ variant: 'destructive', title: 'Name required', description: 'Give this campaign a name.' })
            return
        }
        if (mode === 'selected' && totalSelected === 0) {
            toast({ variant: 'destructive', title: 'No recipients', description: 'Select at least one recipient.' })
            return
        }

        setIsSending(true)
        try {
            let campaignId = existingCampaign?.id

            if (!campaignId) {
                const res = await api.post('/campaigns', {
                    name: name.trim(),
                    newsletter_id: parseInt(newsletterId, 10),
                    subject: subject.trim() || null,
                })
                campaignId = res.data.id
            }

            const payload: Record<string, unknown> = {}
            if (mode === 'selected') {
                if (selectedSubscriberIds.size > 0) {
                    payload.subscriber_ids = Array.from(selectedSubscriberIds)
                }
                if (selectedContactIds.size > 0) {
                    payload.contact_ids = Array.from(selectedContactIds)
                }
            }
            const result = await api.post<CampaignSendResult>(`/campaigns/${campaignId}/send`, payload)

            toast({
                title: 'Campaign sent',
                description: result.data.message,
            })
            onSent()
            onOpenChange(false)
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Send failed',
                description: err.response?.data?.message || 'Failed to send campaign.',
            })
        } finally {
            setIsSending(false)
        }
    }

    const selectedNewsletter = newsletters.find((n) => n.id === parseInt(newsletterId, 10))

    return (
        <Dialog open={open} onOpenChange={(o) => !isSending && onOpenChange(o)}>
            <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>{existingCampaign ? 'Send Campaign' : 'Share Newsletter'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Campaign Name</label>
                            <Input
                                className="bg-background border-border text-foreground"
                                placeholder="e.g. March Market Brief"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!!existingCampaign}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Newsletter</label>
                            <Select value={newsletterId} onValueChange={setNewsletterId} disabled={!!existingCampaign || !!preselectedNewsletterId}>
                                <SelectTrigger className="bg-background border-border text-foreground">
                                    <SelectValue placeholder="Choose a newsletter..." />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border max-h-64">
                                    {newsletters.length === 0 && (
                                        <SelectItem value="none" disabled>No newsletters available</SelectItem>
                                    )}
                                    {newsletters.map((n) => (
                                        <SelectItem key={n.id} value={String(n.id)}>{n.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Email Subject <span className="opacity-60">(optional override)</span>
                            </label>
                            <Input
                                className="bg-background border-border text-foreground"
                                placeholder={selectedNewsletter?.subject || 'Uses the newsletter subject by default'}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-secondary/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Users size={16} className="text-primary" />
                                Recipients
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span className="text-emerald-500 font-bold">{totalEligible} eligible</span>
                                {totalOptedOut > 0 && (
                                    <span className="flex items-center gap-1 text-red-500 font-bold">
                                        <UserX size={12} /> {totalOptedOut} opted out
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setMode('all')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                    mode === 'all'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border/50 text-muted-foreground hover:bg-secondary/20'
                                }`}
                            >
                                Send to all eligible
                            </button>
                            <button
                                onClick={() => setMode('selected')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                    mode === 'selected'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border/50 text-muted-foreground hover:bg-secondary/20'
                                }`}
                            >
                                Choose recipients{totalSelected > 0 ? ` (${totalSelected})` : ''}
                            </button>
                        </div>

                        {mode === 'selected' && (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                    <Input
                                        placeholder="Search subscribers and contacts..."
                                        className="pl-9 bg-background border-border text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {filteredSubscribers.length > 0 && (
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                            <Users size={12} /> Newsletter Subscribers
                                        </div>
                                        <div className="max-h-48 overflow-y-auto border border-border/50 rounded-lg divide-y divide-border/30">
                                            {filteredSubscribers.map((sub) => {
                                                const blocked = sub.is_opted_out || !sub.is_active
                                                return (
                                                    <label
                                                        key={`sub-${sub.id}`}
                                                        className={`flex items-center gap-3 px-3 py-2 text-sm ${
                                                            blocked ? 'opacity-60' : 'hover:bg-secondary/20 cursor-pointer'
                                                        }`}
                                                    >
                                                        <Checkbox
                                                            checked={selectedSubscriberIds.has(sub.id)}
                                                            onCheckedChange={() => !blocked && toggleSubscriber(sub.id)}
                                                            disabled={blocked}
                                                            className="border-border"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate text-foreground">{sub.email}</div>
                                                            {sub.name && <div className="text-xs text-muted-foreground truncate">{sub.name}</div>}
                                                        </div>
                                                        {sub.is_opted_out ? (
                                                            <StatusBadge variant="danger">Opted out</StatusBadge>
                                                        ) : !sub.is_active ? (
                                                            <StatusBadge variant="muted">Inactive</StatusBadge>
                                                        ) : null}
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {filteredContacts.length > 0 && (
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                            <Contact size={12} /> Saved Contacts
                                        </div>
                                        <div className="max-h-48 overflow-y-auto border border-border/50 rounded-lg divide-y divide-border/30">
                                            {filteredContacts.map((contact) => {
                                                const blocked = contact.is_opted_out
                                                return (
                                                    <label
                                                        key={`contact-${contact.id}`}
                                                        className={`flex items-center gap-3 px-3 py-2 text-sm ${
                                                            blocked ? 'opacity-60' : 'hover:bg-secondary/20 cursor-pointer'
                                                        }`}
                                                    >
                                                        <Checkbox
                                                            checked={selectedContactIds.has(contact.id)}
                                                            onCheckedChange={() => !blocked && toggleContact(contact.id)}
                                                            disabled={blocked}
                                                            className="border-border"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate text-foreground">{contact.email}</div>
                                                            {contact.name && <div className="text-xs text-muted-foreground truncate">{contact.name}</div>}
                                                        </div>
                                                        {contact.is_opted_out && (
                                                            <StatusBadge variant="danger">Opted out</StatusBadge>
                                                        )}
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {filteredSubscribers.length === 0 && filteredContacts.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">No recipients found.</div>
                                )}

                                <p className="text-[11px] text-muted-foreground">
                                    Opted-out and inactive recipients cannot be selected or emailed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={isSending || !newsletterId} className="gap-2">
                        {isSending ? (
                            <><Loader2 size={16} className="animate-spin" /> Sending...</>
                        ) : (
                            <><Send size={16} /> Send Campaign</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CampaignSendDialog
