"use client"

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useApi } from '@/hooks/use-api'
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Activity
} from 'lucide-react'
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area 
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

interface EventAnalytics {
    total_events: number
    total_registrations: number
    attendance_rate: number
    registrations_over_time: Array<{ date: string; count: number }>
    registrations_by_event: Array<{ id: number; title: string; date: string; registrations_count: number }>
    upcoming_events: Array<{ id: number; title: string; date: string; registrations_count: number }>
}

const EventAnalyticsPage = () => {
    const { data: stats, isLoading } = useApi<EventAnalytics>('/analytics/events')

    if (isLoading || !stats) {
        return (
            <AdminLayout>
                <div className="space-y-8 animate-pulse">
                    <div className="h-20 bg-secondary/10 rounded-xl flex items-center px-8">
                        <div className="h-4 w-48 bg-secondary/20 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-secondary/10 rounded-xl" />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-80 bg-secondary/10 rounded-xl" />
                        <div className="h-80 bg-secondary/10 rounded-xl" />
                    </div>
                </div>
            </AdminLayout>
        )
    }

    const metrics = [
        { title: 'Total Events', value: stats.total_events, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
        { title: 'Total Registrations', value: stats.total_registrations, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Avg. Attendance', value: `${stats.attendance_rate}%`, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Active Growth', value: '+12%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ]

    return (
        <AdminLayout>
            <div className="space-y-8 pb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Event Analytics</h1>
                        <p className="text-muted-foreground text-sm">Deep dive into your event performance and audience engagement.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((m) => (
                        <Card key={m.title} className="bg-secondary/10 border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
                                        <m.icon size={20} />
                                    </div>
                                    <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                        <ArrowUpRight size={12} />
                                        8.2%
                                    </span>
                                </div>
                                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{m.title}</h3>
                                <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-secondary/10 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity size={18} className="text-primary" />
                                Registration Trends (Last 30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] pr-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.registrations_over_time}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#94a3b8" 
                                        fontSize={12} 
                                        tickFormatter={(val) => format(new Date(val), 'MMM d')}
                                    />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '12px' }}
                                        itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/10 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 size={18} className="text-primary" />
                                Popular Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {stats.registrations_by_event.map((event, i) => (
                                <div key={event.id} className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-muted-foreground">0{i+1}</span>
                                            <p className="text-sm font-bold text-foreground truncate">{event.title}</p>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground ml-6">
                                            {format(new Date(event.date), 'MMMM d, yyyy')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">{event.registrations_count}</p>
                                        <p className="text-[10px] text-muted-foreground">Registrations</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-secondary/10 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Upcoming Events Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-secondary/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                                        <tr>
                                            <th className="px-6 py-4">Event</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-center">Registrations</th>
                                            <th className="px-6 py-4">Performance</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {stats.upcoming_events.map((event) => {
                                            const capacity = 100 // Example
                                            const percentage = Math.min((event.registrations_count / capacity) * 100, 100)
                                            
                                            return (
                                                <tr key={event.id} className="hover:bg-secondary/5 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-foreground">{event.title}</td>
                                                    <td className="px-6 py-4 text-sm text-muted-foreground">{format(new Date(event.date), 'MMM d, yyyy')}</td>
                                                    <td className="px-6 py-4 text-center font-mono font-bold text-primary">{event.registrations_count}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-full max-w-[150px] bg-secondary/30 rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-primary h-full rounded-full" style={{ width: `${percentage}%` }} />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-xs font-bold text-primary hover:underline">View Details</button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}

export default EventAnalyticsPage
