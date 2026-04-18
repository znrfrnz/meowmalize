---
phase: 05-deck-and-folder-management
status: complete
---

# Phase 05 Context: Deck and Folder Management

## Decisions

### D-01: Built-in Seed Deck
Keep the existing FLASHCARDS seed deck as a **locked default deck** — always visible in the deck browser, cannot be deleted. Labelled something like "Database Concepts (Built-in)".

### D-02: Folder Hierarchy
**2 levels only**: Folder → Decks. No nested sub-folders. Same as Quizlet/Gizmo.

### D-03: Deck Creation
Decks can be created **two ways**:
1. **Manually** — user creates an empty deck (picks folder or no folder), then adds cards one by one
2. **AI generation** — existing /generate flow saves result as a new deck; user picks/creates folder at save time

### D-04: Entry Point
**Keep home page as-is**. Add a **separate `/decks` page** accessible from the top nav (replace the existing "Flashcards" nav link with "Decks"). The /decks page is the folder browser.

## Deferred Ideas
- Nested sub-folders (too complex for now)
- Sharing/exporting decks
- Import from CSV/Anki

## Codebase Context

### Existing data model (to be extended)
- `Flashcard` type: `{ id, type, term, definition, items?, itemCount? }`
- `flashcardStore`: single `generatedCards: Flashcard[]` + `deckName: string` — needs to evolve into multi-deck
- `FLASHCARDS` in `src/data/flashcards.ts` — static seed data, becomes the locked default deck

### New data model needed
```typescript
interface Folder { id: string; name: string; createdAt: string }
interface Deck {
  id: string
  name: string
  folderId: string | null  // null = ungrouped
  cards: Flashcard[]
  createdAt: string
  locked?: boolean          // true for the built-in seed deck
}
```

### Store strategy
New `useDeckStore` (separate from `flashcardStore`) persisted via Zustand persist + `skipHydration: true`. The `flashcardStore` keeps its `progress` tracking (card-id based, still global across all decks — simple and fine for MVP).

### Navigation update
`src/app/layout.tsx` nav: replace `<Link href="/flashcards">Flashcards</Link>` with `<Link href="/decks">Decks</Link>`.

### AI generation integration
`CardReview.handleSave()` currently calls `setGeneratedCards(accepted)` + `router.push('/generated')`. Change to: create a new Deck in `useDeckStore`, prompt user to pick/create a folder (or skip to ungrouped), then navigate to `/decks/[newDeckId]`.
