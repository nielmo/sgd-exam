'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchStates } from '@/lib/api';
import { State, ApiError, UseStatesResult } from '@/lib/types';

/**
 * Custom hook for managing state data fetching based on selected country
 * Implements cascading dropdown behavior by automatically fetching states when countryId changes
 * 
 * @param {number} countryId - Optional country ID to fetch states for
 * @returns {UseStatesResult} Object containing states data, loading state, error state, and refetch function
 */
export function useStates(countryId?: number): UseStatesResult {
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Memoized function to fetch states for a given country
   * Includes validation to prevent unnecessary API calls with invalid country IDs
   */
  const refetch = useCallback(async () => {
    // Early return if no valid country ID is provided
    if (!countryId || countryId <= 0) {
      setStates([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchStates(countryId);
      setStates(data);
    } catch (err) {
      // Type-safe error handling with fallback message
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to fetch states' });
      }
      // Clear states data on error to prevent stale data display
      setStates([]);
    } finally {
      setIsLoading(false);
    }
  }, [countryId]);

  /**
   * Effect to automatically fetch states when country changes
   * Clears states when no country is selected (cascading dropdown behavior)
   */
  useEffect(() => {
    if (countryId) {
      refetch();
    } else {
      // Reset states when no country is selected
      setStates([]);
      setError(null);
      setIsLoading(false);
    }
  }, [countryId, refetch]);

  return {
    states,
    isLoading,
    error,
    refetch,
  };
}