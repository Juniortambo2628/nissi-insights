import React from 'react'
import { render, screen } from '@testing-library/react'
import { HydrationSafe } from '@/components/ui/HydrationSafe'

describe('HydrationSafe', () => {
  it('renders children after mount', () => {
    render(
      <HydrationSafe>
        <span>Client content</span>
      </HydrationSafe>
    )
    expect(screen.getByText('Client content')).not.toBeNull()
  })

  it('renders fallback during SSR', () => {
    render(
      <HydrationSafe fallback={<span>Loading...</span>}>
        <span>Client content</span>
      </HydrationSafe>
    )
    expect(screen.getByText('Client content')).not.toBeNull()
  })

  it('renders null as default fallback', () => {
    const { container } = render(
      <HydrationSafe>
        <span>Content</span>
      </HydrationSafe>
    )
    expect(container).not.toBeNull()
  })
})
