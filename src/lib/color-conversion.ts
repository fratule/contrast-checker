/**
 * Advanced color conversion utilities
 */

export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'oklch'

export interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  rgba: { r: number; g: number; b: number; a: number }
  hsl: { h: number; s: number; l: number }
  hsla: { h: number; s: number; l: number; a: number }
  oklch: { l: number; c: number; h: number }
}

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')}`
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Parse RGB string to object
 */
export function parseRgb(rgb: string): { r: number; g: number; b: number } | null {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i)
  return match ? {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3])
  } : null
}

/**
 * Parse RGBA string to object
 */
export function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } | null {
  const match = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([01]?\.?\d*)\)$/i)
  return match ? {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
    a: parseFloat(match[4])
  } : null
}

/**
 * Parse HSL string to object
 */
export function parseHsl(hsl: string): { h: number; s: number; l: number } | null {
  const match = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/i)
  return match ? {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3])
  } : null
}

/**
 * Parse HSLA string to object
 */
export function parseHsla(hsla: string): { h: number; s: number; l: number; a: number } | null {
  const match = hsla.match(/^hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([01]?\.?\d*)\)$/i)
  return match ? {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3]),
    a: parseFloat(match[4])
  } : null
}

/**
 * Parse OKLCH string to object
 */
export function parseOklch(oklch: string): { l: number; c: number; h: number } | null {
  const match = oklch.match(/^oklch\(([01]?\.?\d*),\s*(\d+)%,\s*(\d+)\)$/i)
  return match ? {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3])
  } : null
}

/**
 * Convert any valid color to all formats
 */
export function parseColor(color: string): ColorValues | null {
  const trimmedColor = color.trim().toLowerCase()

  // HEX
  if (trimmedColor.startsWith('#')) {
    const rgb = hexToRgb(trimmedColor)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      return {
        hex: trimmedColor.toUpperCase(),
        rgb,
        rgba: { ...rgb, a: 1 },
        hsl,
        hsla: { ...hsl, a: 1 },
        oklch: { l: 0, c: 0, h: 0 } // TODO: Implement OKLCH conversion
      }
    }
  }

  // RGB
  if (trimmedColor.startsWith('rgb(')) {
    const rgb = parseRgb(trimmedColor)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        rgba: { ...rgb, a: 1 },
        hsl,
        hsla: { ...hsl, a: 1 },
        oklch: { l: 0, c: 0, h: 0 }
      }
    }
  }

  // RGBA
  if (trimmedColor.startsWith('rgba(')) {
    const rgba = parseRgba(trimmedColor)
    if (rgba) {
      const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b)
      return {
        hex: rgbToHex(rgba.r, rgba.g, rgba.b),
        rgb: { r: rgba.r, g: rgba.g, b: rgba.b },
        rgba,
        hsl,
        hsla: { ...hsl, a: rgba.a },
        oklch: { l: 0, c: 0, h: 0 }
      }
    }
  }

  // HSL
  if (trimmedColor.startsWith('hsl(')) {
    const hsl = parseHsl(trimmedColor)
    if (hsl) {
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
      return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        rgba: { ...rgb, a: 1 },
        hsl,
        hsla: { ...hsl, a: 1 },
        oklch: { l: 0, c: 0, h: 0 }
      }
    }
  }

  // HSLA
  if (trimmedColor.startsWith('hsla(')) {
    const hsla = parseHsla(trimmedColor)
    if (hsla) {
      const rgb = hslToRgb(hsla.h, hsla.s, hsla.l)
      return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        rgba: { r: rgb.r, g: rgb.g, b: rgb.b, a: hsla.a },
        hsl: { h: hsla.h, s: hsla.s, l: hsla.l },
        hsla,
        oklch: { l: 0, c: 0, h: 0 }
      }
    }
  }

  return null
}

/**
 * Format color in specific format
 */
export function formatColor(color: ColorValues, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return color.hex
    case 'rgb':
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
    case 'rgba':
      return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`
    case 'hsl':
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
    case 'hsla':
      return `hsla(${color.hsla.h}, ${color.hsla.s}%, ${color.hsla.l}%, ${color.hsla.a})`
    case 'oklch':
      return `oklch(${color.oklch.l}%, ${color.oklch.c}%, ${color.oklch.h})`
    default:
      return color.hex
  }
}