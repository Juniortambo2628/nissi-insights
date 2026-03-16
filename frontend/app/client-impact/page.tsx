"use client"

import React from 'react'
import { useApi } from "@/hooks/use-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ClientsSection from "@/components/sections/ClientsSection";
import CTABanner from "@/components/sections/CTABanner";
import VideoHero from "@/components/VideoHero";
import CaseStudiesPreview from "@/components/sections/CaseStudiesPreview";

export default function ClientImpactPage() {
    const { data: settingsByGroup } = useApi('/settings')

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const heroMedia = getSetting('hero_client_impact_media', '/assets/videos/hero/01-energy.mp4')

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

