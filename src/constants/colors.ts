export const DEFAULT_COLORS = {
  TEXT: '#000000' as string,
  BACKGROUND: '#FFFFFF' as string,
} as const

export const COLOR_FORMATS = {
  HEX: 'hex',
  RGB: 'rgb',
  HSL: 'hsl',
} as const

export const COLOR_LUMINANCE_COEFFICIENTS = {
  R: 0.2126,
  G: 0.7152,
  B: 0.0722,
} as const

export const COLOR_CONVERSION = {
  SRGB_THRESHOLD: 0.03928,
  SRGB_OFFSET: 0.055,
  SRGB_SCALE: 1.055,
  SRGB_DIVISOR: 12.92,
} as const 