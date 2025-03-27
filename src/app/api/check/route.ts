import { NextRequest, NextResponse } from 'next/server'
import { parseColor } from '@/lib/color-conversion'
import { getContrastRatio, getContrastCompliance } from '@/lib/utils'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 60
const store = new Map<string, { count: number; resetAt: number }>()

function getClientId(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function rateLimit(clientId: string): boolean {
  const now = Date.now()
  let entry = store.get(clientId)
  if (!entry) {
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    store.set(clientId, entry)
    return true
  }
  if (now > entry.resetAt) {
    entry.count = 1
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS
    return true
  }
  entry.count += 1
  return entry.count <= RATE_LIMIT_MAX
}

const MAX_COLOR_LENGTH = 200

export async function GET(request: NextRequest) {
  const clientId = getClientId(request)
  if (!rateLimit(clientId)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const textParam = searchParams.get('text') ?? searchParams.get('textColor') ?? searchParams.get('fg')
  const bgParam = searchParams.get('background') ?? searchParams.get('backgroundColor') ?? searchParams.get('bg')

  if (!textParam || !bgParam) {
    return NextResponse.json(
      { error: 'Missing parameters. Use text (or textColor/fg) and background (or backgroundColor/bg).' },
      { status: 400 }
    )
  }

  if (textParam.length > MAX_COLOR_LENGTH || bgParam.length > MAX_COLOR_LENGTH) {
    return NextResponse.json({ error: 'Color value too long' }, { status: 400 })
  }

  const textParsed = parseColor(textParam.trim())
  const bgParsed = parseColor(bgParam.trim())

  if (!textParsed || !bgParsed) {
    return NextResponse.json(
      { error: 'Invalid color format. Supported: hex, rgb, rgba, hsl, hsla.' },
      { status: 400 }
    )
  }

  const textHex = textParsed.hex
  const bgHex = bgParsed.hex
  const ratio = getContrastRatio(textHex, bgHex)
  const compliance = getContrastCompliance(ratio)

  return NextResponse.json({
    ratio: Math.round(ratio * 100) / 100,
    textColor: textHex,
    backgroundColor: bgHex,
    passesAA: compliance.aa,
    passesAAA: compliance.aaa,
    largeTextOnly: compliance.largeText ?? false,
  })
}

export async function POST(request: NextRequest) {
  const clientId = getClientId(request)
  if (!rateLimit(clientId)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: { text?: string; textColor?: string; background?: string; backgroundColor?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const textParam = body.text ?? body.textColor
  const bgParam = body.background ?? body.backgroundColor

  if (!textParam || !bgParam || typeof textParam !== 'string' || typeof bgParam !== 'string') {
    return NextResponse.json(
      { error: 'Body must include text/textColor and background/backgroundColor (strings).' },
      { status: 400 }
    )
  }

  if (textParam.length > MAX_COLOR_LENGTH || bgParam.length > MAX_COLOR_LENGTH) {
    return NextResponse.json({ error: 'Color value too long' }, { status: 400 })
  }

  const textParsed = parseColor(textParam.trim())
  const bgParsed = parseColor(bgParam.trim())

  if (!textParsed || !bgParsed) {
    return NextResponse.json(
      { error: 'Invalid color format. Supported: hex, rgb, rgba, hsl, hsla.' },
      { status: 400 }
    )
  }

  const textHex = textParsed.hex
  const bgHex = bgParsed.hex
  const ratio = getContrastRatio(textHex, bgHex)
  const compliance = getContrastCompliance(ratio)

  return NextResponse.json({
    ratio: Math.round(ratio * 100) / 100,
    textColor: textHex,
    backgroundColor: bgHex,
    passesAA: compliance.aa,
    passesAAA: compliance.aaa,
    largeTextOnly: compliance.largeText ?? false,
  })
}
