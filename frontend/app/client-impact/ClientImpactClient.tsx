"use client"

import React from 'react'
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ClientsSection from "@/components/sections/ClientsSection";
import CTABanner from "@/components/sections/CTABanner";
import VideoHero from "@/components/VideoHero";
import { getMediaUrl } from '@/lib/utils'
import CaseStudiesPreview from "@/components/sections/CaseStudiesPreview";
import { useSettings } from '@/hooks/use-settings'

export default function ClientImpactClient() {
    const { getSetting } = useSettings()

    const heroMedia = getMediaUrl(getSetting('hero_client_impact_media', '/assets/videos/hero/01-energy.mp4'))

    return (
        <>
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
        </>
    );
}
