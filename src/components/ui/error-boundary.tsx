"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <Card className="w-full max-w-md mx-auto border-destructive">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-destructive">Something went wrong</CardTitle>
        <CardDescription>
          An unexpected error occurred while loading the application
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="p-3 bg-muted rounded-md text-left">
          <p className="text-sm text-muted-foreground font-mono break-all">
            {error.message}
          </p>
        </div>
        <Button onClick={resetError} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}

export { ErrorBoundary, DefaultErrorFallback }
export type { ErrorBoundaryProps }