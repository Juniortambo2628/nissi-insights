"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Calendar, ArrowLeft, Tag, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import { useApi } from '@/hooks/use-api'
import { useSettings } from '@/hooks/use-settings'
import { getMediaUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface ResourceDetailsClientProps {
    initialData: any
    slug: string
}

export default function ResourceDetailsClient({ initialData, slug }: ResourceDetailsClientProps) {
    const { data: resource, isLoading, isError } = useApi<any>(`/resources/${slug}`, {
        fallbackData: initialData
    })
    const { getSetting } = useSettings()
    const { toast } = useToast()

    const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false)
    const [subscribeEmail, setSubscribeEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const heroImage = getSetting('hero_knowledge_base_media', '/NI-Digital-Assets/financial-technology.jpg')

    const triggerDownload = (filePath: string) => {
        const link = document.createElement('a')
        link.href = getMediaUrl(filePath)
        link.setAttribute('download', '')
        link.setAttribute('target', '_blank')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleSubscribeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!subscribeEmail.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await api.post('/subscribe', { email: subscribeEmail, source: 'knowledge_base_download' })
            toast({
                title: "Successfully Subscribed!",
                description: "Thank you for subscribing to our newsletter.",
            })
            setIsSubscribeDialogOpen(false)
            setSubscribeEmail('')
        } catch (err: any) {
            if (err.response?.status === 422) {
                toast({
                    title: "Welcome back!",
                    description: "You are already subscribed to our newsletter.",
                })
                setIsSubscribeDialogOpen(false)
                setSubscribeEmail('')
            } else {
                toast({
                    variant: "destructive",
                    title: "Subscription Failed",
                    description: err.response?.data?.message || 'Something went wrong. Please try again.',
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }


    if (isLoading && !resource) {
        return (
            <div className="flex min-h-screen flex-col bg-background relative">
                <Navbar />
                <div className="flex-1 pt-32 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="h-12 w-1/2 bg-foreground/10 animate-pulse mb-8" />
                        <div className="h-64 bg-secondary/10 rounded-xl animate-pulse" />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (isError || !resource) {
        return (
            <div className="flex min-h-screen flex-col bg-background relative">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Resource Not Found</h2>
                        <Button asChild variant="outline">
                            <Link href="/knowledge-base">Back to Knowledge Base</Link>
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-background relative">
            <Navbar />
            
            <VideoHero 
                title={resource.title}
                tagline={resource.type}
                subtitle={resource.description || 'Access our strategic insights and industry reports.'}
                bgImage={resource.thumbnail ? getMediaUrl(resource.thumbnail) : getMediaUrl(heroImage)}
            />

            <main className="flex-1 bg-background pb-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="pt-24 flex flex-col lg:flex-row gap-16">
                        {/* Main Content */}
                        <div className="flex-1">
                            <Link href="/knowledge-base" className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-12 hover:gap-4 transition-all">
                                <ArrowLeft size={16} /> Back to Knowledge Base
                            </Link>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose prose-invert prose-lg max-w-none"
                            >
                                <div className="flex items-center gap-6 text-muted-foreground/60 text-sm mb-12 border-b border-border/50 pb-8">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-primary" />
                                        {new Date(resource.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-primary" />
                                        {resource.type}
                                    </div>
                                </div>

                                {resource.thumbnail && (
                                    <div className="mb-12 rounded-2xl overflow-hidden border border-border/50 max-h-[450px] bg-secondary/10">
                                        <img 
                                            src={getMediaUrl(resource.thumbnail)} 
                                            alt={resource.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                                    {resource.content || resource.description || 'No detailed content available for this resource.'}
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar / Action Area */}
                        <div className="lg:w-96">
                            <div className="sticky top-32 bg-secondary/10 border border-border/50 p-8 rounded-2xl">
                                <h3 className="text-xl font-bold text-foreground mb-6">Resource Actions</h3>
                                
                                {resource.file_path ? (
                                    <div className="space-y-6">
                                        <p className="text-sm text-muted-foreground">
                                            This document is available for download as a PDF/Resource file.
                                        </p>
                                        <Button 
                                            onClick={() => {
                                                triggerDownload(resource.file_path)
                                                setIsSubscribeDialogOpen(true)
                                            }}
                                            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold gap-3 text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
                                        >
                                            Download Resource <Download size={18} />
                                        </Button>
                                    </div>
                                ) : resource.external_link ? (
                                    <div className="space-y-6">
                                        <p className="text-sm text-muted-foreground">
                                            This resource is hosted on an external platform.
                                        </p>
                                        <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold gap-3 text-sm uppercase tracking-widest shadow-xl shadow-primary/20" asChild>
                                            <a href={resource.external_link} target="_blank" rel="noopener noreferrer">
                                                Visit Resource <ExternalLink size={18} />
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        This is a digital briefing. No downloadable file is attached.
                                    </p>
                                )}

                                <div className="mt-12 pt-8 border-t border-border/50">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Related Topics</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(resource.tags || ['Intelligence', 'Advisory', 'Strategy']).map((tag: string) => (
                                            <span key={tag} className="text-[10px] bg-foreground/5 text-muted-foreground px-3 py-1 rounded-full border border-border/50 uppercase font-bold tracking-tighter">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Dialog open={isSubscribeDialogOpen} onOpenChange={setIsSubscribeDialogOpen}>
                <DialogContent className="sm:max-w-[450px] bg-background border-border p-6 rounded-2xl overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                    
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <span className="text-primary">Subscribe</span> to our Newsletter
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
                            Join our newsletter list to get the latest strategic insights, market intelligence, and industry reports directly in your inbox.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubscribeSubmit} className="space-y-4 mt-4 relative z-10">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.name@company.com"
                                value={subscribeEmail}
                                onChange={(e) => setSubscribeEmail(e.target.value)}
                                className="h-12 bg-secondary/15 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0"
                                required
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={16} /> Subscribing...
                                </span>
                            ) : (
                                "Subscribe"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    )
}
