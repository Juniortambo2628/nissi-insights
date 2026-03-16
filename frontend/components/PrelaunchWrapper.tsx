"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import RsvpCountdown from './RsvpCountdown'
import api from '@/lib/api'

interface PrelaunchWrapperProps {
    children: React.ReactNode
    launchSettings: {
        isActive: boolean
        date: string
        title: string
        description: string
        media: string
    } | null
}

export default function PrelaunchWrapper({ children, launchSettings: initialSettings }: PrelaunchWrapperProps) {
    const pathname = usePathname()
    const [launchSettings, setLaunchSettings] = React.useState(initialSettings)
    
    // Polling for launch settings changes
    React.useEffect(() => {
        const checkSettings = async () => {
            try {
                // @ts-ignore
                const { data } = await api.get('/site-settings/launch')
                if (JSON.stringify(data) !== JSON.stringify(launchSettings)) {
                    setLaunchSettings(data)
                }
            } catch (error) {
                console.error('Failed to poll launch settings:', error)
            }
        }

        const interval = setInterval(checkSettings, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [launchSettings])

    // Always permit access to the admin dashboard
    if (pathname?.startsWith('/admin')) {
        return <>{children}</>
    }

    // If RSVP is active globally, take over the screen
    if (launchSettings?.isActive) {
        return (
            <RsvpCountdown 
                date={launchSettings.date}
                title={launchSettings.title}
                description={launchSettings.description}
                media={launchSettings.media}
            />
        )
    }

    return <>{children}</>
}
