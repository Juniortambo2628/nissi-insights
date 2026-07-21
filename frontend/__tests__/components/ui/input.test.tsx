import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).not.toBeNull()
  })

  it('renders with default type', () => {
    render(<Input />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.type).toBe('text')
  })

  it('accepts text input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'hello')
    expect((input as HTMLInputElement).value).toBe('hello')
  })

  it('can be disabled', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toHaveProperty('disabled', true)
  })

  it('applies custom className', () => {
    render(<Input className="my-class" />)
    expect(screen.getByRole('textbox').className).toContain('my-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
