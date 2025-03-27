import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contrast-ratio.vercel.app"

export const metadata: Metadata = {
  title: "Contrast Ratio Checker – WCAG 2.2",
  description: "Check color contrast between text and background. Ensure your combinations meet WCAG 2.2 AA and AAA guidelines.",
  keywords: ["contrast ratio", "WCAG", "accessibility", "color contrast", "AA", "AAA", "a11y"],
  authors: [{ name: "Contrast Ratio Checker" }],
  openGraph: {
    title: "Contrast Ratio Checker – WCAG 2.2",
    description: "Check color contrast between text and background. Meet WCAG 2.2 accessibility standards.",
    url: siteUrl,
    siteName: "Contrast Ratio Checker",
    type: "website",
    images: [{ url: `${siteUrl}/api/og`, width: 1200, height: 630, alt: "Contrast Ratio Checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contrast Ratio Checker – WCAG 2.2",
    description: "Check color contrast and meet WCAG 2.2 guidelines.",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Contrast Ratio Checker",
              description: "Check color contrast between text and background. Ensure your combinations meet WCAG 2.2 AA and AAA guidelines.",
              url: siteUrl,
              applicationCategory: "UtilitiesApplication",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How is contrast ratio calculated?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We use the WCAG formula: (L1 + 0.05) / (L2 + 0.05), where L1 and L2 are the relative luminances of the lighter and darker colors. The result is a ratio (e.g. 4.5:1 for AA normal text).",
                  },
                },
                {
                  "@type": "Question",
                  name: "What do AA and AAA mean?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "AA is the minimum conformance level (4.5:1 for normal text, 3:1 for large text). AAA is enhanced (7:1 and 4.5:1). This tool checks both so you can aim for the level you need.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Why do my URL parameters update when I change colors?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "So you can share or bookmark a specific combination. Anyone opening the link will see the same colors and ratio.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased touch-manipulation`}>
        <ThemeProvider storageKey="contrast-ratio-theme">
          <div className="min-h-screen flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold truncate">Contrast Ratio Checker</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Ensure your colors meet accessibility standards
                  </p>
                </div>
                <nav className="flex items-center gap-2 sm:gap-4">
                  <ThemeToggle />
                  <a
                    href="https://github.com/fratule/contrast-checker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-md hover:bg-muted"
                  >
                    <span className="hidden sm:inline">GitHub</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>

          <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
                <p className="text-center sm:text-left">Built with ❤️ using Next.js, Cursor & OpenCode</p>
                <p>© {new Date().getFullYear()} Contrast Ratio Checker</p>
              </div>
            </div>
          </footer>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
