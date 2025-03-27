'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading'
import { History, Trash2, Trash, AlertCircle, RefreshCw, Copy } from 'lucide-react'
import type { HistoryEntry } from '@/hooks/use-history'

interface HistoryModalProps {
  history: HistoryEntry[]
  isLoading?: boolean
  error?: string | null
  onRestore: (textColor: string, backgroundColor: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onCopy?: (textColor: string, backgroundColor: string) => void
  onRetry?: () => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function HistoryModal({
  history,
  isLoading = false,
  error,
  onRestore,
  onRemove,
  onClear,
  onCopy,
  onRetry,
  isOpen,
  onOpenChange
}: HistoryModalProps) {
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  const handleRemove = async (id: string) => {
    setIsRemoving(id)
    await onRemove(id)
    setIsRemoving(null)
  }

  const handleClear = async () => {
    await onClear()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lg" className="relative px-2 border-l-0 min-w-[60px]">
          <History className="h-4 w-4" />
          {history.length > 0 && !isLoading && (
            <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 bg-primary text-[11px] font-bold text-primary-foreground flex items-center justify-center border border-primary-foreground/20">
              {history.length > 99 ? '99+' : history.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        {/* Background pattern */}
        <div className="absolute inset-0 dot-pattern-modal pointer-events-none" />

        <DialogHeader className="relative shrink-0">
          <DialogTitle>History</DialogTitle>
          <DialogDescription>
            View and restore your previous color combinations
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 flex-1 min-h-0 overflow-y-auto relative">
          {isLoading ? (
            <div className="py-12 border-2 border-border text-center">
              <LoadingSpinner text="Loading history..." />
            </div>
          ) : error ? (
            <div className="py-12 border-2 border-border text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">Failed to load history</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
              {onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border-2 border-border">
              <p className="text-base">No history yet</p>
              <p className="text-sm mt-2">Your saved color combinations will appear here</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="border-2 border-border p-4 sm:p-6 space-y-4 hover:border-primary/50 transition-colors bg-card relative"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-chart-2 to-chart-3 opacity-20" />

                {/* Color Section – column on mobile, row on larger */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex gap-2 shrink-0">
                    <div
                      className="w-12 h-12 border-2 border-border"
                      style={{ backgroundColor: entry.color1 }}
                      aria-label={`Text color: ${entry.color1}`}
                    />
                    <div
                      className="w-12 h-12 border-2 border-border"
                      style={{ backgroundColor: entry.color2 }}
                      aria-label={`Background color: ${entry.color2}`}
                    />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="text-sm font-medium break-all">
                      <span className="text-muted-foreground">Text:</span> {entry.color1}
                    </div>
                    <div className="text-sm font-medium break-all">
                      <span className="text-muted-foreground">Background:</span> {entry.color2}
                    </div>
                  </div>
                </div>

                {/* Ratio Section */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-lg font-semibold">
                    Contrast Ratio: {entry.contrast ? `${entry.contrast.toFixed(2)}:1` : 'N/A'}
                  </span>
                  {entry.contrast && (
                    <>
                      {entry.contrast >= 7 && (
                        <Badge className="bg-green-600 text-white border-green-700 px-3 py-1">
                          AAA
                        </Badge>
                      )}
                      {entry.contrast >= 4.5 && entry.contrast < 7 && (
                        <Badge className="bg-green-500 text-white border-green-600 px-3 py-1">
                          AA
                        </Badge>
                      )}
                      {entry.contrast >= 3 && entry.contrast < 4.5 && (
                        <Badge variant="secondary" className="px-3 py-1">
                          AA Large
                        </Badge>
                      )}
                      {entry.contrast < 3 && (
                        <Badge variant="destructive" className="px-3 py-1">
                          Fail
                        </Badge>
                      )}
                    </>
                  )}
                </div>

                {/* Action Buttons Group: Use (grow) | Copy | Delete */}
                <div className="flex items-center gap-0 border border-border bg-muted/30">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRestore(entry.color1, entry.color2)}
                    className="border-r border-border flex-1"
                  >
                    Use
                  </Button>
                  {onCopy && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCopy(entry.color1, entry.color2)}
                      className="border-r border-border px-2.5"
                      aria-label="Copy colors"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(entry.id)}
                    disabled={isRemoving === entry.id}
                    className="border-l-0 gap-2 px-2.5 sm:px-3"
                    aria-label="Delete"
                  >
                    {isRemoving === entry.id ? (
                      <LoadingSpinner size="sm" className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4 shrink-0" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
          {history.length > 0 && !isLoading && !error && (
            <div className="pt-4 border-t-2 border-border">
              <Button
                variant="destructive"
                className="group w-full px-8 py-3 border-2 border-destructive hover:bg-destructive/90 hover:border-destructive/80 transition-all duration-300"
                onClick={handleClear}
                disabled={isRemoving !== null}
              >
                <span className="relative inline-flex items-center gap-2">
                  <Trash className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="relative overflow-hidden">
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full group-hover:opacity-0">
                      Clear All History
                    </span>
                    <span className="absolute inset-0 inline-block translate-y-full opacity-0 transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Clear All History
                    </span>
                  </span>
                </span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}