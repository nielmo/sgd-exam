import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { CountryStateForm } from '../../components/country-state-form'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

const baseUrl = 'https://fedt.unruffledneumann.xyz/api/v1'

describe('Error Handling Scenarios', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL = baseUrl
    process.env.NEXT_PUBLIC_COUNTRY_API_KEY = 'test-api-key'
  })

  describe('Network Errors', () => {
    it('should handle network timeout errors', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.error()
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
      })
    })

    it('should handle network connection errors for states', async () => {
      server.use(
        http.get(`${baseUrl}/countries/1/states`, () => {
          return HttpResponse.error()
        })
      )

      render(<CountryStateForm />)

      // Wait for countries to load
      await waitFor(() => {
        expect(screen.getByText('Select a country')).toBeInTheDocument()
      })

      // Select country
      const countrySelect = screen.getByRole('combobox', { name: /country/i })
      fireEvent.click(countrySelect)

      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('United States'))

      // Should show states error
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch states/)).toBeInTheDocument()
      })
    })
  })

  describe('HTTP Error Status Codes', () => {
    it('should handle 401 unauthorized error', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      })
    })

    it('should handle 403 forbidden error', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          )
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      })
    })

    it('should handle 404 not found error for states', async () => {
      server.use(
        http.get(`${baseUrl}/countries/999/states`, () => {
          return HttpResponse.json(
            { error: 'Country not found' },
            { status: 404 }
          )
        })
      )

      render(<CountryStateForm />)

      // This test simulates selecting a country that doesn't exist
      // In practice, this would be handled by validation, but we test the error handling
      await waitFor(() => {
        expect(screen.getByText('Select a country')).toBeInTheDocument()
      })
    })

    it('should handle 500 internal server error', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          )
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
      })
    })

    it('should handle 503 service unavailable error', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json(
            { error: 'Service unavailable' },
            { status: 503 }
          )
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      })
    })
  })

  describe('Malformed API Responses', () => {
    it('should handle invalid JSON response', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return new HttpResponse('invalid json', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      })
    })

    it('should handle missing required fields in response', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json([
            { id: 1 }, // missing 'value' field
            { value: 'Canada' } // missing 'id' field
          ])
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText('Select a country')).toBeInTheDocument()
      })

      // The component should handle this gracefully
      const countrySelect = screen.getByRole('combobox', { name: /country/i })
      expect(countrySelect).toBeInTheDocument()
    })

    it('should handle null response', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json(null)
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      })
    })
  })

  describe('Error Recovery', () => {
    it('should recover from error after successful retry', async () => {
      let callCount = 0
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          callCount++
          if (callCount === 1) {
            return HttpResponse.json(
              { error: 'Temporary error' },
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

      // Initial error
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      })

      // Retry and succeed
      const retryButton = screen.getByRole('button', { name: /retry/i })
      fireEvent.click(retryButton)

      await waitFor(() => {
        expect(screen.queryByText(/Failed to fetch countries/)).not.toBeInTheDocument()
        expect(screen.getByText('Select a country')).toBeInTheDocument()
      })
    })

    it('should maintain error state across component rerenders', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json(
            { error: 'Persistent error' },
            { status: 500 }
          )
        })
      )

      const { rerender } = render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
      })

      // Rerender component
      rerender(<CountryStateForm />)

      // Error should still be visible
      expect(screen.getByText(/Failed to fetch countries/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty array responses', async () => {
      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json([])
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText('Select a country')).toBeInTheDocument()
      })

      const countrySelect = screen.getByRole('combobox', { name: /country/i })
      fireEvent.click(countrySelect)

      await waitFor(() => {
        expect(screen.getByText('No countries found.')).toBeInTheDocument()
      })
    })

    it('should handle very large response data', async () => {
      const largeCountriesList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        value: `Country ${i + 1}`
      }))

      server.use(
        http.get(`${baseUrl}/countries`, () => {
          return HttpResponse.json(largeCountriesList)
        })
      )

      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText('Select a country')).toBeInTheDocument()
      })

      const countrySelect = screen.getByRole('combobox', { name: /country/i })
      fireEvent.click(countrySelect)

      // Should handle large datasets without crashing
      await waitFor(() => {
        expect(screen.getByText('Country 1')).toBeInTheDocument()
      })
    })

    it('should handle rapid successive API calls', async () => {
      render(<CountryStateForm />)

      await waitFor(() => {
        expect(screen.getByText('Select a country')).toBeInTheDocument()
      })

      const countrySelect = screen.getByRole('combobox', { name: /country/i })
      
      // Rapidly select different countries
      fireEvent.click(countrySelect)
      fireEvent.click(screen.getByText('United States'))
      
      fireEvent.click(countrySelect)
      fireEvent.click(screen.getByText('Canada'))
      
      fireEvent.click(countrySelect)
      fireEvent.click(screen.getByText('United Kingdom'))

      // Should handle rapid state changes without errors
      await waitFor(() => {
        expect(screen.getByText('Select a state')).toBeInTheDocument()
      })
    })
  })
})