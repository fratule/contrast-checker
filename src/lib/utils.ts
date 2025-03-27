import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { COLOR_LUMINANCE_COEFFICIENTS, COLOR_CONVERSION } from "@/constants/colors"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function getLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255
    return s <= COLOR_CONVERSION.SRGB_THRESHOLD 
      ? s / COLOR_CONVERSION.SRGB_DIVISOR 
      : Math.pow((s + COLOR_CONVERSION.SRGB_OFFSET) / COLOR_CONVERSION.SRGB_SCALE, 2.4)
  })
  return COLOR_LUMINANCE_COEFFICIENTS.R * rs + 
         COLOR_LUMINANCE_COEFFICIENTS.G * gs + 
         COLOR_LUMINANCE_COEFFICIENTS.B * bs
}

export function getContrastRatio(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrastCompliance(ratio: number) {
  if (ratio >= 7) return { aa: true, aaa: true }
  if (ratio >= 4.5) return { aa: true, aaa: false }
  if (ratio >= 3) return { aa: false, aaa: false, largeText: true }
  return { aa: false, aaa: false, largeText: false }
}
