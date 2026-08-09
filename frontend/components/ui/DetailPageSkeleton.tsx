"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface DetailPageSkeletonProps {
  /** Show hero image skeleton */
  showHero?: boolean
  /** Number of content rows to show */
  contentRows?: number
  /** Custom className */
  className?: string
  /** Loading message */
  message?: string
}

export function DetailPageSkeleton({
  showHero = true,
  contentRows = 4,
  className,
  message = 'Loading...',
}: DetailPageSkeletonProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Hero skeleton */}
      {showHero && (
        <div className="relative h-[60vh] bg-secondary/10 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Content skeleton */}
      <div className="max-w-[1000px] mx-auto px-6 -mt-32 relative z-10">
        {/* Tag skeleton */}
        <div className="h-4 w-24 bg-primary/20 animate-pulse mb-4" />

        {/* Title skeleton */}
        <div className="h-12 w-3/4 bg-foreground/10 animate-pulse mb-6" />

        {/* Meta skeleton */}
        <div className="flex gap-4 mb-8">
          <div className="h-4 w-32 bg-foreground/5 animate-pulse" />
          <div className="h-4 w-24 bg-foreground/5 animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          {Array.from({ length: contentRows }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-full bg-foreground/5 animate-pulse" />
              <div className="h-5 w-5/6 bg-foreground/5 animate-pulse" />
              <div className="h-5 w-4/6 bg-foreground/5 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Loading message */}
        {message && (
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/40 animate-pulse">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
