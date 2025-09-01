import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useStates } from '../use-states'
import * as api from '../../lib/api'

vi.mock('../../lib/api')

describe('useStates', () => {
  const mockStates = [
    { id: 1, value: 'California' },
    { id: 2, value: 'New York' },
    { id: 3, value: 'Texas' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch states when countryId is not provided', () => {
    const { result } = renderHook(() => useStates())

    expect(result.current.states).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(api.fetchStates).not.toHaveBeenCalled()
  })

  it('should not fetch states when countryId is 0 or negative', () => {
    const { result: result1 } = renderHook(() => useStates(0))
    const { result: result2 } = renderHook(() => useStates(-1))

    expect(result1.current.states).toEqual([])
    expect(result1.current.isLoading).toBe(false)
    expect(result1.current.error).toBe(null)

    expect(result2.current.states).toEqual([])
    expect(result2.current.isLoading).toBe(false)
    expect(result2.current.error).toBe(null)

    expect(api.fetchStates).not.toHaveBeenCalled()
  })

  it('should fetch states when valid countryId is provided', async () => {
    vi.mocked(api.fetchStates).mockResolvedValue(mockStates)

    const { result } = renderHook(() => useStates(1))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.states).toEqual([])
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.states).toEqual(mockStates)
    expect(result.current.error).toBe(null)
    expect(api.fetchStates).toHaveBeenCalledWith(1)
  })

  it('should handle errors when fetching states', async () => {
    const mockError = new Error('Failed to fetch states')
    vi.mocked(api.fetchStates).mockRejectedValue(mockError)

    const { result } = renderHook(() => useStates(1))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.states).toEqual([])
    expect(result.current.error).toEqual({ message: 'Failed to fetch states' })
  })

  it('should clear states when countryId changes from valid to invalid', async () => {
    vi.mocked(api.fetchStates).mockResolvedValue(mockStates)

    const { result, rerender } = renderHook((countryId?: number) => useStates(countryId), {
      initialProps: 1
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.states).toEqual(mockStates)

    // Change to invalid countryId
    rerender(undefined)

    expect(result.current.states).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should refetch states when countryId changes', async () => {
    const mockStates1 = [{ id: 1, value: 'California' }]
    const mockStates2 = [{ id: 4, value: 'Ontario' }]

    vi.mocked(api.fetchStates)
      .mockResolvedValueOnce(mockStates1)
      .mockResolvedValueOnce(mockStates2)

    const { result, rerender } = renderHook((countryId: number) => useStates(countryId), {
      initialProps: 1
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.states).toEqual(mockStates1)
    expect(api.fetchStates).toHaveBeenCalledWith(1)

    // Change countryId
    rerender(2)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.states).toEqual(mockStates2)
    expect(api.fetchStates).toHaveBeenCalledWith(2)
    expect(api.fetchStates).toHaveBeenCalledTimes(2)
  })

  it('should handle unknown errors', async () => {
    vi.mocked(api.fetchStates).mockRejectedValue('Unknown error')

    const { result } = renderHook(() => useStates(1))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.states).toEqual([])
    expect(result.current.error).toEqual({ message: 'Failed to fetch states' })
  })

  it('should allow manual refetch', async () => {
    vi.mocked(api.fetchStates).mockResolvedValue(mockStates)

    const { result } = renderHook(() => useStates(1))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.fetchStates).toHaveBeenCalledOnce()

    // Clear the mock and refetch
    vi.clearAllMocks()
    vi.mocked(api.fetchStates).mockResolvedValue(mockStates)

    await waitFor(async () => {
      await result.current.refetch()
    })

    expect(api.fetchStates).toHaveBeenCalledWith(1)
  })
})