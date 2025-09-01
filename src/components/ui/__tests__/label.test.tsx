import { render, screen } from '@testing-library/react'
import { Label } from '../label'

describe('Label', () => {
  it('renders with correct content and data-slot', () => {
    render(<Label>Test Label</Label>)
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute('data-slot', 'label')
  })

  it('applies default styling classes', () => {
    render(<Label>Label</Label>)
    
    const label = screen.getByText('Label')
    expect(label).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-sm',
      'leading-none',
      'font-medium',
      'select-none'
    )
  })

  it('applies custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>)
    
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-label')
  })

  it('forwards HTML attributes', () => {
    render(<Label htmlFor="test-input">Form Label</Label>)
    
    const label = screen.getByText('Form Label')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('handles disability states through group/peer selectors', () => {
    render(
      <div className="group" data-disabled="true">
        <Label>Disabled Label</Label>
      </div>
    )
    
    const label = screen.getByText('Disabled Label')
    expect(label).toHaveClass('group-data-[disabled=true]:pointer-events-none')
    expect(label).toHaveClass('group-data-[disabled=true]:opacity-50')
  })

  it('handles peer-disabled states', () => {
    render(
      <div>
        <input disabled className="peer" />
        <Label>Peer Label</Label>
      </div>
    )
    
    const label = screen.getByText('Peer Label')
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed')
    expect(label).toHaveClass('peer-disabled:opacity-50')
  })

  it('works as form label for input association', () => {
    render(
      <div>
        <Label htmlFor="email">Email Address</Label>
        <input id="email" type="email" />
      </div>
    )
    
    const label = screen.getByLabelText('Email Address')
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute('type', 'email')
  })
})