import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 15

const preferredModels = ['gemini-2.5-flash', 'gemini-2.0-flash']

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ status: 'missing_configuration' }, { status: 503 })
  }

  try {
    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      { cache: 'no-store' },
    )

    if (!modelsResponse.ok) {
      return NextResponse.json({ status: 'authentication_or_model_listing_failed' }, { status: modelsResponse.status === 429 ? 429 : 503 })
    }

    const models = (await modelsResponse.json()) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>
    }
    const model = preferredModels.find((candidate) =>
      models.models?.some(
        (entry) => entry.name === `models/${candidate}` && entry.supportedGenerationMethods?.includes('generateContent'),
      ),
    )

    if (!model) {
      return NextResponse.json({ status: 'no_supported_free_candidate_verified' }, { status: 503 })
    }

    const generationResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Reply with the single word: READY' }] }],
          generationConfig: { maxOutputTokens: 8, temperature: 0 },
        }),
        cache: 'no-store',
      },
    )

    if (!generationResponse.ok) {
      return NextResponse.json(
        { status: generationResponse.status === 429 ? 'quota_or_rate_limit' : 'generation_request_failed' },
        { status: generationResponse.status === 429 ? 429 : 503 },
      )
    }

    return NextResponse.json({ status: 'authenticated', model })
  } catch {
    return NextResponse.json({ status: 'network_or_provider_failure' }, { status: 503 })
  }
}
