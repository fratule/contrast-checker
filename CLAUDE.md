# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Contrast Ratio Checker - a web app for checking color contrast against WCAG 2.2 accessibility standards. Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and shadcn/ui components.

**Live site:** https://www.contrast-checker.org

## Commands

```bash
npm run dev           # Start dev server with Turbopack (localhost:3000)
npm run build         # Production build
npm run lint          # Run ESLint
npm run typecheck     # TypeScript type checking
npm run test          # Run Vitest tests
npm run test:watch    # Vitest in watch mode
```

## Architecture

### App Structure (src/)

- **app/page.tsx** - Main client component with color picker UI
- **app/api/check/** - REST API for contrast checking (GET/POST, rate-limited at 60 req/min)
- **app/api/og/** - Dynamic OG image generation

### Key Modules

- **hooks/use-colors.ts** - Color state management with URL synchronization (300ms debounce)
- **hooks/use-history.ts** - localStorage-based history management
- **lib/utils.ts** - Core utilities including `cn()` helper, hex/rgb conversion, contrast ratio calculation
- **lib/color-conversion.ts** - Multi-format color parsing (hex, rgb, hsl, hsla, oklch)
- **constants/wcag.ts** - WCAG thresholds for AA/AAA compliance

### Component Patterns

- UI components use Tailwind + shadcn/ui with `cn()` for class merging
- Client components marked with `'use client'` directive
- Theme support via context provider (light/dark with localStorage persistence)
- Toast notifications with independent expiration timers

### API Design

The `/api/check` endpoint accepts multiple parameter aliases:
- Text color: `text`, `fg`, or `textColor`
- Background: `background`, `bg`, or `backgroundColor`

Supports hex, RGB, HSL color formats. Returns WCAG compliance results for AA, AAA, and large text.

## Testing

Tests are colocated with source files (e.g., `route.test.ts` alongside `route.ts`). Run with `npm run test`.

## Key Technical Details

- **WCAG Contrast Formula**: Uses sRGB gamma correction with luminance coefficients (0.2126 R, 0.7152 G, 0.0722 B)
- **URL as State**: Color selections sync to URL query params for shareability
- **Path Alias**: `@/` maps to `src/`
- **PWA Ready**: manifest.json, icons, and service worker support
