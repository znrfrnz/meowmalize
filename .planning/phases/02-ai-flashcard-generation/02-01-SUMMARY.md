---
phase: 02-ai-flashcard-generation
plan: 01
subsystem: api
tags: [azure-openai, officeparser, zustand, typescript, nextjs]

requires:
  - phase: 01-foundation
    provides: Flashcard types, FlashcardStore base, design system tokens

provides:
  - GeneratedCard interface and GenerationStatus type in src/types/index.ts
  - Zustand store extended with generatedCards, setGeneratedCards, clearGeneratedCards
  - POST /api/parse — extracts text from PDF/PPTX via officeparser or passes JSON text through
  - POST /api/flashcards — calls Azure OpenAI claude-3-5-sonnet with retry-once logic
  - src/lib/azureAI.ts — Azure OpenAI client wrapper with generateFlashcards export

affects: [02-02-generation-ui, flashcardStore consumers]

tech-stack:
  added: [openai (AzureOpenAI class), officeparser]
  patterns:
    - Azure OpenAI via openai SDK with AzureOpenAI class (endpoint + apiKey + apiVersion)
    - officeparser returns OfficeParserAST; text extracted via recursive walk of content nodes
    - generateFlashcards returns union type: { cards } | { error, retried }
    - API routes use runtime='nodejs' and maxDuration for Vercel serverless

key-files:
  created:
    - src/lib/azureAI.ts
    - src/app/api/parse/route.ts
    - src/app/api/flashcards/route.ts
  modified:
    - src/types/index.ts
    - src/stores/flashcardStore.ts
    - package.json

key-decisions:
  - "Used openai SDK with AzureOpenAI class instead of @azure/ai-inference (not on npm)"
  - "officeparser v5+ returns OfficeParserAST not string; extractText() walks content tree"
  - "generatedCards persisted in Zustand (survives page reload between generate → study)"
  - "AZURE_AI_MODEL env var defaults to 'claude-3-5-sonnet' if not set"

patterns-established:
  - "Azure OpenAI: new AzureOpenAI({ endpoint, apiKey, apiVersion: '2024-02-01' })"
  - "officeparser: parseOffice(buffer) → OfficeParserAST → walk content[].text recursively"
  - "Retry pattern: try { return await callAI() } catch { try { return await callAI() } catch { return { error, retried: true } } }"

requirements-completed: [AI-01, AI-02, AI-03, AI-04, AI-08]

duration: 25min
completed: 2026-04-18
---

# Phase 02-01: AI Flashcard Generation Backend Summary

**Azure OpenAI backend pipeline complete — /api/parse + /api/flashcards routes built with officeparser extraction and retry-once error handling.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-04-18
- **Tasks:** 3/3
- **Files modified:** 5

## Accomplishments

### Types Extended
- `GeneratedCard` interface (Flashcard without required `id`) added to `src/types/index.ts`
- `GenerationStatus` union type (`idle | parsing | generating | done | error`) added

### Store Extended
- `generatedCards: Flashcard[]` — persisted in Zustand (survives page reload)
- `setGeneratedCards(cards)` and `clearGeneratedCards()` added
- Existing progress fields and `skipHydration: true` unchanged

### POST /api/parse
- Multipart path: accepts PDF/PPTX file, validates ≤4.5 MB, extracts text via officeparser
- JSON path: accepts `{ text: string }` and passes through (text-paste flow)
- Returns 413 for oversized files, 415 for unsupported formats, 422 if no extractable text

### POST /api/flashcards  
- Accepts `{ text: string }` (min 10 chars)
- Calls `generateFlashcards()` from azureAI.ts
- Returns `{ cards: Flashcard[] }` on success or `{ error, retried }` on failure

### src/lib/azureAI.ts
- Uses `AzureOpenAI` from the `openai` SDK (Azure OpenAI endpoint pattern)
- System prompt instructs JSON mode with definition/enumeration classification
- Retry-once: first failure triggers second attempt; second failure returns structured error
- All auth via `AZURE_AI_KEY` + `AZURE_AI_ENDPOINT` env vars — no hardcoded secrets

## Key Technical Note

officeparser v5+ returns `OfficeParserAST` (not `string`). The `extractText()` function recursively walks `ast.content[].text` to collect text. The plan's code sample assumed `parseOfficeAsync` returning string — adapted to use `parseOffice` with proper AST traversal.

## Verification

- `npx tsc --noEmit` → zero errors
- `npm run build` → successful, both API routes visible as Dynamic routes
- No hardcoded secrets (grep: `AZURE_AI_KEY` only via `process.env`)
- generatedCards in Zustand store persist block
