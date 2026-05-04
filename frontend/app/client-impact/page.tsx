"use client"

import React from 'react'
import { useApi } from "@/hooks/use-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ClientsSection from "@/components/sections/ClientsSection";
import CTABanner from "@/components/sections/CTABanner";
import VideoHero from "@/components/VideoHero";
import { getMediaUrl } from '@/lib/utils'
import CaseStudiesPreview from "@/components/sections/CaseStudiesPreview";
import { useSettings } from '@/hooks/use-settings'

export default function ClientImpactPage() {
    const { getSetting } = useSettings()

    const heroMedia = getMediaUrl(getSetting('hero_client_impact_media', '/assets/videos/hero/01-energy.mp4'))

    return (
        <main className="flex min-h-screen flex-col relative bg-background">
            <Navbar />
            <VideoHero 
                tagline="Client Impact"
                title="Results that build trust."
                subtitle="Delivering measurable results across global markets through strategic advisory and deep sector expertise."
                videoSrc={heroMedia.endsWith('.mp4') ? heroMedia : undefined}
                bgImage={!heroMedia.endsWith('.mp4') ? heroMedia : undefined}
            />
            <CaseStudiesPreview />
            <TestimonialsSection />
            <ClientsSection />
            <CTABanner />
            <Footer />
        </main>
    );
}

