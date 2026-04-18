---
status: complete
phase: 05-deck-and-folder-management
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md]
started: "2026-04-18T00:00:00.000Z"
updated: "2026-04-18T00:00:00.000Z"
---

## Current Test

[testing complete]

## Tests

### 1. Nav shows Decks link
expected: The top navigation bar shows a "Decks" link (not "Flashcards"). Clicking it navigates to /decks.
result: pass

### 2. /decks page loads with Built-in section
expected: Opening /decks shows a page titled "My Decks". A "Built-in" section at the bottom contains the "Database Concepts" deck with a lock icon and no delete button.
result: pass

### 3. Create a folder
expected: Clicking "+ New Folder" shows an inline text input. Typing a name and pressing Enter (or clicking ✓) creates the folder and it appears as a section in the list.
result: pass

### 4. Create a deck inside a folder
expected: Inside a folder section, clicking the "+" button shows an inline input. Entering a deck name and pressing Enter creates an empty deck that appears as a card inside that folder. The card shows the deck name and "0 cards".
result: pass

### 5. Delete a deck
expected: A non-locked deck shows a trash icon. Clicking it triggers a confirm dialog. Confirming removes the deck from the list.
result: pass

### 6. Delete a folder (decks move to ungrouped)
expected: A folder's trash icon triggers a confirm dialog. After confirming, the folder disappears and any decks it contained appear in the "Ungrouped" section.
result: pass

### 7. Navigate to deck study page
expected: Clicking a deck name (or its card) navigates to /decks/[deckId]. The study session for that deck loads. A "← Back to Decks" link is visible above it.
result: pass

### 8. Built-in deck is playable
expected: Clicking "Database Concepts" in the Built-in section navigates to its study page and renders the full set of seed flashcards in the study session.
result: pass

### 9. AI generation saves to a deck in deckStore
expected: After generating cards via the AI flow and reaching the CardReview screen, there is a "Deck name" input and a "Save to folder" dropdown (with Ungrouped, any created folders, and "+ New folder…"). Clicking Save creates a new deck and navigates to its study page at /decks/[id].
result: pass

### 10. GeneratedDeckCard on home page links to /decks
expected: After saving a generated deck, the home page shows a "GeneratedDeckCard" widget. "Study Deck" links to /decks/[id] and "All Decks" links to /decks — neither links to the old /generated route.
result: pass

### 11. /generated redirects to /decks
expected: Navigating directly to /generated in the browser redirects to /decks (no 404, no blank page).
result: pass

## Summary

total: 11
passed: 11
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]












