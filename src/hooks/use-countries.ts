'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCountries } from '@/lib/api';
import { Country, ApiError, UseCountriesResult } from '@/lib/types';

/**
 * Custom hook for managing country data fetching and state
 * Provides countries list with loading, error states, and refetch functionality
 * 
 * @returns {UseCountriesResult} Object containing countries data, loading state, error state, and refetch function
 */
export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Memoized function to fetch countries from API
   * Handles loading states, error states, and data updates
   * Can be called manually to refresh data
   */
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (err) {
      // Type-safe error handling with fallback message
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to fetch countries' });
      }
      // Clear countries data on error to prevent stale data display
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    countries,
    isLoading,
    error,
    refetch,
  };
}