"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import SearchDialog from './SearchDialog'
import { ThemeToggle } from './ThemeToggle'
import { useApi } from '@/hooks/use-api'
import { useTheme } from 'next-themes'

const Navbar = () => {
    const { theme } = useTheme()
    const { data: services } = useApi('/services')
    const { data: settingsByGroup } = useApi('/settings')
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const logoWhiteBg = getSetting('logo_light', '/logos/nissi-landscape-white.png')
    const logoBlackBg = getSetting('logo_dark', '/logos/nissi-landscape-black.png')
    
    // Stabilize logo for hydration
    const [logo, setLogo] = useState(logoWhiteBg)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            setLogo(theme === 'light' ? logoWhiteBg : logoBlackBg)
        }
    }, [theme, mounted, logoWhiteBg, logoBlackBg])
    const navLinksJson = getSetting('main_nav_links', '[]')
    
    const navLinks = React.useMemo(() => {
        try {
            if (navLinksJson) {
                if (typeof navLinksJson === 'string') {
                    const parsed = JSON.parse(navLinksJson)
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed
                } else if (Array.isArray(navLinksJson)) {
                    return navLinksJson
                }
            }
        } catch (e) {
            console.error("Failed to parse nav links", e)
        }
        return [
            { name: 'Insights', href: '/insights' },
            { name: 'Case Studies', href: '/case-studies' },
            { name: 'Client Impact', href: '/client-impact' },
            { name: 'About', href: '/about' },
            { name: 'Contact', href: '/contact' },
        ]
    }, [navLinksJson])

    // Group services by Pillar for mega menu
    const dynamicServiceCategories = React.useMemo(() => {
        if (!services || !Array.isArray(services)) return []
        
        const pillarGroups: Record<number, { title: string, href: string, items: any[] }> = {}
        const legacyCategories: Record<string, any[]> = {}

        services.forEach((s: any) => {
            if (s.pillar) {
                const p = s.pillar
                if (!pillarGroups[p.id]) {
                    pillarGroups[p.id] = {
                        title: p.title,
                        href: `/pillars/${p.slug}`,
                        items: []
                    }
                }
                pillarGroups[p.id].items.push({ name: s.title, href: `/services/${s.slug}` })
            } else {
                if (!legacyCategories[s.category]) {
                    legacyCategories[s.category] = []
                }
                legacyCategories[s.category].push({ name: s.title, href: `/services/${s.slug}` })
            }
        })

        const result = Object.values(pillarGroups)
        
        // Add legacy categories as backfills if any
        Object.entries(legacyCategories).forEach(([title, items]) => {
            result.push({
                title,
                href: `/services?category=${encodeURIComponent(title)}`,
                items
            })
        })

        return result
    }, [services])

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
                isScrolled 
                    ? "bg-background/95 backdrop-blur-md border-b border-border/50 py-3" 
                    : "bg-transparent py-5"
            )}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 relative z-50 shrink-0">
                    {mounted ? (
                        <Image
                            src={logo}
                            alt="Nissi Insights Logo"
                            width={240}
                            height={60}
                            className="h-14 w-auto object-contain"
                            priority
                        />
                    ) : (
                        <div className="h-14 w-40 animate-pulse bg-muted/20 rounded" />
                    )}
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-5">
                    {/* Advisory Dropdown Trigger */}
                    <button
                        className="text-[13px] font-bold uppercase tracking-widest hover:text-primary transition-colors text-foreground/90 flex items-center gap-1"
                        onMouseEnter={() => setIsMegaMenuOpen(true)}
                    >
                        Advisory <ChevronDown className="h-3 w-3" />
                    </button>

                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[13px] font-bold uppercase tracking-widest hover:text-primary transition-colors text-foreground/90"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-6 w-[1px] bg-border/50" />
                    <SearchDialog />
                    <ThemeToggle />
                    <div className="h-6 w-[1px] bg-border/50" />
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white rounded-none px-4 font-bold uppercase tracking-wider text-xs"
                        asChild
                    >
                        <Link href="/consultation">Request a Consultation</Link>
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mega Menu */}
            {isMegaMenuOpen && dynamicServiceCategories.length > 0 && (
                <div
                    className="hidden lg:block absolute top-full left-0 right-0 bg-background border-b border-border shadow-2xl shadow-black/10"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                >
                    <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {dynamicServiceCategories.map((cat) => (
                            <div key={cat.title}>
                                <Link href={cat.href} className="text-primary font-bold text-lg uppercase tracking-wider mb-6 block hover:underline">
                                    {cat.title}
                                </Link>
                                <ul className="space-y-3">
                                    {cat.items.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2 group">
                                                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                    {/* Advisory Sections */}
                    {dynamicServiceCategories.map((cat) => (
                        <div key={cat.title} className="pb-4 border-b border-border/50">
                            <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-3">{cat.title}</h3>
                            {cat.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block text-muted-foreground text-sm py-1.5 hover:text-foreground"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    ))}


                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium py-2 text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button className="w-full rounded-none mt-2">Request a Consultation</Button>
                </div>
            )}
        </nav>
    )
}

export default Navbar
