'use client'

import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateColor, toHex, getColorErrorMessage } from '@/lib/color-validation'
import { parseColor, formatColor } from '@/lib/color-conversion'
import { useKeyboardNavigation, getColorAriaLabels } from '@/lib/keyboard-navigation'
import { useMobile } from '@/hooks/use-mobile'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  disabled?: boolean
  contrastRatio?: number
  oppositeColor?: string
  onCopyFormat?: (value: string, format: 'rgb' | 'hsl') => void
}

export function ColorPicker({ label, value, onChange, disabled = false, contrastRatio, oppositeColor, onCopyFormat }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [validationError, setValidationError] = useState<string>('')
  const isMobile = useMobile()
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 })
  const pickerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync external value with internal state
  useEffect(() => {
    setInputValue(value)
    setValidationError('')
  }, [value])

  const validateAndUpdateColor = (newColor: string) => {
    setInputValue(newColor)

    const validation = validateColor(newColor)
    if (validation.isValid) {
      const hexColor = toHex(validation.normalized || newColor)
      if (hexColor) {
        onChange(hexColor)
        setValidationError('')
      }
    } else {
      setValidationError(getColorErrorMessage(validation))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndUpdateColor(e.target.value)
  }

  const handlePickerChange = (newColor: string) => {
    const hexColor = toHex(newColor)
    if (hexColor) {
      onChange(hexColor)
      setInputValue(hexColor)
      setValidationError('')
    }
  }

  const handleInputBlur = () => {
    // Final validation on blur
    if (inputValue) {
      validateAndUpdateColor(inputValue)
    }
  }

  const togglePicker = () => {
    if (disabled) return

    // Position picker below input on desktop
    if (!isMobile && !isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setPickerPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      })
    }
    setIsOpen(!isOpen)
  }


  const getDisplayColor = () => {
    const parsed = parseColor(inputValue)
    if (parsed) {
      // Show in multiple formats
      return {
        hex: parsed.hex,
        rgb: formatColor(parsed, 'rgb'),
        hsl: formatColor(parsed, 'hsl')
      }
    }
    return { hex: inputValue, rgb: '', hsl: '' }
  }

  // Enhanced color adjustment with keyboard
  const adjustColor = (direction: 'lighter' | 'darker' | 'saturated' | 'desaturated') => {
    const parsed = parseColor(inputValue)
    if (!parsed) return

    let newColor = { ...parsed }

    switch (direction) {
      case 'lighter':
        // Increase lightness
        newColor.hsl.l = Math.min(100, newColor.hsl.l + 5)
        break
      case 'darker':
        // Decrease lightness
        newColor.hsl.l = Math.max(0, newColor.hsl.l - 5)
        break
      case 'saturated':
        // Increase saturation
        newColor.hsl.s = Math.min(100, newColor.hsl.s + 5)
        break
      case 'desaturated':
        // Decrease saturation
        newColor.hsl.s = Math.max(0, newColor.hsl.s - 5)
        break
    }

    const newHex = formatColor(newColor, 'hex')
    validateAndUpdateColor(newHex)
  }

  const ariaLabels = getColorAriaLabels(label, toHex(value) || value, contrastRatio)
  const keyboardNav = useKeyboardNavigation(!disabled, {
    onArrowUp: () => adjustColor('lighter'),
    onArrowDown: () => adjustColor('darker'),
    onArrowRight: () => adjustColor('saturated'),
    onArrowLeft: () => adjustColor('desaturated'),
    onEscape: () => setIsOpen(false)
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])


  const display = getDisplayColor()
  const handleCopy = (value: string, format: 'rgb' | 'hsl') => {
    if (!value || !onCopyFormat) return
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value)
      onCopyFormat(value, format)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</Label>
      <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row flex-wrap items-center gap-2 sm:gap-3'}`}>
        <div className={`relative ${isMobile ? 'flex-1' : 'min-w-40 w-44 shrink-0'}`}>
          {/* Text input - always visible */}
          <Input
            ref={inputRef}
            id={label.toLowerCase().replace(' ', '-')}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            disabled={disabled}
            className={`w-full ${isMobile ? 'text-lg py-3 pr-14' : 'min-w-0'} ${validationError ? 'border-destructive focus:border-destructive' : ''}`}
            placeholder="#000000"
            aria-label={ariaLabels.label}
            aria-describedby={`${label.toLowerCase().replace(' ', '-')}-description`}
            onKeyDown={keyboardNav.onKeyDown}
            type="text"
          />
          <div
            id={`${label.toLowerCase().replace(' ', '-')}-description`}
            className="sr-only"
          >
            {ariaLabels.description}
          </div>

          {/* Color swatch button - triggers native picker on mobile, custom picker on desktop */}
          <div
            className={`absolute ${isMobile ? 'right-3 top-1/2 -translate-y-1/2 w-12 h-12' : 'right-2 top-1/2 -translate-y-1/2 w-10 h-10'} border-2 border-border cursor-pointer hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center`}
            style={{ backgroundColor: toHex(value) || '#000000' }}
            onClick={togglePicker}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                togglePicker()
              }
            }}
            aria-label={`Open ${label} picker`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              style={{
                color: oppositeColor || '#000000',
                opacity: 0.9
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
        </div>

        {/* Validation error: full-width row below input + picker / RGB-HSL */}
        {validationError && (
          <div className="w-full basis-full mt-1">
            <p className="text-xs text-destructive wrap-break-word" role="alert">{validationError}</p>
          </div>
        )}

        {/* Color format: desktop = column right of picker; mobile = below input+picker */}
        {inputValue && !validationError && (display.rgb || display.hsl) && (
          <div className="flex flex-col gap-1 shrink-0 text-xs text-muted-foreground">
            {display.rgb && (
              <button
                type="button"
                onClick={() => handleCopy(display.rgb, 'rgb')}
                className="text-left hover:text-foreground hover:underline underline-offset-2 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1 rounded"
                title="Copy RGB value"
              >
                RGB: {display.rgb}
              </button>
            )}
            {display.hsl && (
              <button
                type="button"
                onClick={() => handleCopy(display.hsl, 'hsl')}
                className="text-left hover:text-foreground hover:underline underline-offset-2 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1 rounded"
                title="Copy HSL value"
              >
                HSL: {display.hsl}
              </button>
            )}
          </div>
        )}

        {/* Color picker dropdown for desktop */}
        {isOpen && !disabled && !isMobile && (
          <div
            ref={pickerRef}
            className="fixed z-50 bg-background border-2 border-border shadow-lg p-2"
            style={{ top: `${pickerPosition.top}px`, left: `${pickerPosition.left}px` }}
          >
            <HexColorPicker
              color={value}
              onChange={handlePickerChange}
              style={{ width: '200px', height: '200px' }}
            />
          </div>
        )}

        {/* Mobile optimized color picker */}
        {isOpen && !disabled && isMobile && (
          <div
            ref={pickerRef}
            className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-background border-2 border-border shadow-xl p-4 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{label}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  aria-label="Close color picker"
                >
                  ×
                </button>
              </div>
              <HexColorPicker
                color={value}
                onChange={handlePickerChange}
                style={{ width: '100%', height: '250px' }}
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Current: {toHex(value) || value}
                </p>
              </div>
              <div className="mt-4 h-12" style={{ backgroundColor: toHex(value) || value }}>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}