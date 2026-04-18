---
phase: 02-ai-flashcard-generation
plan: 02
subsystem: ui
tags: [nextjs, react, zustand, tailwind, typescript]

requires:
  - phase: 02-01
    provides: /api/parse, /api/flashcards, setGeneratedCards store action, GenerationStatus type

provides:
  - /generate page (src/app/generate/page.tsx) — full intake → review flow
  - GenerateUpload component — file upload + text paste intake with loading states
  - CardReview component — per-card edit/accept/reject + batch controls + save
  - Home page Flashcard Deck card augmented with "Upload Slides" button (D-06)

affects: [flashcard study flow (/flashcards uses generatedCards from store)]

tech-stack:
  added: []
  patterns:
    - Page orchestrates upload/review state with local useState (generatedCards: Flashcard[] | null)
    - File upload: useRef<HTMLInputElement> + client-side 4.5MB guard before fetch
    - Loading stages: GenerationStatus 'parsing' | 'generating' drive spinner + status text
    - CardReview uses local ReviewCard state (accepted, editing, editTerm, editDefinition) per card
    - setGeneratedCards called once on save, then router.push('/flashcards')
    - supportsUpload field on module data controls "Upload Slides" visibility per card

key-files:
  created:
    - src/app/generate/page.tsx
    - src/components/GenerateUpload.tsx
    - src/components/CardReview.tsx
  modified:
    - src/app/page.tsx

key-decisions:
  - "supportsUpload field added to module data (page.tsx) — controls Upload Slides per-module, future-safe"
  - "GeneratePage uses local state (not Zustand) for generated cards until user saves — avoids dirty state"
  - "CardReview persists edits locally before saving — user can edit term/definition before committing"

patterns-established:
  - "File upload guard: check file.size > MAX client-side in onChange, set error before fetch"
  - "Two-step API flow: /api/parse first, then /api/flashcards — each step updates GenerationStatus"
  - "ReviewCard local state pattern: wrap each card with accepted/editing/editTerm/editDefinition"

requirements-completed: [AI-01, AI-02, AI-04, AI-05, AI-06, AI-07, AI-08]

duration: 20min
completed: 2026-04-18
---

# Phase 02-02: Generation UI Summary

**Full AI generation UI complete — /generate page with file upload + text paste, two-stage loading, card review with inline editing and batch controls, and Upload Slides button on home page.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-04-18
- **Tasks:** 2/2
- **Files modified:** 4

## Accomplishments

### /generate page
- Orchestrates intake → review flow via local `useState<Flashcard[] | null>`
- Shows `GenerateUpload` until cards are generated, then switches to `CardReview`
- Back button in `CardReview` resets to upload view

### GenerateUpload component
- File upload mode: drag-to-click upload area, `.pdf/.pptx/.ppt` accept filter
- Client-side 4.5 MB guard with user-friendly error message
- Text paste mode: full textarea with minimum-length validation
- Two-stage loading: "parsing" → "generating" with spinner + status text
- Error banner with AlertCircle icon for API failures
- Disabled submit button during loading

### CardReview component
- Per-card `ReviewCard` state: `accepted`, `editing`, `editTerm`, `editDefinition`
- Click-to-edit: term + definition inline inputs, Save button commits edits to card
- Accept/Reject toggle per card (green checkmark / grey X)
- Accept All / Reject All batch buttons
- "N of M accepted" counter in header
- Save button: calls `setGeneratedCards(accepted)` then `router.push('/flashcards')`
- Save disabled when 0 cards accepted

### Home page
- `supportsUpload: true` field on Flashcard Deck module entry
- "Upload Slides" secondary button visible only for modules with `supportsUpload`
- "Start Studying" button unchanged (D-06 compliance)

## Verification

- `npx tsc --noEmit` → zero errors
- `npm run build` → /generate appears as Static route in build output
- All 6 routes present: /, /generate, /flashcards, /api/parse, /api/flashcards, /_not-found
