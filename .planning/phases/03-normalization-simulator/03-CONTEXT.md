# Phase 3: Normalization Simulator — Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a step-by-step normalization wizard where students practice converting an unnormalized table (UNF) through 1NF, 2NF, and 3NF. Students pick a pre-built exercise, work through each normalization step by entering their answer in a structured table builder, and receive pass/fail feedback with explanations. Progress persists via localStorage.

</domain>

<decisions>
## Implementation Decisions

### D-01: Answer Input — Structured Table Builder
Use a visual grid/table UI where students add/remove column name inputs, mark which column(s) are the PK, and define functional dependencies. This is the core answer component used at every step. It must support:
- Add/remove column name text inputs (dynamic list)
- PK checkbox or toggle per column
- FD input fields (see D-02)

### D-02: Functional Dependency Inputs at Every Step
Explicit `[left side columns] → [right side columns]` FD input fields appear at every wizard step (not just 2NF/3NF). Student specifies FDs alongside their table definition. Validation engine uses these FDs to check for partial dependencies (2NF) and transitive dependencies (3NF). FD inputs at UNF/1NF steps are still required but expected to reflect the unnormalized/partially-normalized state.

### D-03: Exercise List Page + Per-Exercise Wizard Route
- `/normalization` — landing page showing all pre-built exercises as cards (exercise name + schema preview)
- `/normalization/[exerciseId]` — the wizard for a specific exercise
- No difficulty/topic tags needed — keep cards simple

### D-04: Wizard Navigation — Horizontal Step Tabs
Horizontal tab bar at the top showing all 4 steps: UNF, 1NF, 2NF, 3NF. Completed steps show a checkmark. Students can click back to any previously completed step (NORM-08). Forward navigation only unlocks after passing the current step.

### D-05: Hints — Sequential Click-to-Reveal
Each step has a fixed set of hints. A "Show hint" button reveals one hint at a time in sequence. A counter displays "Hint N/M" so students know how many are available. No accordion, no bulk reveal — one click per hint.

### Claude's Discretion
- Exact number of pre-built exercises and their schemas (aim for 3–5 covering partial dependency, transitive dependency, and mixed violations)
- Exact column names / sample data rows in the UNF table display
- Specific hint text content per step per exercise
- Rule card copy per normal form step
- Component decomposition within the wizard (e.g., how TableBuilder, FDInput, RuleCard, HintPanel are split)
- Correct-answer reveal format after a failed submission
- Violation highlighting style on the UNF table (e.g., red cell border, strikethrough, badge)
- Zustand store shape for normalization progress persistence

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, target users
- `.planning/REQUIREMENTS.md` — NORM-01 through NORM-12 (requirements this phase covers)
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria

### Existing Foundation (what this phase builds on)
- `src/types/index.ts` — Flashcard, CardType, ProgressStatus, Deck types — reuse or extend
- `src/app/globals.css` — Design tokens: `--color-accent: #6366f1`, `--color-surface: #1a1a1a`, `--color-border: #27272a`, `--color-success: #22c55e`, `--color-destructive: #ef4444`
- `src/app/page.tsx` — Home page: Normalization Simulator card already present with `href: '/normalization'` and `enabled: false` — must be set to `enabled: true`
- `src/stores/flashcardStore.ts` — Reference for Zustand persist + skipHydration pattern
- `src/components/StorageHydration.tsx` — SSR hydration fence pattern to replicate for normalization store
- `package.json` — Check before adding any new deps

### Phase Summaries (patterns to reuse)
- `.planning/phases/01-foundation-flashcard-study/01-01-SUMMARY.md` — App shell, Zustand pattern, Tailwind v4 setup
- `.planning/phases/01-foundation-flashcard-study/01-02-SUMMARY.md` — StudySession component patterns
- `.planning/phases/02-ai-flashcard-generation/02-CONTEXT.md` — Design system decisions already locked

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/stores/flashcardStore.ts` — Zustand persist with `skipHydration: true` — copy this exact pattern for `normalizationStore.ts`
- `src/components/StorageHydration.tsx` — SSR hydration fence — normalization store needs the same treatment
- `src/app/globals.css` — All color tokens already defined; no new CSS variables needed
- `src/app/page.tsx` — Module card for Normalization already exists with `enabled: false`; flip it to `true` and confirm `href: '/normalization'`

### Established Patterns
- Zustand stores live in `src/stores/`, persist middleware with `skipHydration: true`, `name` key in localStorage
- Pages live in `src/app/[route]/page.tsx` (App Router)
- No external UI component library — Tailwind utility classes only
- Dark theme everywhere: `bg-[#1a1a1a]`, `border-[#27272a]`, accent `#6366f1`

### Integration Points
- `src/app/page.tsx` — Set `enabled: true` on the Normalization Simulator module card
- New routes: `src/app/normalization/page.tsx` (exercise list) + `src/app/normalization/[exerciseId]/page.tsx` (wizard)
- New store: `src/stores/normalizationStore.ts` (step progress, current answers, completed exercises)
- New types: extend `src/types/index.ts` with normalization-specific types (Exercise, NormStep, TableAnswer, FDPair)

</code_context>

<specifics>
## Specific Ideas

- Table builder answer component: a list of rows where each row = one column input + PK checkbox. "Add column" button appends a new row. Trash icon removes it.
- FD inputs: pairs of multi-select (or comma-separated text) — left side columns → right side columns. "Add FD" button appends another pair.
- UNF table display: render the original unnormalized table as a read-only HTML table with sample data rows. Cells that violate the current normal form are highlighted (e.g., red border or background tint).
- Rule card: a fixed info card at the top/side of each step showing the definition of the current normal form and what to look for. Non-interactive.
- Correct answer reveal: shown below the user's failed answer after submission, formatted as a read-only version of the table builder (columns + PK + FDs).
- Step tabs: `UNF | 1NF | 2NF | 3NF` — UNF tab is always "completed" (it's the given, not solved), 1NF–3NF unlock progressively.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-normalization-simulator*
*Context gathered: 2026-04-18*
