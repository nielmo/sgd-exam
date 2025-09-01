"use client"

import { Label } from "@/components/ui/label"
import { LoadingSpinner, LoadingSkeleton } from "@/components/ui/loading"
import { ErrorDisplay } from "@/components/ui/error"
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select"
import { useStates } from "@/hooks/use-states"
import { StateSelectProps } from "@/lib/types"

export function StateSelect({ 
  countryId, 
  value, 
  onValueChange, 
  disabled 
}: StateSelectProps) {
  const { states, isLoading, error, refetch } = useStates(countryId)

  if (!countryId) {
    return (
      <div className="space-y-2 animate-in fade-in-50 duration-200">
        <Label>State</Label>
        <SearchableSelect
          options={[]}
          placeholder="Select a country first"
          disabled={true}
          className="w-full opacity-50"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2 animate-in fade-in-50 duration-200">
        <Label>State</Label>
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
        <Label>State</Label>
        <div className="relative">
          <LoadingSkeleton className="h-9 w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </div>
    )
  }

  const stateOptions: SearchableSelectOption[] = (states || [])
    .filter((state) => state && typeof state.id !== 'undefined' && state.value)
    .map((state) => ({
      value: state.id.toString(),
      label: state.value,
    }))

  return (
    <div className="space-y-2 animate-in fade-in-50 duration-200">
      <Label htmlFor="state-select">State</Label>
      <SearchableSelect
        id="state-select"
        options={stateOptions}
        value={value ? value.toString() : undefined}
        onValueChange={(val) => onValueChange(parseInt(val))}
        placeholder={states.length === 0 ? "No states available" : "Select a state"}
        emptyMessage="No states found."
        disabled={disabled || states.length === 0}
        className={`w-full ${states.length === 0 ? 'opacity-50' : ''}`}
      />
    </div>
  )
}