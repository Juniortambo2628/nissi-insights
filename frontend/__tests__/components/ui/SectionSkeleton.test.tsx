import React from 'react'
import { render, screen } from '@testing-library/react'
import { SectionSkeleton } from '@/components/ui/SectionSkeleton'

describe('SectionSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<SectionSkeleton />)
    expect(container.querySelector('.animate-pulse')).not.toBeNull()
  })

  it('shows header skeleton by default', () => {
    render(<SectionSkeleton />)
    const pulses = document.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBeGreaterThan(0)
  })

  it('hides header when showHeader is false', () => {
    const { container } = render(<SectionSkeleton showHeader={false} />)
    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBeGreaterThan(0)
  })

  it('renders card variant', () => {
    const { container } = render(<SectionSkeleton variant="cards" rows={3} />)
    const cards = container.querySelectorAll('.rounded-xl')
    expect(cards.length).toBe(3)
  })

  it('renders grid variant', () => {
    const { container } = render(<SectionSkeleton variant="grid" rows={4} />)
    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBeGreaterThan(0)
  })

  it('renders media skeleton when showMedia is true', () => {
    const { container } = render(<SectionSkeleton showMedia />)
    const mediaSkeleton = container.querySelector('.aspect-\\[3\\/4\\]')
    expect(mediaSkeleton).not.toBeNull()
  })

  it('applies custom className', () => {
    const { container } = render(<SectionSkeleton className="custom-class" />)
    expect((container.firstChild as Element)?.className).toContain('custom-class')
  })

  it('renders correct number of rows in cards variant', () => {
    const { container } = render(<SectionSkeleton variant="cards" rows={5} />)
    const cards = container.querySelectorAll('.rounded-xl')
    expect(cards.length).toBe(5)
  })
})
