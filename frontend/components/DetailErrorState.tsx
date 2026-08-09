"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface DetailErrorStateProps {
    title: string
    description?: string
    backHref: string
    backLabel?: string
}

export default function DetailErrorState({ title, description, backHref, backLabel }: DetailErrorStateProps) {
    return (
        <div className="flex-1 flex items-center justify-center pt-32">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
                {description && <p className="text-muted-foreground mb-8">{description}</p>}
                <Button asChild variant="outline">
                    <Link href={backHref}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {backLabel || 'Back'}
                    </Link>
                </Button>
            </div>
        </div>
    )
}
