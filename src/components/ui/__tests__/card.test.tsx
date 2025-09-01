import { render, screen } from '@testing-library/react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardAction, 
  CardContent, 
  CardFooter 
} from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default classes and data-slot', () => {
      render(<Card>Card content</Card>)
      const card = screen.getByText('Card content')
      expect(card).toHaveAttribute('data-slot', 'card')
      expect(card).toHaveClass('bg-card', 'text-card-foreground', 'flex', 'flex-col')
    })

    it('applies custom className', () => {
      render(<Card className="custom-card">Card content</Card>)
      const card = screen.getByText('Card content')
      expect(card).toHaveClass('custom-card')
    })
  })

  describe('CardHeader', () => {
    it('renders with correct data-slot and classes', () => {
      render(<CardHeader>Header content</CardHeader>)
      const header = screen.getByText('Header content')
      expect(header).toHaveAttribute('data-slot', 'card-header')
      expect(header).toHaveClass('@container/card-header', 'grid', 'auto-rows-min')
    })

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>)
      const header = screen.getByText('Header')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('renders with correct data-slot and classes', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText('Card Title')
      expect(title).toHaveAttribute('data-slot', 'card-title')
      expect(title).toHaveClass('leading-none', 'font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('renders with correct data-slot and classes', () => {
      render(<CardDescription>Card description</CardDescription>)
      const description = screen.getByText('Card description')
      expect(description).toHaveAttribute('data-slot', 'card-description')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })
  })

  describe('CardAction', () => {
    it('renders with correct data-slot and classes', () => {
      render(<CardAction>Action</CardAction>)
      const action = screen.getByText('Action')
      expect(action).toHaveAttribute('data-slot', 'card-action')
      expect(action).toHaveClass('col-start-2', 'row-span-2', 'row-start-1')
    })
  })

  describe('CardContent', () => {
    it('renders with correct data-slot and classes', () => {
      render(<CardContent>Card content</CardContent>)
      const content = screen.getByText('Card content')
      expect(content).toHaveAttribute('data-slot', 'card-content')
      expect(content).toHaveClass('px-6')
    })
  })

  describe('CardFooter', () => {
    it('renders with correct data-slot and classes', () => {
      render(<CardFooter>Footer content</CardFooter>)
      const footer = screen.getByText('Footer content')
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
      expect(footer).toHaveClass('flex', 'items-center', 'px-6')
    })
  })

  describe('Full Card Layout', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })
  })
})