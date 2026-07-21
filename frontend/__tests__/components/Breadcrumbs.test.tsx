import React from 'react'
import { render, screen } from '@testing-library/react'
import Breadcrumbs from '@/components/Breadcrumbs'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

import { usePathname } from 'next/navigation'

const mockUsePathname = usePathname as jest.Mock

describe('Breadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns nothing on homepage', () => {
    mockUsePathname.mockReturnValue('/')
    const { container } = render(<Breadcrumbs />)
    expect(container.firstChild).toBeNull()
  })

  it('renders Home link', () => {
    mockUsePathname.mockReturnValue('/about')
    render(<Breadcrumbs />)
    expect(screen.getByText('Home')).not.toBeNull()
  })

  it('renders current page label', () => {
    mockUsePathname.mockReturnValue('/about')
    render(<Breadcrumbs />)
    expect(screen.getByText('About Us')).not.toBeNull()
  })

  it('maps known paths to labels', () => {
    mockUsePathname.mockReturnValue('/insights')
    render(<Breadcrumbs />)
    expect(screen.getByText('Insights')).not.toBeNull()
  })

  it('converts unknown segments with dashes replaced by spaces', () => {
    mockUsePathname.mockReturnValue('/some-page')
    render(<Breadcrumbs />)
    expect(screen.getByText('some page')).not.toBeNull()
  })

  it('renders multi-level breadcrumbs', () => {
    mockUsePathname.mockReturnValue('/insights/my-article')
    render(<Breadcrumbs />)
    expect(screen.getByText('Home')).not.toBeNull()
    expect(screen.getByText('Insights')).not.toBeNull()
    expect(screen.getByText('my article')).not.toBeNull()
  })

  it('links intermediate segments', () => {
    mockUsePathname.mockReturnValue('/insights/my-article')
    render(<Breadcrumbs />)
    const insightsLink = screen.getByText('Insights').closest('a')
    expect(insightsLink?.getAttribute('href')).toBe('/insights')
  })

  it('does not link the last segment', () => {
    mockUsePathname.mockReturnValue('/about')
    render(<Breadcrumbs />)
    const aboutText = screen.getByText('About Us')
    expect(aboutText.tagName).not.toBe('A')
  })
})
