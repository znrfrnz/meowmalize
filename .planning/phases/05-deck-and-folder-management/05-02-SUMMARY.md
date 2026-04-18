# 05-02 Summary: /decks Browser + Study Page + Nav Update

## What Was Built

- `/decks` folder browser with folder accordion UI, deck cards, create/delete actions
- `/decks/[deckId]` study page that renders StudySession with the deck's cards
- Nav updated: "Flashcards" link → "Decks" pointing to `/decks`

## Key Files

### Created
- `src/app/decks/page.tsx` — Full folder browser with inline create/delete UI
- `src/app/decks/[deckId]/page.tsx` — Per-deck study page using `use(params)` (Next.js 15)

### Modified
- `src/app/layout.tsx` — Nav link `href="/decks"` text "Decks"

## Features

- Folder sections are collapsible (expanded by default)
- `+ New Folder` inline input at top of page
- `+ New Deck` inline input inside each folder section and ungrouped section
- Delete folder → moves decks to ungrouped (via `deleteFolder`)
- Delete deck → `window.confirm` + `deleteDeck` (locked decks show Lock icon, no delete button)
- Built-in deck section with `border-[#6366f1]/20` visual distinction
- `/decks/[deckId]` shows "Deck not found" with back link for invalid IDs

## Verification

- `npx tsc --noEmit` — zero errors ✓
- All design tokens consistent with existing theme ✓
- Next.js 15 `use(params)` pattern used for dynamic route ✓
