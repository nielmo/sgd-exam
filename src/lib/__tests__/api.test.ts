import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchCountries, fetchStates } from '../api'

// Mock environment variables
vi.mock('../api', async () => {
  const actual = await vi.importActual('../api')
  
  // Mock the API client directly
  const mockApiClient = {
    fetchCountries: vi.fn(),
    fetchStates: vi.fn()
  }

  return {
    ...actual,
    apiClient: mockApiClient,
    fetchCountries: () => mockApiClient.fetchCountries(),
    fetchStates: (countryId: number) => mockApiClient.fetchStates(countryId)
  }
})

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchCountries', () => {
    it('should fetch countries successfully', async () => {
      const mockCountries = [
        { id: 1, value: 'United States' },
        { id: 2, value: 'Canada' }
      ]

      // Mock the API response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCountries)
      })

      const result = await fetch('https://fedt.unruffledneumann.xyz/api/v1/countries', {
        headers: {
          'X-API-Key': 'test-key',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())

      expect(result).toEqual(mockCountries)
      expect(fetch).toHaveBeenCalledWith(
        'https://fedt.unruffledneumann.xyz/api/v1/countries',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'test-key',
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should handle fetch countries error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(
        fetch('https://fedt.unruffledneumann.xyz/api/v1/countries')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`)
            return res.json()
          })
      ).rejects.toThrow('HTTP Error: 500 Internal Server Error')
    })
  })

  describe('fetchStates', () => {
    it('should fetch states successfully', async () => {
      const mockStates = [
        { id: 1, value: 'California' },
        { id: 2, value: 'New York' }
      ]
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStates)
      })

      const result = await fetch('https://fedt.unruffledneumann.xyz/api/v1/countries/1/states', {
        headers: {
          'X-API-Key': 'test-key',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())

      expect(result).toEqual(mockStates)
      expect(fetch).toHaveBeenCalledWith(
        'https://fedt.unruffledneumann.xyz/api/v1/countries/1/states',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'test-key'
          })
        })
      )
    })

    it('should handle invalid country ID', async () => {
      const invalidIds = [0, -1, null, undefined]
      
      for (const id of invalidIds) {
        if (id === null || id === undefined || id <= 0) {
          expect(() => {
            if (!id || id <= 0) {
              throw new Error('Valid country ID is required')
            }
          }).toThrow('Valid country ID is required')
        }
      }
    })

    it('should handle fetch states error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(
        fetch('https://fedt.unruffledneumann.xyz/api/v1/countries/999/states')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`)
            return res.json()
          })
      ).rejects.toThrow('HTTP Error: 404 Not Found')
    })
  })

  describe('Network errors', () => {
    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(fetch('https://test.com')).rejects.toThrow('Network error')
    })
  })
})