"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Calendar, Clock, Globe, Briefcase, CheckCircle2 } from 'lucide-react'

import { useApi } from '@/hooks/use-api'

import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'

export default function ConsultationPage() {
    const { data: settingsByGroup } = useApi('/settings')
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const heroMedia = getSetting('hero_consultation_media', 'https://cdn.pixabay.com/video/2016/11/28/6355-193847498_large.mp4')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        
        // Split name into first and last for the backend if needed, or send as is
        // The backend ConsultationRequestController.php expects first_name and last_name
        const fullName = formData.get('full_name') as string
        const [firstName = '', ...lastNameParts] = fullName.split(' ')
        const lastName = lastNameParts.join(' ') || '-'

        const data = {
            first_name: firstName,
            last_name: lastName,
            email: formData.get('email'),
            subject: formData.get('sector'), // Map sector to subject
            message: `Organisation: ${formData.get('company')}\nObjective: ${formData.get('objective')}\nTimeframe: ${formData.get('timeframe')}`,
        }

        try {
            setIsSubmitting(true)
            await api.post('/consultation-requests', data)
            toast({
                title: "Submission Received",
                description: "Your submission has been received. You will be contacted concerning your submission shortly. An email has been sent to the address indicated on the form confirming the same.",
            })
            form.reset()
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: err.response?.data?.message || "Something went wrong. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />

            <VideoHero
                tagline="Strategic Consultation"
                title="Secure your competitive <br />advantage."
                subtitle="Book a session with our advisory team to discuss market entry, risk mitigation, or strategic growth in focus sectors."
                videoSrc={heroMedia.endsWith('.mp4') ? heroMedia : undefined}
                bgImage={!heroMedia.endsWith('.mp4') ? heroMedia : undefined}
            />

            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/5 flex items-center justify-center rounded-none border border-primary/10 mx-auto mb-6">
                                    <Globe className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Global Expertise</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Advisors with deep experience across 40+ markets.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/5 flex items-center justify-center rounded-none border border-primary/10 mx-auto mb-6">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Confidentiality</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Secure, high-stakes dialogue focused on your objectives.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/5 flex items-center justify-center rounded-none border border-primary/10 mx-auto mb-6">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Sector Focus</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Specialists in Energy, Fintech, and Diplomacy.</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-8 md:p-12 shadow-xl shadow-slate-200/50 rounded-2xl">
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Request a Consultation</h2>
                                <p className="text-slate-500 max-w-2xl">Please provide some preliminary details so we can assign the most relevant specialist to your specific needs.</p>
                            </div>

                            <form className="space-y-10" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="full-name" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Full Name</Label>
                                        <Input 
                                            id="full-name" 
                                            name="full_name"
                                            required
                                            placeholder="Alexander Hamilton" 
                                            className="rounded-xl border-slate-300 bg-slate-50/50 h-14 focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Work Email</Label>
                                        <Input 
                                            id="email" 
                                            name="email"
                                            type="email" 
                                            required
                                            placeholder="a.hamilton@treasury.gov" 
                                            className="rounded-xl border-slate-300 bg-slate-50/50 h-14 focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="company" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Organisation</Label>
                                        <Input 
                                            id="company" 
                                            name="company"
                                            required
                                            placeholder="Entity Name" 
                                            className="rounded-xl border-slate-300 bg-slate-50/50 h-14 focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="sector" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Sector of interest</Label>
                                        <select 
                                            id="sector" 
                                            name="sector"
                                            required
                                            className="w-full h-14 px-4 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900"
                                        >
                                            <option value="" className="text-slate-900">Select a sector</option>
                                            <option className="text-slate-900">Renewable Energy</option>
                                            <option className="text-slate-900">Fintech & Digital Assets</option>
                                            <option className="text-slate-900">Sovereign Advisory</option>
                                            <option className="text-slate-900">Infrastructure & PPP</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="objective" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Primary Consultation Objective</Label>
                                    <textarea 
                                        id="objective" 
                                        name="objective"
                                        required
                                        placeholder="Briefly describe what you would like to achieve in this session..." 
                                        className="w-full min-h-[160px] px-4 py-3 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 items-end">
                                    <div className="space-y-3">
                                        <Label htmlFor="timeframe" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Preferred Timeframe</Label>
                                        <select 
                                            id="timeframe" 
                                            name="timeframe"
                                            required
                                            className="w-full h-14 px-4 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900"
                                        >
                                            <option className="text-slate-900">Urgent (Within 48 hours)</option>
                                            <option className="text-slate-900">Strategic Planning (Next 2 weeks)</option>
                                            <option className="text-slate-900">General Exploratory</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Button 
                                            size="lg" 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-14 rounded-xl font-bold text-sm uppercase tracking-[0.1em] bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 transition-all group"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Request Consultation Session'}
                                            {!isSubmitting && <Calendar className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-6">What to expect</h5>
                                <ul className="space-y-4">
                                    {[
                                        'Specialist matching based on your sector and geography.',
                                        'Initial 30-minute discovery session.',
                                        'Confidential needs assessment and capability overview.',
                                        'Strategic proposal for high-impact engagement.'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 border border-slate-100 flex flex-col justify-center">
                                <h4 className="font-bold text-slate-900 mb-2 italic">Prefer a direct line?</h4>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Our senior partners are available for priority discussions via our London office.</p>
                                <a href="tel:+442071234567" className="text-xl font-bold text-primary hover:underline transition-all">+44 (0) 20 7123 4567</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
