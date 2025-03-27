/**
 * Color validation and formatting utilities
 */

// Updated ColorFormat types
// Updated ColorFormat types
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsla' | 'rgba' | 'oklch'

export interface ValidationResult {
  isValid: boolean
  format?: ColorFormat
  normalized?: string
  error?: string
}

/**
 * Validates if a string is a valid hex color
 */
export function isValidHex(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

/**
 * Validates if a string is a valid RGB color
 */
export function isValidRgb(color: string): boolean {
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
  return rgbRegex.test(color)
}

/**
 * Validates if a string is a valid RGBA color
 */
export function isValidRgba(color: string): boolean {
  const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.?\d*)\s*\)$/
  return rgbaRegex.test(color)
}

/**
 * Validates if a string is a valid HSL color
 */
export function isValidHsl(color: string): boolean {
  const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/
  return hslRegex.test(color)
}

/**
 * Validates if a string is a valid OKLCH color
 */
export function isValidOklch(color: string): boolean {
  const oklchRegex = /^oklch\(\s*([01]?\.?\d*)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})\s*\)$/
  return oklchRegex.test(color)
}

/**
 * Validates if a string is a valid HSLA color
 */
export function isValidHsla(color: string): boolean {
  const hslaRegex = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01]?\.?\d*)\s*\)$/
  return hslaRegex.test(color)
}

/**
 * Comprehensive color validation
 */
export function validateColor(color: string): ValidationResult {
  if (!color || typeof color !== 'string') {
    return { isValid: false, error: 'Color value is required' }
  }

  const trimmedColor = color.trim()

  if (isValidHex(trimmedColor)) {
    return {
      isValid: true,
      format: 'hex',
      normalized: trimmedColor.toUpperCase()
    }
  }

  if (isValidRgb(trimmedColor)) {
    return {
      isValid: true,
      format: 'rgb',
      normalized: trimmedColor
    }
  }

  if (isValidRgba(trimmedColor)) {
    return {
      isValid: true,
      format: 'rgba',
      normalized: trimmedColor
    }
  }

  if (isValidHsl(trimmedColor)) {
    return {
      isValid: true,
      format: 'hsl',
      normalized: trimmedColor
    }
  }

  if (isValidHsla(trimmedColor)) {
    return {
      isValid: true,
      format: 'hsla',
      normalized: trimmedColor
    }
  }

  if (isValidOklch(trimmedColor)) {
    return {
      isValid: true,
      format: 'oklch',
      normalized: trimmedColor
    }
  }

  // Try to fix common hex color issues
  const fixedHex = tryFixHex(trimmedColor)
  if (fixedHex) {
    return {
      isValid: true,
      format: 'hex',
      normalized: fixedHex,
      error: 'Auto-corrected hex format'
    }
  }

  return {
    isValid: false,
    error: 'Invalid color format. Use hex (#FF0000), rgb(255,0,0), hsl(0,100%,50%), etc.'
  }
}

/**
 * Attempts to fix common hex color issues
 */
function tryFixHex(color: string): string | null {
  // Add # if missing
  if (!color.startsWith('#') && /^[A-Fa-f0-9]{6}$/.test(color)) {
    return `#${color.toUpperCase()}`
  }
  
  // Expand 3-digit hex
  if (/^#([A-Fa-f0-9]{3})$/.test(color)) {
    const expanded = color.replace(/^#([A-Fa-f0-9])$/, '#$1$1$1')
    return expanded.toUpperCase()
  }
  
  // Fix 3-digit without #
  if (/^[A-Fa-f0-9]{3}$/.test(color)) {
    const expanded = color.split('').map(c => c + c).join('')
    return `#${expanded.toUpperCase()}`
  }

  return null
}

/**
 * Convert any valid color to hex format
 */
export function toHex(color: string): string | null {
  const validation = validateColor(color)
  if (!validation.isValid) return null

  try {
    // Create a temporary div to test color conversion
    const div = document.createElement('div')
    div.style.color = validation.normalized || color
    document.body.appendChild(div)
    const computedColor = window.getComputedStyle(div).color
    document.body.removeChild(div)

    // Extract RGB from computed color and convert to hex
    const rgbMatch = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1])
      const g = parseInt(rgbMatch[2])
      const b = parseInt(rgbMatch[3])
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
    }

    return validation.normalized || null
  } catch {
    return validation.normalized || null
  }
}

/**
 * Get a user-friendly error message for color validation
 */
export function getColorErrorMessage(validation: ValidationResult): string {
  if (validation.isValid) return ''
  
  switch (validation.error) {
    case 'Color value is required':
      return 'Please enter a color value'
    default:
      return validation.error || 'Invalid color format'
  }
}