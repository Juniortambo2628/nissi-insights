"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react'

type Status = 'loading' | 'success' | 'error' | 'missing'

const UnsubscribeClient = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState<Status>(() => (token ? 'loading' : 'missing'))
    const [email, setEmail] = useState<string | null>(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            return
        }

        let cancelled = false

        api.post('/unsubscribe', { token })
            .then((res) => {
                if (cancelled) return
                setEmail(res.data.email || null)
                setMessage(res.data.message || 'You have been unsubscribed.')
                setStatus('success')
            })
            .catch((err) => {
                if (cancelled) return
                setMessage(err.response?.data?.message || 'This unsubscribe link is invalid or has expired.')
                setStatus('error')
            })

        return () => {
            cancelled = true
        }
    }, [token])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-secondary/10 border border-border/50 rounded-2xl p-8 text-center shadow-lg">
                {status === 'loading' && (
                    <div className="py-8 flex flex-col items-center gap-4 text-muted-foreground">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <p>Processing your request...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-4 flex flex-col items-center gap-4">
                        <CheckCircle2 className="text-emerald-500" size={48} />
                        <h1 className="text-2xl font-bold text-foreground">You&apos;ve been unsubscribed</h1>
                        <p className="text-muted-foreground">
                            {email ? (
                                <>
                                    <span className="font-semibold text-foreground">{email}</span> will no longer
                                    receive email campaigns or newsletters from us.
                                </>
                            ) : (
                                message
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            You can resubscribe at any time from the footer of our website.
                        </p>
                        <Link
                            href="/"
                            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            Back to website
                        </Link>
                    </div>
                )}

                {(status === 'error' || status === 'missing') && (
                    <div className="py-4 flex flex-col items-center gap-4">
                        <XCircle className="text-destructive" size={48} />
                        <h1 className="text-2xl font-bold text-foreground">Unsubscribe failed</h1>
                        <p className="text-muted-foreground">
                            {status === 'missing'
                                ? 'No unsubscribe token was provided. Please use the link from your email.'
                                : message}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center">
                            <Mail size={12} /> Need help? Contact us from our website.
                        </p>
                        <Link
                            href="/"
                            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            Back to website
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UnsubscribeClient
