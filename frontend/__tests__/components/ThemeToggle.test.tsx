import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/ThemeToggle'

const mockSetTheme = jest.fn()
let mockTheme = 'light'

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockTheme = 'light'
  })

  it('renders the toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).not.toBeNull()
  })

  it('toggles from light to dark on click', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('toggles from dark to light on click', async () => {
    mockTheme = 'dark'
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('shows SVG icon when theme is dark', () => {
    mockTheme = 'dark'
    const { container } = render(<ThemeToggle />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('shows SVG icon when theme is light', () => {
    const { container } = render(<ThemeToggle />)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
