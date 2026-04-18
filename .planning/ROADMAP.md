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
**Plans:** 2 plans

Plans:
- [x] 03-01-PLAN.md -- Data layer + components (TableBuilder, FDInput, WizardTabs, RuleCard) + exercise list page + wizard shell
- [x] 03-02-PLAN.md -- Validation engine + UnfTable violation highlighting + FeedbackPanel + HintPanel + full wiring + persistence

---

## Phase 4: ERD Simulator

**Goal:** Students can build Entity-Relationship Diagrams (ERDs) with Crow's Foot notation on an interactive canvas, complete pre-built exercises, validate their diagrams against reference answers, and export their work as PNG.
**UI hint:** yes

### Plans
1 plan(s)  TBD after /gsd-discuss-phase 4

### Requirements Covered
ERD-01, ERD-02, ERD-03, ERD-04, ERD-05, ERD-06, ERD-07, ERD-08, ERD-09, ERD-10, ERD-11, ERD-12, ERD-13

### Success Criteria
1. User can create entity boxes with a table name and attribute list, and assign PK/FK/regular markers to each attribute
2. User can draw relationships between entities with Crow's Foot cardinality markers and a relationship label
3. User can pan, zoom, select, move, delete entities and relationships, and use undo/redo (Ctrl+Z/Ctrl+Y)
4. User can attempt pre-built ERD exercises and validate their diagram against a reference answer with a diff view highlighting mismatches
5. User can export their ERD as a PNG and clear/reset the canvas
6. An always-visible Crow's Foot notation legend is displayed on the canvas

---
