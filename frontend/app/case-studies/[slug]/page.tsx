"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { useApi } from '@/hooks/use-api'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import SocialShare from '@/components/SocialShare'
import { getMediaUrl } from '@/lib/utils'

export default function CaseStudyDetailPage() {
    const params = useParams()
    const slug = params?.slug as string
    const { data: caseStudy, isLoading, isError } = useApi(slug ? `/case-studies/${slug}` : null)
    const { data: allCaseStudies } = useApi('/case-studies')

    const relatedStudies = allCaseStudies?.filter((cs: any) => cs.slug !== slug && cs.category === caseStudy?.category).slice(0, 2)

    if (isLoading) {
        return (
            <main className="flex min-h-screen flex-col bg-[#050a1a]">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-32">
                    <div className="text-muted-foreground/50 text-lg animate-pulse">Retrieving case study...</div>
                </div>
                <Footer />
            </main>
        )
    }

    if (isError || !caseStudy) {
        return (
            <main className="flex min-h-screen flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-32">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Case Study Not Found</h1>
                        <Button asChild variant="outline"><Link href="/case-studies">Back to Case Studies</Link></Button>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-40 pb-24 bg-background overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
                <div className="max-w-[1000px] mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Link href="/case-studies" className="text-primary/70 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 mb-12 hover:text-primary transition-all">
                            <ArrowLeft className="h-3 w-3" />
                            Case Studies
                        </Link>

                        {caseStudy.client_name && (
                            <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
                                {caseStudy.client_name}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
                            {caseStudy.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-border/50">
                            {caseStudy.significant_figure && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-1">Impact Result</span>
                                    <span className="text-2xl font-mono text-primary font-bold">{caseStudy.significant_figure}</span>
                                </div>
                            )}
                            {caseStudy.category && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-1">Sector</span>
                                    <span className="text-foreground font-bold">{caseStudy.category}</span>
                                </div>
                            )}
                            <div className="ml-auto">
                                <SocialShare title={caseStudy.title} slug={slug} type="case-studies" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-24 bg-secondary/10">
                <div className="max-w-[1000px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 space-y-20">
                            {caseStudy.problem && (
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                                    <h2 className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <span className="w-8 h-[1px] bg-red-400/30" /> The Challenge
                                    </h2>
                                    <div 
                                        className="text-muted-foreground leading-relaxed text-xl font-light prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: caseStudy.problem }} 
                                    />
                                </motion.div>
                            )}

                            {caseStudy.methodology && (
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                                    <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <span className="w-8 h-[1px] bg-primary/30" /> Our Advisory Strategy
                                    </h2>
                                    <div 
                                        className="text-muted-foreground leading-relaxed text-xl font-light prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: caseStudy.methodology }} 
                                    />
                                </motion.div>
                            )}

                            {caseStudy.outcome && (
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                                    <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <span className="w-8 h-[1px] bg-emerald-400/30" /> The Outcome
                                    </h2>
                                    <div 
                                        className="text-muted-foreground leading-relaxed text-xl font-light prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: caseStudy.outcome }} 
                                    />
                                </motion.div>
                            )}
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-32 p-8 bg-card border border-border/50 rounded-2xl shadow-sm">
                                <h3 className="text-foreground font-bold mb-6">In This Study</h3>
                                <ul className="space-y-4">
                                    <li className="text-sm text-muted-foreground/60 flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span>Market Entry Strategy</span>
                                    </li>
                                    <li className="text-sm text-muted-foreground/60 flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span>Regulatory Compliance</span>
                                    </li>
                                    <li className="text-sm text-muted-foreground/60 flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span>Stakeholder Engagement</span>
                                    </li>
                                </ul>
                                <Button asChild className="w-full mt-10 rounded-none h-12 font-bold uppercase tracking-widest text-[10px]">
                                    <Link href="/contact">Request Similar Advisory</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Content */}
            {relatedStudies && relatedStudies.length > 0 && (
                <section className="py-24 bg-background border-t border-border/50">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Related Case Studies</h2>
                            <Link href="/case-studies" className="text-primary text-sm font-bold uppercase tracking-widest hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {relatedStudies.map((rs: any) => (
                                <Link key={rs.id} href={`/case-studies/${rs.slug}`} className="group block relative aspect-[21/9] overflow-hidden border border-border/50 bg-card">
                                    {rs.image && (
                                        <Image src={getMediaUrl(rs.image)} alt={rs.title} fill className="object-cover opacity-60 group-hover:opacity-20 transition-all duration-700" />
                                    )}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-background to-transparent">
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-2">{rs.client_name}</span>
                                        <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{rs.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    )
}
