import { useState, useEffect, useCallback, useRef, useMemo, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getContrastRatio } from '@/lib/utils'
import { DEFAULT_COLORS } from '@/constants/colors'

export function useColors() {
  const [textColor, setTextColor] = useState(DEFAULT_COLORS.TEXT)
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_COLORS.BACKGROUND)
  const [isInitialized, setIsInitialized] = useState(false)
  const [, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const router = useRouter()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const urlSyncSkippedFirstRef = useRef(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const urlTextColor = searchParams.get('textColor')
      const urlBackgroundColor = searchParams.get('backgroundColor')

      if (urlTextColor) {
        setTextColor(urlTextColor)
      }
      if (urlBackgroundColor) {
        setBackgroundColor(urlBackgroundColor)
      }
      setIsInitialized(true)
    }
  }, [searchParams])

  // Sync URL when colors change (picker, input, or restore). Skip first run after init (we just read from URL).
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return
    if (urlSyncSkippedFirstRef.current) {
      urlSyncSkippedFirstRef.current = false
      return
    }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        const url = new URL(window.location.href)
        url.searchParams.set('textColor', textColor)
        url.searchParams.set('backgroundColor', backgroundColor)
        router.push(url.toString())
      })
    }, 300)
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [textColor, backgroundColor, isInitialized, router, startTransition])

  const updateUrl = useCallback((newTextColor: string, newBackgroundColor: string) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce URL updates to 300ms with transition for better UX
    debounceTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined') {
        startTransition(() => {
          const url = new URL(window.location.href)
          url.searchParams.set('textColor', newTextColor)
          url.searchParams.set('backgroundColor', newBackgroundColor)
          router.push(url.toString())
        })
      }
    }, 300)
  }, [router, startTransition])

  const swapColors = useCallback(() => {
    const newTextColor = backgroundColor
    const newBackgroundColor = textColor
    setTextColor(newTextColor)
    setBackgroundColor(newBackgroundColor)
    updateUrl(newTextColor, newBackgroundColor)
  }, [backgroundColor, textColor, updateUrl])

  const updateColors = useCallback((newTextColor: string, newBackgroundColor: string) => {
    setTextColor(newTextColor)
    setBackgroundColor(newBackgroundColor)
    updateUrl(newTextColor, newBackgroundColor)
  }, [updateUrl])

  const contrastRatio = useMemo(
    () => getContrastRatio(textColor, backgroundColor),
    [textColor, backgroundColor]
  )

  return {
    textColor,
    backgroundColor,
    contrastRatio,
    setTextColor,
    setBackgroundColor,
    swapColors,
    updateColors,
    isInitialized
  }
}