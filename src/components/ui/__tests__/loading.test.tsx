import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import { LoadingSpinner, LoadingSkeleton } from '../loading'

describe('Loading Components', () => {
  describe('LoadingSpinner', () => {
    it('should render with default size', () => {
      render(<LoadingSpinner />)
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('should render with small size', () => {
      render(<LoadingSpinner size="sm" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('h-4', 'w-4')
    })

    it('should render with default size when size is not specified', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('h-6', 'w-6')
    })
  })

  describe('LoadingSkeleton', () => {
    it('should render with default classes', () => {
      render(<LoadingSkeleton />)
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<LoadingSkeleton className="custom-class" />)
      const skeleton = screen.getByTestId('loading-skeleton')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('custom-class')
    })
  })
})