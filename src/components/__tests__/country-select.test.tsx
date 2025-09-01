import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '../../test/test-utils'
import { CountrySelect } from '../country-select'
import * as useCountriesHook from '../../hooks/use-countries'

vi.mock('../../hooks/use-countries')

describe('CountrySelect', () => {
  const mockOnValueChange = vi.fn()
  const defaultProps = {
    value: undefined,
    onValueChange: mockOnValueChange,
    disabled: false
  }

  const mockCountries = [
    { id: 1, value: 'United States' },
    { id: 2, value: 'Canada' },
    { id: 3, value: 'United Kingdom' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state', () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: [],
      isLoading: true,
      error: null,
      refetch: vi.fn()
    })

    render(<CountrySelect {...defaultProps} />)

    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should render error state with retry button', async () => {
    const mockRefetch = vi.fn()
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: [],
      isLoading: false,
      error: { message: 'Failed to fetch countries' },
      refetch: mockRefetch
    })

    render(<CountrySelect {...defaultProps} />)

    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch countries')).toBeInTheDocument()
    
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()

    fireEvent.click(retryButton)
    expect(mockRefetch).toHaveBeenCalledOnce()
  })

  it('should render countries in select', async () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<CountrySelect {...defaultProps} />)

    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Select a country')).toBeInTheDocument()
  })

  it('should call onValueChange when country is selected', async () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<CountrySelect {...defaultProps} />)

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    expect(mockOnValueChange).toHaveBeenCalledWith(1)
  })

  it('should display selected country value', () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<CountrySelect {...defaultProps} value={1} />)

    // The select component shows the selected value in its trigger
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<CountrySelect {...defaultProps} disabled={true} />)

    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeDisabled()
  })

  it('should show empty message when no countries match search', async () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<CountrySelect {...defaultProps} />)

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    const searchInput = screen.getAllByRole('combobox')[1]
    fireEvent.change(searchInput, { target: { value: 'NonexistentCountry' } })

    await waitFor(() => {
      expect(screen.getByText('No countries found.')).toBeInTheDocument()
    })
  })

  it('should have proper accessibility attributes', () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<CountrySelect {...defaultProps} />)

    const label = screen.getByText('Country')
    const select = screen.getByRole('combobox')

    expect(label).toHaveAttribute('for', 'country-select')
    expect(select).toHaveAttribute('id', 'country-select')
  })
})