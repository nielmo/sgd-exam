import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ErrorBoundary, DefaultErrorFallback } from '../error-boundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  const originalError = console.error
  
  beforeEach(() => {
    console.error = vi.fn()
  })
  
  afterEach(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders default error fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred while loading the application')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('renders custom fallback component when provided', () => {
    const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
      <div>
        <h1>Custom Error</h1>
        <p>{error.message}</p>
        <button onClick={resetError}>Reset</button>
      </div>
    )

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('resets error state when reset button is clicked', async () => {
    const user = userEvent.setup()
    let shouldThrow = true
    
    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>Recovered</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    shouldThrow = false
    
    const resetButton = screen.getByRole('button', { name: /try again/i })
    await user.click(resetButton)
    
    rerender(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Recovered')).toBeInTheDocument()
  })

  it('logs error information when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(console.error).toHaveBeenCalledWith(
      'Error caught by boundary:',
      expect.any(Error),
      expect.any(Object)
    )
  })
})

describe('DefaultErrorFallback', () => {
  it('renders error message and reset button', () => {
    const mockResetError = vi.fn()
    const mockError = new Error('Test error message')

    render(<DefaultErrorFallback error={mockError} resetError={mockResetError} />)
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('calls resetError when try again button is clicked', async () => {
    const user = userEvent.setup()
    const mockResetError = vi.fn()
    const mockError = new Error('Test error')

    render(<DefaultErrorFallback error={mockError} resetError={mockResetError} />)
    
    const button = screen.getByRole('button', { name: /try again/i })
    await user.click(button)
    
    expect(mockResetError).toHaveBeenCalledTimes(1)
  })

  it('displays error with destructive styling', () => {
    const mockResetError = vi.fn()
    const mockError = new Error('Test error')

    render(<DefaultErrorFallback error={mockError} resetError={mockResetError} />)
    
    const card = screen.getByText('Something went wrong').closest('[data-slot="card"]')
    expect(card).toHaveClass('border-destructive')
  })
})