"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { format } from 'date-fns'
import { useSettings } from '@/hooks/use-settings'
import { getMediaUrl } from '@/lib/utils'
import { FallbackImage } from '@/components/ui/FallbackImage'
import VideoHero from '@/components/VideoHero'

interface Event {
    id: number
    title: string
    slug: string
    description: string
    date: string
    duration_minutes?: number
    location: string
    image: string
    status: 'upcoming' | 'past'
}

export default function EventsClient() {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { getSetting } = useSettings()

    const heroImage = getSetting('hero_events_media', '/NI-Digital-Assets/corporate-event.jpg')

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

    const isEventEnded = (event: Event) => {
        const eventDate = new Date(event.date)
        const durationMs = (event.duration_minutes || 60) * 60 * 1000
        return new Date(eventDate.getTime() + durationMs) < new Date()
    }

    const upcomingEvents = events.filter(e => !isEventEnded(e))
    const pastEvents = events.filter(e => isEventEnded(e))

    return (
        <>
            <VideoHero 
                title="Global Events & <span class='text-primary'>Intelligence</span>"
                tagline="Engagement"
                subtitle="Join our exclusive sessions where we discuss market trends, energy transition, and sovereign intelligence with industry leaders."
                bgImage={getMediaUrl(heroImage)}
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
                                <div key={i} className="flex flex-col h-[500px] bg-secondary/10 border border-border/20 rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-64 bg-secondary/20" />
                                    <div className="p-8 space-y-4">
                                        <div className="h-4 w-1/3 bg-primary/20 rounded" />
                                        <div className="h-8 w-full bg-foreground/10 rounded" />
                                        <div className="h-20 w-full bg-muted-foreground/10 rounded" />
                                    </div>
                                </div>
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
        </>
    )
}

const EventCard = ({ event, isPast = false }: { event: Event, isPast?: boolean }) => {
    const ended = isPast || (new Date(event.date).getTime() + (event.duration_minutes || 60) * 60 * 1000) < new Date()

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`group relative flex flex-col h-full bg-secondary/10 border ${ended ? 'border-border/20 grayscale opacity-60' : 'border-border/50 hover:border-primary/30'} overflow-hidden rounded-2xl transition-all duration-500`}
        >
                <div className="relative h-64 overflow-hidden">
                <FallbackImage
                    src={event.image}
                    alt={event.title}
                    className="transition-transform duration-700 group-hover:scale-110"
                    fallbackText="Event"
                />
                {!ended ? (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Registration Open
                    </div>
                ) : (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-slate-500/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Past Event
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
                        className={`p-2 rounded-full ${ended ? 'bg-secondary/50 text-muted-foreground' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'} transition-all`}
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
