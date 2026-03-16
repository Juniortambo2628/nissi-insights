"use client"

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApi } from '@/hooks/use-api'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
    const { data: settingsByGroup } = useApi('/settings')
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const contactEmail = getSetting('contact_email', 'advisory@nissi-insights.com')
    const contactPhone = getSetting('contact_phone', '+44 (0) 20 7123 4567')
    const contactAddress = getSetting('contact_address', 'Level 32, One Canada Square\nCanary Wharf, London, E14 5AB')
    const mapUrl = getSetting('contact_map_url', 'https://www.google.com/maps/embed?...')

    const heroMedia = getSetting('hero_contact_media', 'https://cdn.pixabay.com/video/2019/02/10/21262-316279619_large.mp4')

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />

            <VideoHero
                tagline="Get in Touch"
                title="Let's discuss your <br />next strategic move."
                subtitle="Whether you have a specific inquiry or just want to explore how we can help, our team is ready to connect."
                videoSrc={heroMedia.endsWith('.mp4') ? heroMedia : undefined}
                bgImage={!heroMedia.endsWith('.mp4') ? heroMedia : undefined}
            />

            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">Contact Information</h2>
                            <p className="text-slate-500 mb-12 leading-relaxed max-w-md">
                                Our advisory teams are strategically located to serve global markets. Reach out directly or fill out the form, and a sector specialist will get back to you within 24 hours.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/5 flex items-center justify-center rounded-none border border-primary/10 shrink-0">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                                        <p className="text-slate-500">{contactEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/5 flex items-center justify-center rounded-none border border-primary/10 shrink-0">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                                        <p className="text-slate-500">{contactPhone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/5 flex items-center justify-center rounded-none border border-primary/10 shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Headquarters</h4>
                                        <p className="text-slate-500 whitespace-pre-line">{contactAddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 p-8 bg-slate-50 border border-slate-100 italic text-slate-500 flex items-start gap-4">
                                <MessageSquare className="h-6 w-6 text-primary shrink-0 opacity-50" />
                                <p>"Nissi Insights provided the clarity we needed during a critical transition. Their responsiveness and expertise are world-class."</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-slate-200 p-8 md:p-12 shadow-xl shadow-slate-200/50 rounded-2xl"
                        >
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Send a Message</h2>
                                <p className="text-slate-500">Please provide your details and inquiry below.</p>
                            </div>

                            <form 
                                className="space-y-8"
                                onSubmit={async (e) => {
                                    e.preventDefault()
                                    const form = e.target as HTMLFormElement
                                    const formData = new FormData(form)
                                    const data = {
                                        first_name: formData.get('first_name'),
                                        last_name: formData.get('last_name'),
                                        email: formData.get('email'),
                                        subject: formData.get('subject'),
                                        message: formData.get('message'),
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
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="first_name" className="text-sm font-bold text-slate-900 uppercase tracking-tight">First Name</Label>
                                        <Input 
                                            id="first_name" 
                                            name="first_name" 
                                            required 
                                            placeholder="John" 
                                            className="rounded-xl border-slate-300 bg-slate-50/50 h-14 focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="last_name" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Last Name</Label>
                                        <Input 
                                            id="last_name" 
                                            name="last_name" 
                                            required 
                                            placeholder="Doe" 
                                            className="rounded-xl border-slate-300 bg-slate-50/50 h-14 focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Work Email</Label>
                                    <Input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        required 
                                        placeholder="john.doe@company.com" 
                                        className="rounded-xl border-slate-300 bg-slate-50/50 h-14 focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="subject" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Subject</Label>
                                    <select 
                                        id="subject" 
                                        name="subject" 
                                        required
                                        className="w-full h-14 px-4 py-2 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900"
                                    >
                                        <option value="">Select an inquiry type</option>
                                        <option>Energy Advisory Inquiry</option>
                                        <option>Fintech Strategy</option>
                                        <option>International Diplomacy</option>
                                        <option>Market Intelligence</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="message" className="text-sm font-bold text-slate-900 uppercase tracking-tight">Message</Label>
                                    <textarea 
                                        id="message" 
                                        name="message"
                                        required
                                        placeholder="How can we help you?" 
                                        className="w-full min-h-[160px] px-4 py-3 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>

                                <Button 
                                    size="lg" 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 transition-all group"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    {!isSubmitting && <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                                </Button>

                                <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
                                    By submitting this form, you agree to our privacy policy.
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
