"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Search, LayoutGrid, List, MoreVertical, ExternalLink, Activity, Shield, Zap, TrendingUp, BarChart, Globe, Mail, Users, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { Pillar } from '@/types/api'
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

const iconMap: Record<string, React.ElementType> = {
    Activity, Shield, Zap, TrendingUp, BarChart, Globe, Mail, Users, Settings
}

const AdminPillarsPage = () => {
    const { data: pillars, mutate, isLoading } = useApi<Pillar[]>('/pillars')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const [form, setForm] = useState<Partial<Pillar>>({
        title: '',
        overview: '',
        content: '',
        icon: 'Activity',
        is_active: true,
    })

    const resetForm = () => {
        setForm({ title: '', overview: '', content: '', icon: 'Activity', is_active: true })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (p: Pillar) => {
        setForm({
            title: p.title,
            overview: p.overview || '',
            content: p.content || '',
            icon: p.icon || 'Activity',
            is_active: p.is_active ?? true,
        })
        setEditingId(p.id)
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
                await api.put(`/pillars/${editingId}`, form)
            } else {
                await api.post('/pillars', form)
            }
            toast({ title: "Success", description: `Pillar ${editingId ? 'updated' : 'created'} successfully.` })
            mutate()
            resetForm()
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || 'Failed to save pillar' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this pillar?')) return
        try {
            await api.delete(`/pillars/${id}`)
            toast({ title: "Deleted", description: "Pillar removed." })
            mutate()
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: 'Failed to delete pillar' })
        }
    }

    const filteredPillars = pillars?.filter((p) => {
        return p.title.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Service Pillars</h1>
                        <p className="text-muted-foreground">Manage the core pillars that encompass your advisory services.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white" onClick={() => { resetForm(); setShowForm(true); }}>
                            <Plus size={18} /> Add Pillar
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/10 p-4 border border-border/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                            placeholder="Search pillars..." 
                            className="pl-10 bg-background/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-secondary/20 animate-pulse border border-border/50" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPillars?.map((pillar) => {
                            const IconNode = iconMap[pillar.icon || 'Activity'] || Activity
                            return (
                                <div key={pillar.id} className="group relative bg-secondary/10 border border-border p-6 overflow-hidden hover:border-primary/40 transition-all flex flex-col shadow-sm">
                                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 bg-background/50 backdrop-blur-sm border border-border">
                                                    <MoreVertical size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(pillar)} className="gap-2">
                                                    <Pencil size={14} /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(pillar.id)} className="gap-2 text-destructive">
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="mb-6 w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-xl ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <IconNode size={32} />
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-2">
                                            {!pillar.is_active && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5">Inactive</span>}
                                        </div>
                                        <h3 className="font-bold text-xl leading-tight text-foreground">{pillar.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {pillar.overview}
                                        </p>
                                        <div className="pt-2 text-[10px] uppercase tracking-widest font-bold text-primary/60">
                                            {pillar.services?.length || 0} Associated Services
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground" onClick={() => handleEdit(pillar)}>Manage Pillar</Button>
                                        <a href={`/pillars/${pillar.slug}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><ExternalLink size={16} /></a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit' : 'New'} Pillar</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">Title</label>
                            <Input className="bg-background border-border text-foreground" placeholder="Pillar Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">Short Overview</label>
                            <Input className="bg-background border-border text-foreground" placeholder="Brief overview of the pillar" value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} />
                        </div>
                        
                        <div className="md:col-span-2">
                            <RichTextEditor 
                                label="Detailed Content"
                                value={form.content || ''}
                                onChange={(content) => setForm({ ...form, content })}
                                className="min-h-[200px]"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium block text-muted-foreground">Icon Selection</label>
                            <div className="grid grid-cols-5 gap-2">
                                {Object.keys(iconMap).map(iconName => (
                                    <Button 
                                        key={iconName}
                                        type="button"
                                        variant={form.icon === iconName ? 'secondary' : 'ghost'}
                                        className={cn("h-10 w-10 p-0", form.icon === iconName && "ring-1 ring-primary")}
                                        onClick={() => setForm({ ...form, icon: iconName })}
                                    >
                                        {React.createElement(iconMap[iconName] as React.ElementType, { size: 18 })}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-8">
                            <Checkbox 
                                checked={form.is_active} 
                                onCheckedChange={(checked: boolean) => setForm({ ...form, is_active: !!checked })} 
                                id="is_active_pillar"
                                className="border-border"
                            />
                            <label htmlFor="is_active_pillar" className="text-sm font-medium text-muted-foreground">Active</label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                            {isSaving ? 'Saving...' : 'Save Pillar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}

export default AdminPillarsPage
