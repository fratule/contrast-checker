'use client'

import { useState, Suspense, useMemo, lazy } from 'react'
import { ColorPicker } from '@/components/color-picker'
import { ColorPreview } from '@/components/color-preview'
import { ContrastResults } from '@/components/contrast-results'
import { HistoryModal } from '@/components/history-modal'
import { useColors } from '@/hooks/use-colors'
import { useHistory } from '@/hooks/use-history'
import { useToast } from '@/components/ui/toast'
import { useMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight, Copy } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading'
import { HowAndWhy } from '@/components/how-and-why'

const ColorSuggestions = lazy(() => import('@/components/color-suggestions').then(m => ({ default: m.ColorSuggestions })))

function HomeContent() {
  const { textColor, backgroundColor, contrastRatio, setTextColor, setBackgroundColor, swapColors, isInitialized } = useColors()
  const { history, isLoading, error, addToHistory, removeHistoryItem, clearHistory, retry } = useHistory()
  const { success, error: showError, ToastContainer } = useToast()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const isMobile = useMobile()

  const handleCheck = async () => {
    if (isSaving) return

    setIsSaving(true)
    const wasSuccessful = await addToHistory(textColor, backgroundColor, contrastRatio)

    if (wasSuccessful) {
      success('Saved to history!')
    } else {
      showError('Failed to save to history')
    }

    setIsSaving(false)
  }

  const handleRestore = (textColor: string, backgroundColor: string) => {
    setTextColor(textColor)
    setBackgroundColor(backgroundColor)
    setIsHistoryOpen(false)
    success('Colors restored from history')
  }

  const handleCopyFormat = (_value: string, format: 'rgb' | 'hsl') => {
    success(format === 'rgb' ? 'RGB value copied' : 'HSL value copied')
  }

  const handleCopyLink = (copyText?: string, copyBg?: string) => {
    const t = copyText ?? textColor
    const b = copyBg ?? backgroundColor
    const url = new URL(typeof window !== 'undefined' ? window.location.href : '', window.location.origin)
    url.searchParams.set('textColor', t)
    url.searchParams.set('backgroundColor', b)
    const u = url.toString()
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(u)
      success('Link copied to clipboard')
    }
  }

  const handleSuggestionApply = (type: 'text' | 'background', color: string) => {
    if (type === 'text') {
      setTextColor(color)
    } else {
      setBackgroundColor(color)
    }
    success(`Applied ${type} color suggestion!`)
  }

  const memoizedContrastRatio = useMemo(() => contrastRatio.toFixed(2), [contrastRatio])

  return (
    <>
      <main className="flex-1 px-4 py-6 sm:py-8">
        <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Color Pickers Section */}
          <section className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 dot-pattern" />

            {/* Creative blob shapes */}
            <div className="blob-shape top-0 left-0 w-64 h-64 bg-primary" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }} />
            <div className="blob-shape bottom-0 right-0 w-48 h-48 bg-chart-2" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">
              {/* Text Color Section */}
              <div className="relative p-6 sm:p-8 border-r border-border bg-linear-to-br from-background to-muted/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-20" />
                <ColorPicker
                  label="Text Color"
                  value={textColor}
                  onChange={setTextColor}
                  disabled={!isInitialized}
                  contrastRatio={contrastRatio}
                  oppositeColor={backgroundColor}
                  onCopyFormat={handleCopyFormat}
                />
              </div>

              {/* Background Color Section */}
              <div className="relative p-6 sm:p-8 bg-linear-to-br from-muted/30 to-background">
                <div className="absolute top-0 right-0 w-full h-1 bg-chart-2 opacity-20" />
                <ColorPicker
                  label="Background Color"
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                  disabled={!isInitialized}
                  contrastRatio={contrastRatio}
                  oppositeColor={textColor}
                  onCopyFormat={handleCopyFormat}
                />
              </div>
            </div>

            {/* Swap Button - Integrated between sections */}
            <div className="flex justify-center -mt-4 relative z-10">
              <Button
                variant="default"
                onClick={swapColors}
                disabled={!isInitialized}
                className="group px-8 py-3 bg-primary text-primary-foreground border-2 border-primary hover:bg-primary/90 hover:border-primary/80 transition-all duration-300"
                aria-label="Swap text and background colors"
              >
                <span className="relative inline-flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180 group-active:scale-110" />
                  <span className="relative overflow-hidden">
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full group-hover:opacity-0">
                      Swap Colors
                    </span>
                    <span className="absolute inset-0 inline-block translate-y-full opacity-0 transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Swap Colors
                    </span>
                  </span>
                </span>
              </Button>
            </div>
          </section>

          {/* Contrast Ratio Results Section */}
          <section className="space-y-4 sm:space-y-6">
            <div className="bg-card border border-border p-6 sm:p-8 relative overflow-hidden">
              {/* Subtle background accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-chart-2 to-chart-3" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-center sm:text-left space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Contrast Ratio: {memoizedContrastRatio}:1
                  </h2>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {contrastRatio >= 7 && (
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700">
                        AAA Compliant
                      </span>
                    )}
                    {contrastRatio >= 4.5 && contrastRatio < 7 && (
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700">
                        AA Compliant
                      </span>
                    )}
                    {contrastRatio >= 3 && contrastRatio < 4.5 && (
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">
                        AA Large Only
                      </span>
                    )}
                    {contrastRatio < 3 && (
                      <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-300 dark:border-red-700">
                        WCAG Fail
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons Group */}
                <div className="flex items-center gap-0 border border-border bg-muted/30">
                  <Button
                    onClick={handleCheck}
                    disabled={!isInitialized || isSaving}
                    className="border-r border-border flex-1 sm:flex-none"
                    size="lg"
                    variant="ghost"
                  >
                    {isSaving ? 'Saving...' : 'Save to History'}
                  </Button>
                  <Button
                    onClick={() => handleCopyLink()}
                    size="lg"
                    variant="ghost"
                    className="border-r border-border px-3"
                    aria-label="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <HistoryModal
                    history={history}
                    isLoading={isLoading}
                    error={error}
                    onRestore={handleRestore}
                    onRemove={removeHistoryItem}
                    onClear={clearHistory}
                    onCopy={handleCopyLink}
                    onRetry={retry}
                    isOpen={isHistoryOpen}
                    onOpenChange={setIsHistoryOpen}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preview Section - Moved up for better UX */}
          <section>
            <ColorPreview
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </section>

          {/* Color Suggestions */}
          <section>
            <Suspense fallback={<div className="p-4 text-center text-muted-foreground">Loading suggestions...</div>}>
              <ColorSuggestions
                textColor={textColor}
                backgroundColor={backgroundColor}
                onApplySuggestion={handleSuggestionApply}
              />
            </Suspense>
          </section>

          {/* WCAG 2.2 Guidelines */}
          <section className="space-y-4">
            <ContrastResults ratio={contrastRatio} />
          </section>

          {/* How & why – small FAQ */}
          <section>
            <HowAndWhy />
          </section>
        </div>
      </main>
      <ToastContainer />
    </>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner text="Loading contrast checker..." />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
