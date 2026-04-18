# Roadmap — Infoman Reviewer

**Milestone:** 1.0
**Granularity:** Coarse
**Total Phases:** 4

---

## Phase 1: Foundation + Flashcard Study

**Goal:** Students can study a pre-seeded flashcard deck with full interaction, and the app's Zustand/localStorage persistence foundation is in place for all future phases.
**UI hint:** yes

### Plans
1. App shell + Zustand foundation — Next.js 15 app shell, global layout with nav, StorageHydration fence (skipHydration pattern), Zustand stores with persist middleware, Tailwind v4 setup, home page with three module cards
2. Flashcard study UI — flip animation, Definition/Enumeration card types, shuffle, keyboard navigation, progress indicator, "Know it"/"Still learning" marking, filter by type, session completion screen, reset progress, localStorage persistence via Zustand

### Requirements Covered
FLASH-01, FLASH-02, FLASH-03, FLASH-04, FLASH-05, FLASH-06, FLASH-07, FLASH-08, FLASH-09, FLASH-10, FLASH-11, FLASH-12

### Success Criteria
1. User can view flashcards with a flip animation (term front, definition/list back) and see a visual badge for Definition vs. Enumeration type
2. User can navigate the deck with arrow keys and spacebar, seeing a live progress indicator (e.g., "Card 4 of 20")
3. User can mark cards as "Know it" or "Still learning"; after a full page reload the split is identical to what was saved
4. User can filter the deck to Definitions only or Enumerations only, shuffle, restart, and see a session completion screen
5. User can reset all flashcard progress and return to a blank slate

---

## Phase 2: AI Flashcard Generation

**Goal:** Students can upload their lecture slides (PDF/PPTX) or paste raw text and receive a reviewable AI-generated flashcard deck they can edit and save to their study set.
**UI hint:** yes

### Plans
1. File parsing pipeline — client-side file size guard (≤4.5 MB), `/api/parse` route (officeparser, server-only), `/api/flashcards` route (OpenAI JSON mode, server-only), text-paste fallback path
2. Generation review UI — upload/paste intake page, loading/progress indicator, per-card inline edit, accept/reject per card, batch accept/reject, error state messaging, save accepted cards into Zustand flashcard store

### Requirements Covered
AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, AI-07, AI-08

### Success Criteria
1. User can upload a PDF or PPTX file and receive a set of AI-generated flashcards automatically classified as Definition or Enumeration
2. User can paste raw text as a fallback and get the same generation experience
3. User can edit any generated card inline, reject individual cards, and batch-accept or batch-reject all cards before they are saved
4. User sees a loading indicator during the 5–20 s generation window and a clear error message if the API call fails

---

## Phase 3: Normalization Simulator

**Goal:** Students can practice database normalization step-by-step (UNF → 1NF → 2NF → 3NF) with built-in validation, hints, and progress that persists across sessions.
**UI hint:** yes

### Plans
1. Normalization wizard UI — exercise list page, UNF table display with violation highlighting, step-by-step wizard shell (UNF → 1NF → 2NF → 3NF), contextual rule card per step, hint panel (progressive disclosure), back-navigation between steps
2. Answer validation engine — TableBuilder structured input, set-based column/PK/FD validation, pass/fail feedback with explanation, correct-answer reveal on failure, multiple pre-built exercise schemas, Zustand persist for step progress

### Requirements Covered
NORM-01, NORM-02, NORM-03, NORM-04, NORM-05, NORM-06, NORM-07, NORM-08, NORM-09, NORM-10, NORM-11, NORM-12

### Success Criteria
1. User can open an exercise, see the unnormalized table with sample data, and read a contextual rule card explaining the current normal form
2. User can input a normalized table at each step and receive pass/fail feedback with an explanation; the correct answer is shown on failure
3. User can request a hint without immediately seeing the answer, and go back to revise a previous step
4. User can select from multiple pre-built exercises; completed step progress is still there after a full page reload

---

## Phase 4: ERD Simulator

**Goal:** Students can freely draw Crow's Foot ERD diagrams and attempt pre-built exercises that validate their diagram against a reference answer, with undo/redo and PNG export.
**UI hint:** yes

### Plans
1. ERD canvas + entity/relationship drawing — React Flow 12 setup with `ReactFlowProvider`, custom `EntityNode` (table name + attributes with PK/FK badges), custom `CrowsFootEdge` (cardinality markers at both ends), relationship labels, pan/zoom, select/move/delete, undo/redo via zundo, Crow's Foot legend always visible, free-draw mode saved to localStorage
2. Exercise mode + validation + export — pre-built exercise schemas, exercise selection page, validate ERD against reference answer, diff view highlighting mismatches, clear/reset canvas, PNG export via `getViewportForBounds` + `toPng`

### Requirements Covered
ERD-01, ERD-02, ERD-03, ERD-04, ERD-05, ERD-06, ERD-07, ERD-08, ERD-09, ERD-10, ERD-11, ERD-12, ERD-13

### Success Criteria
1. User can create entity boxes with attributes (PK/FK/regular badges), draw relationships between them, and assign Crow's Foot cardinality markers (one/many/optional/mandatory) to each relationship end
2. User can pan and zoom, select, move, delete, and undo/redo actions on the canvas; an always-visible Crow's Foot legend is shown
3. User can choose a pre-built ERD exercise, build their diagram, and validate it — seeing a diff view that highlights missing or incorrect entities, relationships, and cardinalities
4. User can export their current diagram as a PNG and clear the canvas to start fresh

---

## Progress Table

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Foundation + Flashcard Study | 0/2 | not-started | — |
| 2 | AI Flashcard Generation | 0/2 | not-started | — |
| 3 | Normalization Simulator | 0/2 | not-started | — |
| 4 | ERD Simulator | 0/2 | not-started | — |
