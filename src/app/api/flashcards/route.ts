import { NextRequest, NextResponse } from 'next/server'
import { generateFlashcards } from '@/lib/azureAI'

export const runtime = 'nodejs'
export const maxDuration = 60 // AI can take 5-20s; give headroom

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { text?: string }
    if (!body.text || typeof body.text !== 'string' || body.text.trim().length < 10) {
      return NextResponse.json({ error: 'text field required (min 10 chars)' }, { status: 400 })
    }

    const result = await generateFlashcards(body.text.trim())

    if ('error' in result) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[/api/flashcards] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
