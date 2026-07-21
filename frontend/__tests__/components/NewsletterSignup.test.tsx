import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewsletterSignup from '@/components/NewsletterSignup'

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}))

const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

import api from '@/lib/api'

describe('NewsletterSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the form with email input and submit button', () => {
    render(<NewsletterSignup />)
    expect(screen.getByPlaceholderText('your@email.com')).not.toBeNull()
    expect(screen.getByRole('button', { name: /subscribe/i })).not.toBeNull()
  })

  it('renders heading and description text', () => {
    render(<NewsletterSignup />)
    expect(screen.getByText('Stay Informed')).not.toBeNull()
    expect(screen.getByText(/Get the latest insights/)).not.toBeNull()
  })

  it('allows typing an email address', async () => {
    const user = userEvent.setup()
    render(<NewsletterSignup />)
    const input = screen.getByPlaceholderText('your@email.com')
    await user.type(input, 'test@example.com')
    expect((input as HTMLInputElement).value).toBe('test@example.com')
  })

  it('submits the form and calls API', async () => {
    const user = userEvent.setup()
    const mockPost = api.post as jest.MockedFunction<typeof api.post>
    mockPost.mockResolvedValueOnce({ data: { message: 'Subscribed' } } as any)

    render(<NewsletterSignup />)
    const input = screen.getByPlaceholderText('your@email.com')
    const button = screen.getByRole('button', { name: /subscribe/i })

    await user.type(input, 'test@example.com')
    await user.click(button)

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/subscribe', {
        email: 'test@example.com',
        source: 'footer',
      })
    })
  })

  it('clears email after successful submission', async () => {
    const user = userEvent.setup()
    const mockPost = api.post as jest.MockedFunction<typeof api.post>
    mockPost.mockResolvedValueOnce({ data: {} } as any)

    render(<NewsletterSignup />)
    const input = screen.getByPlaceholderText('your@email.com')

    await user.type(input, 'test@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe('')
    })
  })

  it('shows error toast on API failure', async () => {
    const user = userEvent.setup()
    const mockPost = api.post as jest.MockedFunction<typeof api.post>
    mockPost.mockRejectedValueOnce({ response: { data: { message: 'Already subscribed' } } })

    render(<NewsletterSignup />)
    await user.type(screen.getByPlaceholderText('your@email.com'), 'dup@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: 'destructive' })
      )
    })
  })

  it('does not submit empty email', async () => {
    const user = userEvent.setup()
    const mockPost = api.post as jest.MockedFunction<typeof api.post>

    render(<NewsletterSignup />)
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(mockPost).not.toHaveBeenCalled()
  })
})
