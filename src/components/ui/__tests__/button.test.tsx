import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '../button'

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Click me')
    expect(button).toHaveAttribute('data-slot', 'button')
  })

  it('renders with different variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
    
    variants.forEach(variant => {
      const { unmount } = render(<Button variant={variant}>Test</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      unmount()
    })
  })

  it('renders with different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const
    
    sizes.forEach(size => {
      const { unmount } = render(<Button size={size}>Test</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      unmount()
    })
  })

  it('renders as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('Link Button')
    expect(link).toHaveAttribute('data-slot', 'button')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards props correctly', () => {
    render(<Button disabled type="submit">Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('buttonVariants function returns correct class names', () => {
    expect(buttonVariants()).toContain('inline-flex')
    expect(buttonVariants({ variant: 'destructive' })).toContain('bg-destructive')
    expect(buttonVariants({ size: 'sm' })).toContain('h-8')
    expect(buttonVariants({ variant: 'outline', size: 'lg' })).toContain('border')
  })
})