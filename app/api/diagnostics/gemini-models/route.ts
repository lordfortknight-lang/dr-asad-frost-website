import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ status: 'missing_key' }, { status: 503 })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      { cache: 'no-store' },
    )

    if (!response.ok) {
      return NextResponse.json({ status: 'model_list_failed', httpStatus: response.status }, { status: 502 })
    }

    const payload = (await response.json()) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>
    }
    const models = (payload.models ?? [])
      .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
      .map((model) => model.name?.replace(/^models\//, ''))
      .filter((name): name is string => Boolean(name))

    return NextResponse.json({ status: 'ok', models })
  } catch {
    return NextResponse.json({ status: 'model_list_failed' }, { status: 502 })
  }
}
