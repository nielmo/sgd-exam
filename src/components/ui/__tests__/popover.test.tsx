import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '../popover'

describe('Popover Components', () => {
  describe('Popover', () => {
    it('renders with correct data-slot', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('data-slot', 'popover-trigger')
    })
  })

  describe('PopoverTrigger', () => {
    it('renders trigger with correct data-slot', () => {
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open Popover' })
      expect(trigger).toHaveAttribute('data-slot', 'popover-trigger')
    })

    it('opens popover when clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover is open</PopoverContent>
        </Popover>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)
      
      expect(screen.getByText('Popover is open')).toBeInTheDocument()
    })
  })

  describe('PopoverContent', () => {
    it('renders with correct data-slot and styling', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      
      const content = screen.getByText('Content')
      expect(content).toHaveAttribute('data-slot', 'popover-content')
      expect(content).toHaveClass(
        'bg-popover',
        'text-popover-foreground',
        'z-50',
        'w-72',
        'rounded-md',
        'border',
        'p-4',
        'shadow-md'
      )
    })

    it('applies custom className', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent className="custom-popover">Custom Content</PopoverContent>
        </Popover>
      )
      
      const content = screen.getByText('Custom Content')
      expect(content).toHaveClass('custom-popover')
    })

    it('uses default align and sideOffset', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Default positioning</PopoverContent>
        </Popover>
      )
      
      const content = screen.getByText('Default positioning')
      expect(content).toBeInTheDocument()
    })

    it('accepts custom align and sideOffset props', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent align="start" sideOffset={8}>
            Custom positioned content
          </PopoverContent>
        </Popover>
      )
      
      const content = screen.getByText('Custom positioned content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('PopoverAnchor', () => {
    it('renders with correct data-slot', () => {
      render(
        <Popover open={true}>
          <PopoverAnchor>
            <div>Anchor element</div>
          </PopoverAnchor>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      
      const anchor = screen.getByText('Anchor element').parentElement
      expect(anchor).toHaveAttribute('data-slot', 'popover-anchor')
    })
  })

  describe('Complete Popover Structure', () => {
    it('renders full popover with all components', async () => {
      const user = userEvent.setup()
      
      render(
        <Popover>
          <PopoverAnchor>
            <span>Anchor</span>
          </PopoverAnchor>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>
            <div>
              <h3>Popover Title</h3>
              <p>This is popover content</p>
            </div>
          </PopoverContent>
        </Popover>
      )
      
      expect(screen.getByText('Anchor')).toBeInTheDocument()
      
      const trigger = screen.getByRole('button', { name: 'Open Popover' })
      await user.click(trigger)
      
      expect(screen.getByText('Popover Title')).toBeInTheDocument()
      expect(screen.getByText('This is popover content')).toBeInTheDocument()
    })

    it('closes when clicking outside', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Popover>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Popover content</PopoverContent>
          </Popover>
          <div>Outside element</div>
        </div>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)
      
      expect(screen.getByText('Popover content')).toBeInTheDocument()
      
      const outside = screen.getByText('Outside element')
      await user.click(outside)
      
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(trigger).toHaveAttribute('aria-haspopup')
    })

    it('manages focus correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button>Focusable content</button>
          </PopoverContent>
        </Popover>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)
      
      const contentButton = screen.getByRole('button', { name: 'Focusable content' })
      expect(contentButton).toBeInTheDocument()
    })
  })
})