import type { 
  Country, 
  State, 
  ApiResponse, 
  ApiError, 
  CountrySelectProps, 
  StateSelectProps,
  UseCountriesResult,
  UseStatesResult
} from '../types'

describe('Type definitions', () => {
  describe('Country type', () => {
    it('should have correct structure', () => {
      const country: Country = {
        id: 1,
        value: 'United States'
      }
      
      expect(country.id).toBe(1)
      expect(country.value).toBe('United States')
      expect(typeof country.id).toBe('number')
      expect(typeof country.value).toBe('string')
    })
  })

  describe('State type', () => {
    it('should have correct structure', () => {
      const state: State = {
        id: 1,
        value: 'California'
      }
      
      expect(state.id).toBe(1)
      expect(state.value).toBe('California')
      expect(typeof state.id).toBe('number')
      expect(typeof state.value).toBe('string')
    })
  })

  describe('ApiResponse type', () => {
    it('should handle successful response', () => {
      const successResponse: ApiResponse<Country[]> = {
        data: [{ id: 1, value: 'Test Country' }],
        success: true,
        message: 'Success'
      }
      
      expect(successResponse.success).toBe(true)
      expect(successResponse.data).toHaveLength(1)
      expect(successResponse.message).toBe('Success')
    })

    it('should handle failed response without message', () => {
      const failureResponse: ApiResponse<never> = {
        data: null as never,
        success: false
      }
      
      expect(failureResponse.success).toBe(false)
      expect(failureResponse.message).toBeUndefined()
    })
  })

  describe('ApiError type', () => {
    it('should have message property', () => {
      const error: ApiError = {
        message: 'Something went wrong'
      }
      
      expect(error.message).toBe('Something went wrong')
    })

    it('should optionally include status', () => {
      const errorWithStatus: ApiError = {
        message: 'Not found',
        status: 404
      }
      
      expect(errorWithStatus.status).toBe(404)
    })

    it('should work without status', () => {
      const errorWithoutStatus: ApiError = {
        message: 'Generic error'
      }
      
      expect(errorWithoutStatus.status).toBeUndefined()
    })
  })

  describe('CountrySelectProps type', () => {
    it('should have required onValueChange', () => {
      const props: CountrySelectProps = {
        onValueChange: (value: number) => value
      }
      
      expect(typeof props.onValueChange).toBe('function')
    })

    it('should have optional value and disabled', () => {
      const props: CountrySelectProps = {
        value: 1,
        onValueChange: (value: number) => value,
        disabled: true
      }
      
      expect(props.value).toBe(1)
      expect(props.disabled).toBe(true)
    })
  })

  describe('StateSelectProps type', () => {
    it('should have required onValueChange', () => {
      const props: StateSelectProps = {
        onValueChange: (value: number) => value
      }
      
      expect(typeof props.onValueChange).toBe('function')
    })

    it('should have all optional properties', () => {
      const props: StateSelectProps = {
        countryId: 1,
        value: 2,
        onValueChange: (value: number) => value,
        disabled: false
      }
      
      expect(props.countryId).toBe(1)
      expect(props.value).toBe(2)
      expect(props.disabled).toBe(false)
    })
  })

  describe('UseCountriesResult type', () => {
    it('should have all required properties', () => {
      const result: UseCountriesResult = {
        countries: [{ id: 1, value: 'Test' }],
        isLoading: false,
        error: null,
        refetch: async () => {}
      }
      
      expect(Array.isArray(result.countries)).toBe(true)
      expect(typeof result.isLoading).toBe('boolean')
      expect(result.error).toBeNull()
      expect(typeof result.refetch).toBe('function')
    })

    it('should handle error state', () => {
      const errorResult: UseCountriesResult = {
        countries: [],
        isLoading: false,
        error: { message: 'Failed to fetch countries' },
        refetch: async () => {}
      }
      
      expect(errorResult.error?.message).toBe('Failed to fetch countries')
    })
  })

  describe('UseStatesResult type', () => {
    it('should have all required properties', () => {
      const result: UseStatesResult = {
        states: [{ id: 1, value: 'Test State' }],
        isLoading: true,
        error: null,
        refetch: async () => {}
      }
      
      expect(Array.isArray(result.states)).toBe(true)
      expect(result.isLoading).toBe(true)
      expect(result.error).toBeNull()
      expect(typeof result.refetch).toBe('function')
    })

    it('should handle error with status code', () => {
      const errorResult: UseStatesResult = {
        states: [],
        isLoading: false,
        error: { message: 'States not found', status: 404 },
        refetch: async () => {}
      }
      
      expect(errorResult.error?.status).toBe(404)
    })
  })

  describe('Type compatibility', () => {
    it('should allow Country in ApiResponse', () => {
      const response: ApiResponse<Country> = {
        data: { id: 1, value: 'Test' },
        success: true
      }
      
      expect(response.data.id).toBe(1)
    })

    it('should allow State array in ApiResponse', () => {
      const response: ApiResponse<State[]> = {
        data: [
          { id: 1, value: 'State 1' },
          { id: 2, value: 'State 2' }
        ],
        success: true
      }
      
      expect(response.data).toHaveLength(2)
    })
  })
})