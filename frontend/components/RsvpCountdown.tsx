"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'
import { Send, CheckCircle2, Loader2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMediaUrl, cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface RsvpCountdownProps {
    date: string
    title: string
    description: string
    media: string
    bgLight?: string
    bgDark?: string
    venue?: string
    address?: string
    time?: string
    menuFile?: string
}

export default function RsvpCountdown({ 
    date, title, description, media, bgLight, bgDark,
    venue = 'The Sage Delicacy, Gigiri',
    address = 'Corner of, 183 Gigiri Close, United Nations Cresent, Nairobi',
    time = '7:00-9:00 P.M.',
    menuFile
}: RsvpCountdownProps) {
    const { toast } = useToast()
    const { theme } = useTheme()
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isMounted, setIsMounted] = useState(false)
    const [activeTab, setActiveTab] = useState('rsvp')
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        job_title: '',
        sector: '',
        interest: '',
        consent: false,
        newsletter: false,
        attendance: 'accept', // for RSVP
        type: 'rsvp' // 'rsvp' or 'early_access'
    })
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const targetDate = new Date(date).getTime()

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate - now

            if (distance < 0) {
                clearInterval(interval)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [date])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.consent) {
            toast({
                variant: 'destructive',
                title: 'Consent Required',
                description: 'Please provide consent to be notified about the launch.',
            })
            return
        }

        setIsSubmitting(true)

        try {
            await api.post('/rsvps', {
                ...formData,
                type: activeTab
            })
            setIsSuccess(true)
            toast({
                title: activeTab === 'rsvp' ? 'RSVP Confirmed' : 'Access Requested',
                description: 'Thank you! We have sent a confirmation email.',
            })
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Something went wrong. Please try again.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isMounted) return <div className="min-h-screen bg-background" />

    // Fallback abstract video: Using a reliable Mixkit URL
    const themeBg = theme === 'dark' ? bgDark : bgLight
    const rawMedia = themeBg || (media === '/assets/videos/hero.mp4' 
        ? 'https://assets.mixkit.co/videos/preview/mixkit-abstract-light-streaks-running-through-a-black-background-4074-large.mp4' 
        : media)
    
    const bgMedia = getMediaUrl(rawMedia)
    const isVideo = bgMedia.toLowerCase().endsWith('.mp4') || bgMedia.toLowerCase().endsWith('.webm')

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground selection:bg-primary selection:text-white">
            <div className="absolute inset-0 z-0">
                {isVideo ? (
                    <video 
                        src={bgMedia} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className={cn(
                            "w-full h-full object-cover scale-105",
                            theme === 'dark' ? "opacity-90" : "opacity-80"
                        )}
                    />
                ) : (
                    <div 
                        className={cn(
                            "w-full h-full bg-cover bg-center scale-105 transition-transform duration-10000",
                            theme === 'dark' ? "opacity-90" : "opacity-80"
                        )}
                        style={{ backgroundImage: `url('${bgMedia}')` }}
                    />
                )}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-tr",
                    theme === 'dark' 
                        ? "from-black/40 via-black/20 to-transparent" 
                        : "from-background/50 via-background/20 to-transparent"
                )} />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 min-h-screen">
                
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 space-y-8 text-center lg:text-left pt-10 lg:pt-0"
                >
                    <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2 px-6 py-3 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-md mb-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-xs uppercase tracking-widest font-bold text-primary">
                                Launch: {format(new Date(date), 'MMMM do, yyyy')}
                            </span>
                        </div>
                        <span className="hidden sm:block text-primary/40">|</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            {venue} • {time}
                        </span>
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tighter leading-[1.2] pb-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50 max-w-2xl mx-auto lg:mx-0">
                        {title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        {description}
                    </p>

                    {/* Event Details Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0"
                    >
                        <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 text-left">
                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Location</h4>
                            <p className="text-sm text-foreground/80 font-medium">{venue}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{address}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 text-left">
                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Agenda</h4>
                            <p className="text-sm text-foreground/80 font-medium">Platform Unveiling & Networking</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Complimentary refreshments served</p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-4 gap-3 sm:gap-6 pt-6 max-w-lg mx-auto lg:mx-0">
                        {[
                            { label: 'Days', value: timeLeft.days },
                            { label: 'Hours', value: timeLeft.hours },
                            { label: 'Minutes', value: timeLeft.minutes },
                            { label: 'Seconds', value: timeLeft.seconds },
                        ].map((time, i) => (
                            <motion.div 
                                key={time.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                                className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-background/50 border border-border backdrop-blur-md shadow-2xl"
                            >
                                <span className="text-3xl sm:text-5xl font-light tracking-tight tabular-nums font-mono text-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                    {String(time.value).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-2">{time.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full max-w-md shrink-0"
                >
                    <div className="relative group p-[1px] rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-primary/10 to-transparent opacity-70" />
                        
                        <div className="relative bg-background/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-border shadow-2xl">
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-center mb-6">
                                            <img 
                                                src={theme === 'dark' ? "/logos/nissi-landscape-black.png" : "/logos/nissi-landscape-white.png"} 
                                                alt="Nissi Insights" 
                                                className="h-[40px] object-contain" 
                                            />
                                        </div>

                                        <Tabs defaultValue="rsvp" className="w-full" onValueChange={setActiveTab}>
                                            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-xl p-1 mb-8">
                                                <TabsTrigger value="rsvp" className="rounded-lg text-xs font-bold uppercase transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm py-2.5">
                                                    Dinner RSVP
                                                </TabsTrigger>
                                                <TabsTrigger value="early_access" className="rounded-lg text-xs font-bold uppercase transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm py-2.5">
                                                    Early Access
                                                </TabsTrigger>
                                            </TabsList>

                                            <motion.form 
                                                key={activeTab}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onSubmit={handleSubmit}
                                                className="space-y-5"
                                            >
                                                <div className="text-center mb-6">
                                                    <h3 className="text-xl font-bold text-foreground">
                                                        {activeTab === 'rsvp' ? 'Join Us for Dinner' : 'Priority Access'}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {activeTab === 'rsvp' 
                                                            ? 'Please confirm your attendance for the launch event.' 
                                                            : 'Secure your place in the global rollout queue.'}
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <Input 
                                                        required 
                                                        placeholder="Full Name" 
                                                        value={formData.name}
                                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                                        className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl focus:ring-primary"
                                                    />
                                                    
                                                    <Input 
                                                        required 
                                                        type="email" 
                                                        placeholder="Email Address" 
                                                        value={formData.email}
                                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                                        className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl focus:ring-primary"
                                                    />

                                                    {activeTab === 'rsvp' ? (
                                                        <div className="space-y-3 pt-1">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => setFormData({...formData, attendance: 'accept'})}
                                                                    variant={formData.attendance === 'accept' ? 'default' : 'outline'}
                                                                    className={cn(
                                                                        "flex-1 rounded-xl h-11 font-bold text-xs uppercase transition-all",
                                                                        formData.attendance === 'accept' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-transparent border-border text-foreground"
                                                                    )}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => setFormData({...formData, attendance: 'decline'})}
                                                                    variant={formData.attendance === 'decline' ? 'default' : 'outline'}
                                                                    className={cn(
                                                                        "flex-1 rounded-xl h-11 font-bold text-xs uppercase transition-all",
                                                                        formData.attendance === 'decline' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-transparent border-border text-foreground"
                                                                    )}
                                                                >
                                                                    Decline
                                                                </Button>
                                                            </div>
                                                            <div className="text-center">
                                                                <a 
                                                                    href={getMediaUrl(menuFile || 'files/SAGE DELICACY MENU NEW DRAFT-1 (1).pdf')} 
                                                                    target="_blank" 
                                                                    className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                                                                >
                                                                    View Dinner Menu
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Input 
                                                                placeholder="Organization" 
                                                                value={formData.company}
                                                                onChange={e => setFormData({...formData, company: e.target.value})}
                                                                className="bg-secondary/50 border-border text-foreground h-11 rounded-xl focus:ring-primary"
                                                            />
                                                            <Input 
                                                                placeholder="Sector" 
                                                                value={formData.sector}
                                                                onChange={e => setFormData({...formData, sector: e.target.value})}
                                                                className="bg-secondary/50 border-border text-foreground h-11 rounded-xl focus:ring-primary"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-3 bg-secondary/30 p-4 rounded-xl border border-border">
                                                        <div className="flex items-start gap-3">
                                                            <Checkbox 
                                                                id="consent" 
                                                                checked={formData.consent}
                                                                onCheckedChange={(c) => setFormData({...formData, consent: c as boolean})}
                                                                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                                                            />
                                                            <label htmlFor="consent" className="text-[10px] font-medium leading-tight text-foreground/70">
                                                                I consent to be notified about the launch and future updates. *
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button 
                                                    type="submit" 
                                                    disabled={isSubmitting} 
                                                    className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground group shadow-xl shadow-primary/20"
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            {activeTab === 'rsvp' ? 'Submit RSVP' : 'Secure My Spot'}
                                                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                        </span>
                                                    )}
                                                </Button>
                                            </motion.form>
                                        </Tabs>
                                        
                                        <div className="text-[10px] text-center text-muted-foreground leading-relaxed pt-2">
                                            Information collected will only be used by Nissi Insights. Review our <a href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 flex flex-col items-center text-center space-y-4"
                                    >
                                        <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-2">
                                            <CheckCircle2 className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-3xl font-bold tracking-tight text-foreground">
                                            {activeTab === 'rsvp' ? 'RSVP Received' : 'Access Granted'}
                                        </h3>
                                        <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                                            {activeTab === 'rsvp' 
                                                ? "We've confirmed your status for the launch dinner. See you there!"
                                                : "You've been added to our exclusive list. Keep an eye on your email for the official launch."}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
            
        </div>
    )
}
