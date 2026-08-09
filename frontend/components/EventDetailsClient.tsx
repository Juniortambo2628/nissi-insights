"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowLeft, Mail, User, Building, Phone, Send, CheckCircle2, FileText, Link as LinkIcon, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { useApi } from '@/hooks/use-api'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { FallbackImage } from '@/components/ui/FallbackImage'
import { getMediaUrl } from '@/lib/utils'

interface EventDocument {
    id: number
    title: string
    type: 'file' | 'link'
    path: string
    original_filename?: string
    mime_type?: string
    size?: number
    url?: string
}

interface Event {
    id: number
    title: string
    slug: string
    description: string
    overview: string
    date: string
    duration_minutes?: number
    location: string
    image: string
    link: string
    status: 'upcoming' | 'past'
    documents?: EventDocument[]
}

interface EventDetailsClientProps {
    initialData: Event | null
    slug: string
}

export default function EventDetailsClient({ initialData, slug }: EventDetailsClientProps) {
    const { toast } = useToast()
    const { data: event, isLoading, isError } = useApi<Event>(slug ? `/events/${slug}` : null, {
        fallbackData: initialData
    })

    const isEventEnded = event ? (new Date(event.date).getTime() + (event.duration_minutes || 60) * 60 * 1000) < new Date() : false
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        organization: ''
    })

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!event) return

        setIsSubmitting(true)
        try {
            await api.post('/events/register', {
                ...formData,
                event_id: event.id
            })
            setIsRegistered(true)
            toast({
                title: "Registration Successful",
                description: "You've been registered for the event. Check your email for details.",
            })
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: "There was an error submitting your registration. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading && !event) return <div className="h-screen bg-background animate-pulse" />
    if (isError || !event) return <div className="h-screen bg-background flex items-center justify-center">Event not found</div>

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <FallbackImage src={event.image} alt={event.title} fallbackText="Event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>

                <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 pt-20">
                    <Link href="/events" className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all">
                        <ArrowLeft size={16} /> Back to Events
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 max-w-4xl leading-tight">
                        {event.title}
                    </h1>
                    
                    <div className="flex flex-wrap gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                        <div className="flex items-center gap-3"><Calendar className="text-primary" size={20} /> {format(new Date(event.date), 'MMMM d, yyyy')}</div>
                        <div className="flex items-center gap-3"><Clock className="text-primary" size={20} /> {format(new Date(event.date), 'h:mm a')}</div>
                        <div className="flex items-center gap-3"><MapPin className="text-primary" size={20} /> {event.location}</div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 max-w-[1400px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="prose prose-invert prose-lg max-w-none">
                            <h2 className="text-3xl font-bold text-foreground mb-8">Event Overview</h2>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap opacity-90">
                                {event.overview || event.description}
                            </div>
                        </div>

                        {/* Event Documents & Resources */}
                        {event.documents && event.documents.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-foreground">Resources & Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.documents.map((doc) => (
                                        <div key={doc.id} className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                    {doc.type === 'file' ? (
                                                        <FileText size={20} className="text-primary" />
                                                    ) : (
                                                        <LinkIcon size={20} className="text-primary" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-foreground text-sm truncate">{doc.title}</h4>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {doc.type === 'file' ? (doc.original_filename || 'Uploaded file') : 'External link'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="border-primary/50 text-primary hover:bg-primary hover:text-white shrink-0"
                                            >
                                                {doc.type === 'file' ? (
                                                    <a href={getMediaUrl(doc.path)} target="_blank" rel="noopener noreferrer" download>
                                                        <Download size={16} className="mr-1" /> Download
                                                    </a>
                                                ) : (
                                                    <a href={doc.path} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink size={16} className="mr-1" /> Open
                                                    </a>
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.link && (
                            <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between gap-6">
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">External Resources</h4>
                                    <p className="text-sm text-muted-foreground">Additional documents or links related to this session.</p>
                                </div>
                                <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-white">
                                    <a href={event.link} target="_blank" rel="noopener noreferrer">Access Resources</a>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Registration Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 p-8 bg-secondary/10 border border-border/50 rounded-3xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -skew-x-12 translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700" />
                            
                            {isRegistered ? (
                                <div className="text-center py-12 relative z-10">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Registration Confirmed</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                                        We've sent a confirmation email to <strong>{formData.email}</strong>. See you at the event!
                                    </p>
                                    <Button onClick={() => setIsRegistered(false)} variant="outline" className="w-full">Register Another Person</Button>
                                </div>
                            ) : isEventEnded ? (
                                <div className="text-center py-12 relative z-10">
                                    <div className="inline-flex items-center px-3 py-1 bg-slate-500/20 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                                        Past Event
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Event Ended</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        This event has already taken place. Browse the resources and documents above for related materials.
                                    </p>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <div className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                                        Registration Open
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Reserve Your Seat</h3>
                                    <p className="text-muted-foreground text-sm mb-8">Fill in your details to register for this session.</p>

                                    <form onSubmit={handleRegister} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-widest font-bold opacity-60">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-primary/40" size={18} />
                                                <Input 
                                                    required
                                                    placeholder="John Doe" 
                                                    className="pl-10 bg-background border-border"
                                                    value={formData.name}
                                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-widest font-bold opacity-60">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 text-primary/40" size={18} />
                                                <Input 
                                                    required
                                                    type="email"
                                                    placeholder="john@organization.com" 
                                                    className="pl-10 bg-background border-border"
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-widest font-bold opacity-60">Organization</Label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-3 text-primary/40" size={18} />
                                                <Input 
                                                    placeholder="Company Name" 
                                                    className="pl-10 bg-background border-border"
                                                    value={formData.organization}
                                                    onChange={e => setFormData({...formData, organization: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-widest font-bold opacity-60">Phone (Optional)</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 text-primary/40" size={18} />
                                                <Input 
                                                    placeholder="+1 (555) 000-0000" 
                                                    className="pl-10 bg-background border-border"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <Button 
                                            disabled={isSubmitting}
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
                                        >
                                            {isSubmitting ? "Processing..." : <><Send size={18} /> Register Now</>}
                                        </Button>
                                    </form>
                                    <p className="text-[10px] text-center text-muted-foreground mt-6 opacity-40">
                                        By registering, you agree to our Terms & Privacy Policy.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
