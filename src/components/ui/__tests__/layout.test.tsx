import { render, screen } from '@testing-library/react'
import { Container, FormContainer } from '../layout'

describe('Layout Components', () => {
  describe('Container', () => {
    it('renders children with default container classes', () => {
      render(
        <Container>
          <div>Container content</div>
        </Container>
      )
      
      const container = screen.getByText('Container content').parentElement
      expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
    })

    it('applies custom className', () => {
      render(
        <Container className="custom-container">
          <div>Content</div>
        </Container>
      )
      
      const container = screen.getByText('Content').parentElement
      expect(container).toHaveClass('custom-container')
    })

    it('renders multiple children correctly', () => {
      render(
        <Container>
          <div>First child</div>
          <div>Second child</div>
        </Container>
      )
      
      expect(screen.getByText('First child')).toBeInTheDocument()
      expect(screen.getByText('Second child')).toBeInTheDocument()
    })
  })

  describe('FormContainer', () => {
    it('renders children with default form container classes', () => {
      render(
        <FormContainer>
          <div>Form content</div>
        </FormContainer>
      )
      
      const container = screen.getByText('Form content').parentElement
      expect(container).toHaveClass('max-w-md', 'mx-auto', 'space-y-6')
    })

    it('renders without title and description when not provided', () => {
      render(
        <FormContainer>
          <div>Form content</div>
        </FormContainer>
      )
      
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
      expect(screen.getByText('Form content')).toBeInTheDocument()
    })

    it('renders title when provided', () => {
      render(
        <FormContainer title="Login Form">
          <div>Form content</div>
        </FormContainer>
      )
      
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveTextContent('Login Form')
      expect(title).toHaveClass('text-2xl', 'font-bold')
    })

    it('renders description when provided', () => {
      render(
        <FormContainer description="Please enter your credentials">
          <div>Form content</div>
        </FormContainer>
      )
      
      const description = screen.getByText('Please enter your credentials')
      expect(description).toHaveClass('text-muted-foreground')
    })

    it('renders both title and description', () => {
      render(
        <FormContainer 
          title="Registration Form" 
          description="Create your account below"
        >
          <div>Form content</div>
        </FormContainer>
      )
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Registration Form')
      expect(screen.getByText('Create your account below')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <FormContainer className="custom-form">
          <div>Content</div>
        </FormContainer>
      )
      
      const container = screen.getByText('Content').parentElement
      expect(container).toHaveClass('custom-form')
    })

    it('renders header section with proper spacing when title/description exist', () => {
      render(
        <FormContainer 
          title="Test Title" 
          description="Test Description"
        >
          <form>Form</form>
        </FormContainer>
      )
      
      const headerSection = screen.getByText('Test Title').parentElement
      expect(headerSection).toHaveClass('text-center', 'space-y-2')
    })

    it('properly structures content with form children', () => {
      render(
        <FormContainer title="Contact Form">
          <form data-testid="contact-form">
            <input type="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        </FormContainer>
      )
      
      expect(screen.getByTestId('contact-form')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })
  })
})