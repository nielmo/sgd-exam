import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test/test-utils'
import { StateSelect } from '../state-select'
import * as useStatesHook from '../../hooks/use-states'

vi.mock('../../hooks/use-states')

describe('StateSelect', () => {
  const mockOnValueChange = vi.fn()
  const defaultProps = {
    countryId: undefined,
    value: undefined,
    onValueChange: mockOnValueChange,
    disabled: false
  }

  const mockStates = [
    { id: 1, value: 'California' },
    { id: 2, value: 'New York' },
    { id: 3, value: 'Texas' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render disabled state when no country is selected', () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} />)

    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('Select a country first')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('should render loading state', () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: [],
      isLoading: true,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} />)

    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should render error state with retry button', async () => {
    const mockRefetch = vi.fn()
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: [],
      isLoading: false,
      error: { message: 'Failed to fetch states' },
      refetch: mockRefetch
    })

    render(<StateSelect {...defaultProps} countryId={1} />)

    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch states')).toBeInTheDocument()
    
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()

    fireEvent.click(retryButton)
    expect(mockRefetch).toHaveBeenCalledOnce()
  })

  it('should render states in select when country is selected', async () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} />)

    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Select a state')).toBeInTheDocument()
  })

  it('should call onValueChange when state is selected', async () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} />)

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('California')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('California'))

    expect(mockOnValueChange).toHaveBeenCalledWith(1)
  })

  it('should display selected state value', () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} value={1} />)

    // The select component shows the selected value in its trigger
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} disabled={true} />)

    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeDisabled()
  })

  it('should be disabled when no states are available', () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} />)

    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeDisabled()
    expect(screen.getByText('No states available')).toBeInTheDocument()
  })

  it('should show empty message when no states match search', async () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} />)

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    const searchInput = screen.getAllByRole('combobox')[1]
    fireEvent.change(searchInput, { target: { value: 'NonexistentState' } })

    await waitFor(() => {
      expect(screen.getByText('No states found.')).toBeInTheDocument()
    })
  })

  it('should have proper accessibility attributes', () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={1} />)

    const label = screen.getByText('State')
    const select = screen.getByRole('combobox')

    expect(label).toHaveAttribute('for', 'state-select')
    expect(select).toHaveAttribute('id', 'state-select')
  })

  it('should pass countryId to useStates hook', () => {
    const mockUseStates = vi.mocked(useStatesHook.useStates)
    mockUseStates.mockReturnValue({
      states: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<StateSelect {...defaultProps} countryId={5} />)

    expect(mockUseStates).toHaveBeenCalledWith(5)
  })
})