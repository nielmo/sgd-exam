import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCountries } from '../use-countries'
import * as api from '../../lib/api'

vi.mock('../../lib/api')

describe('useCountries', () => {
  const mockCountries = [
    { id: 1, value: 'United States' },
    { id: 2, value: 'Canada' },
    { id: 3, value: 'United Kingdom' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch countries on mount', async () => {
    vi.mocked(api.fetchCountries).mockResolvedValue(mockCountries)

    const { result } = renderHook(() => useCountries())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.countries).toEqual([])
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.countries).toEqual(mockCountries)
    expect(result.current.error).toBe(null)
    expect(api.fetchCountries).toHaveBeenCalledOnce()
  })

  it('should handle errors when fetching countries', async () => {
    const mockError = new Error('Failed to fetch countries')
    vi.mocked(api.fetchCountries).mockRejectedValue(mockError)

    const { result } = renderHook(() => useCountries())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.countries).toEqual([])
    expect(result.current.error).toEqual({ message: 'Failed to fetch countries' })
  })

  it('should refetch countries when refetch is called', async () => {
    vi.mocked(api.fetchCountries).mockResolvedValue(mockCountries)

    const { result } = renderHook(() => useCountries())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.fetchCountries).toHaveBeenCalledOnce()

    // Clear the mock and refetch
    vi.clearAllMocks()
    vi.mocked(api.fetchCountries).mockResolvedValue(mockCountries)

    await waitFor(async () => {
      await result.current.refetch()
    })

    expect(api.fetchCountries).toHaveBeenCalledOnce()
  })

  it('should handle unknown errors', async () => {
    vi.mocked(api.fetchCountries).mockRejectedValue('Unknown error')

    const { result } = renderHook(() => useCountries())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.countries).toEqual([])
    expect(result.current.error).toEqual({ message: 'Failed to fetch countries' })
  })

  it('should set loading state correctly during refetch', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise(resolve => { resolvePromise = resolve })
    vi.mocked(api.fetchCountries).mockReturnValue(promise)

    const { result } = renderHook(() => useCountries())

    expect(result.current.isLoading).toBe(true)

    // Resolve the promise
    resolvePromise!(mockCountries)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.countries).toEqual(mockCountries)
  })
})