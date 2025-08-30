"use client"

import { cn } from "@/lib/utils"

interface ContainerProps {
  className?: string
  children: React.ReactNode
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  )
}

interface FormContainerProps {
  className?: string
  children: React.ReactNode
  title?: string
  description?: string
}

export function FormContainer({ 
  className, 
  children, 
  title, 
  description 
}: FormContainerProps) {
  return (
    <div className={cn("max-w-md mx-auto space-y-6", className)}>
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}