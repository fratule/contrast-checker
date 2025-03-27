import { describe, it, expect } from 'vitest'
import { GET, POST } from './route'

function nextRequest(url: string, options?: { method?: string; body?: string }) {
  return new Request(url, {
    method: options?.method ?? 'GET',
    body: options?.body,
    headers: options?.body ? { 'Content-Type': 'application/json' } : undefined,
  }) as unknown as import('next/server').NextRequest
}

describe('API /api/check', () => {
  const base = 'https://example.com/api/check'

  it('GET returns 400 when params missing', async () => {
    const res = await GET(nextRequest(base))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Missing parameters')
  })

  it('GET returns 400 for invalid color format', async () => {
    const res = await GET(nextRequest(`${base}?text=notacolor&background=%23fff`))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid color format')
  })

  it('GET returns 200 and correct ratio for hex colors', async () => {
    const res = await GET(nextRequest(`${base}?text=%23ffffff&background=%23000000`))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toMatchObject({
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
      passesAA: true,
      passesAAA: true,
    })
    expect(typeof json.ratio).toBe('number')
    expect(json.ratio).toBeGreaterThan(20)
  })

  it('GET accepts textColor and backgroundColor params', async () => {
    const url = `${base}?textColor=%23000000&backgroundColor=%23ffffff`
    const res = await GET(nextRequest(url))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ratio).toBeGreaterThan(1)
  })

  it('POST returns 400 for invalid JSON', async () => {
    const res = await POST(nextRequest(base, { method: 'POST', body: 'not json' }))
    expect(res.status).toBe(400)
  })

  it('POST returns 200 with valid body', async () => {
    const res = await POST(
      nextRequest(base, {
        method: 'POST',
        body: JSON.stringify({ textColor: '#333333', backgroundColor: '#eeeeee' }),
      })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty('ratio')
    expect(json).toHaveProperty('passesAA')
    expect(json).toHaveProperty('passesAAA')
  })
})
