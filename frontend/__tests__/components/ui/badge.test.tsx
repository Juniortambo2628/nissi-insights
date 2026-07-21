import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders with text content', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeTruthy()
  })

  it('renders as a div element', () => {
    render(<Badge>Tag</Badge>)
    const badge = screen.getByText('Tag')
    expect(badge.tagName).toBe('DIV')
  })

  it('applies default variant class', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toContain('inline-flex')
  })

  it('applies custom className', () => {
    render(<Badge className="extra">Test</Badge>)
    expect(screen.getByText('Test').className).toContain('extra')
  })

  it('spreads additional HTML attributes', () => {
    render(<Badge data-testid="custom-badge">Test</Badge>)
    expect(screen.getByTestId('custom-badge')).toBeTruthy()
  })
})
