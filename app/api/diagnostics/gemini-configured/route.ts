export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({
    configured: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  })
}
