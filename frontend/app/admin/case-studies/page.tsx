"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2, Search, Save, Star, LayoutGrid, List, MoreVertical, ExternalLink } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import api from '@/lib/api'
import { CaseStudy } from '@/types/api'
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
import { useAutosave } from '@/hooks/use-autosave'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const AdminCaseStudiesPage = () => {
    const { data: caseStudies, mutate, isLoading } = useApi<CaseStudy[]>('/case-studies')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'standard'>('all')
    const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const emptyForm: Partial<CaseStudy> = {
        title: '', client_name: '', problem: '', methodology: '',
        outcome: '', significant_figure: '', image: '', is_featured: false,
    }
    const [form, setForm] = useState<Partial<CaseStudy>>(emptyForm)

    const { isSaving: isAutosaving, lastSaved, error: autosaveError } = useAutosave({
        data: form,
        enabled: isFormOpen && !!form.title,
        endpoint: editingId ? `/case-studies/${editingId}` : undefined,
        localStorageKey: !editingId ? 'case_study_draft' : undefined,
        onSaveSuccess: () => {
            if (editingId) mutate()
        }
    })

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this case study?')) return
        try {
            await api.delete(`/case-studies/${id}`)
            toast({ title: "Deleted", description: "Case study removed." })
            mutate()
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: 'Failed to delete case study' })
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} case studies?`)) return
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/case-studies/${id}`)))
            toast({ title: "Success", description: "Case studies deleted." })
            setSelectedIds([])
            mutate()
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Bulk delete failed." })
        }
    }

    const handleEdit = (cs: CaseStudy) => {
        setEditingId(cs.id)
        setForm({
            title: cs.title || '', client_name: cs.client_name || '',
            problem: cs.problem || '', methodology: cs.methodology || '', outcome: cs.outcome || '',
            significant_figure: cs.significant_figure || '', image: cs.image || '',
            is_featured: !!cs.is_featured,
        })
        setIsFormOpen(true)
    }

    const handleCreate = () => {
        setEditingId(null)
        const draft = localStorage.getItem('case_study_draft')
        if (draft) {
            try {
                setForm(JSON.parse(draft))
            } catch (e) {
                setForm(emptyForm)
            }
        } else {
            setForm(emptyForm)
        }
        setIsFormOpen(true)
    }

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!form.title || !form.client_name) {
            toast({ variant: "destructive", title: "Validation Error", description: "Title and Client Name are required" })
            return
        }

        setIsSaving(true)
        try {
            if (editingId) {
                await api.put(`/case-studies/${editingId}`, form)
            } else {
                await api.post('/case-studies', form)
            }
            toast({ title: "Success", description: `Case study ${editingId ? 'updated' : 'created'} successfully.` })
            if (!editingId) localStorage.removeItem('case_study_draft')
            mutate()
            setIsFormOpen(false)
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || 'Failed to save case study' })
        } finally {
            setIsSaving(false)
        }
    }

    const filteredCaseStudies = caseStudies?.filter(cs => {
        const matchesSearch = cs.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (cs.client_name || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = featuredFilter === 'all' || 
                              (featuredFilter === 'featured' ? cs.is_featured : !cs.is_featured)
        return matchesSearch && matchesFilter
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
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Case Studies</h1>
                        <p className="text-muted-foreground">Showcase your advisory impact and project outcomes.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-secondary/20 p-1 rounded-lg border border-border/50">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                                        Filter: {featuredFilter === 'all' ? 'All' : featuredFilter === 'featured' ? 'Featured' : 'Standard'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setFeaturedFilter('all')}>All</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFeaturedFilter('featured')}>Featured Only</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFeaturedFilter('standard')}>Standard Only</DropdownMenuItem>
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
                            <Plus size={18} /> Add Case Study
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/10 p-4 border border-border/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                            placeholder="Search case studies..." 
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
                                {filteredCaseStudies?.map((cs) => (
                                    <div key={cs.id} className="group relative bg-secondary/10 border border-border overflow-hidden hover:border-primary/40 transition-all flex flex-col shadow-sm">
                                        <div className="absolute top-3 left-3 z-10">
                                            <Checkbox 
                                                checked={selectedIds.includes(cs.id)}
                                                onCheckedChange={() => toggleSelect(cs.id)}
                                                className="border-border bg-background/50"
                                            />
                                        </div>
                                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-background/80"><MoreVertical size={16} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(cs)} className="gap-2">
                                                        <Pencil size={14} /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" asChild>
                                                        <a href={`/case-studies/${cs.slug}`} target="_blank"><ExternalLink size={14} /> View Live</a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(cs.id)} className="gap-2 text-destructive">
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="aspect-video relative overflow-hidden bg-secondary/30">
                                            {cs.image ? (
                                                <img src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary/20">
                                                    <Star size={48} />
                                                </div>
                                            )}
                                            {cs.is_featured && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <Star size={20} className="fill-yellow-500 text-yellow-500 drop-shadow-lg" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{cs.client_name}</span>
                                            </div>
                                            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-foreground">{cs.title}</h3>
                                            <div className="text-xs text-primary font-bold mb-4">{cs.significant_figure}</div>
                                            <div className="pt-4 border-t border-border flex items-center justify-end">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-red-400 bg-background/50 backdrop-blur-sm border border-border" onClick={() => handleDelete(cs.id)}>
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
                                                    checked={selectedIds.length === filteredCaseStudies?.length && filteredCaseStudies?.length > 0}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) setSelectedIds(filteredCaseStudies?.map(i => i.id) || [])
                                                        else setSelectedIds([])
                                                    }}
                                                />
                                            </th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Case Study</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Client</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Impact</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Featured</th>
                                            <th className="p-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredCaseStudies?.map((cs) => (
                                            <tr key={cs.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="p-4 px-6">
                                                    <Checkbox 
                                                        checked={selectedIds.includes(cs.id)}
                                                        onCheckedChange={() => toggleSelect(cs.id)}
                                                        className="border-border"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded bg-secondary overflow-hidden shrink-0">
                                                            {cs.image ? <img src={cs.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/40"><Star size={16} /></div>}
                                                        </div>
                                                        <div className="font-bold line-clamp-1">{cs.title}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-medium text-muted-foreground">{cs.client_name}</td>
                                                <td className="p-4 text-xs font-bold text-primary">{cs.significant_figure || '—'}</td>
                                                <td className="p-4">
                                                    {cs.is_featured ? <Star size={14} className="fill-yellow-500 text-yellow-500" /> : <span className="text-muted-foreground">—</span>}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cs)}><Pencil size={14} /></Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cs.id)} className="text-destructive"><Trash2 size={14} /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {filteredCaseStudies?.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-xl opacity-50">
                                <p className="text-muted-foreground">No case studies found.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Form Modal */}
            <Dialog open={isFormOpen} onOpenChange={(open) => !open && setIsFormOpen(false)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit' : 'New'} Case Study</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Title</Label>
                                <Input className="bg-background border-border text-foreground" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Client Name</Label>
                                <Input className="bg-background border-border text-foreground" value={form.client_name || ''} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Significant Figure</Label>
                                <Input className="bg-background border-border text-foreground" value={form.significant_figure || ''} onChange={(e) => setForm({ ...form, significant_figure: e.target.value })} placeholder="e.g. £180M PPA Portfolio" />
                            </div>
                        </div>
                        
                        <RichTextEditor 
                            label="The Problem"
                            value={form.problem || ''}
                            onChange={(val) => setForm({ ...form, problem: val })}
                            className="min-h-[120px]"
                        />

                        <RichTextEditor 
                            label="Methodology & Approach"
                            value={form.methodology || ''}
                            onChange={(val) => setForm({ ...form, methodology: val })}
                            className="min-h-[120px]"
                        />

                        <RichTextEditor 
                            label="Outcome & Results"
                            value={form.outcome || ''}
                            onChange={(val) => setForm({ ...form, outcome: val })}
                            className="min-h-[120px]"
                        />

                        <ImageUploader
                            label="Featured Image"
                            value={form.image || ''}
                            onChange={(url) => setForm({ ...form, image: url })}
                        />
                        
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="is_featured_modal" 
                                checked={form.is_featured} 
                                onCheckedChange={(checked) => setForm({ ...form, is_featured: !!checked })} 
                                className="border-border"
                            />
                            <Label htmlFor="is_featured_modal" className="text-muted-foreground">Featured Case Study</Label>
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
                            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button onClick={() => handleSubmit()} disabled={isSaving} className="gap-2">
                                <Save size={16} /> {isSaving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}

export default AdminCaseStudiesPage
