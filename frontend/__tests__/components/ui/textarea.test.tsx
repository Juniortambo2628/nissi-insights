import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter message" />)
    expect(screen.getByPlaceholderText('Enter message')).not.toBeNull()
  })

  it('accepts text input', async () => {
    const user = userEvent.setup()
    render(<Textarea placeholder="Type here" />)
    const textarea = screen.getByPlaceholderText('Type here')
    await user.type(textarea, 'hello world')
    expect((textarea as HTMLTextAreaElement).value).toBe('hello world')
  })

  it('can be disabled', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toHaveProperty('disabled', true)
  })

  it('applies custom className', () => {
    render(<Textarea className="custom" />)
    expect(screen.getByRole('textbox').className).toContain('custom')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })
})
