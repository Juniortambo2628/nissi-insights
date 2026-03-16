"use client"

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, Mail } from 'lucide-react'
import Link from 'next/link'
import { useApi } from '@/hooks/use-api'


const CTABanner = () => {
    const { data: settingsByGroup } = useApi('/settings')
    const { scrollY } = useScroll()
    const backgroundY = useTransform(scrollY, [0, 5000], [0, -60])

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const badgeText = getSetting('cta_badge', 'Limited availability — book your slot')
    const title = getSetting('cta_title', 'Ready to unlock your\nstrategic advantage?')
    const subtitle = getSetting('cta_subtitle', 'Whether you need due diligence, market intelligence, or sovereign engagement — our advisory team is ready.')
    const backgroundImage = getSetting('cta_background', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')

    return (
        <section className="w-full relative overflow-hidden">
            {/* Parallax Background */}
            <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
                <Image
                    src={backgroundImage}
                    alt="Modern architecture"
                    fill
                    sizes="100vw"
                    className="object-cover scale-110"
                />
            </motion.div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/90 via-blue-700/85 to-blue-900/90 z-[1]" />

            {/* Dot Pattern */}
            <div className="absolute top-0 left-0 w-full h-full z-[1] opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }} />

            <div className="max-w-[1400px] mx-auto px-6 py-28 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-white/90 text-sm font-medium">{badgeText}</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 whitespace-pre-line">
                        {title}
                    </h2>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto mb-14 leading-relaxed">
                        {subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Button
                            size="lg"
                            className="h-14 px-10 text-base font-bold rounded-none bg-white text-primary hover:bg-white/90 transition-all hover:scale-[1.03] active:scale-[0.98] group shadow-2xl"
                            asChild
                        >
                            <Link href="/consultation">
                                Book a Consultation
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-10 text-base font-bold rounded-none border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all group"
                        >
                            <Download className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                            Download Free Report
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            className="h-14 px-10 text-base font-bold rounded-none text-white/80 hover:text-white hover:bg-white/20 transition-all"
                        >
                            <Mail className="mr-2 h-5 w-5" />
                            Subscribe
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}


export default CTABanner
