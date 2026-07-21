"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorFallbackProps {
  /** Error title */
  title?: string
  /** Error message */
  message?: string
  /** Retry callback */
  onRetry?: () => void
  /** Custom className */
  className?: string
  /** Show as compact inline error instead of full section */
  compact?: boolean
}

export function ErrorFallback({
  title = 'Something went wrong',
  message = 'We couldn\'t load this content. Please try again.',
  onRetry,
  className,
  compact = false,
}: ErrorFallbackProps) {
  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive',
        className
      )}>
        <AlertCircle size={16} className="shrink-0" />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto text-sm font-medium hover:underline flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'w-full py-24 bg-background',
      className
    )}>
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
          <AlertCircle size={24} className="text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
