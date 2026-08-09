"use client"

import React from 'react'
import { useApi } from '@/hooks/use-api'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import VideoHero from '@/components/VideoHero'
import { useSettings } from '@/hooks/use-settings'
import { getMediaUrl } from '@/lib/utils'

export default function PillarsClient() {
    const { data: pillars, isLoading } = useApi('/pillars')
    const { getSetting } = useSettings()

    const heroImage = getMediaUrl(getSetting('hero_services_media', '/NI-Digital-Assets/financial-technology.jpg'))

    if (isLoading) {
        return (
            <main className="flex-1 bg-background pt-32 pb-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="h-12 w-1/2 bg-foreground/10 animate-pulse mb-16" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-secondary/10 border border-border/20 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <>
            <VideoHero
                tagline="Our Pillars"
                title="Three pillars of <span class='text-primary'>strategic advisory</span>."
                subtitle="Each pillar represents a deep domain of expertise, interconnected to deliver comprehensive solutions for complex markets."
                bgImage={heroImage}
            />

            <main className="flex-1 bg-background pb-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="pt-24" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pillars?.map((pillar: any, index: number) => (
                            <motion.div
                                key={pillar.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <Link
                                    href={`/pillars/${pillar.slug}`}
                                    className="group block bg-secondary/5 border border-border/30 rounded-xl p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                                        {pillar.title}
                                    </h2>
                                    {pillar.overview && (
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">
                                            {pillar.overview}
                                        </p>
                                    )}
                                    {pillar.services && pillar.services.length > 0 && (
                                        <div className="mb-6">
                                            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                                                Services
                                            </p>
                                            <ul className="space-y-1.5">
                                                {pillar.services.slice(0, 4).map((service: any) => (
                                                    <li key={service.id} className="text-sm text-muted-foreground">
                                                        {service.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <span className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                                        Explore <ArrowRight className="h-4 w-4" />
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}
