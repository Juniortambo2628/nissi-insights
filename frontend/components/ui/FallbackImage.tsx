"use client"

import React, { useState } from 'react'
import { cn, getMediaUrl } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'

interface FallbackImageProps {
    src?: string | null
    alt: string
    className?: string
    containerClassName?: string
    fallbackText?: string
}

export function FallbackImage({
    src,
    alt,
    className,
    containerClassName,
    fallbackText = 'No image',
}: FallbackImageProps) {
    const [error, setError] = useState(false)
    const url = getMediaUrl(src)

    if (!url || error) {
        return (
            <div
                className={cn(
                    "w-full h-full bg-secondary/30 flex flex-col items-center justify-center text-muted-foreground/50",
                    containerClassName
                )}
            >
                <ImageIcon size={24} className="mb-1 opacity-50" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{fallbackText}</span>
            </div>
        )
    }

    return (
        <img
            src={url}
            alt={alt}
            className={cn("w-full h-full object-cover", className)}
            onError={() => setError(true)}
        />
    )
}
