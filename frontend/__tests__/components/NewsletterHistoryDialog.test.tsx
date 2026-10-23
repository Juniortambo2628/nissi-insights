import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewsletterHistoryDialog from '@/components/admin/NewsletterHistoryDialog'
import { useApi } from '@/hooks/use-api'
import { Newsletter, NewsletterRevision } from '@/types/api'
import api from '@/lib/api'

jest.mock('@/hooks/use-api', () => ({
    useApi: jest.fn(),
}))

jest.mock('@/hooks/use-toast', () => ({
    useToast: () => ({ toast: jest.fn() }),
}))

jest.mock('@/lib/api', () => ({
    __esModule: true,
    default: { post: jest.fn() },
}))

const mockUseApi = useApi as jest.Mock
const mockPost = api.post as jest.Mock

const revisions: NewsletterRevision[] = [
    {
        id: 11,
        source: 'autosave',
        title: 'Updated title',
        subject: 'Updated subject',
        excerpt: 'Latest body text',
        user: { id: 1, name: 'Admin' },
        created_at: '2026-10-23T10:30:00Z',
    },
    {
        id: 4,
        source: 'manual',
        title: 'Original title',
        subject: 'Original subject',
        excerpt: 'First body text',
        user: { id: 1, name: 'Admin' },
        created_at: '2026-10-23T09:00:00Z',
    },
]

const restoredNewsletter = { id: 3 } as Newsletter

const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    newsletterId: 3,
    onRestored: jest.fn(),
}

describe('NewsletterHistoryDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseApi.mockReturnValue({
            data: revisions,
            isLoading: false,
            isError: false,
            mutate: jest.fn(),
        })
        mockPost.mockResolvedValue({ data: restoredNewsletter })
    })

    it('requests revisions only when open with a newsletter id', () => {
        render(<NewsletterHistoryDialog {...defaultProps} />)

        expect(mockUseApi).toHaveBeenCalledWith('/newsletters/3/revisions')
    })

    it('does not fetch when closed', () => {
        render(<NewsletterHistoryDialog {...defaultProps} open={false} />)

        expect(mockUseApi).toHaveBeenCalledWith(null)
    })

    it('lists revisions with source labels, excerpt and timestamp', () => {
        render(<NewsletterHistoryDialog {...defaultProps} />)

        expect(screen.getByText('Updated title')).toBeInTheDocument()
        expect(screen.getByText('Original title')).toBeInTheDocument()
        expect(screen.getByText('Autosave')).toBeInTheDocument()
        expect(screen.getByText('Manual save')).toBeInTheDocument()
        expect(screen.getByText('Latest body text')).toBeInTheDocument()
        expect(screen.getAllByText(/· Admin/)).toHaveLength(2)
    })

    it('shows an empty state when there is no history', () => {
        mockUseApi.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            mutate: jest.fn(),
        })

        render(<NewsletterHistoryDialog {...defaultProps} />)

        expect(screen.getByText(/No versions yet/)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /restore/i })).toBeNull()
    })

    it('shows a loading state while history loads', () => {
        mockUseApi.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            mutate: jest.fn(),
        })

        render(<NewsletterHistoryDialog {...defaultProps} />)

        expect(screen.getByText(/Loading history/)).toBeInTheDocument()
    })

    it('restores a revision after confirmation', async () => {
        const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
        render(<NewsletterHistoryDialog {...defaultProps} />)

        const restoreButtons = screen.getAllByRole('button', { name: /restore/i })
        expect(restoreButtons).toHaveLength(2)

        fireEvent.click(restoreButtons[0])

        await waitFor(() => expect(defaultProps.onRestored).toHaveBeenCalledWith(restoredNewsletter))

        expect(confirmSpy).toHaveBeenCalled()
        expect(mockPost).toHaveBeenCalledWith('/newsletters/3/revisions/11/restore')

        confirmSpy.mockRestore()
    })

    it('does not restore when the user cancels the confirmation', () => {
        const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)

        render(<NewsletterHistoryDialog {...defaultProps} />)

        fireEvent.click(screen.getAllByRole('button', { name: /restore/i })[0])

        expect(mockPost).not.toHaveBeenCalled()
        expect(defaultProps.onRestored).not.toHaveBeenCalled()

        confirmSpy.mockRestore()
    })
})
