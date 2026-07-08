"use client"

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
    "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
    {
        variants: {
            variant: {
                default: "bg-primary/10 text-primary border border-primary/20",
                success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                warning: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
                danger: "bg-red-500/10 text-red-500 border border-red-500/20",
                muted: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
    children: React.ReactNode
    className?: string
    icon?: React.ReactNode
}

export function StatusBadge({ children, variant, className, icon }: StatusBadgeProps) {
    return (
        <span className={cn(statusBadgeVariants({ variant }), className)}>
            {icon}
            {children}
        </span>
    )
}
