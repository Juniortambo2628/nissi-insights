"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApi } from '@/hooks/use-api'
import { FileText, Download, Filter, Search, Tag, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getMediaUrl } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const KnowledgeBasePage = () => {
    const { data: resources, isLoading, isError } = useApi('/resources')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeType, setActiveType] = useState('All')

    if (isLoading) return <div className="min-h-screen flex items-center justify-center pt-24"><div className="animate-spin border-t-2 border-primary h-8 w-8 rounded-full" /></div>
    if (isError) return <div className="min-h-screen flex items-center justify-center pt-24 text-muted-foreground">Failed to load resources.</div>

    // Extract unique types
    const types = ['All', ...Array.from(new Set(resources?.map((r: any) => r.type) || []))]

    const filteredResources = resources?.filter((resource: any) => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesType = activeType === 'All' || resource.type === activeType
        return matchesSearch && matchesType
    })

    return (
        <div className="flex min-h-screen flex-col bg-background relative">
            <Navbar />
            <main className="flex-1 bg-background pt-32 pb-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
                        Intelligence Hub
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Knowledge Base
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        Access our comprehensive library of white papers, industry reports, and strategic insights.
                    </p>
                </motion.div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {types.map((type: any) => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                                    activeType === type
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search resources..."
                            className="pl-10 h-12 bg-secondary/10 border-border/50"
                        />
                    </div>
                </div>

                {/* Resource Grid */}
                {filteredResources?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((resource: any, index: number) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card border border-border/50 hover:border-primary/30 transition-all group flex flex-col h-full"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-sm">
                                            {resource.type}
                                        </span>
                                        {resource.tags && resource.tags.length > 0 && (
                                            <div className="flex items-center gap-1 text-muted-foreground/60 text-[10px]">
                                                <Tag size={12} />
                                                <span>{resource.tags[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {resource.title}
                                    </h3>
                                    
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                        {resource.description || 'No description provided.'}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(resource.created_at).toLocaleDateString()}
                                        </span>
                                        {resource.file_path ? (
                                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary font-bold text-xs uppercase tracking-wider gap-2" asChild>
                                                <a href={getMediaUrl(resource.file_path)} target="_blank" rel="noopener noreferrer">
                                                    Download <Download size={14} />
                                                </a>
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary font-bold text-xs uppercase tracking-wider gap-2" asChild>
                                                <a href={`/knowledge-base/${resource.slug}`}>
                                                    Read More <ExternalLink size={14} />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center border border-dashed border-border/50 bg-secondary/5 rounded-xl">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">No Resources Found</h3>
                        <p className="text-muted-foreground">We couldn't find any resources matching your search or filter.</p>
                        <Button 
                            variant="outline" 
                            onClick={() => { setSearchQuery(''); setActiveType('All'); }}
                            className="mt-6"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </main>
        <Footer />
        </div>
    )
}

export default KnowledgeBasePage
