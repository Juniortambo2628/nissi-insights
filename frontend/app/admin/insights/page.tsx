"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Search, Calendar, User, ImageIcon, LayoutGrid, List, MoreVertical, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ImageUploader from '@/components/admin/ImageUploader'
import api from '@/lib/api'
import { Insight } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
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
} from "@/components/ui/dropdown-menu"
import RichTextEditor from '@/components/admin/RichTextEditor'
import { cn } from '@/lib/utils'
import { useAutosave } from '@/hooks/use-autosave'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const AdminInsightsPage = () => {
    const { data: insights, mutate, isLoading } = useApi<Insight[]>('/insights')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const [form, setForm] = useState<Partial<Insight>>({
        title: '',
        category: '',
        excerpt: '',
        content: '',
        image: '',
        is_published: true,
    })

    const { isSaving: isAutosaving, lastSaved, error: autosaveError } = useAutosave({
        data: form,
        enabled: showForm && !!form.title, // Only autosave if form is open and has a title
        endpoint: editingId ? `/insights/${editingId}` : undefined,
        localStorageKey: !editingId ? 'insight_draft' : undefined,
        onSaveSuccess: () => {
            if (editingId) mutate()
        }
    })

    const resetForm = () => {
        setForm({ title: '', category: '', excerpt: '', content: '', image: '', is_published: true })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (i: Insight) => {
        setForm({
            title: i.title,
            category: i.category || '',
            excerpt: i.excerpt || '',
            content: i.content || '',
            image: i.image || '',
            is_published: !!i.is_published,
        })
        setEditingId(i.id)
        setShowForm(true)
    }

    const handleCreate = () => {
        const draft = localStorage.getItem('insight_draft')
        if (draft) {
            try {
                setForm(JSON.parse(draft))
            } catch (e) {
                resetForm()
            }
        } else {
            resetForm()
        }
        setShowForm(true)
    }

    const handleSave = async () => {
        if (!form.title) {
            toast({ variant: "destructive", title: "Validation Error", description: "Title is required" })
            return
        }

        setIsSaving(true)
        try {
            if (editingId) {
                await api.put(`/insights/${editingId}`, form)
            } else {
                await api.post('/insights', form)
            }
            toast({
                title: "Success",
                description: `Insight ${editingId ? 'updated' : 'created'} successfully.`,
            })
            if (!editingId) localStorage.removeItem('insight_draft')
            mutate()
            resetForm()
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.message || 'Failed to save insight',
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this insight?')) return
        try {
            await api.delete(`/insights/${id}`)
            toast({ title: "Deleted", description: "Insight has been removed." })
            mutate()
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: 'Failed to delete insight' })
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} insights?`)) return
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/insights/${id}`)))
            toast({ title: "Success", description: "Insights deleted." })
            setSelectedIds([])
            mutate()
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Bulk delete failed." })
        }
    }

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const filteredInsights = insights?.filter(i => {
        const matchesSearch = 
            i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (i.category && i.category.toLowerCase().includes(searchTerm.toLowerCase()))
        
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'published' ? i.is_published : !i.is_published)
            
        return matchesSearch && matchesStatus
    }).sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1
        if (sortBy === 'title') return a.title.localeCompare(b.title) * factor
        return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * factor
    })

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Market Insights</h1>
                        <p className="text-muted-foreground">Manage your energy intelligence and articles.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-secondary/20 p-1 rounded-lg border border-border/50">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                                        Filter: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('published')}>Published</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('draft')}>Draft</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <hr className="mx-1 border-white/10 h-6 my-auto" />
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                                        Sort: {sortBy === 'created_at' ? 'Date' : 'Title'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSortBy('created_at')}>Sort by Date</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('title')}>Sort by Title</DropdownMenuItem>
                                    <hr className="my-1 border-white/10" />
                                    <DropdownMenuItem onClick={() => setSortOrder('asc')}>Ascending</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder('desc')}>Descending</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex bg-secondary/20 p-1 rounded-lg border border-border/50">
                            <Button 
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid size={16} />
                            </Button>
                            <Button 
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => setViewMode('list')}
                            >
                                <List size={16} />
                            </Button>
                        </div>
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white" onClick={handleCreate}>
                            <Plus size={18} />
                            Create Insight
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/10 p-4 border border-border/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                            placeholder="Search insights..." 
                            className="pl-10 bg-background/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-4 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                            <span className="text-sm font-medium text-primary">{selectedIds.length} selected</span>
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-secondary/20 animate-pulse border border-border/50" />)}
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredInsights?.map((insight) => (
                                    <div key={insight.id} className="group relative bg-secondary/10 border border-border overflow-hidden hover:border-primary/40 transition-all flex flex-col shadow-sm">
                                        <div className="absolute top-3 left-3 z-10">
                                            <Checkbox 
                                                checked={selectedIds.includes(insight.id)}
                                                onCheckedChange={() => toggleSelect(insight.id)}
                                                className="border-border bg-background/50"
                                            />
                                        </div>
                                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-background/80"><MoreVertical size={16} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(insight)} className="gap-2">
                                                        <Pencil size={14} /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" asChild>
                                                        <a href={`/insights/${insight.slug}`} target="_blank"><ExternalLink size={14} /> View Live</a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(insight.id)} className="gap-2 text-destructive">
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="aspect-video relative overflow-hidden bg-secondary/30">
                                            {insight.image ? (
                                                <img src={insight.image} alt={insight.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary/20">
                                                    <ImageIcon size={48} />
                                                </div>
                                            )}
                                            {!insight.is_published && (
                                                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-500/20 text-yellow-500 px-3 py-1 border border-yellow-500/30">Draft</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{insight.category || 'General'}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">{new Date(insight.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-foreground">{insight.title}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                                                {insight.excerpt?.replace(/<[^>]*>?/gm, '')}
                                            </p>
                                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <User size={12} /> {insight.user?.name || 'Admin'}
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-red-400 bg-background/50 backdrop-blur-sm border border-border" onClick={() => handleDelete(insight.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-secondary/10 border border-border/50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/20 border-b border-border/50">
                                        <tr>
                                            <th className="p-4 px-6 w-10">
                                                <Checkbox 
                                                    checked={selectedIds.length === filteredInsights?.length && filteredInsights?.length > 0}
                                                    onCheckedChange={(checked: boolean) => {
                                                        if (checked) setSelectedIds(filteredInsights?.map(i => i.id) || [])
                                                        else setSelectedIds([])
                                                    }}
                                                />
                                            </th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Title</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Category</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                                            <th className="p-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredInsights?.map((insight) => (
                                            <tr key={insight.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="p-4 px-6">
                                                    <Checkbox 
                                                        checked={selectedIds.includes(insight.id)}
                                                        onCheckedChange={() => toggleSelect(insight.id)}
                                                        className="border-border"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded bg-secondary overflow-hidden shrink-0">
                                                            {insight.image ? <img src={insight.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/40"><ImageIcon size={16} /></div>}
                                                        </div>
                                                        <div className="font-bold line-clamp-1">{insight.title}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-xs font-medium text-muted-foreground">{insight.category || '—'}</span>
                                                </td>
                                                <td className="p-4">
                                                    {insight.is_published ? (
                                                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-amber-500 uppercase">Draft</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-xs text-muted-foreground">
                                                    {new Date(insight.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(insight)}><Pencil size={14} /></Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(insight.id)} className="text-destructive"><Trash2 size={14} /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {filteredInsights?.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-xl opacity-50">
                                <p className="text-muted-foreground">No insights found.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Form Modal */}
            <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit' : 'New'} Insight</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Title</label>
                            <Input className="bg-background border-border text-foreground" placeholder="Insight Title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Category</label>
                            <Input className="bg-background border-border text-foreground" placeholder="Category" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                        </div>
                        
                        <div className="md:col-span-2">
                            <RichTextEditor 
                                label="Excerpt"
                                value={form.excerpt || ''}
                                onChange={(excerpt) => setForm({ ...form, excerpt })}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <RichTextEditor 
                                label="Full Content"
                                value={form.content || ''}
                                onChange={(content) => setForm({ ...form, content })}
                                className="min-h-[300px]"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <ImageUploader 
                                label="Featured Image"
                                value={form.image || ''}
                                onChange={(url) => setForm({ ...form, image: url })}
                                maxSizeMB={2}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox 
                                checked={form.is_published} 
                                onCheckedChange={(checked: boolean) => setForm({ ...form, is_published: !!checked })} 
                                id="is_published_modal"
                                className="border-border"
                            />
                            <label htmlFor="is_published_modal" className="text-sm font-medium text-muted-foreground">Published</label>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mr-auto">
                            {isAutosaving ? (
                                <><Loader2 className="animate-spin" size={12} /> Saving...</>
                            ) : lastSaved ? (
                                <><CheckCircle2 className="text-emerald-500" size={12} /> Saved at {lastSaved.toLocaleTimeString()}</>
                            ) : autosaveError ? (
                                <><AlertCircle className="text-destructive" size={12} /> {autosaveError}</>
                            ) : editingId ? (
                                <span className="opacity-50">Autosave enabled</span>
                            ) : (
                                <span className="opacity-50">Draft stored locally</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                {isSaving ? 'Saving...' : 'Save Insight'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}

export default AdminInsightsPage

