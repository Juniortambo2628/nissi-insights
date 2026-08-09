"use client"

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface PublicLayoutProps {
    children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
