"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Search, LayoutGrid, List, MoreVertical, ExternalLink, Activity, Shield, Zap, TrendingUp, BarChart, Globe, Mail, Users, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { Service } from '@/types/api'
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

const AdminServicesPage = () => {
    const { data: services, mutate, isLoading } = useApi<Service[]>('/services')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const [form, setForm] = useState<Partial<Service>>({
        title: '',
        category: '',
        description: '',
        content: '',
        icon: 'Activity',
        is_active: true,
    })

    const resetForm = () => {
        setForm({ title: '', category: '', description: '', content: '', icon: 'Activity', is_active: true })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (s: Service) => {
        setForm({
            title: s.title,
            category: s.category || '',
            description: s.description || '',
            content: s.content || '',
            icon: s.icon || 'Activity',
            is_active: s.is_active ?? true,
        })
        setEditingId(s.id)
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
                await api.put(`/services/${editingId}`, form)
            } else {
                await api.post('/services', form)
            }
            toast({ title: "Success", description: `Service ${editingId ? 'updated' : 'created'} successfully.` })
            mutate()
            resetForm()
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err.response?.data?.message || 'Failed to save service' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return
        try {
            await api.delete(`/services/${id}`)
            toast({ title: "Deleted", description: "Service removed." })
            mutate()
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: 'Failed to delete service' })
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} services?`)) return
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/services/${id}`)))
            toast({ title: "Success", description: "Services deleted." })
            setSelectedIds([])
            mutate()
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Bulk delete failed." })
        }
    }

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const filteredServices = services?.filter((s) => {
        const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = activeFilter === 'all' || 
                              (activeFilter === 'active' ? s.is_active : !s.is_active)
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
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Advisory Services</h1>
                        <p className="text-muted-foreground">Manage your core advisory offerings and service categories.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-secondary/20 p-1 rounded-lg border border-border/50">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                                        Filter: {activeFilter === 'all' ? 'All' : activeFilter === 'active' ? 'Active' : 'Inactive'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setActiveFilter('all')}>All</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActiveFilter('active')}>Active Only</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActiveFilter('inactive')}>Inactive Only</DropdownMenuItem>
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
                        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white" onClick={() => { resetForm(); setShowForm(true); }}>
                            <Plus size={18} /> Add Service
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-secondary/10 p-4 border border-border/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                            placeholder="Search services..." 
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
                                {filteredServices?.map((service) => {
                                    const IconNode = iconMap[service.icon || 'Activity'] || Activity
                                    return (
                                        <div key={service.id} className="group relative bg-secondary/10 border border-border p-6 overflow-hidden hover:border-primary/40 transition-all flex flex-col shadow-sm">
                                            <div className="absolute top-4 left-4 z-10">
                                                <Checkbox 
                                                    checked={selectedIds.includes(service.id)}
                                                    onCheckedChange={() => toggleSelect(service.id)}
                                                    className="border-border bg-background/50"
                                                />
                                            </div>
                                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-red-400 bg-background/50 backdrop-blur-sm border border-border" onClick={() => handleDelete(service.id)}>
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(service)} className="gap-2">
                                                            <Pencil size={14} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(service.id)} className="gap-2 text-destructive">
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
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{service.category || 'Advisory'}</span>
                                                    {!service.is_active && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5">Inactive</span>}
                                                </div>
                                                <h3 className="font-bold text-xl leading-tight text-foreground">{service.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3">
                                                    {service.description}
                                                </p>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                                                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground" onClick={() => handleEdit(service)}>Update details</Button>
                                                <a href={`/services#${service.slug}`} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><ExternalLink size={16} /></a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="bg-secondary/10 border border-border/50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/20 border-b border-border/50">
                                        <tr>
                                            <th className="p-4 px-6 w-10">
                                                <Checkbox 
                                                    checked={selectedIds.length === filteredServices?.length && filteredServices?.length > 0}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) setSelectedIds(filteredServices?.map(i => i.id) || [])
                                                        else setSelectedIds([])
                                                    }}
                                                />
                                            </th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Service</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Category</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                                            <th className="p-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredServices?.map((service) => {
                                            const IconNode = iconMap[service.icon || 'Activity'] || Activity
                                            return (
                                                <tr key={service.id} className="hover:bg-primary/5 transition-colors group">
                                                    <td className="p-4 px-6">
                                                    <Checkbox 
                                                            checked={selectedIds.includes(service.id)}
                                                            onCheckedChange={() => toggleSelect(service.id)}
                                                            className="border-border"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                                <IconNode size={18} />
                                                            </div>
                                                            <div className="font-bold">{service.title}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-xs font-medium text-muted-foreground">{service.category || '—'}</td>
                                                    <td className="p-4">
                                                        {service.is_active ? (
                                                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-amber-500 uppercase">Inactive</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}><Pencil size={14} /></Button>
                                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)} className="text-destructive"><Trash2 size={14} /></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {filteredServices?.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-xl opacity-50">
                                <p className="text-muted-foreground">No services found.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Form Modal */}
            <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit' : 'New'} Service</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Title</label>
                            <Input className="bg-background border-border text-foreground" placeholder="Service Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Category</label>
                            <Input className="bg-background border-border text-foreground" placeholder="Category (e.g. Energy Advisory)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">Short Description</label>
                            <Input className="bg-background border-border text-foreground" placeholder="Brief overview" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
                                id="is_active_modal"
                                className="border-border"
                            />
                            <label htmlFor="is_active_modal" className="text-sm font-medium text-muted-foreground">Active</label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                            {isSaving ? 'Saving...' : 'Save Service'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}

export default AdminServicesPage
