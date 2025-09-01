import { Country, State, ApiError } from './types';

if (!process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_COUNTRY_API_BASE_URL environment variable is required');
}

if (!process.env.NEXT_PUBLIC_COUNTRY_API_KEY) {
  throw new Error('NEXT_PUBLIC_COUNTRY_API_KEY environment variable is required');
}

const BASE_URL = process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_COUNTRY_API_KEY;

class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = BASE_URL;
    this.headers = {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        const errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(error.message);
      }
      throw new ApiError('An unknown error occurred');
    }
  }

  async fetchCountries(): Promise<Country[]> {
    try {
      const countries = await this.request<Country[]>('/countries');
      return countries;
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(`Failed to fetch countries: ${error.message}`);
      }
      throw new ApiError('Failed to fetch countries: Unknown error');
    }
  }

  async fetchStates(countryId: number): Promise<State[]> {
    if (!countryId || countryId <= 0) {
      throw new ApiError('Valid country ID is required');
    }

    try {
      const states = await this.request<State[]>(`/countries/${countryId}/states`);
      return states;
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(`Failed to fetch states: ${error.message}`);
      }
      throw new ApiError('Failed to fetch states: Unknown error');
    }
  }
}

class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = new ApiClient();

export const fetchCountries = () => apiClient.fetchCountries();
export const fetchStates = (countryId: number) => apiClient.fetchStates(countryId);