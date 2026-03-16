"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import NewsletterSignup from './NewsletterSignup'
import { useApi } from '@/hooks/use-api'
import { useTheme } from 'next-themes'

const Footer = () => {
    const { theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const { data: settingsByGroup } = useApi('/settings')

    const { data: services } = useApi('/services')

    // Helper to get setting value
    const getSetting = (key: string, defaultValue: string) => {
        if (!settingsByGroup) return defaultValue
        const allSettings = Object.values(settingsByGroup).flat() as any[]
        const setting = allSettings.find(s => s.key === key)
        return setting?.value || defaultValue
    }

    const logoWhiteBg = getSetting('logo_light', '/logos/nissi-landscape-white.png')
    const logoBlackBg = getSetting('logo_dark', '/logos/nissi-landscape-black.png')
    const contactEmail = getSetting('contact_email', 'info@nissiinsights.com')
    const contactAddress = getSetting('contact_address', 'London, United Kingdom')

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const logo = theme === 'light' ? logoWhiteBg : logoBlackBg

    // Dynamic service links from the API
    const dynamicServiceLinks = React.useMemo(() => {
        if (!services) return []
        // Just take the first 6 active services
        return services.slice(0, 6).map((s: any) => ({
            name: s.title,
            href: `/services/${s.slug}`
        }))
    }, [services])

    const companyLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Insights', href: '/insights' },
        { name: 'Client Impact', href: '/client-impact' },
        { name: 'Contact', href: '/contact' },
    ]

    const legalLinks = [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
    ]

    return (
        <footer className="w-full bg-background border-t border-border/50">
            {/* Main Footer */}
            <div className="max-w-[1400px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Column 1: Brand + Newsletter */}
                    <div className="lg:col-span-1">
                        <div className="relative h-14 w-60 mb-6">
                            {mounted ? (
                                <Image
                                    src={logo}
                                    alt="Nissi Insights"
                                    fill
                                    sizes="240px"
                                    className="object-contain"
                                />
                            ) : (
                                <div className="h-full w-full animate-pulse bg-muted/20 rounded" />
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                            Trusted strategic advisory, market intelligence, and due diligence across energy, fintech, and sovereign markets.
                        </p>

                        <NewsletterSignup />
                    </div>

                    {/* Column 2: Services */}
                    <div>
                        <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-6">Services</h4>
                        <ul className="space-y-3">
                            {(dynamicServiceLinks.length > 0 ? dynamicServiceLinks : []).map((link: any) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-foreground font-bold text-sm uppercase tracking-widest mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="text-muted-foreground">
                                <span className="text-foreground font-semibold block mb-1">Email</span>
                                <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors">
                                    {contactEmail}
                                </a>
                            </li>
                            <li className="text-muted-foreground">
                                <span className="text-foreground font-semibold block mb-1">Location</span>
                                {contactAddress}
                            </li>
                        </ul>

                        <div className="mt-8">
                            <Link
                                href="/consultation"
                                className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:underline group"
                            >
                                Request a Consultation
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border/50">
                <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground/60 text-xs" suppressHydrationWarning>
                        © {new Date().getFullYear()} Nissi Insights. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-muted-foreground/60 hover:text-foreground text-xs transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}


export default Footer
