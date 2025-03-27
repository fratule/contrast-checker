'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getContrastRatio } from '@/lib/utils'
import { hexToRgb, rgbToHsl, rgbToHex } from '@/lib/color-conversion'
import { Lightbulb, ChevronDown } from 'lucide-react'

interface ColorSuggestion {
  originalColor: string
  suggestedColor: string
  improvement: 'lightness' | 'saturation' | 'hue'
  contrastRatio: number
  originalRatio: number
  improvementRatio: number
}

interface ColorSuggestionsProps {
  textColor: string
  backgroundColor: string
  onApplySuggestion: (type: 'text' | 'background', color: string) => void
}

export function ColorSuggestions({ textColor, backgroundColor, onApplySuggestion }: ColorSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    text: ColorSuggestion[]
    background: ColorSuggestion[]
  }>({ text: [], background: [] })
  const [expanded, setExpanded] = useState(true)

  const currentRatio = useMemo(
    () => getContrastRatio(textColor, backgroundColor),
    [textColor, backgroundColor]
  )

  const generateSuggestions = useCallback(() => {
    // Generate suggestions for text color
    const textSuggestions = generateColorSuggestions(textColor, backgroundColor, 'text', currentRatio)

    // Generate suggestions for background color
    const backgroundSuggestions = generateColorSuggestions(backgroundColor, textColor, 'background', currentRatio)

    setSuggestions({
      text: textSuggestions,
      background: backgroundSuggestions
    })
  }, [textColor, backgroundColor, currentRatio])

  useEffect(() => {
    generateSuggestions()
  }, [generateSuggestions])

  const generateColorSuggestions = (
    baseColor: string,
    compareColor: string,
    type: 'text' | 'background',
    currentRatio: number
  ): ColorSuggestion[] => {
    const suggestions: ColorSuggestion[] = []
    const rgb = hexToRgb(baseColor)

    if (!rgb) return suggestions

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    // Generate lightness adjustments
    const lightnessSteps = type === 'text' ? [-10, 10, 20, 30] : [10, -10, -20, -30]
    lightnessSteps.forEach(step => {
      const newL = Math.max(0, Math.min(100, hsl.l + step))
      const newRgb = hslToRgb(hsl.h, hsl.s, newL)
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
      const newRatio = getContrastRatio(newHex, compareColor)

      if (newRatio > currentRatio) {
        suggestions.push({
          originalColor: baseColor,
          suggestedColor: newHex,
          improvement: 'lightness',
          contrastRatio: newRatio,
          originalRatio: currentRatio,
          improvementRatio: ((newRatio - currentRatio) / currentRatio) * 100
        })
      }
    })

    // Generate saturation adjustments for better contrast
    if (hsl.s > 10) {
      const newRgb = hslToRgb(hsl.h, hsl.s - 10, hsl.l)
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
      const newRatio = getContrastRatio(newHex, compareColor)

      if (newRatio > currentRatio) {
        suggestions.push({
          originalColor: baseColor,
          suggestedColor: newHex,
          improvement: 'saturation',
          contrastRatio: newRatio,
          originalRatio: currentRatio,
          improvementRatio: ((newRatio - currentRatio) / currentRatio) * 100
        })
      }
    }

    // Sort by improvement ratio and limit to top 3
    return suggestions
      .sort((a, b) => b.contrastRatio - a.contrastRatio)
      .slice(0, 3)
  }

  // Helper function for HSL to RGB conversion
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
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

  const getImprovementLabel = (improvement: string) => {
    switch (improvement) {
      case 'lightness':
        return 'Lightness Adjusted'
      case 'saturation':
        return 'Saturation Adjusted'
      case 'hue':
        return 'Hue Adjusted'
      default:
        return 'Improved'
    }
  }

  const shouldShowSuggestions = useMemo(() => {
    return currentRatio < 7 // Only show if not AAA compliant
  }, [currentRatio])

  if (!shouldShowSuggestions) {
    return null
  }

  return (
    <Card className="w-full">
      <div className="p-4">
        <div className={`flex items-center justify-between ${expanded ? 'mb-4' : ''}`}>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold">Accessibility Suggestions</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs"
          >
            {expanded ? 'Hide' : 'Show'} Suggestions
            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {expanded && (
          <div className="space-y-4">
            {/* Text Color Suggestions */}
            {suggestions.text.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Text Color Improvements</h4>
                <div className="grid gap-2">
                  {suggestions.text.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onApplySuggestion('text', suggestion.suggestedColor)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: suggestion.suggestedColor }}
                        />
                        <div className="text-sm">
                          <div className="font-mono">{suggestion.suggestedColor}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {getImprovementLabel(suggestion.improvement)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {suggestion.originalRatio.toFixed(1)} → {suggestion.contrastRatio.toFixed(1)}
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          +{suggestion.improvementRatio.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Background Color Suggestions */}
            {suggestions.background.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Background Color Improvements</h4>
                <div className="grid gap-2">
                  {suggestions.background.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onApplySuggestion('background', suggestion.suggestedColor)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: suggestion.suggestedColor }}
                        />
                        <div className="text-sm">
                          <div className="font-mono">{suggestion.suggestedColor}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {getImprovementLabel(suggestion.improvement)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {suggestion.originalRatio.toFixed(1)} → {suggestion.contrastRatio.toFixed(1)}
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          +{suggestion.improvementRatio.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
              <strong>💡 Tip:</strong> These suggestions help improve WCAG compliance.
              Click any suggestion to apply it instantly.
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}