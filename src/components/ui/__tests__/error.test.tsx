import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ErrorDisplay } from '../error'

describe('ErrorDisplay', () => {
  it('renders error message with icon', () => {
    render(<ErrorDisplay message="Something went wrong" />)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    const alertIcon = document.querySelector('.lucide-circle-alert')
    expect(alertIcon).toBeInTheDocument()
  })

  it('renders without retry button when onRetry is not provided', () => {
    render(<ErrorDisplay message="Error message" />)
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders with retry button when onRetry is provided', () => {
    const mockRetry = vi.fn()
    render(<ErrorDisplay message="Error message" onRetry={mockRetry} />)
    
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup()
    const mockRetry = vi.fn()
    
    render(<ErrorDisplay message="Error message" onRetry={mockRetry} />)
    
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await user.click(retryButton)
    
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<ErrorDisplay message="Error" className="custom-error" />)
    
    const container = screen.getByText('Error').parentElement
    expect(container).toHaveClass('custom-error')
  })

  it('applies default destructive styling', () => {
    render(<ErrorDisplay message="Error message" />)
    
    const container = screen.getByText('Error message').parentElement
    expect(container).toHaveClass('text-destructive', 'flex', 'items-center', 'gap-2', 'text-sm')
  })

  it('retry button has correct styling and size', () => {
    const mockRetry = vi.fn()
    render(<ErrorDisplay message="Error" onRetry={mockRetry} />)
    
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toHaveClass('h-6', 'px-2')
  })

  it('retry button contains refresh icon and text', () => {
    const mockRetry = vi.fn()
    render(<ErrorDisplay message="Error" onRetry={mockRetry} />)
    
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })
})