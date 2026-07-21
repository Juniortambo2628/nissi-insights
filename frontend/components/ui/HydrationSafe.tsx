"use client"

import React, { useState, useEffect } from 'react'

interface HydrationSafeProps {
  children: React.ReactNode
  /** Content to render during SSR/hydration (before mounted) */
  fallback?: React.ReactNode
}

export function HydrationSafe({ children, fallback = null }: HydrationSafeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
