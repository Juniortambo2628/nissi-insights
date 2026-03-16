"use client"

import React, { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const NewsletterSignup = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || isLoading) return

        setIsLoading(true)

        try {
            await api.post('/subscribe', { email, source: 'footer' })
            toast({
                title: "Subscribed!",
                description: "You've been successfully added to our newsletter.",
            })
            setEmail('')
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Subscription Failed",
                description: err.response?.data?.message || 'Something went wrong. Please try again.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h4 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">Stay Informed</h4>
            <p className="text-muted-foreground text-sm mb-4">
                Get the latest insights, market analysis, and advisory updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-all"
                    required
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {isLoading ? 'Sending...' : 'Subscribe'}
                </button>
            </form>
        </div>
    )
}

export default NewsletterSignup

