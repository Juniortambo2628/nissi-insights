"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Breadcrumbs from './Breadcrumbs'

interface VideoHeroProps {
    tagline: string
    title: string
    subtitle: string
    videoSrc?: string
    bgImage?: string
}

const VideoHero = ({ tagline, title, subtitle, videoSrc, bgImage }: VideoHeroProps) => {
    return (
        <section className="relative pt-32 pb-24 min-h-[420px] overflow-hidden">
            {/* Background Asset */}
            <div className="absolute inset-0 z-0 bg-background">
                {videoSrc && (
                    <motion.video
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </motion.video>
                )}
                
                {bgImage && !videoSrc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    />
                )}
                
                <div className="absolute inset-0 bg-background/80" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/90" />
            </div>

            {/* Dot Grid */}
            <div className="absolute inset-0 z-[1] opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '48px 48px',
                }} />

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center pt-10">
                <div className="flex justify-center flex-col items-center">
                    <Breadcrumbs />
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
                        {tagline}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" dangerouslySetInnerHTML={{ __html: title }} />
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                    <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-8" />
                </motion.div>
            </div>
        </section>
    )
}

export default VideoHero
