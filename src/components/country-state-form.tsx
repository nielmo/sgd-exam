"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { CountrySelect } from "./country-select"
import { StateSelect } from "./state-select"

export function CountryStateForm() {
  const [selectedCountry, setSelectedCountry] = useState<number | undefined>()
  const [selectedState, setSelectedState] = useState<number | undefined>()

  useEffect(() => {
    setSelectedState(undefined)
  }, [selectedCountry])

  const handleCountryChange = (countryId: number) => {
    setSelectedCountry(countryId)
  }

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