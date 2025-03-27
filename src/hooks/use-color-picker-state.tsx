import { useState, useCallback, useRef } from 'react'
import { validateColor, toHex } from '@/lib/color-validation'
import { parseColor, ColorValues } from '@/lib/color-conversion'

interface UseColorPickerState {
  color: string
  setValue: (value: string) => void
  error: string | null
  isValid: boolean
  isModalOpen: boolean
  formats: ColorValues
  openModal: () => void
  closeModal: () => void
}

export function useColorPickerState(initialColor: string): UseColorPickerState {
  const [color, setColor] = useState(initialColor)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const validateAndSet = useCallback((newColor: string) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce validation to prevent excessive re-renders
    debounceTimerRef.current = setTimeout(() => {
      const validation = validateColor(newColor)

      if (validation.isValid) {
        const hexColor = toHex(validation.normalized || newColor)
        if (hexColor) {
          setColor(hexColor)
          setError(null)
        }
      } else {
        setError(validation.error || 'Invalid color')
      }
    }, 100)
  }, [])

  const setValue = useCallback((newColor: string) => {
    validateAndSet(newColor)
  }, [validateAndSet])

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const parsedColor = parseColor(color)
  const formats: ColorValues = parsedColor || {
    hex: color,
    rgb: { r: 0, g: 0, b: 0 },
    rgba: { r: 0, g: 0, b: 0, a: 1 },
    hsl: { h: 0, s: 0, l: 0 },
    hsla: { h: 0, s: 0, l: 0, a: 1 },
    oklch: { l: 0, c: 0, h: 0 }
  }

  return {
    color,
    setValue,
    error,
    isValid: !error,
    formats,
    isModalOpen,
    openModal,
    closeModal
  }
}