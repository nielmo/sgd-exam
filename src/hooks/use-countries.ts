'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCountries } from '@/lib/api';
import { Country, ApiError, UseCountriesResult } from '@/lib/types';

export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCountries();
      setCountries(data);
    } catch (err) {
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to fetch countries' });
      }
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