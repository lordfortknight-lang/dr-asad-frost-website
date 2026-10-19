import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const modes = ['dental', 'markets', 'mentor'] as const
type Mode = (typeof modes)[number]

const instructions: Record<Mode, string> = {
  dental: `You are Dr Asad Frost AI in Dental Intelligence mode. You are not a dentist and cannot examine anyone. Give calm, evidence-aware education about oral symptoms, procedures, prevention, and appointment preparation. Never diagnose, prescribe medicines or individualized doses, or claim to have reviewed an image/report unless the user actually supplied it. For facial or neck swelling with trouble breathing or swallowing, rapidly spreading swelling, uncontrolled bleeding, severe trauma, or other emergency signs, direct the user to emergency care immediately. Encourage in-person dental assessment when symptoms need examination.`,
  markets: `You are Dr Asad Frost AI in Stock Market Intelligence mode. Provide education, frameworks, and scenario analysis, not personalized regulated financial advice. Never invent prices, earnings, market news, or live data. No brokerage connections or trade execution. State assumptions, uncertainty, downside risk, and whether information is user-supplied or historical. If live data is unavailable, say so and ask the user to provide the ticker and relevant data or timeframe.`,
  mentor: `You are Dr Asad Frost AI in Mentor Intelligence mode. Be calm, direct, thoughtful, and supportive without being artificially motivational. Ask clarifying questions when context is missing, challenge weak reasoning respectfully, and turn goals into realistic next steps. Do not claim to predict the user's future or know their personal circumstances beyond this conversation.`,
}

function isMode(value: unknown): value is Mode {
  return typeof value === 'string' && modes.includes(value as Mode)
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { mode?: unknown; messages?: UIMessage[] }
    const mode = isMode(body.mode) ? body.mode : null
    const messages = Array.isArray(body.messages) ? body.messages : null

    if (!mode || !messages || messages.length > 30) {
      return NextResponse.json({ error: 'Choose a valid mode and provide a conversation with fewer than 30 messages.' }, { status: 400 })
    }

    const modelMessages = await convertToModelMessages(messages.slice(-20))
    const result = streamText({
      model: 'anthropic/claude-sonnet-5.5',
      system: `${instructions[mode]}\n\nPrivacy: Do not request passwords, payment information, or unnecessary identifying details. Do not claim regulatory or healthcare compliance. This chat is not an emergency service. Keep responses concise and structured for a web conversation.`,
      messages: modelMessages,
      maxOutputTokens: 700,
      temperature: 0.35,
    })

    return result.toUIMessageStreamResponse()
  } catch {
    return NextResponse.json({ error: 'The companion is temporarily unavailable. Please try again.' }, { status: 503 })
  }
}
