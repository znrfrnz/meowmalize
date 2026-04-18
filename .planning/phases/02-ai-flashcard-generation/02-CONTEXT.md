# Phase 2: AI Flashcard Generation — Context

**Gathered:** 2026-04-18
**Status:** Ready for planning
**Source:** Discussion with user

<domain>
## Phase Boundary

Build the AI-powered flashcard generation pipeline. Students upload a PDF/PPTX file or paste raw text, the server parses it and calls an AI model to extract flashcards, and the user reviews/edits the generated cards before saving them as a standalone study session. The existing Phase 1 deck is never touched.

</domain>

<decisions>
## Decisions

### D-01: AI Provider — Azure AI Foundry, claude-3-5-sonnet
Use `@azure/ai-inference` SDK (or `openai` SDK with Azure base URL override) pointed at an Azure AI Foundry deployment of `claude-3-5-sonnet`. Do NOT use the Anthropic SDK directly or hardcode an OpenAI endpoint. Auth via `AZURE_AI_KEY` + `AZURE_AI_ENDPOINT` env vars (server-side only, never exposed to client).

Rationale: Flashcard generation is structured extraction — 3.5 Sonnet is accurate enough and significantly cheaper than 3.7 Sonnet.

### D-02: Generated cards are a standalone study session
Generated cards DO NOT merge into the Phase 1 hard-coded deck. They are stored separately in a `generatedCards` field in the Zustand store (or a separate localStorage key). The existing `FLASHCARDS` array from `src/data/flashcards.ts` is never modified.

### D-03: No card count limit
Generate as many flashcards as the AI can find from the source material. No artificial cap.

### D-04: Retry-once error handling
If the AI API call fails, silently retry once. If the retry also fails, show a clear error message with a manual "Try again" button. Never show raw error objects to the user.

### D-05: 4.5 MB file size limit, client-side guard
Block files > 4.5 MB client-side before upload with a friendly message: "File too large — try a smaller file or paste the text instead." Also add a server-side guard (400 response) as a safety net. 4.5 MB is Vercel free tier's serverless function body limit.

### D-06: Upload entry point — augment home page Flashcard Deck card
The home page Flashcard Deck card (from Phase 1) gets a second CTA button: "Upload Slides" alongside the existing "Start Studying". Clicking "Upload Slides" navigates to `/generate`. Do NOT remove or modify the "Start Studying" button.

### D-07: /generate page for upload + review flow
A dedicated `/generate` page hosts the full intake → loading → review flow. Route: `src/app/generate/page.tsx`. No modal or inline panel — a full page.

### Claude's Discretion
- Exact prompt engineering for JSON mode (structure of system/user messages)
- Whether to use streaming or non-streaming for the AI call
- Internal component decomposition within the /generate page
- Exact Tailwind styling within the design system tokens from Phase 1
- Whether to use a single combined API route or two separate routes (/api/parse + /api/flashcards)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, target users
- `.planning/REQUIREMENTS.md` — AI-01 through AI-08 (requirements this phase covers)
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria

### Phase 1 Foundation (what this phase builds on)
- `src/stores/flashcardStore.ts` — Zustand store to extend with generatedCards state
- `src/types/index.ts` — Flashcard, CardType, ProgressStatus types to reuse
- `src/app/page.tsx` — Home page to augment with "Upload Slides" button (D-06)
- `src/app/globals.css` — Design tokens (colors, spacing, flip utilities)

### Stack Constraints
- `.planning/phases/01-foundation-flashcard-study/01-01-SUMMARY.md` — Confirms Next.js 16, Tailwind v4, Zustand already installed
- `package.json` — Check before adding new deps

</canonical_refs>

<specifics>
## Specific Ideas

- File parsing: `officeparser` library (handles PDF + PPTX, single dependency, ESM-compatible)
- Azure SDK: `@azure/ai-inference` (official Microsoft SDK for Azure AI Foundry)
- JSON mode: Claude on Azure supports structured output via `response_format: { type: "json_object" }`
- The AI prompt should instruct the model to return `{ cards: [{ type, term, definition, items?, itemCount? }] }`
- Per-card inline editing: term and definition/items should be editable text inputs in the review UI
- Accept/Reject per card: each card in review has Accept (green) and Reject (red/grey) toggle
- Batch accept all / batch reject all buttons at the top of the review list
- After accepting, call `useFlashcardStore` to save to `generatedCards` and navigate to `/flashcards?source=generated`

</specifics>

<deferred>
## Deferred Ideas

- Streaming token-by-token card generation (nice UX but complex — use non-streaming for v1)
- Progress bar showing "Card 3 of N generated" during streaming
- Editing enumeration items individually (for v1, edit the whole items list as a textarea)
- Server-side rate limiting per IP (out of scope for private use)
- Saving generated card history (only the most recent generation is kept)

</deferred>

---

*Phase: 02-ai-flashcard-generation*
*Context gathered: 2026-04-18*
