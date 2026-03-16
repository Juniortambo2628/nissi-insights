"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumbs = () => {
    const pathname = usePathname()
    if (pathname === '/') return null

    const pathSegments = pathname.split('/').filter(Boolean)
    
    // Breadcrumb labels mapping
    const labels: Record<string, string> = {
        'insights': 'Insights',
        'case-studies': 'Case Studies',
        'about': 'About Us',
        'services': 'Services',
        'contact': 'Contact',
        'consultation': 'Consultation',
    }

    return (
        <nav className="relative z-20 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-8">
            <Link 
                href="/" 
                className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
            >
                <Home className="h-3 w-3" />
                <span>Home</span>
            </Link>

            {pathSegments.map((segment, index) => {
                const href = `/${pathSegments.slice(0, index + 1).join('/')}`
                const isLast = index === pathSegments.length - 1
                const label = labels[segment] || segment.replace(/-/g, ' ')

                return (
                    <React.Fragment key={href}>
                        <ChevronRight className="h-3 w-3 opacity-20" />
                        {isLast ? (
                            <motion.span 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-primary"
                            >
                                {label}
                            </motion.span>
                        ) : (
                            <Link 
                                href={href} 
                                className="hover:text-foreground transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}

export default Breadcrumbs
