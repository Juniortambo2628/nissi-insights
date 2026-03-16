"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, ArrowUpDown, Hash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'

const AdminStatsPage = () => {
    const { data: stats, mutate, isLoading } = useApi('/stats')
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [form, setForm] = useState({
        label: '',
        value: '',
        order: 0,
        icon: '',
    })

    const resetForm = () => {
        setForm({ label: '', value: '', order: 0, icon: '' })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (s: any) => {
        setForm({
            label: s.label,
            value: s.value,
            order: s.order || 0,
            icon: s.icon || '',
        })
        setEditingId(s.id)
        setShowForm(true)
    }

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`/stats/${editingId}`, form)
            } else {
                await api.post('/stats', form)
            }
            mutate()
            resetForm()
        } catch (err) {
            alert('Failed to save stat')
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this stat?')) {
            try {
                await api.delete(`/stats/${id}`)
                mutate()
            } catch (err) {
                alert('Failed to delete stat')
            }
        }
    }

    const filteredStats = stats?.filter((s: any) => 
        s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.value.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Key Statistics</h1>
                        <p className="text-muted-foreground">Manage the performance metrics shown on the landing page.</p>
                    </div>
                    <Button className="gap-2" onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus size={18} />
                        Add Stat
                    </Button>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <Card className="bg-secondary/10 border-primary/20">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-lg">{editingId ? 'Edit' : 'New'} Statistic</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Value (e.g. 180 M)</label>
                                    <Input placeholder="Stat Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Label (e.g. PPA Portfolio)</label>
                                    <Input placeholder="Stat Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sort Order</label>
                                    <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Icon Name (Optional)</label>
                                    <Input placeholder="e.g. Activity, Users" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSave} className="gap-2">Save Stat</Button>
                                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex items-center gap-4 max-w-sm">
                    <div className="relative flex-1">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                            placeholder="Filter stats..." 
                            className="pl-10 bg-secondary/5"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-secondary/10 border border-border/50 rounded-xl p-6 h-48 animate-pulse">
                                <div className="flex justify-between mb-8">
                                    <div className="w-10 h-10 rounded-lg bg-secondary/20" />
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-secondary/20" />
                                        <div className="w-8 h-8 rounded-lg bg-secondary/20" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-24 h-8 bg-secondary/20 rounded" />
                                    <div className="w-32 h-4 bg-secondary/20 rounded" />
                                </div>
                            </div>
                        ))
                    ) : filteredStats?.map((stat: any) => (
                        <Card key={stat.id} className="bg-secondary/10 border-border/50 hover:bg-secondary/20 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {stat.order}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEdit(stat)}>
                                            <Pencil size={14} />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(stat.id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-bold tracking-tight text-primary">{stat.value}</h3>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <ArrowUpDown size={12} />
                                        Sort order: {stat.order}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        Icon: {stat.icon || 'default'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredStats?.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl opacity-50">
                            No stats found.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminStatsPage
