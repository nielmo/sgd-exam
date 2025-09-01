import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils'
import { CountryStateForm } from '../../country-state-form'
import { server } from '../../../test/mocks/server'
import { http, HttpResponse } from 'msw'

const baseUrl = 'https://fedt.unruffledneumann.xyz/api/v1'

describe('Country-State Selection Integration', () => {
  beforeEach(() => {
    // Reset environment variables for testing
    process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL = baseUrl
    process.env.NEXT_PUBLIC_COUNTRY_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('should complete the full country-state selection flow', async () => {
    render(<CountryStateForm />)

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText('Select a country')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Select United States
    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // Wait for states to load and verify state select is enabled
    await waitFor(() => {
      expect(screen.getByText('Select a state')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Select California
    const stateSelect = screen.getByRole('combobox', { name: /state/i })
    fireEvent.click(stateSelect)

    await waitFor(() => {
      expect(screen.getByText('California')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('California'))

    // Verify selection summary is displayed
    await waitFor(() => {
      expect(screen.getByText(/Selected: Country ID 1, State ID 1/)).toBeInTheDocument()
    })
  })

  it('should handle country change and clear state selection', async () => {
    render(<CountryStateForm />)

    // Wait for countries to load and select United States
    await waitFor(() => {
      expect(screen.getByText('Select a country')).toBeInTheDocument()
    })

    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // Select a state
    await waitFor(() => {
      expect(screen.getByText('Select a state')).toBeInTheDocument()
    })

    const stateSelect = screen.getByRole('combobox', { name: /state/i })
    fireEvent.click(stateSelect)

    await waitFor(() => {
      expect(screen.getByText('California')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('California'))

    // Verify selection is displayed
    await waitFor(() => {
      expect(screen.getByText(/Selected: Country ID 1, State ID 1/)).toBeInTheDocument()
    })

    // Change country to Canada
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Canada'))

    // Verify state selection is cleared (summary should disappear)
    await waitFor(() => {
      expect(screen.queryByText(/Selected: Country ID/)).not.toBeInTheDocument()
    })

    // Verify state select shows new states for Canada
    await waitFor(() => {
      expect(screen.getByText('Select a state')).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error for countries
    server.use(
      http.get(`${baseUrl}/countries`, () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        )
      })
    )

    render(<CountryStateForm />)

    // Should show error message with retry option
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should handle states API error when country is selected', async () => {
    // Mock states API error
    server.use(
      http.get(`${baseUrl}/countries/1/states`, () => {
        return HttpResponse.json(
          { error: 'States not found' },
          { status: 404 }
        )
      })
    )

    render(<CountryStateForm />)

    // Wait for countries to load and select United States
    await waitFor(() => {
      expect(screen.getByText('Select a country')).toBeInTheDocument()
    })

    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // Should show states error
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch states/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should show loading states during API calls', async () => {
    // Mock delayed response
    server.use(
      http.get(`${baseUrl}/countries`, async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return HttpResponse.json([
          { id: 1, value: 'United States' },
          { id: 2, value: 'Canada' }
        ])
      })
    )

    render(<CountryStateForm />)

    // Should show loading skeleton initially
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument()
      expect(screen.getByText('Select a country')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should handle empty states response', async () => {
    // Mock empty states response
    server.use(
      http.get(`${baseUrl}/countries/1/states`, () => {
        return HttpResponse.json([])
      })
    )

    render(<CountryStateForm />)

    // Select country
    await waitFor(() => {
      expect(screen.getByText('Select a country')).toBeInTheDocument()
    })

    const countrySelect = screen.getByRole('combobox', { name: /country/i })
    fireEvent.click(countrySelect)

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('United States'))

    // Should show "No states available" message
    await waitFor(() => {
      expect(screen.getByText('No states available')).toBeInTheDocument()
    })

    const stateSelect = screen.getByRole('combobox', { name: /state/i })
    expect(stateSelect).toBeDisabled()
  })

  it('should allow retry after API error', async () => {
    // Mock initial error, then success
    let callCount = 0
    server.use(
      http.get(`${baseUrl}/countries`, () => {
        callCount++
        if (callCount === 1) {
          return HttpResponse.json(
            { error: 'Server error' },
            { status: 500 }
          )
        }
        return HttpResponse.json([
          { id: 1, value: 'United States' },
          { id: 2, value: 'Canada' }
        ])
      })
    )

    render(<CountryStateForm />)

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
    })

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    // Should load successfully on retry
    await waitFor(() => {
      expect(screen.queryByText(/Failed to fetch countries/)).not.toBeInTheDocument()
      expect(screen.getByText('Select a country')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})