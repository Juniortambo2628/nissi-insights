"use client"

import React from 'react'
import { useApi } from '@/hooks/use-api'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Landmark, Globe } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import ViewToggle, { ViewMode } from '@/components/ViewToggle'

const categoryMeta: Record<string, { icon: any; color: string; gradient: string; description: string }> = {
    'Energy Advisory': {
        icon: Zap,
        color: 'text-cyan-400',
        gradient: 'from-blue-500 to-cyan-400',
        description: 'Comprehensive advisory across due diligence, commercial strategy, route-to-market, legal & policy, transaction support, and market intelligence for the energy sector.',
    },
    'Fintech': {
        icon: Landmark,
        color: 'text-emerald-400',
        gradient: 'from-emerald-500 to-teal-400',
        description: 'Strategic advisory for financial technology companies covering commercial model design, go-to-market, regulatory compliance, capital raising, and M&A support.',
    },
    'International Diplomacy': {
        icon: Globe,
        color: 'text-purple-400',
        gradient: 'from-violet-500 to-purple-400',
        description: 'Enabling sovereign engagement, cross-border deals, geopolitical risk management, and reputation positioning for governments and multinationals.',
    },
}


import VideoHero from '@/components/VideoHero'

export default function ServicesIndexPage() {
    const { data: settingsByGroup } = useApi('/settings')
    const { data: services, isLoading } = useApi('/services')
    const [viewMode, setViewMode] = React.useState<ViewMode>('grid')

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const heroMedia = getSetting('hero_services_media', '/NI-Digital-Assets/financial-technology.jpg')

    const categories = Object.keys(categoryMeta)

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />

            <VideoHero 
                tagline="Our Services"
                title="Advisory services built <br />for complex markets."
                subtitle="We provide trusted strategic advisory across three core pillars, connecting decision-makers with the intelligence needed to unlock value."
                videoSrc={heroMedia.endsWith('.mp4') ? heroMedia : undefined}
                bgImage={!heroMedia.endsWith('.mp4') ? heroMedia : undefined}
            />

            <section className="bg-background py-10 border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex justify-center mt-4">
                        <ViewToggle mode={viewMode} onChange={setViewMode} label="Services View" />
                    </div>
                </div>
            </section>

            {/* Category Sections */}
            {categories.map((category, catIndex) => {
                const meta = categoryMeta[category]
                const Icon = meta.icon
                const categoryServices = services?.filter((s: any) => s.category === category) || []
                const isEven = catIndex % 2 === 0

                return (
                    <section
                        key={category}
                        className={`py-24 ${isEven ? 'bg-secondary/20' : 'bg-background'}`}
                    >
                        <div className="max-w-[1400px] mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row items-start gap-8 mb-16"
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 shadow-lg shadow-black/10`}>
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{category}</h2>
                                    <p className="text-muted-foreground max-w-2xl leading-relaxed">{meta.description}</p>
                                </div>
                            </motion.div>

                            <div className={cn(
                                "grid gap-8",
                                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                            )}>
                                {categoryServices.map((service: any, index: number) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                    >
                                        <Link
                                            href={`/services/${service.slug}`}
                                            className={cn(
                                                "block group border border-border/50 transition-all duration-300",
                                                viewMode === 'grid' 
                                                    ? "bg-card p-8 h-full hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1" 
                                                    : "bg-card/50 p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-card hover:border-primary/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex-1 min-w-0",
                                                viewMode === 'list' && "md:flex md:items-center md:gap-8"
                                            )}>
                                                <div className={cn(viewMode === 'list' && "md:min-w-[300px]")}>
                                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors truncate">
                                                        {service.title}
                                                    </h3>
                                                    {viewMode === 'list' && (
                                                        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded mb-3 md:mb-0">
                                                            {category}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={cn(
                                                    "text-muted-foreground text-sm leading-relaxed transition-colors group-hover:text-foreground",
                                                    viewMode === 'grid' ? "line-clamp-3 mb-6" : "flex-1 line-clamp-2 md:line-clamp-1 mb-4 md:mb-0"
                                                )}>
                                                    {service.description}
                                                </p>
                                            </div>
                                            <span className={cn(
                                                "text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2 shrink-0",
                                                viewMode === 'list' && "md:ml-auto"
                                            )}>
                                                Learn More
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {categoryServices.length === 0 && !isLoading && (
                                <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border/50">
                                    Services for this category are being finalised.
                                </div>
                            )}
                        </div>
                    </section>
                )
            })}

            <Footer />
        </main>
    )
}
