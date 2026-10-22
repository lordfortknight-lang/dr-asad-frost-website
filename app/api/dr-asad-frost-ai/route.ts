import { google } from '@ai-sdk/google'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'

export const maxDuration = 30

type Mode = 'dental' | 'markets' | 'mentor'

const modeGuidance: Record<Mode, string> = {
  dental: `You provide educational oral-health guidance, not diagnosis or treatment. Never claim to examine anyone or review an X-ray unless supplied in this conversation. Do not prescribe medicines or dosages. For difficulty breathing or swallowing, rapidly spreading facial or neck swelling, uncontrolled bleeding, or severe systemic symptoms, direct the person to emergency care immediately. Encourage in-person dental assessment when appropriate.`,
  markets: `You provide financial education, not regulated personalized financial advice. Never fabricate live prices, earnings, news, or market data. State when current data is unavailable. Explain assumptions, uncertainty, downside risk, and distinguish investing from trading and speculation. Never promise returns or execute trades.`,
  mentor: `You provide calm, direct mentorship. Ask a clarifying question when context is missing, challenge weak reasoning respectfully, and offer practical steps without pretending to know the user's future or personal circumstances.`,
}

function isMode(value: unknown): value is Mode {
  return value === 'dental' || value === 'markets' || value === 'mentor'
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { mode?: unknown; messages?: UIMessage[] }
    const mode = isMode(body.mode) ? body.mode : null
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : []

    if (!mode || messages.length === 0) {
      return Response.json({ error: 'A valid mode and conversation are required.' }, { status: 400 })
    }

    const modelMessages = await convertToModelMessages(messages)
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `You are Dr Asad Frost AI, an intelligent companion with three clearly separated modes. Be concise but thoughtful, transparent about uncertainty, and never invent credentials, sources, personal experiences, or current data. Do not store or request unnecessary personal information. Current mode: ${mode}. ${modeGuidance[mode]}`,
      messages: modelMessages,
      maxOutputTokens: 900,
      abortSignal: request.signal,
      onError: ({ error }) => {
        const providerError = error as { statusCode?: number; status?: number; name?: string }
        const status = providerError.statusCode ?? providerError.status
        const category = status === 401 || status === 403 ? 'authentication_or_access' : status === 429 ? 'quota_or_rate_limit' : status && status >= 500 ? 'provider_unavailable' : 'provider_request_failed'
        console.error('[ai] Gemini provider failure', { category, status: typeof status === 'number' ? status : 'unknown', name: providerError.name ?? 'unknown' })
        return 'The AI provider returned an error. Please try again.'
      },
    })

    return result.toUIMessageStreamResponse()
  } catch {
    return Response.json({ error: 'The AI companion is temporarily unavailable. Please try again.' }, { status: 503 })
  }
}
