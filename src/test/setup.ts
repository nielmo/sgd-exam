import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from './mocks/server'

// Set up environment variables for testing
process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL = 'https://fedt.unruffledneumann.xyz/api/v1'
process.env.NEXT_PUBLIC_COUNTRY_API_KEY = 'test-api-key'

// Mock ResizeObserver for components that use it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock scrollIntoView for components that use it (like cmdk)
Element.prototype.scrollIntoView = vi.fn()

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset any request handlers that are declared as a part of our tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())