export interface Country {
  id: number;
  value: string;
}

export interface State {
  id: number;
  value: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface CountrySelectProps {
  value?: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export interface StateSelectProps {
  countryId?: number;
  value?: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export interface UseCountriesResult {
  countries: Country[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export interface UseStatesResult {
  states: State[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}