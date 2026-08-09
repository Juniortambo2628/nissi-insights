"use client"

import React from 'react'

interface CategoryFilterProps {
    categories: string[]
    activeCategory: string
    onChange: (category: string) => void
    className?: string
}

export default function CategoryFilter({ categories, activeCategory, onChange, className }: CategoryFilterProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className || ''}`}>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-all rounded-lg border ${
                        activeCategory === cat
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}
