"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import api from '@/lib/api'
import { format } from 'date-fns'
import { getMediaUrl } from '@/lib/utils'

interface Event {
    id: number
    title: string
    slug: string
    description: string
    date: string
    location: string
    image: string
    status: 'upcoming' | 'past'
}

const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events')
                setEvents(response.data)
            } catch (error) {
                console.error("Failed to fetch events", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const upcomingEvents = events.filter(e => e.status === 'upcoming')
    const pastEvents = events.filter(e => e.status === 'past')

    return (
        <main className="flex min-h-screen flex-col bg-background font-inter">
            <Navbar />
            
            <VideoHero 
                title="Global Events & <span class='text-primary'>Intelligence</span>"
                tagline="Engagement"
                subtitle="Join our exclusive sessions where we discuss market trends, energy transition, and sovereign intelligence with industry leaders."
                bgImage="/NI-Digital-Assets/corporate-event.jpg"
            />

            <section className="py-24 px-6 max-w-[1400px] mx-auto w-full">
                {/* Upcoming Events */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-border/50" />
                        <h2 className="text-3xl font-bold text-foreground shrink-0">Upcoming Events</h2>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[450px] bg-secondary/20 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-secondary/5 border border-dashed border-border rounded-2xl">
                            <Calendar className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
                            <p className="text-muted-foreground">No upcoming events scheduled at the moment.</p>
                        </div>
                    )}
                </div>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <div>
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-border/50" />
                            <h2 className="text-3xl font-bold text-foreground/40 shrink-0">Past Insights</h2>
                            <div className="h-px flex-1 bg-border/50" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pastEvents.map((event) => (
                                <EventCard key={event.id} event={event} isPast />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    )
}

const EventCard = ({ event, isPast = false }: { event: Event, isPast?: boolean }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`group relative flex flex-col h-full bg-secondary/10 border ${isPast ? 'border-border/20 grayscale opacity-60' : 'border-border/50 hover:border-primary/30'} overflow-hidden rounded-2xl transition-all duration-500`}
        >
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={getMediaUrl(event.image) || '/placeholder-event.jpg'} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {!isPast && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Registration Open
                    </div>
                )}
            </div>

            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-bold text-primary mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(event.date), 'MMM d, yyyy')}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {format(new Date(event.date), 'h:mm a')}</span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3 opacity-80">
                    {event.description}
                </p>

                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={14} className="text-primary/50" />
                        {event.location}
                    </div>
                    <Link 
                        href={`/events/${event.slug}`}
                        className={`p-2 rounded-full ${isPast ? 'bg-secondary/50 text-muted-foreground' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'} transition-all`}
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default EventsPage
