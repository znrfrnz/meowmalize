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
- [ ] 03-01-PLAN.md -- Data layer + components (TableBuilder, FDInput, WizardTabs, RuleCard) + exercise list page + wizard shell
- [ ] 03-02-PLAN.md -- Validation engine + UnfTable violation highlighting + FeedbackPanel + HintPanel + full wiring + persistence
