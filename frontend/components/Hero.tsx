"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download } from 'lucide-react'
import { useApi } from '@/hooks/use-api'

const Hero = () => {
    const { data: settingsByGroup } = useApi('/settings')
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 800], [0, 200])
    const opacity = useTransform(scrollY, [0, 600], [1, 0])
    const scale = useTransform(scrollY, [0, 600], [1, 1.1])

    const [currentWord, setCurrentWord] = useState(0)
    const [videoIndex, setVideoIndex] = useState(0)
    
    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const videos = [
        getSetting('hero_home_video_1', '/assets/videos/hero/01-energy.mp4'),
        getSetting('hero_home_video_2', '/assets/videos/hero/02-fintech.mp4'),
        getSetting('hero_home_video_3', '/assets/videos/hero/03-diplomacy.mp4')
    ]

    const handleVideoEnd = () => {
        setVideoIndex((prev) => (prev + 1) % videos.length)
    }


    const tagline = getSetting('hero_tagline', 'Trusted by governments, institutions & investors globally')
    const titleLine1 = getSetting('hero_title_line1', 'Navigating')
    const titleLine2 = getSetting('hero_title_line2', 'Empowering Change.')
    const subtitle = getSetting('hero_subtitle', 'Strategic advisory, market intelligence & due diligence across energy, fintech & sovereign markets.')
    const rotatingWords = getSetting('hero_rotating_words', 'Complexity.,Uncertainty.,Volatility.').split(',')

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % rotatingWords.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [rotatingWords.length])

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Full-screen Background Video with Parallax + Zoom on Scroll */}
            <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
                <AnimatePresence mode="wait">
                    <motion.video
                        key={videoIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={videos[videoIndex]} type="video/mp4" />
                    </motion.video>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1)_0%,transparent_70%)]" />
            </motion.div>


            {/* Dot Grid */}
            <div className="absolute inset-0 z-[1] opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '60px 60px',
                }} />

            {/* Content */}
            <motion.div className="container relative z-10 mx-auto px-6 pt-32 pb-20" style={{ opacity }}>
                <div className="max-w-5xl mx-auto text-center">
                    {/* Pill Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-foreground/10 backdrop-blur-md border border-foreground/20 rounded-full px-6 py-2 mb-10"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-foreground/80 text-sm font-medium">{tagline}</span>
                    </motion.div>

                    {/* Headline with Rotating Word */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05] text-foreground"
                    >
                        {titleLine1}<br />
                        <span className="relative inline-block min-w-[280px] md:min-w-[400px]">
                            <motion.span
                                key={currentWord}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-300"
                            >
                                {rotatingWords[currentWord]}
                            </motion.span>
                        </span>
                        <br />
                        {titleLine2}
                    </motion.h1>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="w-32 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"
                    />

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-xl md:text-2xl text-foreground/60 mb-14 font-medium max-w-3xl mx-auto leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5"
                    >
                        <Button
                            size="lg"
                            className="h-14 px-10 text-base font-bold rounded-none bg-primary hover:bg-primary/90 text-white border-none transition-all hover:scale-[1.03] active:scale-[0.98] group shadow-xl shadow-primary/20"
                            asChild
                        >
                            <Link href="/services">
                                Explore Our Services
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-10 text-base font-bold rounded-none border-foreground/20 text-foreground hover:bg-foreground/10 backdrop-blur-sm transition-all group"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            Download Free Report
                        </Button>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="mt-20"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-foreground/30 text-xs uppercase tracking-widest">Scroll to explore</span>
                            <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center pt-2">
                                <motion.div
                                    animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 bg-primary rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default Hero
