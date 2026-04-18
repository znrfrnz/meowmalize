import { AzureOpenAI } from 'openai'
import { Flashcard } from '@/types'

const SYSTEM_PROMPT = `You are a flashcard generator for an Information Management course.
Extract key concepts from the provided lecture text and generate flashcards.

Output a JSON object with a "cards" array. Each card must have:
- "type": either "definition" (single concept explained) or "enumeration" (a list of items)
- "term": the concept name or question (concise, under 60 chars)
- "definition": the explanation (for "definition" type)
- "items": array of strings (for "enumeration" type only)
- "itemCount": number of items (for "enumeration" type only, equals items.length)

Rules:
- Generate as many cards as the content warrants — do not limit artificially
- Use "enumeration" only when the content is genuinely a list (steps, rules, types)
- Keep terms and definitions concise and pedagogically useful
- Output ONLY the JSON object, no markdown, no explanation`

function getClient(): AzureOpenAI {
  const endpoint = process.env.AZURE_AI_ENDPOINT
  const key = process.env.AZURE_AI_KEY
  if (!endpoint || !key) {
    throw new Error('AZURE_AI_ENDPOINT and AZURE_AI_KEY environment variables are required')
  }
  return new AzureOpenAI({
    endpoint,
    apiKey: key,
    apiVersion: '2024-02-01',
  })
}

async function callAI(text: string): Promise<Flashcard[]> {
  const client = getClient()
  const model = process.env.AZURE_AI_MODEL ?? 'claude-3-5-sonnet'

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Generate flashcards from this lecture content:\n\n${text}` },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 4096,
  })

  const content = response.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from AI')

  const parsed = JSON.parse(content) as { cards?: unknown[] }
  if (!Array.isArray(parsed.cards)) throw new Error('AI response missing cards array')

  return parsed.cards.map((card: unknown, i: number) => {
    const c = card as Record<string, unknown>
    const base = {
      id: `gen-${Date.now()}-${i}`,
      type: (c.type === 'enumeration' ? 'enumeration' : 'definition') as 'definition' | 'enumeration',
      term: String(c.term ?? '').trim(),
      definition: String(c.definition ?? '').trim(),
    }
    if (base.type === 'enumeration' && Array.isArray(c.items)) {
      return { ...base, items: (c.items as unknown[]).map(String), itemCount: (c.items as unknown[]).length }
    }
    return base
  }).filter((c) => c.term && c.definition)
}

export async function generateFlashcards(
  text: string
): Promise<{ cards: Flashcard[] } | { error: string; retried: boolean }> {
  try {
    const cards = await callAI(text)
    return { cards }
  } catch (firstErr) {
    console.error('[azureAI] first attempt failed:', firstErr)
    try {
      const cards = await callAI(text)
      return { cards }
    } catch (secondErr) {
      console.error('[azureAI] retry failed:', secondErr)
      return {
        error: 'AI generation failed. Please try again.',
        retried: true,
      }
    }
  }
}
