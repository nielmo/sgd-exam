"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { CountrySelect } from "./country-select"
import { StateSelect } from "./state-select"

/**
 * Main form component that manages cascading country-state selection
 * Handles the relationship between country and state dropdowns with proper state management
 */
export function CountryStateForm() {
  // Track selected country ID for cascading dropdown behavior
  const [selectedCountry, setSelectedCountry] = useState<number | undefined>()
  // Track selected state ID, automatically reset when country changes
  const [selectedState, setSelectedState] = useState<number | undefined>()

  /**
   * Effect to reset state selection when country changes
   * This ensures that invalid state-country combinations are prevented
   */
  useEffect(() => {
    setSelectedState(undefined)
  }, [selectedCountry])

  /**
   * Handle country selection change
   * Updates the selected country and triggers state dropdown reset via useEffect
   */
  const handleCountryChange = (countryId: number) => {
    setSelectedCountry(countryId)
  }

  /**
   * Handle state selection change
   * Only called when a valid country is selected
   */
  const handleStateChange = (stateId: number) => {
    setSelectedState(stateId)
  }

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-md mx-auto animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center">
          <CardTitle>Select Location</CardTitle>
          <CardDescription>
            Choose your country and state from the dropdowns below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorBoundary>
            <CountrySelect
              value={selectedCountry}
              onValueChange={handleCountryChange}
            />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <StateSelect
              countryId={selectedCountry}
              value={selectedState}
              onValueChange={handleStateChange}
            />
          </ErrorBoundary>
          
          {selectedCountry && selectedState && (
            <div className="p-3 bg-muted rounded-md animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-muted-foreground">
                Selected: Country ID {selectedCountry}, State ID {selectedState}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}