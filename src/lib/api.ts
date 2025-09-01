import { Country, State, ApiError } from './types';

if (!process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_COUNTRY_API_BASE_URL environment variable is required');
}

if (!process.env.NEXT_PUBLIC_COUNTRY_API_KEY) {
  throw new Error('NEXT_PUBLIC_COUNTRY_API_KEY environment variable is required');
}

const BASE_URL = process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_COUNTRY_API_KEY;

/**
 * API Client class for handling HTTP requests to the country/state service
 * Provides centralized configuration and error handling for all API calls
 */
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

  /**
   * Generic request method for making HTTP calls
   * Handles response parsing, error handling, and API key injection
   * 
   * @template T - The expected response type
   * @param {string} endpoint - API endpoint path (e.g., '/countries')
   * @param {RequestInit} options - Optional fetch configuration
   * @returns {Promise<T>} Parsed response data
   * @throws {ApiError} Custom error with context information
   */
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
      // Convert all errors to our custom ApiError type for consistent handling
      if (error instanceof Error) {
        throw new ApiError(error.message);
      }
      throw new ApiError('An unknown error occurred');
    }
  }

  /**
   * Fetch all available countries from the API
   * 
   * @returns {Promise<Country[]>} Array of country objects with id and value
   * @throws {ApiError} When API request fails or response is invalid
   */
  async fetchCountries(): Promise<Country[]> {
    try {
      const countries = await this.request<Country[]>('/countries');
      
      // Validate response structure to ensure type safety
      if (!countries || !Array.isArray(countries)) {
        throw new Error('Invalid response: expected an array of countries');
      }
      
      return countries;
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(`Failed to fetch countries: ${error.message}`);
      }
      throw new ApiError('Failed to fetch countries: Unknown error');
    }
  }

  /**
   * Fetch states for a specific country
   * 
   * @param {number} countryId - The ID of the country to fetch states for
   * @returns {Promise<State[]>} Array of state objects with id and value
   * @throws {ApiError} When country ID is invalid or API request fails
   */
  async fetchStates(countryId: number): Promise<State[]> {
    // Client-side validation to prevent unnecessary API calls
    if (!countryId || countryId <= 0) {
      throw new ApiError('Valid country ID is required');
    }

    try {
      const states = await this.request<State[]>(`/countries/${countryId}/states`);
      
      // Validate response structure to ensure type safety
      if (!states || !Array.isArray(states)) {
        throw new Error('Invalid response: expected an array of states');
      }
      
      return states;
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(`Failed to fetch states: ${error.message}`);
      }
      throw new ApiError('Failed to fetch states: Unknown error');
    }
  }
}

/**
 * Custom error class for API-related errors
 * Extends the native Error class with additional context for HTTP status codes
 */
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