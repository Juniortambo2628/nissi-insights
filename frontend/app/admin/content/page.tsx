"use client"

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Loader2, Layout, Zap, BarChart3, Film, FileText, Mail, Briefcase, Settings, Palette, Check } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import ImageUploader from '@/components/admin/ImageUploader'
import api from '@/lib/api'

// Section configuration — defines which fields are editable for each section
const sectionConfig = [
    {
        id: 'hero',
        title: 'Hero Section',
        description: 'Main landing page hero text and headlines.',
        icon: Layout,
        fields: [
            { key: 'hero_tagline', label: 'Tagline', type: 'text', placeholder: 'e.g. Trusted by governments...' },
            { key: 'hero_title_line1', label: 'Title Line 1', type: 'text', placeholder: 'e.g. Navigating' },
            { key: 'hero_rotating_words', label: 'Rotating Words (comma-separated)', type: 'text', placeholder: 'e.g. Complexity.,Uncertainty.,Volatility.' },
            { key: 'hero_title_line2', label: 'Title Line 2', type: 'text', placeholder: 'e.g. Empowering Change.' },
            { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Strategic advisory, market intelligence...' },
            { key: 'hero_home_video_1', label: 'Background Video 1', type: 'image', accept: ['.mp4'] },
            { key: 'hero_home_video_2', label: 'Background Video 2', type: 'image', accept: ['.mp4'] },
            { key: 'hero_home_video_3', label: 'Background Video 3', type: 'image', accept: ['.mp4'] },
        ],
    },
    {
        id: 'value_proposition',
        title: 'Three Pillars Section',
        description: 'The "Three Pillars of Trusted Intelligence" section.',
        icon: Zap,
        fields: [
            { key: 'vp_section_tagline', label: 'Section Tagline', type: 'text', placeholder: 'e.g. What We Do' },
            { key: 'vp_section_title', label: 'Section Title', type: 'text', placeholder: 'e.g. Three Pillars of Trusted Intelligence' },
            { key: 'vp_section_subtitle', label: 'Section Subtitle', type: 'textarea', placeholder: 'We connect decision-makers...' },
            { key: 'vp_energy_title', label: 'Energy: Title', type: 'text', placeholder: 'e.g. Energy Advisory' },
            { key: 'vp_energy_description', label: 'Energy: Description', type: 'textarea', placeholder: 'Describe energy advisory services...' },
            { key: 'vp_energy_stats', label: 'Energy: Stats', type: 'text', placeholder: 'e.g. $2B+ Assets Advised' },
            { key: 'vp_energy_tag', label: 'Energy: Tag', type: 'text', placeholder: 'e.g. Est. 2019' },
            { key: 'vp_energy_image', label: 'Energy: Background Image', type: 'image' },
            { key: 'vp_fintech_title', label: 'Fintech: Title', type: 'text', placeholder: 'e.g. Fintech Intelligence' },
            { key: 'vp_fintech_description', label: 'Fintech: Description', type: 'textarea', placeholder: 'Describe fintech services...' },
            { key: 'vp_fintech_stats', label: 'Fintech: Stats', type: 'text', placeholder: 'e.g. 50+ Market Reports' },
            { key: 'vp_fintech_tag', label: 'Fintech: Tag', type: 'text', placeholder: 'e.g. AI-Powered' },
            { key: 'vp_fintech_image', label: 'Fintech: Background Image', type: 'image' },
            { key: 'vp_diplomacy_title', label: 'Diplomacy: Title', type: 'text', placeholder: 'e.g. International Diplomacy' },
            { key: 'vp_diplomacy_description', label: 'Diplomacy: Description', type: 'textarea', placeholder: 'Describe diplomacy services...' },
            { key: 'vp_diplomacy_stats', label: 'Diplomacy: Stats', type: 'text', placeholder: 'e.g. 30+ Countries Served' },
            { key: 'vp_diplomacy_tag', label: 'Diplomacy: Tag', type: 'text', placeholder: 'e.g. Sovereign Advisory' },
            { key: 'vp_diplomacy_image', label: 'Diplomacy: Background Image', type: 'image' },
        ],
    },
    {
        id: 'stats',
        title: 'Stats Section',
        description: 'Key performance figures displayed on the homepage.',
        icon: BarChart3,
        fields: [
            { key: 'stats_tagline', label: 'Section Tagline', type: 'text', placeholder: 'e.g. By The Numbers' },
            { key: 'stats_title', label: 'Section Title', type: 'text', placeholder: 'e.g. Our Impact in Numbers' },
            { key: 'stats_background', label: 'Background Image', type: 'image' },
        ],
    },
    {
        id: 'cta',
        title: 'CTA Banner',
        description: 'The call-to-action banner section on the homepage.',
        icon: Zap,
        fields: [
            { key: 'cta_badge', label: 'Badge Text', type: 'text', placeholder: 'e.g. Ready to Start?' },
            { key: 'cta_title', label: 'Title', type: 'text', placeholder: 'e.g. Let us help you navigate complexity.' },
            { key: 'cta_subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Book a consultation with our team...' },
            { key: 'cta_background', label: 'Background Image', type: 'image' },
        ],
    },
    {
        id: 'about',
        title: 'About Page',
        description: 'Manage the mission, vision, and core narrative of Nissi Insights.',
        icon: FileText,
        fields: [
            { key: 'about_title', label: 'Page Title', type: 'text', placeholder: 'e.g. Intelligence for the Future' },
            { key: 'about_tagline', label: 'Page Tagline', type: 'text', placeholder: 'e.g. Our Mission & Vision' },
            { key: 'about_story', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Nissi Insights was founded...' },
            { key: 'hero_about_media', label: 'Hero Background Image/Video', type: 'image' },
            { key: 'about_purpose_tagline', label: 'Purpose Section Tagline', type: 'text', placeholder: 'e.g. Purpose & Direction' },
            { key: 'about_purpose_title', label: 'Purpose Section Title', type: 'text', placeholder: 'e.g. Our commitment to excellence...' },
            { key: 'about_purpose_text', label: 'Purpose Section Description', type: 'textarea', placeholder: 'Describe your purpose and strategic direction...' },
            { key: 'about_mission_title', label: 'Mission Title', type: 'text', placeholder: 'e.g. Our Mission' },
            { key: 'about_mission_text', label: 'Mission Text', type: 'textarea', placeholder: 'Describe your mission...' },
            { key: 'about_vision_title', label: 'Vision Title', type: 'text', placeholder: 'e.g. Our Vision' },
            { key: 'about_vision_text', label: 'Vision Text', type: 'textarea', placeholder: 'Describe your vision...' },
        ],
    },
    {
        id: 'contact',
        title: 'Contact Page',
        description: 'Update your contact details and location information.',
        icon: Mail,
        fields: [
            { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'info@nissi-insights.com' },
            { key: 'contact_phone', label: 'Phone Number', type: 'text', placeholder: '+44 20 7946 0000' },
            { key: 'contact_address', label: 'Office Address', type: 'textarea', placeholder: 'One Canary Wharf, London...' },
            { key: 'contact_map_url', label: 'Google Maps Embed URL', type: 'text', placeholder: 'https://www.google.com/maps/embed?...' },
        ],
    },
    {
        id: 'services',
        title: 'Services Section',
        description: 'Manage heading text and videos for the main services grid.',
        icon: Briefcase,
        fields: [
            { key: 'services_tagline', label: 'Section Tagline', type: 'text', placeholder: 'Our Services' },
            { key: 'services_title', label: 'Section Title', type: 'text', placeholder: 'Explore our portfolio' },
            { key: 'services_video_all', label: 'Video: All Categories', type: 'image', accept: ['.mp4'] },
            { key: 'services_video_energy', label: 'Video: Energy Advisory', type: 'image', accept: ['.mp4'] },
            { key: 'services_video_fintech', label: 'Video: Fintech', type: 'image', accept: ['.mp4'] },
            { key: 'services_video_diplomacy', label: 'Video: International Diplomacy', type: 'image', accept: ['.mp4'] },
        ],
    },
    {
        id: 'page_heroes',
        title: 'Page Hero Media',
        description: 'Background images or videos for each page hero section.',
        icon: Film,
        fields: [
            { key: 'hero_services_media', label: 'Services Page Hero', type: 'image' },
            { key: 'hero_case_studies_media', label: 'Case Studies Page Hero', type: 'image' },
            { key: 'hero_insights_media', label: 'Insights Page Hero', type: 'image' },
            { key: 'hero_events_media', label: 'Events Page Hero', type: 'image' },
            { key: 'hero_knowledge_base_media', label: 'Knowledge Base Page Hero', type: 'image' },
            { key: 'hero_client_impact_media', label: 'Client Impact Page Hero', type: 'image' },
            { key: 'hero_contact_media', label: 'Contact Page Hero', type: 'image' },
            { key: 'hero_consultation_media', label: 'Consultation Page Hero', type: 'image' },
            { key: 'hero_pillar_energy_advisory', label: 'Pillar: Energy Advisory Hero', type: 'image' },
            { key: 'hero_pillar_fintech', label: 'Pillar: Fintech Hero', type: 'image' },
            { key: 'hero_pillar_international_diplomacy', label: 'Pillar: International Diplomacy Hero', type: 'image' },
        ],
    },
    {
        id: 'branding',
        title: 'Branding & Navigation',
        description: 'Logos, favicon, and main navigation links.',
        icon: Palette,
        fields: [
            { key: 'logo_light', label: 'Logo (Light Mode)', type: 'image' },
            { key: 'logo_dark', label: 'Logo (Dark Mode)', type: 'image' },
            { key: 'favicon', label: 'Favicon', type: 'image' },
            { key: 'main_nav_links', label: 'Navigation Links (JSON)', type: 'textarea', placeholder: '[{"name":"Home","href":"/"},{"name":"Services","href":"/services"}]' },
        ],
    },
    {
        id: 'widgets',
        title: 'Widgets',
        description: 'WhatsApp button and AI chatbot configuration.',
        icon: Settings,
        fields: [
            { key: 'whatsapp_enabled', label: 'WhatsApp Enabled', type: 'text', placeholder: '1 or 0' },
            { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', placeholder: '+447000000000' },
            { key: 'whatsapp_message', label: 'WhatsApp Default Message', type: 'textarea', placeholder: 'Hello, I have a question...' },
            { key: 'nissi_assistant_enabled', label: 'AI Assistant Enabled', type: 'text', placeholder: '1 or 0' },
        ],
    },
]


const AdminContentPage = () => {
    const { data: settingsByGroup, mutate, isLoading } = useApi('/settings')
    const [formValues, setFormValues] = useState<Record<string, string>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [activeTab, setActiveTab] = useState('hero')

    // Flatten grouped settings into a key-value map
    useEffect(() => {
        if (settingsByGroup) {
            const flat: Record<string, string> = {}
            Object.values(settingsByGroup).forEach((group: any) => {
                group.forEach((s: any) => { flat[s.key] = s.value || '' })
            })
            setFormValues(flat)
        }
    }, [settingsByGroup])

    const handleChange = (key: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        setSaveSuccess(false)
        try {
            const activeSection = sectionConfig.find((s) => s.id === activeTab)
            if (!activeSection) return

            const settings = activeSection.fields.map((f) => ({
                key: f.key,
                value: formValues[f.key] || '',
                type: f.type === 'image' ? 'image' : 'text',
                group: activeSection.id,
            }))

            await api.put('/settings/batch', { settings })
            mutate()
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch {
            alert('Failed to save settings')
        } finally {
            setIsSaving(false)
        }
    }

    const activeSection = sectionConfig.find((s) => s.id === activeTab)

    return (
        <AdminLayout>
            <div className="space-y-8 pb-24">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
                    <p className="text-muted-foreground">Edit homepage section text, images, and hero backgrounds.</p>
                </div>

                {/* Active Section Editor */}
                {isLoading ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="bg-secondary/10 border border-border/50 rounded-xl h-[500px] flex flex-col">
                            <div className="p-6 border-b border-border/50 bg-secondary/5 space-y-2">
                                <div className="h-6 w-48 bg-secondary/20 rounded" />
                                <div className="h-4 w-64 bg-secondary/20 rounded" />
                            </div>
                            <div className="p-6 space-y-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="space-y-3">
                                        <div className="h-4 w-24 bg-secondary/20 rounded" />
                                        <div className="h-12 w-full bg-secondary/10 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : activeSection && (
                    <Card className="bg-secondary/10 border-border/50">
                        <CardHeader className="border-b border-border/50 bg-secondary/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <activeSection.icon size={20} />
                                </div>
                                <div>
                                    <CardTitle>{activeSection.title}</CardTitle>
                                    <CardDescription>{activeSection.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {activeSection.fields.map((field) => (
                                <div key={field.key}>
                                    {field.type === 'text' && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground/80">{field.label}</Label>
                                            <Input
                                                value={formValues[field.key] || ''}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="bg-background/50"
                                            />
                                        </div>
                                    )}
                                    {field.type === 'textarea' && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground/80">{field.label}</Label>
                                            <textarea
                                                value={formValues[field.key] || ''}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background/50 text-sm resize-y"
                                            />
                                        </div>
                                    )}
                                    {field.type === 'image' && (
                                        <ImageUploader
                                            label={field.label}
                                            value={formValues[field.key] || ''}
                                            onChange={(url) => handleChange(field.key, url)}
                                            accept={(field as any).accept}
                                            maxSizeMB={(field as any).accept?.includes('.mp4') ? 15 : 2}
                                        />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Section Context Switcher Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                <div className="bg-background/80 backdrop-blur-md border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {activeSection && <activeSection.icon size={18} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Section</p>
                            <Select
                                value={activeTab}
                                onValueChange={setActiveTab}
                            >
                                <SelectTrigger className="border-none bg-transparent p-0 h-auto shadow-none focus:ring-0 text-sm font-bold text-foreground">
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border max-h-[300px] overflow-y-auto">
                                    {sectionConfig.map((section) => (
                                        <SelectItem key={section.id} value={section.id}>
                                            <div className="flex items-center gap-2">
                                                <section.icon size={14} />
                                                {section.title}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-border/50" />
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block mr-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fields</p>
                            <p className="text-sm font-bold text-primary">{activeSection?.fields.length || 0}</p>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`gap-2 px-6 font-bold rounded-xl transition-all ${saveSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <Check size={16} /> : <Save size={16} />}
                            {saveSuccess ? 'Saved!' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminContentPage
