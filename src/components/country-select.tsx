"use client"

import { Label } from "@/components/ui/label"
import { LoadingSpinner, LoadingSkeleton } from "@/components/ui/loading"
import { ErrorDisplay } from "@/components/ui/error"
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select"
import { useCountries } from "@/hooks/use-countries"
import { CountrySelectProps } from "@/lib/types"

export function CountrySelect({ 
  value, 
  onValueChange, 
  disabled 
}: CountrySelectProps) {
  const { countries, isLoading, error, refetch } = useCountries()

  if (error) {
    return (
      <div className="space-y-2 animate-in fade-in-50 duration-200">
        <Label>Country</Label>
        <ErrorDisplay 
          message={error.message} 
          onRetry={refetch}
          className="p-2 border rounded-md"
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-2 animate-in fade-in-50 duration-200">
        <Label>Country</Label>
        <div className="relative">
          <LoadingSkeleton className="h-9 w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </div>
    )
  }

  const countryOptions: SearchableSelectOption[] = countries.map((country) => ({
    value: country.id.toString(),
    label: country.value,
  }))

  return (
    <div className="space-y-2 animate-in fade-in-50 duration-200">
      <Label htmlFor="country-select">Country</Label>
      <SearchableSelect
        id="country-select"
        options={countryOptions}
        value={value ? value.toString() : undefined}
        onValueChange={(val) => onValueChange(parseInt(val))}
        placeholder="Select a country"
        emptyMessage="No countries found."
        disabled={disabled}
        className="w-full"
      />
    </div>
  )
}