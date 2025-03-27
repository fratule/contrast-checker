import { useEffect } from 'react'

/**
 * Comprehensive keyboard navigation utilities
 */

export interface KeyboardNavigationCallbacks {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: (shiftKey: boolean) => void
  onSpace?: () => void
  onHome?: () => void
  onEnd?: () => void
  onPageUp?: () => void
  onPageDown?: () => void
}

/**
 * Hook for comprehensive keyboard navigation
 */
export function useKeyboardNavigation(
  enabled: boolean = true,
  callbacks: KeyboardNavigationCallbacks = {}
) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!enabled) return
    
    const { key, shiftKey } = event
    
    // Prevent default behavior for handled keys
    let preventDefault = false
    
    switch (key) {
      case 'Escape':
        callbacks.onEscape?.()
        preventDefault = true
        break
        
      case 'Enter':
        callbacks.onEnter?.()
        preventDefault = true
        break
        
      case ' ':
        callbacks.onSpace?.()
        preventDefault = true
        break
        
      case 'ArrowUp':
        callbacks.onArrowUp?.()
        preventDefault = true
        break
        
      case 'ArrowDown':
        callbacks.onArrowDown?.()
        preventDefault = true
        break
        
      case 'ArrowLeft':
        callbacks.onArrowLeft?.()
        preventDefault = true
        break
        
      case 'ArrowRight':
        callbacks.onArrowRight?.()
        preventDefault = true
        break
        
      case 'Tab':
        callbacks.onTab?.(shiftKey)
        // Don't prevent default for Tab to maintain normal tab behavior
        break
        
      case 'Home':
        callbacks.onHome?.()
        preventDefault = true
        break
        
      case 'End':
        callbacks.onEnd?.()
        preventDefault = true
        break
        
      case 'PageUp':
        callbacks.onPageUp?.()
        preventDefault = true
        break
        
      case 'PageDown':
        callbacks.onPageDown?.()
        preventDefault = true
        break
    }
    
    if (preventDefault) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  
  return {
    onKeyDown: handleKeyDown
  }
}

/**
 * Focus trap utilities for modals and dropdowns
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          event.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          event.preventDefault()
        }
      }
    }
    
    container.addEventListener('keydown', handleKeyDown)
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef])
}

/**
 * Announce screen reader messages
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return
  
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('class', 'sr-only')
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Get appropriate ARIA labels for color inputs
 */
export function getColorAriaLabels(label: string, value: string, contrast?: number) {
  return {
    label: `${label} color input`,
    description: `Current ${label.toLowerCase()} color is ${value}${
      contrast ? ` with contrast ratio ${contrast.toFixed(2)} to 1` : ''
    }`,
    instructions: `Use arrow keys to adjust color, Tab to navigate to next field`
  }
}