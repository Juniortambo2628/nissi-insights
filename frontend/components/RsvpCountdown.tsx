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
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface RsvpCountdownProps {
    date: string
    title: string
    description: string
    media: string
}

export default function RsvpCountdown({ date, title, description, media }: RsvpCountdownProps) {
    const { toast } = useToast()
    const { theme } = useTheme()
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isMounted, setIsMounted] = useState(false)
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        job_title: '',
        sector: '',
        interest: '',
        consent: false,
        newsletter: false
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
            await api.post('/rsvps', formData)
            setIsSuccess(true)
            toast({
                title: 'Access Requested',
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
    const bgMedia = media === '/assets/videos/hero.mp4' 
        ? 'https://assets.mixkit.co/videos/preview/mixkit-abstract-light-streaks-running-through-a-black-background-4074-large.mp4' 
        : media

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
                            theme === 'dark' ? "opacity-60" : "opacity-30"
                        )}
                    />
                ) : (
                    <div 
                        className={cn(
                            "w-full h-full bg-cover bg-center scale-105 transition-transform duration-10000",
                            theme === 'dark' ? "opacity-60" : "opacity-30"
                        )}
                        style={{ backgroundImage: `url(${bgMedia})` }}
                    />
                )}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-tr",
                    theme === 'dark' 
                        ? "from-black/90 via-black/60 to-transparent" 
                        : "from-background/95 via-background/70 to-transparent"
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs uppercase tracking-widest font-semibold text-primary">
                            Target Launch: {format(new Date(date), 'MMMM do, yyyy')}
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                        {title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        {description}
                    </p>

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
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        <div className="flex justify-center mb-8">
                                            <img 
                                                src={theme === 'dark' ? "/logos/nissi-landscape-black.png" : "/logos/nissi-landscape-white.png"} 
                                                alt="Nissi Insights" 
                                                className="h-[45px] object-contain" 
                                            />
                                        </div>
                                        
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold mb-1 text-foreground">Request Early Access</h3>
                                            <p className="text-xs text-muted-foreground mb-4">Join the exclusive waitlist for the launch.</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
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
                                                    placeholder="Work Email" 
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl focus:ring-primary"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input 
                                                    placeholder="Organization" 
                                                    value={formData.company}
                                                    onChange={e => setFormData({...formData, company: e.target.value})}
                                                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl focus:ring-primary"
                                                />
                                                <Input 
                                                    placeholder="Position/Designation" 
                                                    value={formData.job_title}
                                                    onChange={e => setFormData({...formData, job_title: e.target.value})}
                                                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl focus:ring-primary"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 pt-1">
                                                <Select value={formData.sector} onValueChange={(val) => setFormData({...formData, sector: val})}>
                                                    <SelectTrigger className="bg-secondary/50 border-border text-foreground h-11 rounded-xl focus:ring-primary">
                                                        <SelectValue placeholder="Professional Sector" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-background border-border text-foreground">
                                                        <SelectItem value="energy">Energy & Utilities</SelectItem>
                                                        <SelectItem value="finance">Finance & Investment</SelectItem>
                                                        <SelectItem value="government">Government & Policy</SelectItem>
                                                        <SelectItem value="consulting">Consulting & Advisory</SelectItem>
                                                        <SelectItem value="technology">Technology & SaaS</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Select value={formData.interest} onValueChange={(val) => setFormData({...formData, interest: val})}>
                                                    <SelectTrigger className="bg-secondary/50 border-border text-foreground h-11 rounded-xl focus:ring-primary">
                                                        <SelectValue placeholder="Area of Interest" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-background border-border text-foreground">
                                                        <SelectItem value="advisory">Energy Advisory</SelectItem>
                                                        <SelectItem value="due_diligence">Due Diligence</SelectItem>
                                                        <SelectItem value="rtm">Route to Market Strategy</SelectItem>
                                                        <SelectItem value="general">General Updates</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-3 bg-secondary/30 p-4 rounded-xl border border-border">
                                                <div className="flex items-start gap-3">
                                                    <Checkbox 
                                                        id="consent" 
                                                        checked={formData.consent}
                                                        onCheckedChange={(c) => setFormData({...formData, consent: c as boolean})}
                                                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <label htmlFor="consent" className="text-xs font-medium leading-tight text-foreground/90">
                                                            I consent to be notified when the website goes live. *
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Checkbox 
                                                        id="newsletter" 
                                                        checked={formData.newsletter}
                                                        onCheckedChange={(c) => setFormData({...formData, newsletter: c as boolean})}
                                                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <label htmlFor="newsletter" className="text-xs font-medium leading-tight text-foreground/90">
                                                            Subscribe to the Nissi Insights newsletter.
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground group"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Secure My Spot
                                                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                </span>
                                            )}
                                        </Button>
                                        <div className="text-[10px] text-center text-muted-foreground leading-relaxed pt-2">
                                            Information collected will only be used to improve the delivery of services and will not be shared with third parties for any reason. Please review our <a href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                                        </div>
                                    </motion.form>
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
                                        <h3 className="text-3xl font-bold tracking-tight text-foreground">Access Granted</h3>
                                        <p className="text-muted-foreground text-sm">
                                            You've been added to our exclusive list. Keep an eye on your email for the official platform initialization.
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
