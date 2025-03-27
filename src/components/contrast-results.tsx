'use client'

import { Badge } from '@/components/ui/badge'
import { WCAG_GUIDELINES } from '@/constants/wcag'

interface ContrastResultsProps {
  ratio: number
}

export function ContrastResults({ ratio }: ContrastResultsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">WCAG 2.2 Guidelines</h3>
      <div className="border border-border bg-card">
        <ul className="divide-y divide-border">
          {WCAG_GUIDELINES.map((result) => {
            const passes = ratio >= result.requirement
            return (
              <li
                key={result.name}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium">{result.name}</span>
                      <span className="text-sm text-muted-foreground">({result.size})</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-0 sm:ml-0">{result.description}</p>
                    <div>
                      <p
                        className={`${result.name.includes('Large') ? 'text-2xl font-semibold' : 'text-base'}`}
                        style={{
                          color: passes ? 'inherit' : 'var(--destructive)',
                          opacity: passes ? 1 : 0.6
                        }}
                      >
                        Sample {result.name.includes('Large') ? 'Large' : 'Normal'} Text
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {passes ? (
                      <>
                        <span className="text-base font-medium tabular-nums">{result.requirement}:1</span>
                        <Badge className="bg-green-600 text-white border-green-700 px-2 py-1">
                          Pass
                        </Badge>
                      </>
                    ) : (
                      <>
                        <span className="text-sm tabular-nums text-muted-foreground">
                          <span className="text-destructive">{ratio.toFixed(2)}:1</span>
                          <span className="mx-1">/</span>
                          <span>{result.requirement}:1</span>
                        </span>
                        <Badge variant="destructive" className="px-2 py-1">
                          Fail
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}