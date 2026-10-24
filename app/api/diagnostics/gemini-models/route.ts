import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return NextResponse.json({ status: 'missing_key' }, { status: 503 })

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey),
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Reply with exactly: OK' }] }] }),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      const category = response.status === 401 || response.status === 403
        ? 'authentication_or_access'
        : response.status === 404
          ? 'model_or_endpoint_not_found'
          : response.status === 429
            ? 'quota_or_rate_limit'
            : response.status >= 500
              ? 'provider_unavailable'
              : 'invalid_request'
      return NextResponse.json({ status: 'generation_failed', httpStatus: response.status, category }, { status: 502 })
    }

    return NextResponse.json({ status: 'ok', model: 'gemini-2.5-flash', method: 'generateContent' })
  } catch {
    return NextResponse.json({ status: 'generation_failed', category: 'network_or_runtime_error' }, { status: 502 })
  }
}
