'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchStates } from '@/lib/api';
import { State, ApiError, UseStatesResult } from '@/lib/types';

export function useStates(countryId?: number): UseStatesResult {
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = useCallback(async () => {
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
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to fetch states' });
      }
      setStates([]);
    } finally {
      setIsLoading(false);
    }
  }, [countryId]);

  useEffect(() => {
    if (countryId) {
      refetch();
    } else {
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