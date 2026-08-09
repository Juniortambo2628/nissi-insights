"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { 
    Plus, 
    Calendar, 
    MapPin, 
    Edit2, 
    Trash2, 
    Eye, 
    CheckCircle, 
    XCircle,
    MoreVertical,
    Users,
    LayoutGrid,
    List,
    ArrowUpDown,
    CloudUpload,
    Check,
    Activity
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
import { format } from 'date-fns'
import ImageUploader from '@/components/admin/ImageUploader'
import FileUploader from '@/components/admin/FileUploader'
import { FallbackImage } from '@/components/ui/FallbackImage'
import { getMediaUrl } from '@/lib/utils'
import { X, FileText, Link as LinkIcon, GripVertical, ExternalLink, Download } from 'lucide-react'

const AdminEventsPage = () => {
    const { data: events, isLoading, mutate } = useApi('/events?all=true')
    const { toast } = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [documents, setDocuments] = useState<any[]>([])
    const [isSavingDocs, setIsSavingDocs] = useState(false)
    const [newDocTitle, setNewDocTitle] = useState('')
    const [newDocType, setNewDocType] = useState<'file' | 'link'>('file')
    const [newDocPath, setNewDocPath] = useState('')
    const [newDocFilename, setNewDocFilename] = useState('')
    const [newDocMime, setNewDocMime] = useState('')
    const [newDocSize, setNewDocSize] = useState<number>(0)

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date')
    const [isAutosaving, setIsAutosaving] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        overview: '',
        date: '',
        duration_minutes: 60,
        timezone: 'UTC',
        location: '',
        image: '',
        link: '',
        status: 'upcoming',
        is_published: false
    })

    // Autosave Logic
    React.useEffect(() => {
        if (!isModalOpen || formData.is_published || !formData.title || formData.title.length < 3) return

        const timer = setTimeout(async () => {
            setIsAutosaving(true)
            try {
                if (selectedEvent) {
                    await api.put(`/events/${selectedEvent.id}`, formData)
                } else {
                    const res = await api.post('/events', formData)
                    setSelectedEvent(res.data) // Set the newly created draft as the selected event
                }
                mutate()
            } catch (error) {
                console.error("Autosave failed", error)
            } finally {
                setTimeout(() => setIsAutosaving(false), 1000)
            }
        }, 3000) // 3 second debounce

        return () => clearTimeout(timer)
    }, [formData, isModalOpen])

    const sortedEvents = React.useMemo(() => {
        if (!events) return []
        return [...events].sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = a.date ? new Date(a.date).getTime() : 0
                const dateB = b.date ? new Date(b.date).getTime() : 0
                return dateB - dateA
            }
            if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
            if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '')
            return 0
        })
    }, [events, sortBy])

    const handleOpenModal = (event: any = null) => {
        if (event) {
            setSelectedEvent(event)
            setFormData({
                title: event.title,
                description: event.description || '',
                overview: event.overview || '',
                date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
                duration_minutes: event.duration_minutes || 60,
                timezone: event.timezone || 'UTC',
                location: event.location || '',
                image: event.image || '',
                link: event.link || '',
                status: event.status,
                is_published: !!event.is_published
            })
            loadDocuments(event.id)
        } else {
            setSelectedEvent(null)
            setDocuments([])
            setFormData({
                title: '',
                description: '',
                overview: '',
                date: '',
                duration_minutes: 60,
                timezone: 'UTC',
                location: '',
                image: '',
                link: '',
                status: 'upcoming',
                is_published: false
            })
        }
        resetNewDoc()
        setIsModalOpen(true)
    }

    const loadDocuments = async (eventId: number) => {
        try {
            const res = await api.get(`/event-documents?event_id=${eventId}`)
            setDocuments(res.data)
        } catch (error) {
            console.error("Failed to load documents", error)
        }
    }

    const resetNewDoc = () => {
        setNewDocTitle('')
        setNewDocType('file')
        setNewDocPath('')
        setNewDocFilename('')
        setNewDocMime('')
        setNewDocSize(0)
    }

    const handleAddDocument = async () => {
        if (!selectedEvent || !newDocTitle || !newDocPath) return
        setIsSavingDocs(true)
        try {
            const payload: any = {
                event_id: selectedEvent.id,
                title: newDocTitle,
                type: newDocType,
                path: newDocPath,
                is_published: true,
                sort_order: documents.length,
            }
            if (newDocType === 'file') {
                payload.original_filename = newDocFilename
                payload.mime_type = newDocMime
                payload.size = newDocSize
            }
            const res = await api.post('/event-documents', payload)
            setDocuments([...documents, res.data])
            resetNewDoc()
            toast({ title: "Document Added", description: "The document has been added to this event." })
        } catch (error) {
            toast({ title: "Error", description: "Failed to add document.", variant: "destructive" })
        } finally {
            setIsSavingDocs(false)
        }
    }

    const handleDeleteDocument = async (docId: number) => {
        try {
            await api.delete(`/event-documents/${docId}`)
            setDocuments(documents.filter(d => d.id !== docId))
            toast({ title: "Document Removed", description: "The document has been removed." })
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove document.", variant: "destructive" })
        }
    }

    const handleFileUploadDoc = (data: any) => {
        setNewDocPath(data.path)
        setNewDocFilename(data.filename)
        setNewDocMime(data.mime)
        setNewDocSize(data.size)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            if (selectedEvent) {
                await api.put(`/events/${selectedEvent.id}`, formData)
                toast({ title: "Event Updated", description: "The event has been updated successfully." })
            } else {
                await api.post('/events', formData)
                toast({ title: "Event Created", description: "The event has been created successfully." })
            }
            mutate()
            setIsModalOpen(false)
        } catch (error) {
            toast({ title: "Error", description: "Failed to save event.", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedEvent) return
        setIsDeleting(true)
        try {
            await api.delete(`/events/${selectedEvent.id}`)
            toast({ title: "Event Deleted", description: "The event has been removed." })
            mutate()
            setSelectedEvent(null)
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Events Management</h1>
                        <p className="text-muted-foreground text-sm">Schedule and manage your public events and webinars.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-secondary/20 p-1 rounded-lg border border-border/50 mr-4">
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

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 border-border/50 h-10">
                                    <ArrowUpDown size={16} />
                                    Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border-border">
                                <DropdownMenuItem onClick={() => setSortBy('date')}>Date</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('title')}>Title</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('status')}>Status</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="outline" size="sm" className="gap-2 border-border/50 h-10" asChild>
                            <Link href="/admin/analytics/events">
                                <Activity size={16} />
                                View Analytics
                            </Link>
                        </Button>

                        <Button onClick={() => handleOpenModal()} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10">
                            <Plus size={18} />
                            Add New Event
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-secondary/20 animate-pulse rounded-xl" />)}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedEvents?.map((event: any) => (
                            <Card key={event.id} className="bg-secondary/10 border-border/50 overflow-hidden group hover:border-primary/30 transition-all">
                                <div className="relative h-40 overflow-hidden">
                                    <FallbackImage src={event.image} alt={event.title} fallbackText="Event" className="opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${event.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {event.is_published ? 'Published' : 'Draft'}
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${event.status === 'upcoming' ? 'bg-primary/20 text-primary' : 'bg-slate-500/20 text-slate-400'}`}>
                                            {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-foreground line-clamp-1">{event.title}</h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-background border-border">
                                                <DropdownMenuItem onClick={() => handleOpenModal(event)} className="gap-2"><Edit2 size={14} /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem asChild><a href={`/events/${event.slug}`} target="_blank" className="gap-2 cursor-pointer"><Eye size={14} /> View Public</a></DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setSelectedEvent(event); setIsDeleting(true); }} className="gap-2 text-destructive"><Trash2 size={14} /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2 text-xs text-muted-foreground mb-6">
                                        <div className="flex items-center gap-2"><Calendar size={14} /> {format(new Date(event.date), 'MMM d, yyyy h:mm a')}</div>
                                        <div className="flex items-center gap-2"><MapPin size={14} /> {event.location}</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                        <Button variant="ghost" size="sm" className="gap-2 text-xs h-8" asChild>
                                            <Link href={`/admin/registrations?event_id=${event.id}`}>
                                                <Users size={14} /> View Registrations
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-secondary/10 border border-border/50 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {sortedEvents?.map((event: any) => (
                                    <tr key={event.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                                                    <FallbackImage src={event.image} alt={event.title} fallbackText="Event" />
                                                </div>
                                                <span className="font-bold text-foreground">{event.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {format(new Date(event.date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {event.location}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${event.is_published ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-400'}`}>
                                                    {event.is_published ? 'Published' : 'Draft'}
                                                </div>
                                                <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${event.status === 'upcoming' ? 'bg-primary/20 text-primary' : 'bg-slate-500/20 text-slate-400'}`}>
                                                    {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical size={16} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-background border-border">
                                                    <DropdownMenuItem onClick={() => handleOpenModal(event)} className="gap-2"><Edit2 size={14} /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem asChild><a href={`/events/${event.slug}`} target="_blank" className="gap-2 cursor-pointer"><Eye size={14} /> View Public</a></DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setSelectedEvent(event); setIsDeleting(true); }} className="gap-2 text-destructive"><Trash2 size={14} /> Delete</DropdownMenuItem>
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
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                                <DialogDescription>Fill in the details for the public event.</DialogDescription>
                            </div>
                            {isAutosaving && (
                                <div className="flex items-center gap-2 text-[10px] font-bold text-primary animate-pulse mr-8 bg-primary/10 px-3 py-1 rounded-full">
                                    <CloudUpload size={12} /> Saving draft...
                                </div>
                            )}
                            {!isAutosaving && !formData.is_published && formData.title.length > 3 && (
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 mr-8 bg-emerald-500/10 px-3 py-1 rounded-full">
                                    <Check size={12} /> Draft saved
                                </div>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Event Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Strategic Outlook 2024" />
                            </div>
                            <div className="space-y-2">
                                <Label>Date & Time</Label>
                                <Input type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Duration (min)</Label>
                                    <Input type="number" min={1} value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value) || 60})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <Input value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} placeholder="UTC" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Nairobi / Zoom" />
                            </div>
                            <div className="space-y-2">
                                <Label>Short Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief summary for listing..." className="min-h-[100px]" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Event Image</Label>
                                <ImageUploader value={formData.image} onChange={url => setFormData({...formData, image: url})} label="Upload Event Image" />
                            </div>
                            <div className="space-y-2">
                                <Label>External Link (Optional)</Label>
                                <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Publish Status</Label>
                                    <p className="text-[10px] text-muted-foreground">Make event visible on the website</p>
                                </div>
                                <Switch checked={formData.is_published} onCheckedChange={val => setFormData({...formData, is_published: val})} />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>Full Overview / Detail</Label>
                            <Textarea value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})} placeholder="Detailed information about the event..." className="min-h-[200px]" />
                        </div>

                        {selectedEvent && (
                            <div className="md:col-span-2 space-y-4">
                                <Label>Event Documents & Resources</Label>
                                <p className="text-xs text-muted-foreground">Upload files or add links that attendees can access before and after the event.</p>
                                
                                {/* Existing Documents */}
                                {documents.length > 0 && (
                                    <div className="space-y-2">
                                        {documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center gap-3 p-3 bg-secondary/10 border border-border/30 rounded-lg group">
                                                <GripVertical size={14} className="text-muted-foreground/40" />
                                                {doc.type === 'file' ? (
                                                    <FileText size={16} className="text-primary shrink-0" />
                                                ) : (
                                                    <LinkIcon size={16} className="text-primary shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">
                                                        {doc.type === 'file' ? (doc.original_filename || doc.path) : doc.path}
                                                    </p>
                                                </div>
                                                {doc.type === 'file' && doc.path && (
                                                    <a href={getMediaUrl(doc.path)} target="_blank" rel="noreferrer" className="p-1 text-muted-foreground hover:text-primary transition-colors">
                                                        <Download size={14} />
                                                    </a>
                                                )}
                                                {doc.type === 'link' && doc.path && (
                                                    <a href={doc.path} target="_blank" rel="noreferrer" className="p-1 text-muted-foreground hover:text-primary transition-colors">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                                <button onClick={() => handleDeleteDocument(doc.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Document */}
                                <div className="p-4 bg-secondary/5 border border-dashed border-border/50 rounded-lg space-y-3">
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={newDocType === 'file' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setNewDocType('file')}
                                            className="h-8 text-xs"
                                        >
                                            <FileText size={14} className="mr-1" /> Upload File
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={newDocType === 'link' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setNewDocType('link')}
                                            className="h-8 text-xs"
                                        >
                                            <LinkIcon size={14} className="mr-1" /> Add Link
                                        </Button>
                                    </div>

                                    <Input
                                        value={newDocTitle}
                                        onChange={e => setNewDocTitle(e.target.value)}
                                        placeholder="Document title (e.g. Agenda, Presentation Slides)"
                                        className="bg-background border-border"
                                    />

                                    {newDocType === 'file' ? (
                                        <>
                                            <FileUploader
                                                value={newDocPath}
                                                onChange={(path) => {
                                                    setNewDocPath(path)
                                                    setNewDocFilename(path.split('/').pop() || '')
                                                }}
                                                label=""
                                            />
                                        </>
                                    ) : (
                                        <Input
                                            value={newDocPath}
                                            onChange={e => setNewDocPath(e.target.value)}
                                            placeholder="https://..."
                                            className="bg-background border-border"
                                        />
                                    )}

                                    <Button
                                        type="button"
                                        onClick={handleAddDocument}
                                        disabled={isSavingDocs || !newDocTitle || !newDocPath}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        {isSavingDocs ? 'Adding...' : 'Add Document'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                            {isSaving && <Calendar className="animate-spin" size={16} />}
                            {selectedEvent ? 'Update Event' : 'Create Event'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent className="bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete Event</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{selectedEvent?.title}"? This will also remove all registrations for this event.</DialogDescription>
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

export default AdminEventsPage
