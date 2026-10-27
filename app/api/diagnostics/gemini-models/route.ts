import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const apiVersion = 'v1beta'
const apiHost = 'generativelanguage.googleapis.com'

type ListedModel = {
  name?: string
  supportedGenerationMethods?: string[]
}

function classify(status: number) {
  if (status === 401 || status === 403) return 'authentication_or_access'
  if (status === 429) return 'quota_or_rate_limit'
  if (status >= 500) return 'provider_unavailable'
  return 'model_list_request_failed'
}

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return NextResponse.json({ status: 'missing_key' }, { status: 503 })

  const listUrl = `https://${apiHost}/${apiVersion}/models`

  try {
    const response = await fetch(`${listUrl}?key=${encodeURIComponent(apiKey)}`, { cache: 'no-store' })
    if (!response.ok) {
      return NextResponse.json({ status: 'model_list_failed', httpStatus: response.status, category: classify(response.status) }, { status: 502 })
    }

    const body = await response.json().catch(() => null) as { models?: ListedModel[] } | null
    const models = (body?.models ?? [])
      .filter((model) => model.name && model.supportedGenerationMethods?.includes('generateContent'))
      .map(({ name, supportedGenerationMethods }) => ({ name, supportedGenerationMethods }))

    return NextResponse.json({ status: 'ok', models })
  } catch {
    return NextResponse.json({ status: 'model_list_failed', category: 'network_or_runtime_error' }, { status: 502 })
  }
}
