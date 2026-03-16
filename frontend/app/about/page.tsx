"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useApi } from '@/hooks/use-api'
import { ArrowRight, Linkedin, Zap, Landmark, Globe, Shield, Star, Award, Heart, Info, X } from 'lucide-react'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const availableIcons: Record<string, any> = {
    Shield, Globe, Zap, Landmark, Star, Award, Heart
}

export default function AboutPage() {
    const { data: settingsByGroup } = useApi('/settings')
    const { data: team } = useApi<any[]>('/team-members')
    const { data: values } = useApi<any[]>('/values')
    
    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const title = getSetting('about_title', 'Trusted intelligence for a complex world.')
    const tagline = getSetting('about_tagline', 'About Us')
    const story = getSetting('about_story', 'Nissi Insights provides strategic advisory and market intelligence to help decision-makers navigate the energy transition, financial technology, and international markets.')
    const heroImage = getSetting('hero_about_media', '/NI-Digital-Assets/international-diplomacy.jpg')
    const missionTitle = getSetting('about_mission_title', 'Connecting decision-makers with reliable intelligence.')
    const missionText1 = getSetting('about_mission_text1', 'We exist to bridge the gap between complexity and clarity. In markets defined by rapid change, regulatory uncertainty, and geopolitical risk, having the right intelligence at the right time is the difference between opportunity captured and opportunity lost.')
    const missionText2 = getSetting('about_mission_text2', 'Our advisory team brings together deep sector expertise, rigorous analytical frameworks, and a global network to deliver actionable intelligence that drives confident decision-making.')

    return (
        <main className="flex min-h-screen flex-col bg-background font-inter">
            <Navbar />

            <VideoHero
                tagline={tagline}
                title={title.replace(/\n/g, '<br />')}
                subtitle={story}
                videoSrc={heroImage.endsWith('.mp4') ? heroImage : undefined}
                bgImage={!heroImage.endsWith('.mp4') ? heroImage : undefined}
            />

            {/* Mission */}
            <section className="py-24 bg-card">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
                            <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">Our Mission</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 whitespace-pre-line">
                                {missionTitle}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                                {missionText1}
                            </p>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {missionText2}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            {values?.map((value, i) => {
                                const Icon = availableIcons[value.icon] || Shield
                                return (
                                    <div key={i} className="bg-secondary/30 border border-border/50 p-6">
                                        <Icon className="h-8 w-8 text-primary mb-4" />
                                        <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                                    </div>
                                )
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section id="team" className="py-24 bg-background border-t border-border/50">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
                        <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">Our Team</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Led by experienced professionals.
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Our team combines deep sector knowledge with proven advisory track records.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {team?.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-slate-100 p-8 text-center flex flex-col group relative"
                            >
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-900/20 mx-auto mb-6 flex items-center justify-center overflow-hidden border border-primary/10">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-primary/40">
                                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                                <span className="text-primary font-bold text-sm uppercase tracking-wider block mb-3">{member.role}</span>
                                
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1 px-2">
                                    {member.bio}
                                </p>

                                <div className="flex flex-col gap-4 mt-auto">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                                                <Info size={14} /> Read Full Bio
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[600px] bg-background p-0 overflow-hidden border-border/50 shadow-2xl">
                                            <div className="bg-primary/5 p-8 border-b border-border/50">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                                                        {member.image ? (
                                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-foreground">{member.name}</h2>
                                                        <p className="text-primary font-bold uppercase tracking-widest text-sm">{member.role}</p>
                                                        {member.linkedin && (
                                                            <a href={member.linkedin} target="_blank" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold mt-2">
                                                                <Linkedin size={14} /> View LinkedIn Profile
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-6">
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">About</h4>
                                                    <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                                                        {member.bio}
                                                    </p>
                                                </div>
                                                
                                                {member.qualifications && (
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">Professional Credentials</h4>
                                                        <p className="text-muted-foreground text-sm italic">{member.qualifications}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 bg-secondary/20 border-t border-border/50 flex justify-end">
                                               <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="rounded-none font-bold uppercase tracking-wider text-[10px] border-border/50">
                                                        Close Profile
                                                    </Button>
                                               </DialogTrigger>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-[#050a1a]">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Let&apos;s work together.</h2>
                    <p className="text-white/60 mb-8 max-w-lg mx-auto">
                        Whether you need strategic advisory, market intelligence, or sovereign engagement — we&apos;re ready to help.
                    </p>
                    <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-none" asChild>
                        <Link href="#contact">
                            Request a Consultation <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </main>
    )
}
