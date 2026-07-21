"use client"

import React, { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, RefreshCw, Globe, Palette, ShieldCheck, Mail, GripVertical, Plus, Trash2, Layout, Film, Image as ImageIcon, Rocket, ListOrdered } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/nissi-switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import api from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'
import { SiteSetting } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { Reorder } from 'framer-motion'
import { getMediaUrl } from '@/lib/utils'

const AdminSettingsPage = () => {
    const { data: settingsByGroup, mutate, isLoading } = useApi<Record<string, SiteSetting[]>>('/settings')
    const { toast } = useToast()
    const [localSettings, setLocalSettings] = useState<Record<string, string>>({})
    const [navLinks, setNavLinks] = useState<{id: string, name: string, href: string}[]>([])
    const [addresses, setAddresses] = useState<{label: string, address: string, phone: string, map_url: string}[]>([])
    const [isSavingAll, setIsSavingAll] = useState(false)

    // Sync local state when data loads
    React.useEffect(() => {
        if (settingsByGroup) {
            const flat: Record<string, string> = {}
            Object.values(settingsByGroup).forEach((group) => {
                group.forEach((s) => {
                    flat[s.key] = s.value || ''
                    if (s.key === 'main_nav_links') {
                        try {
                            const parsed = JSON.parse(s.value || '[]')
                            setNavLinks(parsed.map((l: any, i: number) => ({ 
                                ...l, 
                                id: l.id || `link-${i}-${Math.random().toString(36).substr(2, 9)}` 
                            })))
                        } catch (e) {
                            console.error("Failed to parse local nav links", e)
                        }
                    }
                    if (s.key === 'business_addresses') {
                        try {
                            setAddresses(JSON.parse(s.value || '[]'))
                        } catch (e) {
                            console.error("Failed to parse business addresses", e)
                        }
                    }
                })
            })
            setLocalSettings(flat)
        }
    }, [settingsByGroup])

    const heroSettingsList = [
        { key: 'hero_home_video_1', label: 'Home Hero Video 1', type: 'video' },
        { key: 'hero_home_video_2', label: 'Home Hero Video 2', type: 'video' },
        { key: 'hero_home_video_3', label: 'Home Hero Video 3', type: 'video' },
        { key: 'hero_services_media', label: 'Services Page Hero', type: 'media' },
        { key: 'hero_insights_media', label: 'Insights Page Hero', type: 'media' },
        { key: 'hero_case_studies_media', label: 'Case Studies Hero', type: 'media' },
        { key: 'hero_client_impact_media', label: 'Client Impact Hero', type: 'media' },
        { key: 'hero_contact_media', label: 'Contact Page Hero', type: 'media' },
        { key: 'hero_consultation_media', label: 'Consultation Hero', type: 'media' },
        { key: 'hero_pillar_energy_advisory', label: 'Pillar: Energy Advisory Hero', type: 'media' },
        { key: 'hero_pillar_fintech', label: 'Pillar: Fintech Hero', type: 'media' },
        { key: 'hero_pillar_international_diplomacy', label: 'Pillar: Diplomacy Hero', type: 'media' },
    ]

    const handleSaveAll = async () => {
        setIsSavingAll(true)
        try {
            const allSettings: SiteSetting[] = []
            if (settingsByGroup) {
                Object.values(settingsByGroup).forEach(group => {
                    allSettings.push(...group)
                })
            }

            const settingsToUpdate = Object.entries(localSettings).map(([key, value]) => {
                const original = allSettings.find(s => s.key === key)
                let finalValue = value
                
                if (key === 'main_nav_links') {
                    // Remove the temporary IDs before saving
                    finalValue = JSON.stringify(navLinks.map(({ id, ...rest }) => rest))
                }
                if (key === 'business_addresses') {
                    finalValue = JSON.stringify(addresses)
                }

                return {
                    key,
                    value: finalValue,
                    type: original?.type || 'text',
                    group: original?.group || 'general'
                }
            })

            await api.put('/settings/batch', { settings: settingsToUpdate })
            toast({
                title: "Settings Saved",
                description: "All configuration changes have been updated.",
            })
            mutate()
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.response?.data?.message || err.message || 'Failed to save settings',
            })
        } finally {
            setIsSavingAll(false)
        }
    }

    const groupIcons: Record<string, any> = {
        general: Globe,
        branding: Palette,
        security: ShieldCheck,
        contact: Mail,
        about: ShieldCheck,
        homepage: Globe,
        widgets: Palette,
        launch: Rocket
    }

    const renderSetting = (setting: SiteSetting) => (
        <div key={setting.id} className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={setting.key} className="text-sm font-semibold text-foreground/80">
                    {setting.key.split('_').join(' ').toUpperCase()}
                </Label>
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                    {setting.type}
                </span>
            </div>
            <div>
                {setting.type === 'image' || setting.type === 'file' || setting.key.includes('logo') || setting.key.includes('favicon') || setting.key.includes('image') ? (
                    <ImageUploader 
                        value={getMediaUrl(localSettings[setting.key] ?? setting.value ?? '')}
                        onChange={(url) => setLocalSettings((prev) => ({ ...prev, [setting.key]: url }))}
                        accept={setting.type === 'file' ? ['.pdf'] : undefined}
                        className="w-full"
                        label=""
                    />
                ) : setting.type === 'textarea' ? (
                    <Textarea 
                        id={setting.key}
                        value={localSettings[setting.key] ?? setting.value ?? ''}
                        onChange={(e) => setLocalSettings((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                        className="bg-background/50 min-h-[100px]"
                    />
                ) : setting.type === 'boolean' || setting.type === 'switch' ? (
                    <div className="flex items-center gap-2 pt-2">
                        <Switch 
                            id={setting.key}
                            checked={localSettings[setting.key] === '1' || localSettings[setting.key] === 'true'}
                            onCheckedChange={(checked: boolean) => setLocalSettings((prev) => ({ ...prev, [setting.key]: checked ? '1' : '0' }))}
                        />
                        <span className="text-xs text-muted-foreground">
                            {localSettings[setting.key] === '1' || localSettings[setting.key] === 'true' ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                ) : (
                    <Input 
                        id={setting.key}
                        value={localSettings[setting.key] ?? setting.value ?? ''}
                        onChange={(e) => setLocalSettings((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                        className="bg-background/50"
                    />
                )}
            </div>
        </div>
    )

    const settingsTabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'contact', label: 'Contact Details', icon: Mail },
        { id: 'launch', label: 'Launch', icon: Rocket },
        { id: 'hero-media', label: 'Page Hero Media', icon: Layout },
        { id: 'navigation', label: 'Navigation', icon: ListOrdered },
    ]

    const [activeSettingsTab, setActiveSettingsTab] = useState('general')

    const activeTabMeta = settingsTabs.find(t => t.id === activeSettingsTab)

    return (
        <AdminLayout>
            <div className="space-y-8 pb-24">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Site Settings</h1>
                        <p className="text-muted-foreground text-sm">Configure global variables, branding, and launch modes.</p>
                    </div>
                    <Button 
                        variant="outline" 
                        className="bg-transparent border-border hover:bg-secondary text-foreground" 
                        onClick={() => mutate()} 
                        disabled={isLoading}
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </Button>
                </div>

                {isLoading ? (
                    <div className="py-12 flex justify-center items-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {activeSettingsTab === 'general' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {['general'].map(group => {
                                    const settings = (settingsByGroup?.[group] || []).filter(s => s.key !== 'main_nav_links')
                                    if (settings.length === 0) return null
                                    const Icon = groupIcons[group] || Globe
                                    return (
                                        <Card key={group} className="bg-secondary/5 border-border shadow-sm">
                                            <CardHeader className="bg-secondary/10 border-b border-border pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                        <Icon size={18} />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-foreground capitalize text-lg">Global Settings</CardTitle>
                                                        <CardDescription className="text-muted-foreground text-xs">Manage site-wide variables and metadata.</CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6 space-y-6">
                                                {settings.map(renderSetting)}
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}

                        {activeSettingsTab === 'branding' && (
                            <div className="space-y-8">
                                <Card className="bg-secondary/5 border-border max-w-4xl">
                                    <CardHeader className="bg-secondary/10 border-b border-border">
                                        <CardTitle className="text-foreground">Brand Assets</CardTitle>
                                        <CardDescription className="text-muted-foreground">Manage your logos and favicons across the site.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {settingsByGroup?.['branding']?.map(renderSetting)}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-secondary/5 border-border max-w-4xl">
                                    <CardHeader className="bg-secondary/10 border-b border-border">
                                        <CardTitle className="text-foreground">Section Hero Images</CardTitle>
                                        <CardDescription className="text-muted-foreground">Background images for Events and Knowledge Base sections.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Events Page Hero</Label>
                                                <ImageUploader 
                                                    value={localSettings['hero_events_media'] || ''}
                                                    onChange={(url) => setLocalSettings(prev => ({ ...prev, hero_events_media: url }))}
                                                    label=""
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Knowledge Base Hero</Label>
                                                <ImageUploader 
                                                    value={localSettings['hero_knowledge_base_media'] || ''}
                                                    onChange={(url) => setLocalSettings(prev => ({ ...prev, hero_knowledge_base_media: url }))}
                                                    label=""
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeSettingsTab === 'contact' && (
                            <div className="space-y-8">
                                <Card className="bg-secondary/5 border-border max-w-4xl">
                                    <CardHeader className="bg-secondary/10 border-b border-border">
                                        <CardTitle className="text-foreground">Contact Information</CardTitle>
                                        <CardDescription className="text-muted-foreground">Global contact email and primary phone.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {settingsByGroup?.['contact']?.filter(s => s.key !== 'business_addresses').map(renderSetting)}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-secondary/5 border-border max-w-5xl">
                                    <CardHeader className="bg-secondary/10 border-b border-border">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-foreground">Business Addresses</CardTitle>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-9 px-4 text-xs font-bold gap-2 bg-background border-border text-foreground hover:bg-secondary"
                                                onClick={() => setAddresses([...addresses, { label: 'New Office', address: '', phone: '', map_url: '' }])}
                                            >
                                                <Plus size={14} /> Add Address
                                            </Button>
                                        </div>
                                        <CardDescription className="text-muted-foreground">Manage your global office locations.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            {addresses.map((addr, index) => (
                                                <div key={index} className="bg-secondary/10 border border-border p-6 rounded-xl space-y-4 group transition-all hover:border-primary/30">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Label (e.g. London Office)</Label>
                                                                <Input 
                                                                    value={addr.label} 
                                                                    onChange={(e) => {
                                                                        const newAddrs = [...addresses]
                                                                        newAddrs[index].label = e.target.value
                                                                        setAddresses(newAddrs)
                                                                    }}
                                                                    className="h-10 bg-background border-border text-foreground"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                                                                <Input 
                                                                    value={addr.phone} 
                                                                    onChange={(e) => {
                                                                        const newAddrs = [...addresses]
                                                                        newAddrs[index].phone = e.target.value
                                                                        setAddresses(newAddrs)
                                                                    }}
                                                                    className="h-10 bg-background border-border text-foreground"
                                                                />
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 h-10 w-10 ml-4"
                                                            onClick={() => setAddresses(addresses.filter((_, i) => i !== index))}
                                                        >
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Full Address</Label>
                                                            <Textarea 
                                                                value={addr.address} 
                                                                onChange={(e) => {
                                                                    const newAddrs = [...addresses]
                                                                    newAddrs[index].address = e.target.value
                                                                    setAddresses(newAddrs)
                                                                }}
                                                                className="bg-background border-border text-foreground min-h-[60px]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {addresses.length === 0 && (
                                                <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-xl">
                                                    <p className="text-muted-foreground">No addresses added yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeSettingsTab === 'launch' && (
                            <Card className="bg-secondary/5 border-border max-w-4xl">
                                <CardHeader className="bg-secondary/10 border-border border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                            <Rocket size={20} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-foreground">Launch Configuration</CardTitle>
                                            <CardDescription className="text-muted-foreground">Toggle pre-launch mode and customize the RSVP page.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/50">
                                        <div className="space-y-4">
                                            <Label className="text-sm font-bold text-foreground/80">RSVP BACKGROUND (LIGHT MODE)</Label>
                                            <ImageUploader 
                                                value={getMediaUrl(localSettings['rsvp_bg_light'] || '')}
                                                onChange={(url) => setLocalSettings(prev => ({ ...prev, rsvp_bg_light: url }))}
                                                label=""
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-sm font-bold text-foreground/80">RSVP BACKGROUND (DARK MODE)</Label>
                                            <ImageUploader 
                                                value={getMediaUrl(localSettings['rsvp_bg_dark'] || '')}
                                                onChange={(url) => setLocalSettings(prev => ({ ...prev, rsvp_bg_dark: url }))}
                                                label=""
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-sm font-bold text-foreground/80">RSVP DINNER MENU (PDF)</Label>
                                            <ImageUploader 
                                                value={getMediaUrl(localSettings['rsvp_menu_file'] || '')}
                                                onChange={(url) => setLocalSettings(prev => ({ ...prev, rsvp_menu_file: url }))}
                                                accept={['.pdf']}
                                                label=""
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {settingsByGroup?.['launch']
                                            ?.filter(s => !['rsvp_bg_light', 'rsvp_bg_dark', 'rsvp_polling_enabled'].includes(s.key))
                                            ?.map(renderSetting)}
                                    </div>
                                    <div className="pt-6 border-t border-border/50">
                                        {settingsByGroup?.['launch']
                                            ?.filter(s => s.key === 'rsvp_polling_enabled')
                                            ?.map(renderSetting)}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeSettingsTab === 'hero-media' && (
                            <Card className="bg-secondary/5 border-border">
                                <CardHeader className="bg-secondary/10 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <Layout size={20} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-foreground">Page Hero Media</CardTitle>
                                            <CardDescription className="text-muted-foreground">Customize hero images and videos for all main pages.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {heroSettingsList.map((hero) => (
                                            <div key={hero.key} className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{hero.label}</Label>
                                                    {hero.type === 'video' ? (
                                                        <Film size={14} className="text-muted-foreground/30" />
                                                    ) : (
                                                        <ImageIcon size={14} className="text-muted-foreground/30" />
                                                    )}
                                                </div>
                                                <ImageUploader 
                                                    value={localSettings[hero.key] || ''}
                                                    onChange={(url) => setLocalSettings(prev => ({ ...prev, [hero.key]: url }))}
                                                    accept={hero.type === 'video' ? ['.mp4'] : ['.jpg', '.jpeg', '.png', '.webp']}
                                                    label=""
                                                    className="w-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeSettingsTab === 'navigation' && (
                            <Card className="bg-secondary/5 border-border max-w-5xl">
                                <CardHeader className="bg-secondary/10 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                <ListOrdered size={20} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-foreground">Website Menu Management</CardTitle>
                                                <CardDescription className="text-muted-foreground">Select pages or enter custom paths to reorder the main menu.</CardDescription>
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-9 px-4 text-xs font-bold gap-2 bg-background border-border text-foreground hover:bg-secondary"
                                            onClick={() => setNavLinks([...navLinks, { id: `new-${Date.now()}`, name: 'New Link', href: '/' }])}
                                        >
                                            <Plus size={14} /> Add New Link
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Reorder.Group axis="y" values={navLinks} onReorder={setNavLinks} className="space-y-4">
                                        {navLinks.map((link, index) => (
                                            <Reorder.Item 
                                                key={link.id} 
                                                value={link}
                                                className="flex items-center gap-6 bg-secondary/10 border border-border p-4 rounded-xl cursor-grab active:cursor-grabbing group transition-all hover:border-primary/30"
                                            >
                                                <div className="text-muted-foreground/30 group-hover:text-primary transition-colors">
                                                    <GripVertical size={20} />
                                                </div>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Menu Label</Label>
                                                        <Input 
                                                            value={link.name} 
                                                            onChange={(e) => {
                                                                const newLinks = [...navLinks]
                                                                newLinks[index].name = e.target.value
                                                                setNavLinks(newLinks)
                                                            }}
                                                            className="h-10 bg-background border-border text-foreground"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Link Destination</Label>
                                                        <div className="flex gap-2">
                                                            <Select
                                                                value={['/', '/services', '/insights', '/events', '/knowledge-base', '/case-studies', '/about', '/contact', '/client-impact', '/consultation', '/pillars/energy-advisory', '/pillars/fintech', '/pillars/international-diplomacy'].includes(link.href) ? link.href : 'custom'}
                                                                onValueChange={(val) => {
                                                                    const newLinks = [...navLinks]
                                                                    if (val !== 'custom') {
                                                                        newLinks[index].href = val
                                                                        
                                                                        // Auto-fill label if it's currently a placeholder or empty
                                                                        const options: Record<string, string> = {
                                                                            '/': 'Home',
                                                                            '/services': 'Services',
                                                                            '/insights': 'Insights',
                                                                            '/events': 'Events',
                                                                            '/knowledge-base': 'Knowledge Hub',
                                                                            '/case-studies': 'Case Studies',
                                                                            '/about': 'About Us',
                                                                            '/contact': 'Contact',
                                                                            '/client-impact': 'Client Impact',
                                                                            '/consultation': 'Consultation',
                                                                            '/pillars/energy-advisory': 'Energy Advisory',
                                                                            '/pillars/fintech': 'Fintech',
                                                                            '/pillars/international-diplomacy': 'Diplomacy'
                                                                        }
                                                                        
                                                                        if (!newLinks[index].name || newLinks[index].name === 'New Link') {
                                                                            newLinks[index].name = options[val] || newLinks[index].name
                                                                        }
                                                                    }
                                                                    setNavLinks(newLinks)
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-10 bg-background border-border text-foreground flex-1">
                                                                    <SelectValue placeholder="Select Page" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-background border-border text-foreground">
                                                                    <SelectItem value="/">Home Page</SelectItem>
                                                                    <SelectItem value="/services">Services Page</SelectItem>
                                                                    <SelectItem value="/insights">Insights Page</SelectItem>
                                                                    <SelectItem value="/events">Events Page</SelectItem>
                                                                    <SelectItem value="/knowledge-base">Knowledge Hub</SelectItem>
                                                                    <SelectItem value="/case-studies">Case Studies Page</SelectItem>
                                                                    <SelectItem value="/about">About Us Page</SelectItem>
                                                                    <SelectItem value="/contact">Contact Page</SelectItem>
                                                                    <SelectItem value="/client-impact">Client Impact</SelectItem>
                                                                    <SelectItem value="/consultation">Consultation</SelectItem>
                                                                    <SelectItem value="/pillars/energy-advisory">Pillar: Energy Advisory</SelectItem>
                                                                    <SelectItem value="/pillars/fintech">Pillar: Fintech</SelectItem>
                                                                    <SelectItem value="/pillars/international-diplomacy">Pillar: International Diplomacy</SelectItem>
                                                                    <SelectItem value="custom">Custom Path...</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            
                                                            {(!['/', '/services', '/insights', '/events', '/knowledge-base', '/case-studies', '/about', '/contact', '/client-impact', '/consultation', '/pillars/energy-advisory', '/pillars/fintech', '/pillars/international-diplomacy'].includes(link.href)) && (
                                                                <Input 
                                                                    value={link.href} 
                                                                    onChange={(e) => {
                                                                        const newLinks = [...navLinks]
                                                                        newLinks[index].href = e.target.value
                                                                        setNavLinks(newLinks)
                                                                    }}
                                                                    className="h-10 bg-background border-border text-foreground flex-1"
                                                                    placeholder="/custom-path"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                                                    onClick={() => setNavLinks(navLinks.filter((_, i) => i !== index))}
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>

            {/* Settings Context Switcher Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                <div className="bg-background/80 backdrop-blur-md border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {activeTabMeta && <activeTabMeta.icon size={18} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Section</p>
                            <Select
                                value={activeSettingsTab}
                                onValueChange={setActiveSettingsTab}
                            >
                                <SelectTrigger className="border-none bg-transparent p-0 h-auto shadow-none focus:ring-0 text-sm font-bold text-foreground">
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border max-h-[300px] overflow-y-auto">
                                    {settingsTabs.map((tab) => (
                                        <SelectItem key={tab.id} value={tab.id}>
                                            <div className="flex items-center gap-2">
                                                <tab.icon size={14} />
                                                {tab.label}
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
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Section</p>
                            <p className="text-sm font-bold text-primary">{settingsTabs.findIndex(t => t.id === activeSettingsTab) + 1}/{settingsTabs.length}</p>
                        </div>
                        <Button 
                            onClick={handleSaveAll}
                            disabled={isSavingAll || isLoading}
                            className={`gap-2 px-6 font-bold rounded-xl transition-all ${isSavingAll ? '' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {isSavingAll ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSavingAll ? 'Saving...' : 'Save All'}
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminSettingsPage
