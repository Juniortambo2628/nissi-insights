"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Star, Quote, Save, X, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ImageUploader from '@/components/admin/ImageUploader'
import api from '@/lib/api'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

const AdminTestimonialsPage = () => {
    const { data: testimonials, mutate, isLoading } = useApi('/testimonials')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [form, setForm] = useState({
        name: '',
        role: '',
        company: '',
        quote: '',
        avatar: '',
        rating: 5,
        is_featured: true,
        order: 0,
    })

    const resetForm = () => {
        setForm({ name: '', role: '', company: '', quote: '', avatar: '', rating: 5, is_featured: true, order: 0 })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (t: any) => {
        setForm({
            name: t.name || t.client_name || '',
            role: t.role || '',
            company: t.company || '',
            quote: t.quote || '',
            avatar: t.avatar || '',
            rating: t.rating || 5,
            is_featured: t.is_featured ?? true,
            order: t.order || 0,
        })
        setEditingId(t.id)
        setShowForm(true)
    }

    const handleSave = async () => {
        if (!form.name || !form.quote) {
            toast({ variant: "destructive", title: "Validation Error", description: "Name and Quote are required" })
            return
        }

        setIsSaving(true)
        try {
            if (editingId) {
                await api.put(`/testimonials/${editingId}`, form)
            } else {
                await api.post('/testimonials', form)
            }
            toast({
                title: "Success",
                description: `Testimonial ${editingId ? 'updated' : 'created'} successfully.`,
            })
            mutate()
            resetForm()
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.message || 'Failed to save testimonial',
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await api.delete(`/testimonials/${id}`)
                toast({
                    title: "Deleted",
                    description: "Testimonial has been removed.",
                })
                mutate()
            } catch (err) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: 'Failed to delete testimonial',
                })
            }
        }
    }

    const filteredTestimonials = testimonials?.filter((t: any) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.company?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
                        <p className="text-muted-foreground">Manage client testimonials displayed on the landing page.</p>
                    </div>
                    <Button className="gap-2" onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus size={18} />
                        Add Testimonial
                    </Button>
                </div>

                {/* Create/Edit Modal */}
                <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit' : 'New'} Testimonial</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Client Name</label>
                                    <Input placeholder="Client Name" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Role / Title</label>
                                    <Input placeholder="Role / Title" value={form.role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, role: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Company</label>
                                    <Input placeholder="Company" value={form.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, company: e.target.value })} />
                                </div>
                            </div>
                            
                            <ImageUploader 
                                label="Client Avatar"
                                value={form.avatar}
                                onChange={(url) => setForm({ ...form, avatar: url })}
                                maxSizeMB={2}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Testimonial Quote</label>
                                <textarea
                                    placeholder="Testimonial quote..."
                                    value={form.quote}
                                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                                    className="w-full bg-secondary/5 border border-border rounded-md p-3 text-sm min-h-[120px] resize-y focus:outline-none focus:ring-1 focus:ring-primary/30"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rating (1-5)</label>
                                    <Input type="number" placeholder="Rating" value={form.rating} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} min={1} max={5} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sort Order</label>
                                    <Input type="number" placeholder="Sort Order" value={form.order} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <input 
                                        type="checkbox" 
                                        checked={form.is_featured} 
                                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} 
                                        id="is_featured_modal"
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="is_featured_modal" className="text-sm font-medium">Featured</label>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Testimonial'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Search */}
                <div className="flex items-center gap-4 max-w-sm">
                    <div className="relative flex-1">
                        <Quote className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Filter testimonials..."
                            className="pl-10 bg-secondary/5"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-secondary/10 border border-border/50 rounded-xl p-6 h-48 animate-pulse">
                                <div className="flex justify-between mb-4">
                                    <div className="w-20 h-3 bg-secondary/20 rounded" />
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-secondary/20" />
                                        <div className="w-8 h-8 rounded-lg bg-secondary/20" />
                                    </div>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="w-full h-3 bg-secondary/20 rounded" />
                                    <div className="w-full h-3 bg-secondary/20 rounded" />
                                    <div className="w-2/3 h-3 bg-secondary/20 rounded" />
                                </div>
                                <div className="pt-3 border-t border-border/20">
                                    <div className="w-32 h-4 bg-secondary/20 rounded mb-2" />
                                    <div className="w-24 h-3 bg-secondary/20 rounded" />
                                </div>
                            </div>
                        ))
                    ) : filteredTestimonials?.map((t: any) => (
                        <Card key={t.id} className="bg-secondary/10 border-border/50 hover:bg-secondary/20 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(t)}>
                                            <Pencil size={14} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(t.id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                                <blockquote className="text-sm text-foreground/70 italic mb-4 line-clamp-4">
                                    &ldquo;{t.quote}&rdquo;
                                </blockquote>
                                <div className="border-t border-border/50 pt-3 flex items-center gap-3">
                                    {t.avatar ? (
                                        <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={14} />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-sm">{t.name || t.client_name}</div>
                                        <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredTestimonials?.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl opacity-50">
                            No testimonials found.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminTestimonialsPage
