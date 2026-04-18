# Research Summary — Infoman Reviewer

**Synthesized:** 2026-04-18  
**Sources:** STACK.md · FEATURES.md · ARCHITECTURE.md · PITFALLS.md  
**Overall Confidence:** HIGH

---

## Stack (Final Recommendations)

| Layer | Choice | Version | Confidence |
|-------|--------|---------|------------|
| Framework | Next.js (App Router) | 15.x | HIGH |
| Language | TypeScript (strict) | 5.x | HIGH |
| Styling | Tailwind CSS | v4.x | HIGH |
| Diagram / ERD | React Flow (`@xyflow/react`) | 12.x | HIGH |
| File Parsing (PDF + PPTX) | officeparser | 6.1.x | HIGH |
| AI / Flashcard Generation | openai SDK | 6.x | HIGH |
| State + Persistence | Zustand + localStorage | latest | HIGH |
| Deployment | Vercel (free tier) | — | HIGH |
| Runtime | Node.js | 20 LTS | HIGH |

**What NOT to use:** Mermaid.js (render-only, unvalidatable), D3 (imperative, bad React fit), Pages Router (deprecated), Tailwind v3, `dangerouslyAllowBrowser: true` on OpenAI, any auth or database library (out of scope).

---

## Table Stakes Features

### Flashcard Module
- Flip animation (front → back) with CSS 3D transform
- Term on front, definition or ordered enumeration list on back
- Two card types: **Definition** and **Enumeration** — with visual badge per type
- Shuffle / randomize deck order
- "Know it" / "Still learning" split (persisted in localStorage)
- Keyboard navigation (arrow keys + space to flip)
- Progress indicator ("Card 4 of 20") and session completion screen
- Filter deck by card type; restart / reshuffle at any time

### AI Flashcard Generation
- Upload PDF or PPTX → extract text server-side → generate flashcard deck via OpenAI
- Text-paste fallback (primary path for large files that exceed the 4 MB upload limit)
- Review generated cards before saving — inline edit, accept, or reject per card
- AI auto-classifies cards as Definition vs Enumeration
- Loading indicator (generation takes 5–20 s); graceful error handling on failure

### Normalization Simulator
- Display starting unnormalized table (UNF) with sample data rows
- Step-by-step wizard: **UNF → 1NF → 2NF → 3NF**
- Contextual rule card at each step ("1NF: No repeating groups, atomic values only")
- Student enters normalized result via structured TableBuilder (not free-text SQL)
- Validate answer: column-set comparison, PK check, FD violation check; partial feedback
- Show correct answer on failure + explanation; hint panel (progressive disclosure)
- Allow revising previous step; persist step progress to localStorage

### ERD Simulator (Crow's Foot only)
- Create entity boxes (name + attribute list with PK / FK / attribute role badges)
- Draw relationships between entities with Crow's Foot cardinality markers at both ends
- Cardinality options: one-mandatory, one-optional, many-mandatory, many-optional
- Label relationships; pan and zoom canvas (React Flow built-in)
- Select, move, delete entities and relationships; undo / redo
- Inline Crow's Foot notation legend (always visible)
- Exercise mode: build diagram against scenario → validate → diff view vs reference answer
- Free-draw mode: blank canvas saveable to localStorage

### Progress Tracking
- Known / still-learning split per flashcard deck (persisted cross-session)
- Overall completion percentage per module
- Session summary screen; reset progress per module

---

## Architecture at a Glance

```
app/
├── layout.tsx                  ← Global nav, StorageHydration fence
├── page.tsx                    ← Home: three module cards with progress rings
├── api/
│   ├── parse/route.ts          ← SERVER ONLY: FormData → officeparser → { text }
│   └── flashcards/route.ts     ← SERVER ONLY: { text } → OpenAI → { flashcards[] }
├── flashcards/
│   ├── page.tsx                ← Deck list + "Generate new" CTA
│   ├── generate/page.tsx       ← Upload / paste → parse → AI → review → save
│   └── [deckId]/page.tsx       ← Active study session
├── normalization/
│   ├── page.tsx                ← Exercise list with step completion badges
│   └── [exerciseId]/page.tsx   ← UNF → 3NF wizard
└── erd/
    ├── page.tsx                ← Mode selector (Free Draw / Exercises)
    ├── draw/page.tsx           ← Free canvas
    └── [exerciseId]/page.tsx   ← Exercise mode with validation
```

**Data flow summary:**

1. **File → Flashcards:** `FileUploadZone` (client, ≤4 MB guard) → `POST /api/parse` (officeparser) → `POST /api/flashcards` (OpenAI JSON mode) → `FlashcardReview` (user edits/accepts) → Zustand persist → localStorage `infoman:flashcards`

2. **Normalization:** Static `EXERCISES` constant (TS file) → `NormalizationWizard` state machine → `TableBuilder` input → `validateStep()` (set-based comparison) → Zustand persist → localStorage `infoman:normalization`

3. **ERD:** React Flow canvas (`ERDCanvas` + custom `EntityNode` + `CrowsFootEdge`) → Zustand `useERDStore` (zundo undo/redo) → localStorage `infoman:erd` → `compareERD()` on validate → `ValidationDiff`

4. **All stores:** Zustand `persist` middleware with `skipHydration: true` + manual `rehydrate()` in `useEffect` to prevent SSR mismatch. `StorageHydration` wrapper gates renders until `mounted === true`.

**Key data models locked in:** `Flashcard` (id, type, term, definition, items[], sourceExcerpt), `FlashcardDeck`, `NormalizationExercise` (sourceTable, functionalDependencies, steps[]), `ERDExercise` (scenario, seedEntities, referenceAnswer), `ERDDiagram` (React Flow nodes/edges).

---

## Critical Decisions Made

1. **React Flow v12 for all ERD work** — Custom `edgeTypes` with SVG `<marker>` defs is the only viable approach for interactive, validatable Crow's Foot diagrams. `nodeTypes`/`edgeTypes` must be defined at **module scope** (not inside component render) to avoid infinite re-renders.

2. **officeparser v6.1 handles both PDF and PPTX** — Single library, AST output, ESM, Vercel-compatible. `pdfjs-dist` direct, `pdf-parse`, and `pptx2json` are all inferior or abandoned alternatives.

3. **OpenAI API key stays server-side via Next.js Route Handlers** — Variable name must be `OPENAI_API_KEY` (no `NEXT_PUBLIC_` prefix). `response_format: { type: 'json_object' }` with a flat, fully-required schema for reliable structured output.

4. **localStorage is the only persistence layer** — No auth, no database, no accounts. Zustand `persist` middleware with `skipHydration: true` is mandatory to prevent SSR hydration errors.

5. **Vercel 4.5 MB request body limit is a hard constraint** — The primary mitigation is text-paste as a first-class input path. File upload enforces a client-side 4 MB guard with a clear error message. Large PPTX → extract text client-side with pdf.js if needed.

6. **Normalization answers validated with set-based logic, not string equality** — Column names normalised (trim, lowercase, separator-agnostic), attribute arrays compared as sets, multiple valid reference answers supported per exercise.

7. **`StorageHydration` component wraps all pages reading localStorage state** — Renders children only after `mounted === true` (post `useEffect`), preventing React's SSR/CSR mismatch on every progress-aware page.

8. **`ReactFlowProvider` must wrap the entire ERD client component tree** — ERD pages must be `'use client'`; React Flow hooks cannot be called outside `<ReactFlow>` or `<ReactFlowProvider>`.

9. **`@xyflow/react/dist/style.css` imported before Tailwind** — Prevents Tailwind's CSS reset from hiding all edges (one of the most-filed React Flow issues).

10. **gpt-4o-mini for cost efficiency** — Private classroom scale; Structured Outputs schema must have all fields `required`, `additionalProperties: false`, no discriminated unions at root.

---

## Top Pitfalls to Avoid

| # | Pitfall | Severity | Prevention |
|---|---------|----------|------------|
| 1 | **Zustand + localStorage SSR hydration mismatch** | HIGH | `skipHydration: true` + manual `rehydrate()` in `useEffect`; `StorageHydration` mount guard on all persisted pages |
| 2 | **Vercel 4.5 MB body limit blocks file uploads** | HIGH | Client-side ≤4 MB guard; text-paste as primary path; if needed, extract text in browser before sending |
| 3 | **OpenAI key leaked via `NEXT_PUBLIC_` prefix** | HIGH (security) | Use `OPENAI_API_KEY` only; read exclusively in `app/api/**`; add `server-only` import; grep check pre-commit |
| 4 | **React Flow edges invisible due to Tailwind CSS conflict** | HIGH | Import `@xyflow/react/dist/style.css` before Tailwind; test edge visibility immediately after scaffolding |
| 5 | **`nodeTypes`/`edgeTypes` defined inside render → infinite re-renders** | MEDIUM | Define both objects at module scope (outside component function); never inside `useState` or `useMemo` unless truly dynamic |

**Honourable mentions:** `ReactFlowProvider` missing from App Router tree (crashes ERD on load); normalization validator false negatives on semantically equivalent answers (use set comparison, not string equality); localStorage `QuotaExceededError` silently losing ERD state (wrap all `setItem` in `try/catch`).

---

## Build Order

Recommended phase sequence based on feature dependencies, risk surface, and incremental deliverability:

| Phase | Focus | Rationale |
|-------|-------|-----------|
| **1** | Project scaffold: Next.js 15 + Tailwind v4 + route tree + Zustand stores + `StorageHydration` | Unblocks all other phases; hydration fix must be in place before any localStorage work |
| **2** | Flashcard module (UI only: flip, keyboard nav, known/unknown, progress) | Highest student value; no external dependencies; validates component patterns |
| **3** | AI flashcard generation (parse API route + OpenAI route + review UI) | Adds the file upload path and AI integration; builds on Phase 2's deck format |
| **4** | Normalization simulator (exercises data + wizard + TableBuilder + validation) | Self-contained; custom state machine; no React Flow risk; validates complex form UX |
| **5** | ERD drawing tool — free draw (React Flow + Crow's Foot custom types + toolbar) | Most complex phase; isolate React Flow risk early; no validation logic yet |
| **6** | ERD exercise mode (exercise data + `compareERD` validator + `ValidationDiff`) | Builds on Phase 5's canvas; adds the structured exercise + scoring layer |
| **7** | Home page + progress rings + polish + Vercel deploy + smoke tests | Final integration, deployment verification, and UAT pass |

**Research flags:** Phase 5 (Crow's Foot SVG marker implementation) warrants a spike before full planning — the `markerEnd` + `<defs>` injection pattern in React Flow v12 should be prototyped early. Phase 3 (officeparser Vercel bundle size) should be verified with `next build --profile` before commit.
