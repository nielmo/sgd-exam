import { http, HttpResponse } from 'msw'

const baseUrl = 'https://fedt.unruffledneumann.xyz/api/v1'

export const handlers = [
  // Get countries
  http.get(`${baseUrl}/countries`, () => {
    return HttpResponse.json([
      { id: 1, value: 'United States' },
      { id: 2, value: 'Canada' },
      { id: 3, value: 'United Kingdom' },
    ])
  }),

  // Get states for United States (id: 1)
  http.get(`${baseUrl}/countries/1/states`, () => {
    return HttpResponse.json([
      { id: 1, value: 'California' },
      { id: 2, value: 'New York' },
      { id: 3, value: 'Texas' },
    ])
  }),

  // Get states for Canada (id: 2)
  http.get(`${baseUrl}/countries/2/states`, () => {
    return HttpResponse.json([
      { id: 4, value: 'Ontario' },
      { id: 5, value: 'Quebec' },
      { id: 6, value: 'British Columbia' },
    ])
  }),

  // Get states for United Kingdom (id: 3)
  http.get(`${baseUrl}/countries/3/states`, () => {
    return HttpResponse.json([
      { id: 7, value: 'England' },
      { id: 8, value: 'Scotland' },
      { id: 9, value: 'Wales' },
    ])
  }),

  // Error scenarios
  http.get(`${baseUrl}/countries/999/states`, () => {
    return HttpResponse.json(
      { error: 'Country not found' },
      { status: 404 }
    )
  }),
]