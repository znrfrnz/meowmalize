# 05-03 Summary: AI Generation Wired to deckStore

## What Was Built

- `CardReview.tsx` — swapped `useFlashcardStore` for `useDeckStore`; added deck name input + folder picker UI; `handleSave` creates deck in store and navigates to `/decks/[id]`
- `GeneratedDeckCard.tsx` — now reads most recent non-locked deck from `useDeckStore` instead of `flashcardStore.generatedCards`
- `src/app/generated/page.tsx` — replaced with a `redirect('/decks')` call

## Key Files Modified

- `src/components/CardReview.tsx` — folder picker with select (Ungrouped / existing folders / + New folder…); creates deck via `addDeck`
- `src/components/GeneratedDeckCard.tsx` — "Study Deck" links to `/decks/[id]`, "All Decks" links to `/decks`
- `src/app/generated/page.tsx` — `redirect('/decks')`

## Key Decisions

- Folder picker is a native `<select>` — simple MVP, no dependency needed
- "New folder…" option toggles an inline input to type folder name
- `/generated` redirected (not deleted) to avoid 404s from existing links/bookmarks
- `GeneratedDeckCard` shows most-recently-created non-locked deck

## Verification

- `npx tsc --noEmit` — zero errors ✓
- `CardReview` no longer imports `useFlashcardStore` ✓
- `GeneratedDeckCard` no longer imports `useFlashcardStore` ✓
