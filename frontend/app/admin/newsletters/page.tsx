"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/admin/StatusBadge'
import NewsletterComposer from '@/components/admin/NewsletterComposer'
import ImageUploader from '@/components/admin/ImageUploader'
import CampaignSendDialog from '@/components/admin/CampaignSendDialog'
import NewsletterHistoryDialog from '@/components/admin/NewsletterHistoryDialog'
import api from '@/lib/api'
import { Newsletter, NewsletterTemplate, Campaign } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import {
    useNewsletterAutosave,
    serializeNewsletterForm,
} from '@/hooks/use-newsletter-autosave'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Plus,
    Pencil,
    Trash2,
    MoreVertical,
    Send,
    Eye,
    Loader2,
    Palette,
    Newspaper,
    Copy,
    Save,
    History,
} from 'lucide-react'

const COLOR_PRESETS = [
    { name: 'Light', background_color: '#ffffff', text_color: '#0f172a', accent_color: '#2563eb' },
    { name: 'Dark', background_color: '#0f172a', text_color: '#f8fafc', accent_color: '#38bdf8' },
    { name: 'Sand', background_color: '#fffbeb', text_color: '#451a03', accent_color: '#d97706' },
    { name: 'Forest', background_color: '#f0fdf4', text_color: '#14532d', accent_color: '#059669' },
]

const EMPTY_FORM: Partial<Newsletter> = {
    title: '',
    subject: '',
    preheader: '',
    content: '',
    header_image: '',
    background_color: '#ffffff',
    text_color: '#0f172a',
    accent_color: '#2563eb',
}

const AdminNewslettersPage = () => {
    const { data: newsletters, mutate, isLoading } = useApi<Newsletter[]>('/newsletters')
    const { data: campaigns, mutate: mutateCampaigns } = useApi<Campaign[]>('/campaigns')
    const { toast } = useToast()

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState<Partial<Newsletter>>(EMPTY_FORM)
    const [isSaving, setIsSaving] = useState(false)
    const [editorTab, setEditorTab] = useState('content')
    const [baseline, setBaseline] = useState(() => serializeNewsletterForm(EMPTY_FORM))
    const [historyOpen, setHistoryOpen] = useState(false)

    const autosave = useNewsletterAutosave({
        enabled: showForm,
        form,
        editingId,
        baseline,
        onSynced: (saved, _source, sentSerialized) => {
            setEditingId(saved.id)
            setBaseline(sentSerialized)
            mutate()
        },
    })

    const { data: templates, mutate: mutateTemplates } = useApi<NewsletterTemplate[]>(
        showForm ? '/newsletter-templates' : null
    )

    const [previewHtml, setPreviewHtml] = useState<string | null>(null)
    const [isPreviewing, setIsPreviewing] = useState(false)
    const [previewTitle, setPreviewTitle] = useState('')

    const [shareNewsletter, setShareNewsletter] = useState<Newsletter | null>(null)

    const resetForm = () => {
        setForm(EMPTY_FORM)
        setEditingId(null)
        setShowForm(false)
        setEditorTab('content')
        setPreviewHtml(null)
    }

    const requestClose = async () => {
        if (autosave.dirty) {
            const result = await autosave.flush()
            if (
                result === 'blocked' &&
                !confirm('This draft needs a title and subject before it can be saved. Discard your changes?')
            ) {
                return
            }
            if (
                result === 'error' &&
                !confirm('Autosave could not save your latest changes. Close anyway?')
            ) {
                return
            }
        }
        setHistoryOpen(false)
        resetForm()
    }

    const openCreate = () => {
        // Defers the heavy editor mount to a low-priority transition so the
        // click paints first (INP: the button previously blocked ~200ms).
        React.startTransition(() => {
            setForm(EMPTY_FORM)
            setEditingId(null)
            setBaseline(serializeNewsletterForm(EMPTY_FORM))
            setPreviewHtml(null)
            setEditorTab('content')
            setShowForm(true)
        })
    }

    const handleEdit = (newsletter: Newsletter) => {
        // Defers the heavy editor mount to a low-priority transition so the
        // click paints first (INP: the button previously blocked ~200ms).
        React.startTransition(() => {
            const fields = {
                title: newsletter.title,
                subject: newsletter.subject,
                preheader: newsletter.preheader || '',
                content: newsletter.content || '',
                header_image: newsletter.header_image || '',
                background_color: newsletter.background_color,
                text_color: newsletter.text_color,
                accent_color: newsletter.accent_color,
            }
            setForm(fields)
            setBaseline(serializeNewsletterForm(fields))
            setEditingId(newsletter.id)
            setPreviewHtml(null)
            setEditorTab('content')
            setShowForm(true)
        })
    }

    const handleRestored = (updated: Newsletter) => {
        const fields = {
            title: updated.title,
            subject: updated.subject,
            preheader: updated.preheader || '',
            content: updated.content || '',
            header_image: updated.header_image || '',
            background_color: updated.background_color,
            text_color: updated.text_color,
            accent_color: updated.accent_color,
        }
        setForm(fields)
        setBaseline(serializeNewsletterForm(fields))
        setEditingId(updated.id)
        setHistoryOpen(false)
        mutate()
    }

    const handleSave = async () => {
        if (!form.title?.trim()) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'Title is required' })
            return
        }
        if (!form.subject?.trim()) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'Subject is required' })
            return
        }

        setIsSaving(true)
        try {
            await autosave.whenIdle()
            const targetId = editingId ?? autosave.getId()
            const payload = { ...form, snapshot: 'manual' }
            if (targetId) {
                await api.put(`/newsletters/${targetId}`, payload)
            } else {
                await api.post('/newsletters', payload)
            }
            toast({
                title: 'Success',
                description: `Newsletter ${targetId ? 'updated' : 'created'} successfully.`,
            })
            mutate()
            resetForm()
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.response?.data?.message || 'Failed to save newsletter',
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this newsletter?')) return
        try {
            await api.delete(`/newsletters/${id}`)
            toast({ title: 'Deleted', description: 'Newsletter has been removed.' })
            mutate()
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete newsletter' })
        }
    }

    const handleDuplicate = async (id: number) => {
        try {
            const res = await api.post(`/newsletters/${id}/duplicate`)
            toast({ title: 'Duplicated', description: 'A draft copy is open in the editor.' })
            mutate()
            handleEdit(res.data)
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.response?.data?.message || 'Failed to duplicate newsletter',
            })
        }
    }

    const applyTemplate = (template: NewsletterTemplate) => {
        setForm((prev) => ({
            ...prev,
            background_color: template.background_color,
            text_color: template.text_color,
            accent_color: template.accent_color,
        }))
    }

    const handleSaveTemplate = async () => {
        const name = window.prompt('Template name', 'My template')
        if (!name?.trim()) return
        try {
            await api.post('/newsletter-templates', {
                name: name.trim(),
                background_color: form.background_color,
                text_color: form.text_color,
                accent_color: form.accent_color,
            })
            toast({ title: 'Template saved', description: 'Found under "My templates" in the Design tab.' })
            mutateTemplates()
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.response?.data?.message || 'Failed to save template',
            })
        }
    }

    const handleDeleteTemplate = async (id: number) => {
        try {
            await api.delete(`/newsletter-templates/${id}`)
            mutateTemplates()
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete template' })
        }
    }

    const handlePreview = async () => {
        if (!editingId && !form.title) {
            toast({ variant: 'destructive', title: 'Nothing to preview', description: 'Add a title first.' })
            return
        }
        setIsPreviewing(true)
        try {
            const payload: Record<string, unknown> = {
                title: form.title,
                preheader: form.preheader,
                content: form.content,
                header_image: form.header_image,
                background_color: form.background_color,
                text_color: form.text_color,
                accent_color: form.accent_color,
            }
            if (editingId) payload.newsletter_id = editingId

            const res = await api.post('/newsletters/preview', payload)
            setPreviewHtml(res.data.html)
            setPreviewTitle(form.title || 'Newsletter')
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Preview failed',
                description: err.response?.data?.error || 'Could not render preview.',
            })
        } finally {
            setIsPreviewing(false)
        }
    }

    const applyPreset = (preset: typeof COLOR_PRESETS[number]) => {
        setForm((prev) => ({
            ...prev,
            background_color: preset.background_color,
            text_color: preset.text_color,
            accent_color: preset.accent_color,
        }))
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Newsletters</h1>
                        <p className="text-muted-foreground">Build, style and share newsletters with your saved contacts.</p>
                    </div>
                    <Button
                        className="gap-2 bg-primary hover:bg-primary/90 text-white"
                        onClick={openCreate}
                    >
                        <Plus size={18} />
                        Create Newsletter
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-secondary/20 animate-pulse border border-border/50" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsletters?.map((newsletter) => (
                            <div key={newsletter.id} className="group relative bg-secondary/10 border border-border overflow-hidden hover:border-primary/40 transition-all flex flex-col shadow-sm">
                                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-background/80"><MoreVertical size={16} /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(newsletter)} className="gap-2">
                                                <Pencil size={14} /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(newsletter.id)} className="gap-2">
                                                <Copy size={14} /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setShareNewsletter(newsletter)} className="gap-2 text-primary">
                                                <Send size={14} /> Share / Send
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(newsletter.id)} className="gap-2 text-destructive">
                                                <Trash2 size={14} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div
                                    className="h-20 border-b border-border/50 flex items-center justify-center gap-2"
                                    style={{ backgroundColor: newsletter.background_color }}
                                >
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: newsletter.text_color }}
                                    >
                                        Aa
                                    </span>
                                    <span
                                        className="w-4 h-4 rounded-full border border-black/10"
                                        style={{ backgroundColor: newsletter.accent_color }}
                                    />
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <StatusBadge variant={newsletter.status === 'sent' ? 'success' : 'warning'}>
                                            {newsletter.status}
                                        </StatusBadge>
                                        <span className="text-[10px] text-muted-foreground uppercase">
                                            {new Date(newsletter.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2 text-foreground">{newsletter.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{newsletter.subject}</p>
                                    <div className="pt-4 border-t border-border flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Palette size={12} /> {newsletter.user?.name || 'Admin'}
                                        </span>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={() => handleEdit(newsletter)}>
                                                <Eye size={14} /> Open
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1 text-primary hover:text-primary"
                                                onClick={() => setShareNewsletter(newsletter)}
                                            >
                                                <Send size={14} /> Share
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {newsletters?.length === 0 && !isLoading && (
                    <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-xl">
                        <Newspaper size={40} className="mx-auto mb-4 text-muted-foreground/40" />
                        <p className="text-muted-foreground mb-4">No newsletters yet. Build your first one.</p>
                        <Button onClick={openCreate} className="gap-2">
                            <Plus size={16} /> Create Newsletter
                        </Button>
                    </div>
                )}
            </div>

            {/* Builder Modal */}
            <Dialog open={showForm} onOpenChange={(open) => !open && void requestClose()}>
                <DialogContent aria-describedby={undefined} className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden bg-background border-border text-foreground">
                    <DialogHeader className="shrink-0 pr-8">
                        <DialogTitle>{editingId ? 'Edit' : 'New'} Newsletter</DialogTitle>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                    <Tabs value={editorTab} onValueChange={setEditorTab} className="py-2">
                        <TabsList className="mb-4">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="design">Design</TabsTrigger>
                            <TabsTrigger value="preview" onClick={handlePreview}>Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                                    <Input
                                        className="bg-background border-border text-foreground"
                                        placeholder="Newsletter title (shown as heading)"
                                        value={form.title || ''}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Email Subject</label>
                                    <Input
                                        className="bg-background border-border text-foreground"
                                        placeholder="Inbox subject line"
                                        value={form.subject || ''}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Preheader <span className="opacity-60">(inbox preview text)</span></label>
                                    <Input
                                        className="bg-background border-border text-foreground"
                                        placeholder="Short preview shown after the subject line"
                                        value={form.preheader || ''}
                                        onChange={(e) => setForm({ ...form, preheader: e.target.value })}
                                    />
                                </div>
                            </div>

                            <NewsletterComposer
                                label="Content"
                                value={form.content || ''}
                                onChange={(content) => setForm({ ...form, content })}
                                accentColor={form.accent_color || undefined}
                                textColor={form.text_color || undefined}
                                backgroundColor={form.background_color || undefined}
                                className="min-h-[300px]"
                            />

                            <ImageUploader
                                label="Header Image (optional)"
                                value={form.header_image || ''}
                                onChange={(header_image) => setForm({ ...form, header_image })}
                                maxSizeMB={2}
                            />
                        </TabsContent>

                        <TabsContent value="design" className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-muted-foreground">Template Presets</label>
                                    <Button variant="outline" size="sm" onClick={handleSaveTemplate} className="h-7 gap-1 px-2 text-xs">
                                        <Save size={12} /> Save current colors
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_PRESETS.map((preset) => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() => applyPreset(preset)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 text-sm hover:border-primary/50 transition-all"
                                        >
                                            <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.background_color }} />
                                            <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.text_color }} />
                                            <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.accent_color }} />
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">My templates</label>
                                {templates && templates.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {templates.map((template) => (
                                            <div
                                                key={template.id}
                                                className="flex items-center rounded-lg border border-border/50 bg-background/50 overflow-hidden hover:border-primary/50 transition-all"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => applyTemplate(template)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm"
                                                    title={`Apply "${template.name}" colors`}
                                                >
                                                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: template.background_color }} />
                                                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: template.text_color }} />
                                                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: template.accent_color }} />
                                                    {template.name}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                    aria-label={`Delete template ${template.name}`}
                                                    className="px-2 py-2 text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        No saved templates yet. Set your colors below, then click "Save current colors".
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {([
                                    ['background_color', 'Background Color'],
                                    ['text_color', 'Text Color'],
                                    ['accent_color', 'Accent Color'],
                                ] as const).map(([key, label]) => (
                                    <div key={key} className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">{label}</label>
                                        <div className="flex items-center gap-2 border border-border/50 rounded-lg p-2 bg-background/50">
                                            <input
                                                type="color"
                                                value={form[key] || '#000000'}
                                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                                className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent p-0"
                                                aria-label={label}
                                            />
                                            <Input
                                                className="bg-transparent border-0 font-mono text-sm uppercase focus-visible:ring-0 focus-visible:ring-offset-0"
                                                value={form[key] || ''}
                                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="rounded-xl border border-border/50 p-6"
                                style={{ backgroundColor: form.background_color, color: form.text_color }}
                            >
                                <div className="text-xs uppercase tracking-widest mb-2 opacity-60">Preview</div>
                                <h3 className="text-xl font-bold mb-1" style={{ color: form.text_color }}>{form.title || 'Newsletter title'}</h3>
                                <p className="text-sm mb-3 opacity-80">Body text renders with your selected text color.</p>
                                <span
                                    className="inline-block px-4 py-2 rounded-lg text-white text-sm font-semibold"
                                    style={{ backgroundColor: form.accent_color }}
                                >
                                    Call to action
                                </span>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="min-h-[400px]">
                            {isPreviewing ? (
                                <div className="h-96 flex items-center justify-center gap-2 text-muted-foreground">
                                    <Loader2 className="animate-spin" size={18} /> Rendering preview...
                                </div>
                            ) : previewHtml ? (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">{previewTitle}</div>
                                    <iframe
                                        title="Newsletter preview"
                                        srcDoc={previewHtml}
                                        className="w-full h-[480px] rounded-lg border border-border/50 bg-white"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Includes the per-recipient unsubscribe footer that contacts will see.
                                    </p>
                                </div>
                            ) : (
                                <div className="h-96 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border/50 rounded-lg text-muted-foreground">
                                    <Eye size={32} className="opacity-40" />
                                    <Button variant="outline" onClick={handlePreview} className="gap-2">
                                        Load Preview
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                    </div>

                    <DialogFooter className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/50 pt-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => void requestClose()}
                                disabled={isSaving || autosave.status === 'saving'}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-muted-foreground"
                                disabled={!editingId}
                                onClick={() => setHistoryOpen(true)}
                                title={editingId ? 'View and restore previous versions' : 'Save once to start version history'}
                            >
                                <History size={14} /> History
                            </Button>
                            {isSaving || autosave.status === 'saving' ? (
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Loader2 size={12} className="animate-spin" /> Saving...
                                </span>
                            ) : autosave.blocked ? (
                                <span className="text-xs text-amber-500">
                                    Autosave waiting for title &amp; subject
                                </span>
                            ) : autosave.status === 'error' ? (
                                <span className="text-xs text-destructive">
                                    Autosave failed - press Save
                                </span>
                            ) : autosave.dirty ? (
                                <span className="text-xs text-muted-foreground">Unsaved changes...</span>
                            ) : autosave.lastSavedAt ? (
                                <span className="text-xs text-muted-foreground">
                                    Saved {autosave.lastSavedAt.toLocaleTimeString()}
                                </span>
                            ) : null}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => { setEditorTab('preview'); handlePreview() }}
                                disabled={isPreviewing}
                                className="gap-2"
                            >
                                {isPreviewing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                                Preview
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                {isSaving ? 'Saving...' : 'Save Newsletter'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Version history */}
            <NewsletterHistoryDialog
                open={historyOpen}
                onOpenChange={setHistoryOpen}
                newsletterId={editingId}
                onRestored={handleRestored}
            />

            {/* Share via campaign */}
            <CampaignSendDialog
                open={!!shareNewsletter}
                onOpenChange={(open) => !open && setShareNewsletter(null)}
                newsletters={newsletters || []}
                preselectedNewsletterId={shareNewsletter?.id ?? null}
                onSent={() => { mutate(); mutateCampaigns() }}
            />
        </AdminLayout>
    )
}

export default AdminNewslettersPage
