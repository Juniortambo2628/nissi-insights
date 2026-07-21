"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface SectionSkeletonProps {
  /** Number of content rows to show */
  rows?: number
  /** Show header skeleton (tagline + title) */
  showHeader?: boolean
  /** Show image/media skeleton on the left */
  showMedia?: boolean
  /** Custom className */
  className?: string
  /** Layout variant */
  variant?: 'default' | 'cards' | 'grid'
}

export function SectionSkeleton({
  rows = 3,
  showHeader = true,
  showMedia = false,
  className,
  variant = 'default',
}: SectionSkeletonProps) {
  return (
    <div className={cn('w-full py-32 bg-background', className)}>
      <div className="max-w-[1400px] mx-auto px-6">
        {showHeader && (
          <div className="mb-16">
            <div className="h-4 w-32 bg-primary/20 animate-pulse mb-6" />
            <div className="h-12 w-1/2 bg-foreground/10 animate-pulse" />
          </div>
        )}

        {variant === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 space-y-4"
              >
                <div className="h-40 bg-secondary/20 animate-pulse rounded-lg" />
                <div className="h-5 w-3/4 bg-foreground/10 animate-pulse" />
                <div className="h-4 w-full bg-foreground/5 animate-pulse" />
                <div className="h-4 w-2/3 bg-foreground/5 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {variant === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-16 w-16 bg-secondary/20 animate-pulse rounded-lg shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-1/2 bg-foreground/10 animate-pulse" />
                  <div className="h-4 w-full bg-foreground/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === 'default' && (
          <div className={cn('space-y-8', showMedia && 'grid grid-cols-1 lg:grid-cols-5 gap-12')}>
            {showMedia && (
              <div className="lg:col-span-2 aspect-[3/4] bg-secondary/10 animate-pulse rounded-xl" />
            )}
            <div className={cn(showMedia && 'lg:col-span-3 space-y-8')}>
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 w-1/3 bg-foreground/10 animate-pulse" />
                  <div className="h-4 w-full bg-foreground/5 animate-pulse" />
                  <div className="h-4 w-2/3 bg-foreground/5 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
