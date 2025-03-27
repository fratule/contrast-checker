'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQ = [
  {
    q: 'How is contrast ratio calculated?',
    a: 'We use the WCAG formula: (L1 + 0.05) / (L2 + 0.05), where L1 and L2 are the relative luminances of the lighter and darker colors. The result is a ratio (e.g. 4.5:1 for AA normal text).',
  },
  {
    q: 'What do AA and AAA mean?',
    a: 'AA is the minimum conformance level (4.5:1 for normal text, 3:1 for large text). AAA is enhanced (7:1 and 4.5:1). This tool checks both so you can aim for the level you need.',
  },
  {
    q: 'Why do my URL parameters update when I change colors?',
    a: 'So you can share or bookmark a specific combination. Anyone opening the link will see the same colors and ratio.',
  },
]

export function HowAndWhy() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">How & why</h3>
      <div className="border border-border bg-card divide-y divide-border">
        {FAQ.map((item, index) => (
          <div key={index}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-muted/30 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-none"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-sm sm:text-base">{item.q}</span>
              <ChevronDown
                className={cn('h-4 w-4 shrink-0 transition-transform', openIndex === index && 'rotate-180')}
                aria-hidden
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-sm text-muted-foreground">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
