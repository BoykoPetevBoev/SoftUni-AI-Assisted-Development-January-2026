import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={vi.fn()} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button label="Click me" onClick={handleClick} />)

    const button = screen.getByText('Click me')
    await user.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Disabled" onClick={vi.fn()} disabled />)
    const button = screen.getByText('Disabled') as HTMLButtonElement
    expect(button).toBeDisabled()
  })

  it('applies primary variant class by default', () => {
    render(<Button label="Primary" onClick={vi.fn()} />)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('btn', 'btn-primary')
  })

  it('applies secondary variant class when variant prop is set', () => {
    render(<Button label="Secondary" onClick={vi.fn()} variant="secondary" />)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('btn', 'btn-secondary')
  })
})
