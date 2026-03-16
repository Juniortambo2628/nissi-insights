"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Building2, Save, X, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'

import ImageUploader from '@/components/admin/ImageUploader'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

const AdminClientsPage = () => {
    const { data: clients, mutate, isLoading } = useApi('/clients')
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [form, setForm] = useState({
        name: '',
        logo: '',
        website: '',
        is_active: true,
        order: 0,
    })

    const resetForm = () => {
        setForm({ name: '', logo: '', website: '', is_active: true, order: 0 })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (c: any) => {
        setForm({
            name: c.name,
            logo: c.logo || '',
            website: c.website || '',
            is_active: c.is_active ?? true,
            order: c.order || 0,
        })
        setEditingId(c.id)
        setShowForm(true)
    }

    const handleSave = async () => {
        if (!form.name) {
            toast({ variant: "destructive", title: "Validation Error", description: "Client Name is required" })
            return
        }

        setIsSaving(true)
        try {
            if (editingId) {
                await api.put(`/clients/${editingId}`, form)
            } else {
                await api.post('/clients', form)
            }
            toast({
                title: "Success",
                description: `Client ${editingId ? 'updated' : 'created'} successfully.`,
            })
            mutate()
            resetForm()
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.message || 'Failed to save client',
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this client?')) {
            try {
                await api.delete(`/clients/${id}`)
                toast({
                    title: "Deleted",
                    description: "Client has been removed.",
                })
                mutate()
            } catch (err) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: 'Failed to delete client',
                })
            }
        }
    }

    const filteredClients = clients?.filter((c: any) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Client Logos</h1>
                        <p className="text-muted-foreground">Manage the client logos displayed in the trust carousel.</p>
                    </div>
                    <Button className="gap-2" onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus size={18} />
                        Add Client
                    </Button>
                </div>

                {/* Create/Edit Modal */}
                <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit' : 'New'} Client</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Client Name</label>
                                    <Input placeholder="Client Name" value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Website</label>
                                    <Input placeholder="Website URL" value={form.website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, website: e.target.value })} />
                                </div>
                            </div>
                            
                            <ImageUploader 
                                label="Client Logo"
                                value={form.logo}
                                onChange={(url) => setForm({ ...form, logo: url })}
                                maxSizeMB={2}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sort Order</label>
                                    <Input type="number" placeholder="Sort Order" value={form.order} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <input 
                                        type="checkbox" 
                                        checked={form.is_active} 
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })} 
                                        id="is_active_modal"
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="is_active_modal" className="text-sm font-medium">Active (visible on site)</label>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={resetForm} disabled={isSaving}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Client'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Search */}
                <div className="flex items-center gap-4 max-w-sm">
                    <div className="relative flex-1">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Filter clients..."
                            className="pl-10 bg-secondary/5"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Client Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-secondary/10 border border-border/50 rounded-xl p-5 h-44 animate-pulse flex flex-col justify-between">
                                <div className="flex justify-between">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/20" />
                                    <div className="flex gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-secondary/20" />
                                        <div className="w-7 h-7 rounded-lg bg-secondary/20" />
                                    </div>
                                </div>
                                <div className="space-y-3 px-4">
                                    <div className="w-16 h-8 bg-secondary/20 rounded mx-auto" />
                                    <div className="w-24 h-4 bg-secondary/10 rounded mx-auto" />
                                </div>
                                <div className="w-20 h-3 bg-secondary/10 rounded" />
                            </div>
                        ))
                    ) : filteredClients?.map((client: any) => (
                        <Card key={client.id} className="bg-secondary/10 border-border/50 hover:bg-secondary/20 transition-all">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${client.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {client.order}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(client)}>
                                            <Pencil size={12} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(client.id)}>
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                </div>
                                {client.logo ? (
                                    <img src={client.logo} alt={client.name} className="h-8 object-contain mb-3 opacity-70" />
                                ) : (
                                    <div className="h-8 mb-3 flex items-center">
                                        <Building2 size={24} className="text-muted-foreground" />
                                    </div>
                                )}
                                <h3 className="font-bold text-sm">{client.name}</h3>
                                {client.website && (
                                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1">
                                        <ExternalLink size={10} /> Website
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {filteredClients?.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl opacity-50">
                            No clients found.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminClientsPage
