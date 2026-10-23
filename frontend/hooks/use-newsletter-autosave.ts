"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import api from '@/lib/api'
import { Newsletter } from '@/types/api'

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error'

export type FlushResult = 'saved' | 'clean' | 'blocked' | 'error'

export type SnapshotSource = 'manual' | 'autosave'

export const AUTOSAVE_DEBOUNCE_MS = 3000

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

const COLOR_FIELDS = ['background_color', 'text_color', 'accent_color'] as const

export const NEWSLETTER_FORM_FIELDS = [
    'title',
    'subject',
    'preheader',
    'content',
    'header_image',
    'background_color',
    'text_color',
    'accent_color',
] as const

export function buildNewsletterPayload(
    form: Partial<Newsletter>,
    source: SnapshotSource
): Record<string, string> {
    const payload: Record<string, string> = { snapshot: source }
    for (const field of NEWSLETTER_FORM_FIELDS) {
        payload[field] = form[field] ?? ''
    }
    return payload
}

export function serializeNewsletterForm(form: Partial<Newsletter>): string {
    return JSON.stringify(NEWSLETTER_FORM_FIELDS.map((field) => form[field] ?? ''))
}

export function canAutosave(form: Partial<Newsletter>): boolean {
    if (!form.title?.trim() || !form.subject?.trim()) return false
    for (const field of COLOR_FIELDS) {
        const value = form[field]
        if (value && !HEX_COLOR.test(value)) return false
    }
    return true
}

interface UseNewsletterAutosaveOptions {
    enabled: boolean
    form: Partial<Newsletter>
    editingId: number | null
    baseline: string
    onSynced?: (
        newsletter: Newsletter,
        source: SnapshotSource,
        sentSerialized: string
    ) => void
}

export function useNewsletterAutosave({
    enabled,
    form,
    editingId,
    baseline,
    onSynced,
}: UseNewsletterAutosaveOptions) {
    const [status, setStatus] = useState<AutosaveStatus>('idle')
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

    const baselineRef = useRef(baseline)
    const editingIdRef = useRef(editingId)
    const formRef = useRef(form)
    const enabledRef = useRef(enabled)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const savingRef = useRef<Promise<boolean> | null>(null)
    const onSyncedRef = useRef(onSynced)

    formRef.current = form
    enabledRef.current = enabled
    onSyncedRef.current = onSynced

    const serialized = serializeNewsletterForm(form)
    const dirty = enabled && serialized !== baseline
    const blocked = dirty && !canAutosave(formRef.current)

    useEffect(() => {
        baselineRef.current = baseline
    }, [baseline])

    useEffect(() => {
        editingIdRef.current = editingId
    }, [editingId])

    useEffect(() => {
        if (!enabled) return
        setStatus('idle')
        setLastSavedAt(null)
    }, [enabled])

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const save = useCallback(
        async (source: SnapshotSource): Promise<boolean> => {
            if (savingRef.current) return savingRef.current

            const sentSerialized = serializeNewsletterForm(formRef.current)
            if (sentSerialized === baselineRef.current) return true

            const payload = buildNewsletterPayload(formRef.current, source)
            setStatus('saving')

            const promise = (async () => {
                try {
                    const id = editingIdRef.current
                    const res = id
                        ? await api.put<Newsletter>(`/newsletters/${id}`, payload)
                        : await api.post<Newsletter>('/newsletters', payload)
                    const saved = res.data

                    editingIdRef.current = saved.id
                    baselineRef.current = sentSerialized
                    setLastSavedAt(new Date())
                    setStatus('saved')
                    onSyncedRef.current?.(saved, source, sentSerialized)

                    if (serializeNewsletterForm(formRef.current) !== baselineRef.current) {
                        setStatus('pending')
                        if (enabledRef.current) {
                            clearTimer()
                            timerRef.current = setTimeout(() => {
                                void save('autosave')
                            }, AUTOSAVE_DEBOUNCE_MS)
                        }
                    }

                    return true
                } catch {
                    setStatus('error')
                    return false
                } finally {
                    savingRef.current = null
                }
            })()

            savingRef.current = promise
            return promise
        },
        [clearTimer]
    )

    useEffect(() => {
        if (!enabled) return

        if (serialized === baseline) {
            setStatus((prev) => (prev === 'saving' ? prev : 'idle'))
            return
        }

        setStatus('pending')

        if (!canAutosave(formRef.current)) return

        clearTimer()
        timerRef.current = setTimeout(() => {
            void save('autosave')
        }, AUTOSAVE_DEBOUNCE_MS)

        return clearTimer
    }, [enabled, serialized, baseline, save, clearTimer])

    useEffect(() => {
        if (!enabled) return

        const handler = (event: BeforeUnloadEvent) => {
            if (serializeNewsletterForm(formRef.current) !== baselineRef.current) {
                event.preventDefault()
                event.returnValue = ''
            }
        }

        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [enabled])

    useEffect(() => () => clearTimer(), [clearTimer])

    const flush = useCallback(async (): Promise<FlushResult> => {
        clearTimer()

        if (savingRef.current) {
            const inFlightSaved = await savingRef.current
            if (serializeNewsletterForm(formRef.current) === baselineRef.current) {
                return inFlightSaved ? 'saved' : 'error'
            }
        }

        if (serializeNewsletterForm(formRef.current) === baselineRef.current) return 'clean'
        if (!canAutosave(formRef.current)) return 'blocked'

        const ok = await save('autosave')
        return ok ? 'saved' : 'error'
    }, [save, clearTimer])

    const whenIdle = useCallback(async () => {
        if (savingRef.current) await savingRef.current
    }, [])

    const getId = useCallback(() => editingIdRef.current, [])

    return {
        status,
        lastSavedAt,
        dirty,
        blocked,
        flush,
        whenIdle,
        getId,
    }
}
