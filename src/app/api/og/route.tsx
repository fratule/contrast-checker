import { ImageResponse } from 'next/og'
import { parseColor } from '@/lib/color-conversion'
import { getContrastRatio } from '@/lib/utils'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const textColorParam = searchParams.get('textColor') || searchParams.get('text')
  const bgColorParam = searchParams.get('backgroundColor') || searchParams.get('background')

  let textHex = '#ffffff'
  let bgHex = '#1a1a1a'
  if (textColorParam) {
    const parsed = parseColor(textColorParam.trim())
    if (parsed) textHex = parsed.hex
  }
  if (bgColorParam) {
    const parsed = parseColor(bgColorParam.trim())
    if (parsed) bgHex = parsed.hex
  }

  const ratio = getContrastRatio(textHex, bgHex)
  const ratioText = `${ratio.toFixed(2)}:1`

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          margin: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'row',
          }}
        >
          <div
            style={{
              width: '50%',
              height: '100%',
              backgroundColor: textHex,
            }}
          />
          <div
            style={{
              width: '50%',
              height: '100%',
              backgroundColor: bgHex,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 56,
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          Contrast: {ratioText}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 32,
            fontWeight: 600,
            color: '#374151',
          }}
        >
          Contrast Ratio Checker – WCAG 2.2
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
