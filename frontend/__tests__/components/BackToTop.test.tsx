import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import BackToTop from '@/components/BackToTop'

describe('BackToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn()
  })

  it('does not render when page is at top', () => {
    render(<BackToTop />)
    expect(screen.queryByLabelText('Back to top')).toBeNull()
  })

  it('renders when scrolled past 400px', () => {
    render(<BackToTop />)
    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 500 } })
    })
    expect(screen.getByLabelText('Back to top')).not.toBeNull()
  })

  it('scrolls to top when clicked', () => {
    render(<BackToTop />)
    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 500 } })
    })
    screen.getByLabelText('Back to top').click()
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('does not show at exactly 400px', () => {
    render(<BackToTop />)
    act(() => {
      fireEvent.scroll(window, { target: { scrollY: 400 } })
    })
    expect(screen.queryByLabelText('Back to top')).toBeNull()
  })
})
