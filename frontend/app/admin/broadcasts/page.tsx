"use client"

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Send,
    Users,
    Mail,
    Trash2,
    Search,
    FileText,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from 'lucide-react'
import { Insight, EmailContact, Subscriber, ContentBroadcastResult } from '@/types/api'
import { parseEmailList, countInvalidEmailTokens } from '@/lib/emails'

interface KnowledgeBaseItem {
    id: number
    title: string
    type: string
    is_published: boolean
    thumbnail: string | null
}

type ContentType = 'insight' | 'resource'

const selectClassName =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

function apiErrorMessage(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response
        if (response?.data?.message) return response.data.message
    }
    return fallback
}

const BroadcastContent = () => {
    const searchParams = useSearchParams()
    const { toast } = useToast()

    const { data: insights } = useApi<Insight[]>('/insights')
    const { data: resourcesRaw } = useApi<KnowledgeBaseItem[]>('/resources?all=true')
    const { data: contacts, mutate: mutateContacts, isLoading: contactsLoading } = useApi<EmailContact[]>('/email-contacts')
    const { data: subscribers } = useApi<Subscriber[]>('/subscribers')

    const resources = useMemo(
        () => resourcesRaw?.filter((r) => r.is_published) ?? [],
        [resourcesRaw]
    )
    const publishedInsights = useMemo(
        () => insights?.filter((i) => i.is_published) ?? [],
        [insights]
    )

    const [contentType, setContentType] = useState<ContentType>('resource')
    const [contentId, setContentId] = useState<number | ''>('')
    const [pastedText, setPastedText] = useState('')
    const [selectedContactIds, setSelectedContactIds] = useState<number[]>([])
    const [toSubscribers, setToSubscribers] = useState(false)
    const [saveContacts, setSaveContacts] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [result, setResult] = useState<ContentBroadcastResult | null>(null)
    const [contactSearch, setContactSearch] = useState('')
    const [importText, setImportText] = useState('')
    const [isImporting, setIsImporting] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const pastedEmails = useMemo(() => parseEmailList(pastedText), [pastedText])
    const invalidTokens = useMemo(() => countInvalidEmailTokens(pastedText), [pastedText])

    const activeSubscriberEmails = useMemo(
        () => (subscribers ?? []).filter((s) => s.is_active).map((s) => s.email.toLowerCase()),
        [subscribers]
    )

    const selectedContactEmails = useMemo(
        () => (contacts ?? [])
            .filter((c) => selectedContactIds.includes(c.id))
            .map((c) => c.email.toLowerCase()),
        [contacts, selectedContactIds]
    )

    const recipientPreview = useMemo(() => {
        const all = [...pastedEmails, ...selectedContactEmails]
        if (toSubscribers) all.push(...activeSubscriberEmails)
        return Array.from(new Set(all))
    }, [pastedEmails, selectedContactEmails, toSubscribers, activeSubscriberEmails])

    const contentOptions = contentType === 'insight' ? publishedInsights : resources
    const selectedContent = contentOptions.find((c) => c.id === contentId)

    // Preselect content when arriving from an "Email" action on the content pages
    useEffect(() => {
        const type = searchParams.get('type') as ContentType | null
        const id = Number(searchParams.get('id'))
        if (!type || !id) return

        setContentType(type)
        const list = type === 'insight' ? publishedInsights : resources
        if (list.some((item) => item.id === id)) {
            setContentId(id)
        }
    }, [searchParams, publishedInsights, resources])

    const toggleContact = (id: number) => {
        setSelectedContactIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        )
    }

    const handleSend = async () => {
        if (!contentId) {
            toast({ variant: 'destructive', title: 'Select content', description: 'Choose a published report or article to send.' })
            return
        }
        if (recipientPreview.length === 0) {
            toast({ variant: 'destructive', title: 'No recipients', description: 'Paste emails, pick saved contacts, or choose subscribers.' })
            return
        }

        setIsSending(true)
        setResult(null)
        try {
            const response = await api.post<ContentBroadcastResult>('/content-broadcasts', {
                content_type: contentType,
                content_id: contentId,
                recipients: pastedEmails,
                contact_ids: selectedContactIds,
                to_subscribers: toSubscribers,
                save_contacts: saveContacts,
            })
            setResult(response.data)
            toast({
                title: 'Campaign sent',
                description: response.data.message,
            })
            if (saveContacts && pastedEmails.length > 0) mutateContacts()
            setPastedText('')
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Failed to send',
                description: apiErrorMessage(err, 'Could not send the campaign. Check the email configuration under Admin → Email.'),
            })
        } finally {
            setIsSending(false)
        }
    }

    const handleImport = async () => {
        const emails = parseEmailList(importText)
        if (emails.length === 0) {
            toast({ variant: 'destructive', title: 'No valid emails', description: 'Paste one or more valid email addresses.' })
            return
        }

        setIsImporting(true)
        try {
            const response = await api.post('/email-contacts', { emails, source: 'import' })
            toast({
                title: 'Contacts saved',
                description: response.data?.message || `${emails.length} email(s) processed.`,
            })
            setImportText('')
            mutateContacts()
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Import failed',
                description: apiErrorMessage(err, 'Could not save the contacts.'),
            })
        } finally {
            setIsImporting(false)
        }
    }

    const handleDeleteContact = async () => {
        if (!deletingId) return
        setIsDeleting(true)
        try {
            await api.delete(`/email-contacts/${deletingId}`)
            toast({ title: 'Contact removed' })
            setSelectedContactIds((prev) => prev.filter((id) => id !== deletingId))
            mutateContacts()
            setDeletingId(null)
        } catch {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete contact.' })
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredContacts = (contacts ?? []).filter((c) =>
        c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
        (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase()))
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Email Campaigns</h1>
                    <p className="text-muted-foreground text-sm">
                        Email a published report or article to anyone — paste a list, pick saved contacts, or send to all subscribers.
                    </p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                    <span className="text-sm font-bold text-primary">{contacts?.length || 0} Saved Contacts</span>
                </div>
            </div>

            {/* Compose campaign */}
            <div className="bg-secondary/10 border border-border/50 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Send size={18} className="text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Send Content by Email</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Content Type</Label>
                        <select
                            className={selectClassName}
                            value={contentType}
                            onChange={(e) => {
                                setContentType(e.target.value as ContentType)
                                setContentId('')
                            }}
                        >
                            <option value="resource">Report / Knowledge Base</option>
                            <option value="insight">Insight / Article</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Published {contentType === 'insight' ? 'Insight' : 'Resource'}</Label>
                        <select
                            className={selectClassName}
                            value={contentId}
                            onChange={(e) => setContentId(e.target.value ? Number(e.target.value) : '')}
                        >
                            <option value="">Select content…</option>
                            {contentOptions.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {contentType === 'resource' ? `[${(item as KnowledgeBaseItem).type}] ` : ''}{item.title}
                                </option>
                            ))}
                        </select>
                        {contentOptions.length === 0 && (
                            <p className="text-xs text-muted-foreground">No published content available yet.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Paste a list */}
                    <div className="space-y-2">
                        <Label htmlFor="paste-emails">Paste Email Addresses</Label>
                        <Textarea
                            id="paste-emails"
                            value={pastedText}
                            onChange={(e) => setPastedText(e.target.value)}
                            placeholder={'pauline@example.com\nchrispine@example.com, marvin@example.com'}
                            className="min-h-[140px] font-mono text-sm"
                        />
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{pastedEmails.length} valid email(s)</span>
                            {invalidTokens > 0 && (
                                <span className="text-amber-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> {invalidTokens} invalid token(s) will be skipped
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="save-contacts"
                                checked={saveContacts}
                                onCheckedChange={(checked) => setSaveContacts(checked === true)}
                            />
                            <label htmlFor="save-contacts" className="text-xs text-muted-foreground">
                                Save pasted emails to contacts so you can email them again later
                            </label>
                        </div>
                    </div>

                    {/* Saved contacts + subscribers */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Saved Contacts</Label>
                                <span className="text-xs text-muted-foreground">{selectedContactIds.length} selected</span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                <Input
                                    placeholder="Search contacts…"
                                    className="pl-9 h-9 text-sm"
                                    value={contactSearch}
                                    onChange={(e) => setContactSearch(e.target.value)}
                                />
                            </div>
                            <div className="max-h-48 overflow-y-auto rounded-md border border-border/50 divide-y divide-border/30">
                                {contactsLoading ? (
                                    <div className="h-20 animate-pulse bg-secondary/20" />
                                ) : filteredContacts.length === 0 ? (
                                    <p className="p-4 text-xs text-muted-foreground text-center">No saved contacts yet.</p>
                                ) : (
                                    filteredContacts.map((contact) => (
                                        <label
                                            key={contact.id}
                                            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary/20 cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={selectedContactIds.includes(contact.id)}
                                                onCheckedChange={() => toggleContact(contact.id)}
                                            />
                                            <Mail size={14} className="text-muted-foreground shrink-0" />
                                            <span className="truncate">{contact.email}</span>
                                            {contact.name && (
                                                <span className="ml-auto text-xs text-muted-foreground shrink-0">{contact.name}</span>
                                            )}
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-md bg-secondary/20">
                            <Checkbox
                                id="to-subscribers"
                                checked={toSubscribers}
                                onCheckedChange={(checked) => setToSubscribers(checked === true)}
                            />
                            <label htmlFor="to-subscribers" className="text-sm text-foreground flex items-center gap-2">
                                <Users size={14} className="text-muted-foreground" />
                                Send to all active subscribers
                                <span className="text-xs text-muted-foreground">({activeSubscriberEmails.length})</span>
                            </label>
                        </div>
                    </div>
                </div>

                {result && (
                    <div className={`flex items-start gap-3 p-4 rounded-lg border ${result.failed > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                        {result.failed > 0
                            ? <AlertCircle size={18} className="text-amber-500 mt-0.5" />
                            : <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />}
                        <div className="text-sm">
                            <p className="font-bold text-foreground">{result.message}</p>
                            {result.errors.length > 0 && (
                                <ul className="mt-1 text-xs text-muted-foreground list-disc list-inside">
                                    {result.errors.slice(0, 5).map((error) => <li key={error}>{error}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                        {recipientPreview.length === 0
                            ? 'No recipients selected yet.'
                            : <>Sending <span className="font-bold text-foreground">{selectedContent?.title ?? 'content'}</span> to <span className="font-bold text-primary">{recipientPreview.length}</span> recipient(s).</>}
                    </p>
                    <Button
                        onClick={handleSend}
                        disabled={isSending || !contentId || recipientPreview.length === 0}
                        className="gap-2 bg-primary hover:bg-primary/90 text-white"
                    >
                        {isSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        {isSending ? 'Sending…' : 'Send Campaign'}
                    </Button>
                </div>
            </div>

            {/* Saved contacts manager */}
            <div className="bg-secondary/10 border border-border/50 rounded-xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Users size={18} className="text-primary" /> Saved Email Contacts
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Keep the lists people send you here so you can reuse them any time.
                        </p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Search contacts…"
                            className="pl-9"
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="import-emails">Import a List</Label>
                    <div className="flex flex-col md:flex-row gap-3 items-start">
                        <Textarea
                            id="import-emails"
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Paste emails separated by commas, semicolons or new lines…"
                            className="min-h-[80px] flex-1 font-mono text-sm"
                        />
                        <Button
                            onClick={handleImport}
                            disabled={isImporting || parseEmailList(importText).length === 0}
                            className="gap-2 shrink-0"
                            variant="outline"
                        >
                            {isImporting ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                            Save to Contacts
                        </Button>
                    </div>
                </div>

                <div className="bg-background/50 border border-border/50 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                            <tr>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Source</th>
                                <th className="px-6 py-3">Added</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {contactsLoading ? (
                                <tr><td colSpan={5} className="px-6 py-10"><div className="h-8 bg-secondary/20 animate-pulse rounded" /></td></tr>
                            ) : filteredContacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-3 text-sm font-medium text-foreground">{contact.email}</td>
                                    <td className="px-6 py-3 text-sm text-muted-foreground">{contact.name || '—'}</td>
                                    <td className="px-6 py-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
                                            {contact.source || 'manual'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-xs text-muted-foreground">
                                        {new Date(contact.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={() => setDeletingId(contact.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {!contactsLoading && filteredContacts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                                        <FileText size={24} className="mx-auto mb-2 opacity-40" />
                                        {contactSearch ? 'No contacts match your search.' : 'No contacts saved yet. Paste a list above to get started.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete confirmation */}
            <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
                <DialogContent className="bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Remove Contact</DialogTitle>
                        <DialogDescription>
                            Remove this email from your saved contacts? You can add it again later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteContact} disabled={isDeleting}>
                            {isDeleting ? 'Removing…' : 'Remove'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const AdminBroadcastsPage = () => {
    return (
        <AdminLayout>
            <Suspense fallback={<div className="h-96 bg-secondary/10 animate-pulse rounded-xl" />}>
                <BroadcastContent />
            </Suspense>
        </AdminLayout>
    )
}

export default AdminBroadcastsPage
