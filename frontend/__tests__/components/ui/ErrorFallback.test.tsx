import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorFallback } from '@/components/ui/ErrorFallback'

describe('ErrorFallback', () => {
  it('renders default error message', () => {
    render(<ErrorFallback />)
    expect(screen.getByText('Something went wrong')).not.toBeNull()
    expect(screen.getByText(/We couldn't load this content/)).not.toBeNull()
  })

  it('renders custom title and message', () => {
    render(
      <ErrorFallback title="Custom Error" message="Custom message here" />
    )
    expect(screen.getByText('Custom Error')).not.toBeNull()
    expect(screen.getByText('Custom message here')).not.toBeNull()
  })

  it('renders retry button when onRetry is provided', () => {
    const onRetry = jest.fn()
    render(<ErrorFallback onRetry={onRetry} />)
    expect(screen.getByText('Try Again')).not.toBeNull()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn()
    render(<ErrorFallback onRetry={onRetry} />)
    screen.getByText('Try Again').click()
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('hides retry button when onRetry is not provided', () => {
    render(<ErrorFallback />)
    expect(screen.queryByText('Try Again')).toBeNull()
  })

  it('renders compact variant', () => {
    render(<ErrorFallback compact />)
    expect(screen.queryByText('Something went wrong')).toBeNull()
    expect(screen.getByText(/We couldn't load this content/)).not.toBeNull()
  })

  it('renders retry in compact variant', () => {
    const onRetry = jest.fn()
    render(<ErrorFallback compact onRetry={onRetry} />)
    expect(screen.getByText('Retry')).not.toBeNull()
  })
})
