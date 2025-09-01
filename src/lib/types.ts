/**
 * Represents a country entity from the API
 */
export interface Country {
  /** Unique identifier for the country */
  id: number;
  /** Display name of the country */
  value: string;
}

/**
 * Represents a state/province entity from the API
 */
export interface State {
  /** Unique identifier for the state */
  id: number;
  /** Display name of the state */
  value: string;
}

/**
 * Generic API response wrapper (not currently used but available for future enhancements)
 */
export interface ApiResponse<T> {
  /** The actual data payload */
  data: T;
  /** Indicates if the request was successful */
  success: boolean;
  /** Optional message from the server */
  message?: string;
}

/**
 * Represents an API error with optional HTTP status code
 */
export interface ApiError {
  /** Error message describing what went wrong */
  message: string;
  /** Optional HTTP status code for debugging */
  status?: number;
}

/**
 * Props interface for the CountrySelect component
 */
export interface CountrySelectProps {
  /** Currently selected country ID */
  value?: number;
  /** Callback function called when country selection changes */
  onValueChange: (value: number) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
}

/**
 * Props interface for the StateSelect component
 */
export interface StateSelectProps {
  /** ID of the selected country (required for fetching states) */
  countryId?: number;
  /** Currently selected state ID */
  value?: number;
  /** Callback function called when state selection changes */
  onValueChange: (value: number) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
}

/**
 * Return type for the useCountries custom hook
 */
export interface UseCountriesResult {
  /** Array of available countries */
  countries: Country[];
  /** Whether countries are currently being fetched */
  isLoading: boolean;
  /** Error object if fetch failed, null otherwise */
  error: ApiError | null;
  /** Function to manually refetch countries data */
  refetch: () => Promise<void>;
}

/**
 * Return type for the useStates custom hook
 */
export interface UseStatesResult {
  /** Array of available states for the selected country */
  states: State[];
  /** Whether states are currently being fetched */
  isLoading: boolean;
  /** Error object if fetch failed, null otherwise */
  error: ApiError | null;
  /** Function to manually refetch states data */
  refetch: () => Promise<void>;
}