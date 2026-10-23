import { renderHook, act } from '@testing-library/react'
import {
    useNewsletterAutosave,
    buildNewsletterPayload,
    serializeNewsletterForm,
    canAutosave,
    AUTOSAVE_DEBOUNCE_MS,
    FlushResult,
} from '@/hooks/use-newsletter-autosave'
import { Newsletter } from '@/types/api'
import api from '@/lib/api'

jest.mock('@/lib/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}))

const mockPost = api.post as jest.Mock
const mockPut = api.put as jest.Mock

const baseForm: Partial<Newsletter> = {
    title: 'Monthly Market Brief',
    subject: 'Your March briefing',
    preheader: '',
    content: '<p>Insight body</p>',
    header_image: '',
    background_color: '#ffffff',
    text_color: '#0f172a',
    accent_color: '#2563eb',
}

const savedNewsletter = (id: number): Newsletter => ({
    id,
    user_id: 1,
    title: baseForm.title as string,
    subject: baseForm.subject as string,
    preheader: null,
    content: baseForm.content as string,
    header_image: null,
    background_color: baseForm.background_color as string,
    text_color: baseForm.text_color as string,
    accent_color: baseForm.accent_color as string,
    status: 'draft',
    sent_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
})

type Props = Parameters<typeof useNewsletterAutosave>[0]

const makeProps = (overrides: Partial<Props> = {}): Props => ({
    enabled: true,
    form: { ...baseForm },
    editingId: 5,
    baseline: serializeNewsletterForm(baseForm),
    onSynced: jest.fn(),
    ...overrides,
})

const editedForm = (overrides: Partial<Newsletter> = {}): Partial<Newsletter> => ({
    ...baseForm,
    ...overrides,
})

describe('newsletter autosave payload helpers', () => {
    it('builds a payload with the snapshot source and all form fields', () => {
        expect(buildNewsletterPayload(baseForm, 'autosave')).toEqual({
            snapshot: 'autosave',
            title: 'Monthly Market Brief',
            subject: 'Your March briefing',
            preheader: '',
            content: '<p>Insight body</p>',
            header_image: '',
            background_color: '#ffffff',
            text_color: '#0f172a',
            accent_color: '#2563eb',
        })
    })

    it('falls back to empty strings for missing fields', () => {
        const payload = buildNewsletterPayload({ title: 'Only title' }, 'manual')

        expect(payload.snapshot).toBe('manual')
        expect(payload.title).toBe('Only title')
        expect(payload.subject).toBe('')
        expect(payload.content).toBe('')
    })

    it('serializes forms deterministically for dirty comparison', () => {
        expect(serializeNewsletterForm({ ...baseForm })).toBe(
            serializeNewsletterForm({ ...baseForm })
        )
        expect(serializeNewsletterForm(editedForm({ title: 'Other' }))).not.toBe(
            serializeNewsletterForm(baseForm)
        )
        expect(serializeNewsletterForm({ ...baseForm, title: undefined })).toBe(
            serializeNewsletterForm(editedForm({ title: '' }))
        )
    })

    it('requires a title and subject before autosaving', () => {
        expect(canAutosave(baseForm)).toBe(true)
        expect(canAutosave(editedForm({ title: '' }))).toBe(false)
        expect(canAutosave(editedForm({ title: '   ' }))).toBe(false)
        expect(canAutosave(editedForm({ subject: '' }))).toBe(false)
    })

    it('rejects invalid hex colors and allows empty ones', () => {
        expect(canAutosave(editedForm({ accent_color: '#ff' }))).toBe(false)
        expect(canAutosave(editedForm({ accent_color: 'not-a-color' }))).toBe(false)
        expect(canAutosave(editedForm({ accent_color: '' }))).toBe(true)
        expect(canAutosave(editedForm({ background_color: '#ABCDEF' }))).toBe(true)
    })
})

describe('useNewsletterAutosave', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
        mockPost.mockResolvedValue({ data: savedNewsletter(42) })
        mockPut.mockResolvedValue({ data: savedNewsletter(5) })
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('does not autosave when the form is unchanged', async () => {
        const { result } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        expect(result.current.dirty).toBe(false)

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS * 3)
        })

        expect(mockPut).not.toHaveBeenCalled()
        expect(mockPost).not.toHaveBeenCalled()
    })

    it('does not autosave while the editor is closed', async () => {
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps({ enabled: false }),
        })

        rerender(makeProps({ enabled: false, form: editedForm({ content: '<p>new</p>' }) }))

        expect(result.current.dirty).toBe(false)

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS * 3)
        })

        expect(mockPut).not.toHaveBeenCalled()
    })

    it('autosaves via PUT after the 3 second debounce', async () => {
        const onSynced = jest.fn()
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps({ onSynced }),
        })

        rerender(
            makeProps({ onSynced, form: editedForm({ content: '<p>edited</p>' }) })
        )

        expect(result.current.dirty).toBe(true)
        expect(result.current.status).toBe('pending')

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS - 1)
        })
        expect(mockPut).not.toHaveBeenCalled()

        await act(async () => {
            await jest.advanceTimersByTimeAsync(1)
        })

        expect(mockPut).toHaveBeenCalledTimes(1)
        expect(mockPut.mock.calls[0][0]).toBe('/newsletters/5')
        expect(mockPut.mock.calls[0][1]).toMatchObject({
            snapshot: 'autosave',
            content: '<p>edited</p>',
        })
        expect(mockPost).not.toHaveBeenCalled()
        expect(result.current.status).toBe('saved')
        expect(result.current.lastSavedAt).toBeInstanceOf(Date)

        expect(onSynced).toHaveBeenCalledTimes(1)
        const [saved, source, sentSerialized] = onSynced.mock.calls[0]
        expect(saved.id).toBe(5)
        expect(source).toBe('autosave')
        expect(typeof sentSerialized).toBe('string')

        rerender(
            makeProps({
                onSynced,
                baseline: sentSerialized,
                form: editedForm({ content: '<p>edited</p>' }),
            })
        )
        expect(result.current.dirty).toBe(false)
    })

    it('auto-creates a draft on first autosave then updates via PUT', async () => {
        const onSynced = jest.fn()
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps({ editingId: null, onSynced }),
        })

        rerender(
            makeProps({ editingId: null, onSynced, form: editedForm({ title: 'New Draft' }) })
        )

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)
        })

        expect(mockPost).toHaveBeenCalledTimes(1)
        expect(mockPost.mock.calls[0][0]).toBe('/newsletters')
        expect(mockPost.mock.calls[0][1]).toMatchObject({
            snapshot: 'autosave',
            title: 'New Draft',
        })
        expect(onSynced).toHaveBeenCalledTimes(1)
        expect(result.current.getId()).toBe(42)

        await act(async () => {
            await jest.advanceTimersByTimeAsync(1)
        })
        rerender(
            makeProps({
                editingId: null,
                onSynced,
                form: editedForm({ title: 'New Draft', content: '<p>more</p>' }),
            })
        )
        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)
        })

        expect(mockPut).toHaveBeenCalledTimes(1)
        expect(mockPut.mock.calls[0][0]).toBe('/newsletters/42')
        expect(mockPost).toHaveBeenCalledTimes(1)
    })

    it('holds autosave while the title or subject is missing', async () => {
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        rerender(makeProps({ form: editedForm({ title: '' }) }))

        expect(result.current.dirty).toBe(true)
        expect(result.current.blocked).toBe(true)

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS * 5)
        })

        expect(mockPut).not.toHaveBeenCalled()

        rerender(makeProps({ form: editedForm({ title: 'Filled in' }) }))
        expect(result.current.blocked).toBe(false)

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)
        })

        expect(mockPut).toHaveBeenCalledTimes(1)
    })

    it('holds autosave while a color is an invalid hex value', async () => {
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        rerender(makeProps({ form: editedForm({ accent_color: '#ff' }) }))

        expect(result.current.blocked).toBe(true)

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS * 3)
        })

        expect(mockPut).not.toHaveBeenCalled()
    })

    it('flush reports clean without saving when nothing changed', async () => {
        const { result } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        let flushResult: FlushResult | undefined
        await act(async () => {
            flushResult = await result.current.flush()
        })

        expect(flushResult).toBe('clean')
        expect(mockPut).not.toHaveBeenCalled()
    })

    it('flush saves immediately without waiting for the debounce', async () => {
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        rerender(makeProps({ form: editedForm({ subject: 'Changed subject' }) }))

        let flushResult: FlushResult | undefined
        await act(async () => {
            flushResult = await result.current.flush()
        })

        expect(flushResult).toBe('saved')
        expect(mockPut).toHaveBeenCalledTimes(1)
        expect(mockPut.mock.calls[0][1]).toMatchObject({ snapshot: 'autosave' })
        expect(result.current.status).toBe('saved')
    })

    it('flush reports blocked without saving when title is missing', async () => {
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        rerender(makeProps({ form: editedForm({ title: '' }) }))

        let flushResult: FlushResult | undefined
        await act(async () => {
            flushResult = await result.current.flush()
        })

        expect(flushResult).toBe('blocked')
        expect(mockPut).not.toHaveBeenCalled()
    })

    it('reports an error status when the save request fails', async () => {
        mockPut.mockRejectedValueOnce(new Error('network down'))

        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        rerender(makeProps({ form: editedForm({ content: '<p>unsaved</p>' }) }))

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)
        })

        expect(result.current.status).toBe('error')
        expect(result.current.dirty).toBe(true)

        await act(async () => {
            await jest.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS * 3)
        })
        expect(mockPut).toHaveBeenCalledTimes(1)
    })

    it('blocks page unload only while changes are unsaved', async () => {
        const { result, rerender } = renderHook((props) => useNewsletterAutosave(props), {
            initialProps: makeProps(),
        })

        const cleanEvent = new Event('beforeunload', { cancelable: true })
        window.dispatchEvent(cleanEvent)
        expect(cleanEvent.defaultPrevented).toBe(false)

        const dirtyEvent = makeProps({ form: editedForm({ content: '<p>typed</p>' }) })
        rerender(dirtyEvent)

        const unsavedEvent = new Event('beforeunload', { cancelable: true })
        window.dispatchEvent(unsavedEvent)
        expect(unsavedEvent.defaultPrevented).toBe(true)

        await act(async () => {
            await result.current.flush()
        })

        const savedEvent = new Event('beforeunload', { cancelable: true })
        window.dispatchEvent(savedEvent)
        expect(savedEvent.defaultPrevented).toBe(false)
    })
})
