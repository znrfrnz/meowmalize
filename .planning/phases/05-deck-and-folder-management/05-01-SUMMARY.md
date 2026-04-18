# 05-01 Summary: Folder/Deck Types + useDeckStore

## What Was Built

- Added `Folder` and `Deck` interfaces to `src/types/index.ts`
- Created `src/stores/deckStore.ts` — Zustand persisted store with full CRUD

## Key Files

### Created
- `src/stores/deckStore.ts` — useDeckStore + BUILTIN_DECK_ID export

### Modified
- `src/types/index.ts` — Folder, Deck interfaces appended

## Key Decisions

- `BUILTIN_DECK_ID = 'builtin-flashcards'`, locked deck seeded from FLASHCARDS
- Store persists under key `infoman-decks` with `skipHydration: true`
- `deleteFolder` moves decks to ungrouped (folderId=null), never destroys them
- `deleteDeck` is a noop if `deck.locked === true`

## Exports

```typescript
export const BUILTIN_DECK_ID: string
export const useDeckStore: () => DeckState
// DeckState: folders, decks, addFolder, renameFolder, deleteFolder, addDeck, renameDeck, deleteDeck, addCardToDeck, removeCardFromDeck, updateCardInDeck, setDeckCards
```

## Verification

- `npx tsc --noEmit` — zero errors ✓
- Both `BUILTIN_DECK_ID` and `useDeckStore` exported ✓
- Folder/Deck interfaces in types/index.ts ✓
