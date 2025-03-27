export interface WCAGGuideline {
  name: string
  requirement: number
  description: string
  size: string
}

export const WCAG_GUIDELINES: WCAGGuideline[] = [
  {
    name: 'Normal Text (AA)',
    requirement: 4.5,
    description: 'Minimum contrast ratio for normal text',
    size: '16px',
  },
  {
    name: 'Large Text (AA)',
    requirement: 3,
    description: 'Minimum contrast ratio for large text (18pt or 14pt bold)',
    size: '18px',
  },
  {
    name: 'Normal Text (AAA)',
    requirement: 7,
    description: 'Enhanced contrast ratio for normal text',
    size: '16px',
  },
  {
    name: 'Large Text (AAA)',
    requirement: 4.5,
    description: 'Enhanced contrast ratio for large text (18pt or 14pt bold)',
    size: '18px',
  },
]

export const CONTRAST_LEVELS = {
  AAA: 7,
  AA: 4.5,
  AA_LARGE: 3,
} as const 