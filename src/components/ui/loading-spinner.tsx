'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({ 
  className, 
  size = 'md', 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div 
        className={cn(
          sizeClasses[size],
          "animate-spin"
        )}
      >
        {text && <span className="text-sm text-muted-foreground ml-2">{text}</span>}
      </div>
    </div>
  )
}