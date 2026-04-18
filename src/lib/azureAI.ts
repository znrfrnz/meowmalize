import { AzureOpenAI, OpenAI } from 'openai'
import { Flashcard } from '@/types'

const SYSTEM_PROMPT = `Flashcard generator for Information Management. Input: lecture slides/PDF text (may be fragmented). Output: JSON {"cards":[...]}.

Card schema:
- type: "definition" | "enumeration"
- term: concept name (<60 chars)
- definition: exam-ready explanation (definition type only)
- items: string[] (enumeration type only)
- itemCount: items.length (enumeration type only)

Type rules:
- ENUMERATION if answer is a list of 3+ items: advantages, disadvantages, types, steps, properties, components, phases, features, characteristics, categories.
- DEFINITION if answer is a paragraph explaining what/how/why.
- Never collapse a list into prose like "X include A, B, C." — use enumeration.
- COMBO: if list items are themselves concepts, make 1 enumeration + N definition cards.

Examples:
{"type":"enumeration","term":"Disadvantages of Traditional File Processing","items":["Data redundancy","Limited data sharing","Program-data dependence","Excessive program maintenance","Lengthy development times"],"itemCount":5}
{"type":"enumeration","term":"ACID Properties","items":["Atomicity","Consistency","Isolation","Durability"],"itemCount":4}
{"type":"definition","term":"Atomicity","definition":"A transaction is treated as a single indivisible unit — either all operations complete successfully, or none are applied."}
{"type":"definition","term":"DBMS","definition":"Software that manages creation, maintenance, and use of databases, providing an interface between data and applications."}

Rules:
1. Go deep: expand every named concept into its own card. "Flat files → Hierarchical → Relational" = enumeration + definition per model.
2. Expand fragments: write full definitions even from bullet points.
3. 15-40 cards per lecture. Skip noise (page numbers, names, dates(not timeline dates)).
4. Output ONLY the JSON object.`
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
    max_tokens: 8192,
  })

  const content = response.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from AI')

  const parsed = JSON.parse(content) as { cards?: unknown[] }
  if (!Array.isArray(parsed.cards)) throw new Error('AI response missing cards array')

  return parsed.cards.map((card: unknown, i: number) => {
    const c = card as Record<string, unknown>
    const type = (c.type === 'enumeration' ? 'enumeration' : 'definition') as 'definition' | 'enumeration'
    const base = {
      id: `gen-${Date.now()}-${i}`,
      type,
      term: String(c.term ?? '').trim(),
      definition: String(c.definition ?? '').trim(),
    }
    if (type === 'enumeration' && Array.isArray(c.items)) {
      return { ...base, items: (c.items as unknown[]).map(String), itemCount: (c.items as unknown[]).length }
    }
    return base
  }).filter((c) => c.term && (c.definition || (c.type === 'enumeration' && 'items' in c)))
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
