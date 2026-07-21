import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SocialShare from '@/components/SocialShare'

describe('SocialShare', () => {
  const defaultProps = {
    title: 'Test Article',
    slug: 'test-article',
    type: 'insights' as const,
  }

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://nissi-insights.com' },
      writable: true,
    })
    window.open = jest.fn()
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders share label and buttons', () => {
    render(<SocialShare {...defaultProps} />)
    expect(screen.getByText('Share')).not.toBeNull()
    expect(screen.getByTitle('Share on LinkedIn')).not.toBeNull()
    expect(screen.getByTitle('Share on X')).not.toBeNull()
    expect(screen.getByTitle('Copy link')).not.toBeNull()
  })

  it('opens LinkedIn share URL on click', () => {
    render(<SocialShare {...defaultProps} />)
    fireEvent.click(screen.getByTitle('Share on LinkedIn'))
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing/share-offsite'),
      '_blank',
      'width=600,height=400'
    )
  })

  it('opens Twitter share URL on click', () => {
    render(<SocialShare {...defaultProps} />)
    fireEvent.click(screen.getByTitle('Share on X'))
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      '_blank',
      'width=600,height=400'
    )
  })

  it('copies link to clipboard', async () => {
    render(<SocialShare {...defaultProps} />)
    fireEvent.click(screen.getByTitle('Copy link'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://nissi-insights.com/insights/test-article'
    )
  })

  it('encodes title and URL properly', () => {
    render(<SocialShare title="Hello World & Co." slug="hello-co" type="case-studies" />)
    fireEvent.click(screen.getByTitle('Share on X'))
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('Hello World & Co.')),
      '_blank',
      'width=600,height=400'
    )
  })
})
