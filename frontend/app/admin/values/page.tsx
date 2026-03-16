"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Shield, Globe, Zap, Landmark, Star, Award, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutGrid, List } from 'lucide-react'

const availableIcons = {
    Shield, Globe, Zap, Landmark, Star, Award, Heart
}

export default function AdminValuesPage() {
    const { data: values, mutate, isLoading } = useApi<any[]>('/values')
    const { toast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingValue, setEditingValue] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [sortBy, setSortBy] = useState<'order' | 'title'>('order')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    // Form State
    const [formData, setFormData] = useState({
        icon: 'Shield',
        title: '',
        description: '',
        order: 0
    })

    const handleOpenDialog = (value: any = null) => {
        if (value) {
            setEditingValue(value)
            setFormData({
                icon: value.icon || 'Shield',
                title: value.title,
                description: value.description,
                order: value.order || 0
            })
        } else {
            setEditingValue(null)
            setFormData({
                icon: 'Shield',
                title: '',
                description: '',
                order: (values?.length || 0) + 1
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (editingValue) {
                await api.put(`/values/${editingValue.id}`, formData)
                toast({ title: "Updated", description: "Value updated successfully." })
            } else {
                await api.post('/values', formData)
                toast({ title: "Created", description: "Value added successfully." })
            }
            mutate()
            setIsDialogOpen(false)
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.message || "Failed to save value."
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return
        try {
            await api.delete(`/values/${id}`)
            toast({ title: "Deleted", description: "Value removed." })
            mutate()
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete." })
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} values?`)) return
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/values/${id}`)))
            toast({ title: "Success", description: "Values deleted." })
            setSelectedIds([])
            mutate()
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Bulk action failed." })
        }
    }

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const sortedValues = values?.sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1
        if (sortBy === 'title') return a.title.localeCompare(b.title) * factor
        return (a.order - b.order) * factor
    })

    return (
        <AdminLayout>
            <div className="space-y-8 font-inter">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Company Values</h1>
                        <p className="text-muted-foreground">Manage the core values displayed on the About page.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-secondary/20 p-1 rounded-lg border border-border/50">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                                        Sort: {sortBy === 'title' ? 'Title' : 'Order'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSortBy('title')}>Sort by Title</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('order')}>Sort by Order</DropdownMenuItem>
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
                        <Button onClick={() => handleOpenDialog()} className="gap-2">
                            <Plus size={18} /> Add Value
                        </Button>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-4 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                        <span className="text-sm font-medium text-primary">{selectedIds.length} selected</span>
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-secondary/20 animate-pulse border border-border/50" />)}
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedValues?.map((val) => {
                                    const IconComp = (availableIcons as any)[val.icon] || Shield
                                    return (
                                        <div key={val.id} className="group relative bg-secondary/10 border border-border/50 p-6 flex flex-col hover:border-primary/40 transition-all">
                                            <Checkbox 
                                                checked={selectedIds.includes(val.id)}
                                                onCheckedChange={() => toggleSelect(val.id)}
                                                className="absolute top-4 left-4 border-white/20"
                                            />
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 bg-primary/10 text-primary border border-primary/20 ml-8">
                                                    <IconComp size={24} />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(val)}><Edit2 size={14} /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(val.id)} className="text-destructive"><Trash2 size={14} /></Button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg mb-2">{val.title}</h3>
                                            <p className="text-muted-foreground text-sm flex-1">{val.description}</p>
                                            <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                                Order: {val.order}
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
                                                    checked={selectedIds.length === sortedValues?.length && sortedValues?.length > 0}
                                                    onCheckedChange={(checked: boolean) => {
                                                        if (checked) setSelectedIds(sortedValues?.map(v => v.id) || [])
                                                        else setSelectedIds([])
                                                    }}
                                                    className="border-white/20"
                                                />
                                            </th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Title</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right flex-1">Description</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">Order</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {sortedValues?.map((val) => {
                                            const IconComp = (availableIcons as any)[val.icon] || Shield
                                            return (
                                                <tr key={val.id} className="hover:bg-primary/5 transition-colors group">
                                                    <td className="p-4 px-6">
                                                        <Checkbox 
                                                            checked={selectedIds.includes(val.id)}
                                                            onCheckedChange={() => toggleSelect(val.id)}
                                                            className="border-white/20"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-primary/10 text-primary border border-primary/20 shrink-0">
                                                                <IconComp size={16} />
                                                            </div>
                                                            <div className="font-bold">{val.title}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-xs text-muted-foreground max-w-xs">{val.description}</td>
                                                    <td className="p-4 text-xs font-bold text-primary">{val.order}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(val)}><Edit2 size={14} /></Button>
                                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(val.id)} className="text-destructive"><Trash2 size={14} /></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {sortedValues?.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-border/50">
                                <p className="text-muted-foreground">No values found.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md bg-[#0a1128] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>{editingValue ? 'Edit Value' : 'Add Value'}</DialogTitle>
                        <DialogDescription className="text-white/50">Manage core company value.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <div className="grid grid-cols-7 gap-2">
                                {Object.keys(availableIcons).map((iconName) => {
                                    const Icon = (availableIcons as any)[iconName]
                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setFormData({...formData, icon: iconName})}
                                            className={cn(
                                                "p-2 border transition-all hover:bg-primary/20",
                                                formData.icon === iconName ? "border-primary bg-primary/20" : "border-white/5 bg-white/5"
                                            )}
                                        >
                                            <Icon size={20} className={cn(formData.icon === iconName ? "text-primary" : "text-white/40")} />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input 
                                className="bg-white/5 border-white/10"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                                className="bg-white/5 border-white/10 min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Display Order</Label>
                            <Input 
                                type="number"
                                className="bg-white/5 border-white/10"
                                value={formData.order}
                                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Value'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}
