import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).not.toBeNull()
    expect(button.tagName).toBe('BUTTON')
  })

  it('renders with text content', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByText('Submit')).not.toBeNull()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveProperty('disabled', true)
  })

  it('renders as button element by default', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button').tagName).toBe('BUTTON')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire click when disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Click</Button>)
    screen.getByRole('button').click()
    expect(handleClick).not.toHaveBeenCalled()
  })
})
