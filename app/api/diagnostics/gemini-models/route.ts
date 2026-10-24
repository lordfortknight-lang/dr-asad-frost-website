import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const modelId = 'gemini-2.5-flash'
const apiVersion = 'v1beta'
const apiHost = 'generativelanguage.googleapis.com'

function classify(status: number) {
  if (status === 401 || status === 403) return 'authentication_or_access'
  if (status === 404) return 'model_or_endpoint_not_found'
  if (status === 429) return 'quota_or_rate_limit'
  if (status >= 500) return 'provider_unavailable'
  return 'invalid_request'
}

function sanitizeMessage(value: unknown) {
  if (typeof value !== 'string') return 'No provider message returned.'
  return value
    .replace(/([?&]key=)[^&\s]+/gi, '$1[redacted]')
    .replace(/AIza[\w-]+/g, '[redacted]')
    .replace(/\s+/g, ' ')
    .slice(0, 240)
}

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return NextResponse.json({ status: 'missing_key' }, { status: 503 })

  const listUrl = `https://${apiHost}/${apiVersion}/models`
  const generateUrl = `${listUrl}/${modelId}:generateContent`

  try {
    const listResponse = await fetch(`${listUrl}?key=${encodeURIComponent(apiKey)}`, { cache: 'no-store' })
    const listBody = await listResponse.json().catch(() => null) as { models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>; error?: { message?: string } } | null
    if (!listResponse.ok) {
      return NextResponse.json({ status: 'model_list_failed', httpStatus: listResponse.status, category: classify(listResponse.status), apiVersion, apiHost, errorMessage: sanitizeMessage(listBody?.error?.message) }, { status: 502 })
    }

    const model = listBody?.models?.find((entry) => entry.name === `models/${modelId}`)
    const supportsGenerateContent = model?.supportedGenerationMethods?.includes('generateContent') ?? false
    const response = await fetch(`${generateUrl}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Reply with exactly: OK' }] }] }),
      cache: 'no-store',
    })
    const responseBody = await response.json().catch(() => null) as { candidates?: unknown[]; error?: { message?: string } } | null

    if (!response.ok) {
      return NextResponse.json({ status: 'generation_failed', httpStatus: response.status, category: classify(response.status), apiVersion, apiHost, modelName: model?.name ?? null, supportedGenerationMethods: model?.supportedGenerationMethods ?? [], supportsGenerateContent, method: 'POST', endpointPath: `/${apiVersion}/models/${modelId}:generateContent`, errorMessage: sanitizeMessage(responseBody?.error?.message) }, { status: 502 })
    }

    return NextResponse.json({ status: 'ok', apiVersion, apiHost, modelName: model?.name ?? null, supportedGenerationMethods: model?.supportedGenerationMethods ?? [], supportsGenerateContent, method: 'POST', endpointPath: `/${apiVersion}/models/${modelId}:generateContent`, generated: Array.isArray(responseBody?.candidates) && responseBody.candidates.length > 0 })
  } catch {
    return NextResponse.json({ status: 'generation_failed', category: 'network_or_runtime_error', apiVersion, apiHost }, { status: 502 })
  }
}
