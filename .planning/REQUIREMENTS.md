# Requirements — Infoman Reviewer

**Milestone:** 1.0 — Initial Release
**Last updated:** 2026-04-18 after initialization

---

## v1 Requirements

### Flashcards (FLASH)

- [ ] **FLASH-01**: User can view flashcards with flip animation (term on front, definition/answer on back)
- [ ] **FLASH-02**: User can shuffle/randomize card order
- [ ] **FLASH-03**: User can mark a card as "Know it" or "Still learning"
- [ ] **FLASH-04**: User can navigate cards with keyboard (arrow keys, spacebar to flip)
- [ ] **FLASH-05**: User sees a progress indicator showing current card position (e.g., "Card 4 of 20")
- [ ] **FLASH-06**: User sees a session completion screen when all cards are reviewed
- [ ] **FLASH-07**: User can restart or reshuffle the deck
- [ ] **FLASH-08**: Cards have two distinct types: Definition and Enumeration
- [ ] **FLASH-09**: Enumeration cards display an item count hint before the answer is revealed ("List 4 items")
- [ ] **FLASH-10**: User can filter the deck to study only Definitions or only Enumerations
- [ ] **FLASH-11**: Progress (known/still-learning split) persists across sessions via localStorage
- [ ] **FLASH-12**: User can reset flashcard progress

### AI Flashcard Generation (AI)

- [ ] **AI-01**: User can upload a PDF or PPTX file and receive AI-generated flashcards
- [ ] **AI-02**: User can paste raw text and receive AI-generated flashcards
- [ ] **AI-03**: AI automatically classifies generated cards as Definition or Enumeration type
- [ ] **AI-04**: User sees a loading/progress indicator during AI generation
- [ ] **AI-05**: User reviews generated flashcards before adding them to the study deck
- [ ] **AI-06**: User can edit any generated flashcard inline before accepting
- [ ] **AI-07**: User can batch-accept or batch-reject all generated cards
- [ ] **AI-08**: User sees a clear error message if AI generation fails

### Normalization Simulator (NORM)

- [ ] **NORM-01**: User is shown a pre-built unnormalized table (UNF) with sample data rows
- [ ] **NORM-02**: User works through a step-by-step wizard: UNF → 1NF → 2NF → 3NF
- [ ] **NORM-03**: A contextual rule card is shown at each step explaining the current normal form rule
- [ ] **NORM-04**: User can input their normalized table answer at each step
- [ ] **NORM-05**: App validates the user's answer and shows pass/fail with explanation
- [ ] **NORM-06**: App shows the correct answer when the user's answer is wrong
- [ ] **NORM-07**: App highlights which cells in the UNF table violate the current normal form
- [ ] **NORM-08**: User can go back and revise a previous step
- [ ] **NORM-09**: User can type in a free-form normalized answer and have it validated (type-in mode)
- [ ] **NORM-10**: App provides step-level hints on request
- [ ] **NORM-11**: Multiple pre-built exercises available (different schemas)
- [ ] **NORM-12**: Normalization exercise progress persists via localStorage

### ERD Simulator (ERD)

- [ ] **ERD-01**: User can create entity boxes with a table name and list of attributes
- [ ] **ERD-02**: User can draw relationships between entities
- [ ] **ERD-03**: User can assign Crow's Foot cardinality markers to each end of a relationship (one/many/optional/mandatory)
- [ ] **ERD-04**: User can label relationships (e.g., "enrolls in")
- [ ] **ERD-05**: User can pan and zoom the canvas
- [ ] **ERD-06**: User can select, move, and delete entities and relationships
- [ ] **ERD-07**: User can undo and redo actions (Ctrl+Z / Ctrl+Y)
- [ ] **ERD-08**: User can clear the canvas or reset the exercise
- [ ] **ERD-09**: User can mark attributes as PK, FK, or regular attribute
- [ ] **ERD-10**: An always-visible Crow's Foot notation legend is shown on the canvas
- [ ] **ERD-11**: User can attempt pre-built ERD exercises (build a diagram from a description)
- [ ] **ERD-12**: User can validate their ERD against a reference answer with a diff view showing mismatches
- [ ] **ERD-13**: User can export their ERD diagram as a PNG

---

## v2 Requirements (Deferred)

- Spaced repetition algorithm (SM-2/FSRS) for flashcards — overkill for a semester reviewer
- Show source excerpt that generated each flashcard — adds complexity; defer post-v1
- Streaming AI generation output — complicates review UX
- Quiz/multiple choice mode generated from slides — out of scope for v1
- Learning analytics dashboard — simple percentage is sufficient for v1

---

## Out of Scope

- **User accounts / authentication** — No login required; localStorage is sufficient for solo study use
- **4NF, 5NF, BCNF normalization** — Explicitly scoped to UNF→3NF only per project brief
- **Alternative ERD notations (Chen, UML, IE)** — Crow's Foot only per project brief
- **SQL DDL generation from ERD** — Outside IM exam scope
- **Real-time collaboration** — Single-user study tool
- **Per-user API key management** — Owner's key is hardcoded server-side
- **Drag-and-drop normalization** — Text-based table input matches exam format better
- **Rich media flashcards (images, audio)** — IM content is text-based

---

## Traceability

| Requirement Group | Phase |
|-------------------|-------|
| FLASH-01–12 | TBD by roadmapper |
| AI-01–08 | TBD by roadmapper |
| NORM-01–12 | TBD by roadmapper |
| ERD-01–13 | TBD by roadmapper |
