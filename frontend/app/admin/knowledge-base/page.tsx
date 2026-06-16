"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Eye, 
    MoreVertical,
    FileText,
    CloudUpload,
    Check,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/nissi-switch'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'
import FileUploader from '@/components/admin/FileUploader'
import { getMediaUrl } from '@/lib/utils'


const AdminKnowledgeBasePage = () => {
    const { data: resources, isLoading, mutate } = useApi('/resources?all=true')
    const { toast } = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedResource, setSelectedResource] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [tagInput, setTagInput] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        type: 'White Paper',
        description: '',
        content: '',
        file_path: '',
        external_link: '',
        thumbnail: '',
        tags: [] as string[],
        is_published: false
    })

    const handleOpenModal = (resource: any = null) => {
        if (resource) {
            setSelectedResource(resource)
            let parsedTags = []
            if (Array.isArray(resource.tags)) {
                parsedTags = resource.tags
            } else if (typeof resource.tags === 'string') {
                try {
                    parsedTags = JSON.parse(resource.tags)
                } catch {
                    parsedTags = []
                }
            }
            setFormData({
                title: resource.title,
                type: resource.type,
                description: resource.description || '',
                content: resource.content || '',
                file_path: resource.file_path || '',
                external_link: resource.external_link || '',
                thumbnail: resource.thumbnail || '',
                tags: parsedTags,
                is_published: !!resource.is_published
            })
        } else {
            setSelectedResource(null)
            setFormData({
                title: '',
                type: 'White Paper',
                description: '',
                content: '',
                file_path: '',
                external_link: '',
                thumbnail: '',
                tags: [],
                is_published: false
            })
        }
        setTagInput('')
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (selectedResource) {
                await api.put(`/resources/${selectedResource.id}`, formData)
                toast({ title: "Resource Updated", description: "The resource has been updated successfully." })
            } else {
                await api.post('/resources', formData)
                toast({ title: "Resource Created", description: "The resource has been created successfully." })
            }
            mutate()
            setIsModalOpen(false)
        } catch (error) {
            toast({ title: "Error", description: "Failed to save resource.", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedResource) return
        setIsDeleting(true)
        try {
            await api.delete(`/resources/${selectedResource.id}`)
            toast({ title: "Resource Deleted", description: "The resource has been removed." })
            mutate()
            setSelectedResource(null)
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete resource.", variant: "destructive" })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Knowledge Base</h1>
                        <p className="text-muted-foreground text-sm">Manage white papers, reports, and articles.</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10">
                        <Plus size={18} />
                        Add New Resource
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-secondary/20 animate-pulse rounded-xl" />)}
                    </div>
                ) : (
                    <div className="bg-secondary/10 border border-border/50 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4">Resource</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Date Added</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {resources?.map((resource: any) => (
                                    <tr key={resource.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-secondary flex items-center justify-center text-muted-foreground">
                                                    {resource.thumbnail ? (
                                                        <img src={getMediaUrl(resource.thumbnail)} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FileText size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-foreground block">{resource.title}</span>
                                                    {resource.file_path && <span className="text-xs text-muted-foreground">Has Document</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                                {resource.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(resource.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${resource.is_published ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-400'}`}>
                                                {resource.is_published ? 'Published' : 'Draft'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical size={16} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-background border-border">
                                                    <DropdownMenuItem onClick={() => handleOpenModal(resource)} className="gap-2"><Edit2 size={14} /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setSelectedResource(resource); setIsDeleting(true); }} className="gap-2 text-destructive"><Trash2 size={14} /> Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit/Create Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl bg-background border-border max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
                        <DialogDescription>Fill in the details for this knowledge base item.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Energy Market Report 2026" />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.type} 
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="White Paper">White Paper</option>
                                    <option value="Report">Report</option>
                                    <option value="Article">Article</option>
                                    <option value="Presentation">Presentation</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Description (Short)</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief summary of the resource..." className="min-h-[80px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Detailed Content</Label>
                                <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Full content or executive summary..." className="min-h-[200px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        placeholder="Add tag (e.g. Energy)"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const tag = tagInput.trim();
                                                if (tag && !formData.tags.includes(tag)) {
                                                    setFormData({ ...formData, tags: [...formData.tags, tag] });
                                                    setTagInput('');
                                                }
                                            }
                                        }}
                                    />
                                    <Button 
                                        type="button"
                                        onClick={() => {
                                            const tag = tagInput.trim();
                                            if (tag && !formData.tags.includes(tag)) {
                                                setFormData({ ...formData, tags: [...formData.tags, tag] });
                                                setTagInput('');
                                            }
                                        }}
                                        className="bg-primary hover:bg-primary/90 text-white shrink-0"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {formData.tags.map((tag, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                                            {tag}
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        tags: formData.tags.filter(t => t !== tag)
                                                    });
                                                }}
                                                className="hover:text-destructive text-primary/60 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Thumbnail Image (Optional)</Label>
                                <ImageUploader value={formData.thumbnail} onChange={url => setFormData({...formData, thumbnail: url})} label="Upload Thumbnail" />
                            </div>
                            <div className="space-y-2">
                                <Label>Document File (PDF, DOCX, etc.)</Label>
                                <FileUploader 
                                    value={formData.file_path} 
                                    onChange={url => setFormData({...formData, file_path: url})} 
                                    label=""
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">Upload the resource document.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>External Link (Optional)</Label>
                                <Input value={formData.external_link} onChange={e => setFormData({...formData, external_link: e.target.value})} placeholder="https://example.com/report" />
                                <p className="text-[10px] text-muted-foreground mt-1">Provide an external link if the resource is hosted elsewhere.</p>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Publish Status</Label>
                                    <p className="text-[10px] text-muted-foreground">Make visible on the Knowledge Base</p>
                                </div>
                                <Switch checked={formData.is_published} onCheckedChange={val => setFormData({...formData, is_published: val})} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                            {isSaving && <CloudUpload className="animate-spin" size={16} />}
                            {selectedResource ? 'Update Resource' : 'Save Resource'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent className="bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete Resource</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{selectedResource?.title}"?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>Delete Permanently</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    )
}

export default AdminKnowledgeBasePage
