import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { CountryStateForm } from '../country-state-form'
import * as useCountriesHook from '../../hooks/use-countries'
import * as useStatesHook from '../../hooks/use-states'

vi.mock('../../hooks/use-countries')
vi.mock('../../hooks/use-states')

describe('CountryStateForm', () => {
  const mockCountries = [
    { id: 1, value: 'United States' },
    { id: 2, value: 'Canada' }
  ]

  const mockStates = [
    { id: 1, value: 'California' },
    { id: 2, value: 'New York' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock for useCountries
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    // Default mock for useStates
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })
  })

  it('should render the form with title and description', () => {
    render(<CountryStateForm />)

    expect(screen.getByText('Select Location')).toBeInTheDocument()
    expect(screen.getByText('Choose your country and state from the dropdowns below')).toBeInTheDocument()
  })

  it('should render country and state selects', () => {
    render(<CountryStateForm />)

    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('Select a country')).toBeInTheDocument()
    expect(screen.getByText('Select a country first')).toBeInTheDocument()
  })

  it('should enable state select when country is selected', async () => {
    vi.mocked(useStatesHook.useStates).mockReturnValue({
      states: mockStates,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(<CountryStateForm />)

    // Select a country
    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // State select should now be enabled with states
    await waitFor(() => {
      expect(screen.getByText('Select a state')).toBeInTheDocument()
    })
  })

  it('should clear state selection when country changes', async () => {
    // Mock states hook to return different results based on countryId
    vi.mocked(useStatesHook.useStates).mockImplementation((countryId) => {
      if (countryId === 1) {
        return {
          states: mockStates,
          isLoading: false,
          error: null,
          refetch: vi.fn()
        }
      }
      return {
        states: [],
        isLoading: false,
        error: null,
        refetch: vi.fn()
      }
    })

    render(<CountryStateForm />)

    // Select first country
    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // Wait for states to be available and select a state
    await waitFor(() => {
      expect(screen.getByText('Select a state')).toBeInTheDocument()
    })

    const stateSelect = screen.getByRole('combobox', { name: /state/i })
    fireEvent.click(stateSelect)

    await waitFor(() => {
      expect(screen.getByText('California')).toBeInTheDocument()
    }, { timeout: 3000 })

    fireEvent.click(screen.getByText('California'))

    // Should show selected IDs
    await waitFor(() => {
      expect(screen.getByText(/Selected: Country ID 1, State ID 1/)).toBeInTheDocument()
    })

    // Change country - this should clear state selection
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Canada'))

    // Selected state should be cleared (selection display should disappear)
    await waitFor(() => {
      expect(screen.queryByText(/Selected: Country ID/)).not.toBeInTheDocument()
    })
  })

  it('should display selection summary when both country and state are selected', async () => {
    vi.mocked(useStatesHook.useStates).mockImplementation((countryId) => {
      if (countryId === 1) {
        return {
          states: mockStates,
          isLoading: false,
          error: null,
          refetch: vi.fn()
        }
      }
      return {
        states: [],
        isLoading: false,
        error: null,
        refetch: vi.fn()
      }
    })

    render(<CountryStateForm />)

    // Select country
    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // Wait for states to be available and select a state
    await waitFor(() => {
      expect(screen.getByText('Select a state')).toBeInTheDocument()
    })

    const stateSelect = screen.getByRole('combobox', { name: /state/i })
    fireEvent.click(stateSelect)

    await waitFor(() => {
      expect(screen.getByText('California')).toBeInTheDocument()
    }, { timeout: 3000 })

    fireEvent.click(screen.getByText('California'))

    // Should show selection summary
    await waitFor(() => {
      expect(screen.getByText(/Selected: Country ID 1, State ID 1/)).toBeInTheDocument()
    })
  })

  it('should not display selection summary when only country is selected', async () => {
    render(<CountryStateForm />)

    // Select only country
    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // Should not show selection summary
    expect(screen.queryByText(/Selected: Country ID/)).not.toBeInTheDocument()
  })

  it('should handle country selection error gracefully', () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: [],
      isLoading: false,
      error: { message: 'Failed to fetch countries' },
      refetch: vi.fn()
    })

    render(<CountryStateForm />)

    expect(screen.getByText('Failed to fetch countries')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('should handle state selection error gracefully', async () => {
    // Mock error state for states hook when a country is selected
    vi.mocked(useStatesHook.useStates).mockImplementation((countryId) => {
      if (countryId === 1) {
        return {
          states: [],
          isLoading: false,
          error: { message: 'Failed to fetch states' },
          refetch: vi.fn()
        }
      }
      return {
        states: [],
        isLoading: false,
        error: null,
        refetch: vi.fn()
      }
    })

    render(<CountryStateForm />)

    // First select a country to trigger states fetch
    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))
    
    // The state error should be visible now
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch states')).toBeInTheDocument()
    })
  })

  it('should show loading states correctly', () => {
    vi.mocked(useCountriesHook.useCountries).mockReturnValue({
      countries: [],
      isLoading: true,
      error: null,
      refetch: vi.fn()
    })

    render(<CountryStateForm />)

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})