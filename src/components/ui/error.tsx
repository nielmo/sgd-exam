"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ message, onRetry, className }: ErrorDisplayProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
    </div>
  )
}