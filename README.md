# Contrast Ratio Checker

**Check color contrast between text and background — WCAG 2.2 in one place.**

**[Live app](https://contrast-ratio.vercel.app)** · [GitHub](https://github.com/fratule/contrast-checker)

---

This project was **built 100% with AI** — no hand-written code. Cursor + OpenCode did the whole thing.

---

## Features

- Check contrast ratio between two colors in real time
- Color picker + hex, RGB, HSL input (copy values with one click)
- WCAG 2.2 compliance (AA, AAA, large text)
- Shareable URLs (`?textColor=…&backgroundColor=…`)
- History (localStorage), suggestions, light/dark theme
- Public API for programmatic checks
- PWA-ready (manifest + installable)

## Quick start

```bash
git clone https://github.com/fratule/contrast-checker.git
cd contrast-checker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

**Endpoint:** `GET` or `POST` `/api/check`

**Rate limit:** 60 requests per minute per IP.

### Parameters

| Name | GET (query) | POST (body) | Description |
|------|-------------|-------------|-------------|
| Text color | `text`, `textColor`, or `fg` | `text` or `textColor` | Any supported format (hex, rgb, hsl, etc.) |
| Background color | `background`, `backgroundColor`, or `bg` | `background` or `backgroundColor` | Same |

### Example request (GET)

```bash
curl "https://contrast-ratio.vercel.app/api/check?text=%23ffffff&background=%23000000"
```

Or with `textColor` / `backgroundColor`:

```bash
curl "https://contrast-ratio.vercel.app/api/check?textColor=%23ffffff&backgroundColor=%23000000"
```

### Example request (POST)

```bash
curl -X POST https://contrast-ratio.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{"textColor": "#ffffff", "backgroundColor": "#000000"}'
```

### Example response (200)

```json
{
  "ratio": 21,
  "textColor": "#FFFFFF",
  "backgroundColor": "#000000",
  "passesAA": true,
  "passesAAA": true,
  "largeTextOnly": false
}
```

- **ratio** — Contrast ratio (e.g. 21 for white on black).
- **passesAA** — Meets AA (4.5:1 normal, 3:1 large).
- **passesAAA** — Meets AAA (7:1 normal, 4.5:1 large).
- **largeTextOnly** — Only meets large-text requirements (3:1).

### Error responses

- **400** — Missing or invalid parameters; invalid color format. Body: `{ "error": "…" }`.
- **429** — Too many requests. Body: `{ "error": "Too many requests" }`.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Run API tests (Vitest) |

## Tech

- Next.js, React, TypeScript
- Tailwind CSS, shadcn/ui, react-colorful
- Vercel Analytics, PWA manifest, llms.txt

## License

MIT
