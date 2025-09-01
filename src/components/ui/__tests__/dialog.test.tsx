import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../dialog'

describe('Dialog Components', () => {
  describe('Dialog', () => {
    it('renders with correct data-slot', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog content
          </DialogContent>
        </Dialog>
      )
      
      const dialogContent = screen.getByText('Dialog content')
      expect(dialogContent).toBeInTheDocument()
      expect(dialogContent.closest('[data-slot="dialog-content"]')).toBeInTheDocument()
    })
  })

  describe('DialogTrigger', () => {
    it('renders trigger button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            Content
          </DialogContent>
        </Dialog>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open Dialog' })
      expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger')
    })

    it('opens dialog when clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
            Dialog is open
          </DialogContent>
        </Dialog>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)
      
      expect(screen.getByText('Dialog is open')).toBeInTheDocument()
    })
  })

  describe('DialogContent', () => {
    it('renders with correct styling and data-slot', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            Content
          </DialogContent>
        </Dialog>
      )
      
      const content = screen.getByText('Content')
      expect(content).toHaveAttribute('data-slot', 'dialog-content')
      expect(content).toHaveClass('bg-background', 'fixed', 'top-[50%]', 'left-[50%]')
    })

    it('shows close button by default', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            Content
          </DialogContent>
        </Dialog>
      )
      
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    it('hides close button when showCloseButton is false', () => {
      render(
        <Dialog open={true}>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            Content
          </DialogContent>
        </Dialog>
      )
      
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <Dialog open={true}>
          <DialogContent className="custom-dialog">
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            Content
          </DialogContent>
        </Dialog>
      )
      
      const content = screen.getByText('Content')
      expect(content).toHaveClass('custom-dialog')
    })
  })

  describe('DialogHeader', () => {
    it('renders with correct styling and data-slot', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <DialogHeader>Header content</DialogHeader>
          </DialogContent>
        </Dialog>
      )
      
      const header = screen.getByText('Header content')
      expect(header).toHaveAttribute('data-slot', 'dialog-header')
      expect(header).toHaveClass('flex', 'flex-col', 'gap-2', 'text-center', 'sm:text-left')
    })
  })

  describe('DialogTitle', () => {
    it('renders with correct styling and data-slot', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogContent>
        </Dialog>
      )
      
      const title = screen.getByText('Dialog Title')
      expect(title).toHaveAttribute('data-slot', 'dialog-title')
      expect(title).toHaveClass('text-lg', 'leading-none', 'font-semibold')
    })
  })

  describe('DialogDescription', () => {
    it('renders with correct styling and data-slot', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </Dialog>
      )
      
      const description = screen.getByText('Dialog description')
      expect(description).toHaveAttribute('data-slot', 'dialog-description')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })
  })

  describe('DialogFooter', () => {
    it('renders with correct styling and data-slot', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <DialogFooter>Footer content</DialogFooter>
          </DialogContent>
        </Dialog>
      )
      
      const footer = screen.getByText('Footer content')
      expect(footer).toHaveAttribute('data-slot', 'dialog-footer')
      expect(footer).toHaveClass('flex', 'flex-col-reverse', 'gap-2', 'sm:flex-row', 'sm:justify-end')
    })
  })

  describe('DialogClose', () => {
    it('closes dialog when clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <div>Dialog content</div>
            <DialogClose>Close Dialog</DialogClose>
          </DialogContent>
        </Dialog>
      )
      
      expect(screen.getByText('Dialog content')).toBeInTheDocument()
      
      const closeButton = screen.getByRole('button', { name: 'Close Dialog' })
      await user.click(closeButton)
      
      expect(screen.queryByText('Dialog content')).not.toBeInTheDocument()
    })
  })

  describe('Complete Dialog Structure', () => {
    it('renders full dialog with all components', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>This is a test dialog</DialogDescription>
            </DialogHeader>
            <div>Dialog body content</div>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open Dialog' })
      await user.click(trigger)
      
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()
      expect(screen.getByText('This is a test dialog')).toBeInTheDocument()
      expect(screen.getByText('Dialog body content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>This dialog is accessible</DialogDescription>
            <div>Content</div>
          </DialogContent>
        </Dialog>
      )
      
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
    })
  })
})