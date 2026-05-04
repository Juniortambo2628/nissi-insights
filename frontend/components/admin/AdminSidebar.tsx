"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
    LayoutDashboard, 
    Briefcase, 
    FileText, 
    BarChart3, 
    Settings, 
    LogOut,
    ExternalLink,
    Quote,
    Building2,
    FolderOpen,
    PenTool,
    BookOpen,
    Users,
    MessageSquare,
    UserCircle,
    Zap,
    Mail,
    ShieldCheck,
    Rocket,
    Globe,
    Calendar,
    UserCheck,
    Activity
} from 'lucide-react'

import { cn, getMediaUrl } from '@/lib/utils'
import { useAuth } from '@/components/AuthProvider'
import { useApi } from '@/hooks/use-api'
import { useSettings } from '@/hooks/use-settings'
import { useTheme } from 'next-themes'
import { AdminThemeToggle } from './AdminThemeToggle'

const AdminSidebar = () => {
    const pathname = usePathname()
    const { logout } = useAuth()
    const { getSetting } = useSettings()

    const { theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const logoWhiteBg = getSetting('logo_light', '/assets/logos/nissi-landscape-black.png') // Dark logo for white bg
    const logoBlackBg = getSetting('logo_dark', '/assets/logos/nissi-landscape-white.png') // Light logo for black bg
    
    // In light theme, we use the logo designed for light backgrounds (the dark logo)
    // In dark theme, we use the logo designed for dark backgrounds (the light logo)
    const logo = theme === 'dark' ? logoBlackBg : logoWhiteBg

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Services', href: '/admin/services', icon: Briefcase },
        { name: 'Pillars', href: '/admin/pillars', icon: Globe },
        { name: 'Knowledge Base', href: '/admin/knowledge-base', icon: BookOpen },
        { name: 'Insights', href: '/admin/insights', icon: FileText },
        { name: 'Case Studies', href: '/admin/case-studies', icon: FolderOpen },
        { name: 'Team', href: '/admin/team', icon: UserCircle },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Registrations', href: '/admin/registrations', icon: UserCheck },
        { name: 'Event Analytics', href: '/admin/analytics/events', icon: Activity },
        { name: 'Widgets', href: '/admin/widgets', icon: Zap },
        { name: 'RSVPs', href: '/admin/rsvps', icon: Rocket },
        { name: 'Requests', href: '/admin/requests', icon: MessageSquare },
        { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
        { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
        { name: 'Clients', href: '/admin/clients', icon: Building2 },
        { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
        { name: 'Email', href: '/admin/email', icon: Mail },
        { name: 'Legal', href: '/admin/legal', icon: ShieldCheck },
        { name: 'Content', href: '/admin/content', icon: PenTool },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <aside className="w-64 h-screen bg-secondary/10 border-r border-border/50 flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image 
                            src={getMediaUrl(mounted ? logo : logoWhiteBg)} 
                            alt="Nissi Insights Logo" 
                            width={140} 
                            height={35} 
                            className="h-8 w-auto object-contain"
                        />
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                    </Link>
                    <AdminThemeToggle />
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-all text-nowrap",
                                isActive 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <Icon size={16} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <button 
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-1.5 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar
