---
status: diagnosed
phase: 02-ai-flashcard-generation
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md]
started: 2026-04-18T00:00:00Z
updated: 2026-04-18T00:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Upload Slides Button on Home Page
expected: Visit the home page (/). The Flashcard Deck module card should show two buttons  "Start Studying" (primary) and "Upload Slides" (secondary). Other module cards should NOT show an "Upload Slides" button.
result: pass

### 2. Navigate to /generate Page
expected: Clicking "Upload Slides" on the home page navigates to /generate. The page shows a file upload area (accepting .pdf/.pptx/.ppt) and a toggle or tab to switch to text paste mode. No cards are visible yet.
result: pass

### 3. File Size Validation
expected: On the /generate page, attempt to upload a file larger than 4.5 MB. Before any API call is made, an error message should appear inline telling the user the file is too large. The upload is not submitted.
result: pass

### 4. Text Paste -> Generate Flow
expected: Switch to the text paste mode on /generate. Paste or type at least a paragraph of text (10+ chars) and submit. The UI shows a two-stage loading sequence: first a "parsing" status, then a "generating" status (with spinner). After completion, the card review panel appears showing generated flashcards.
result: pass

### 5. Inline Card Editing
expected: In the CardReview panel, click the edit control on any card. The term and definition fields become editable inline inputs. Edit both, click Save  the card updates and returns to display mode with the new text.
result: pass

### 6. Accept / Reject Per Card + Batch Controls
expected: Each card has an Accept (green checkmark) and Reject (grey X) toggle. The header shows "N of M accepted". Clicking "Accept All" marks all cards accepted; "Reject All" marks all rejected. The Save button is disabled when 0 cards are accepted.
result: pass

### 7. Save and Navigate to Flashcards
expected: With at least one card accepted, click Save. The accepted cards are persisted in the Zustand store and the app navigates to /flashcards. The flashcards page shows the saved generated cards ready to study.
result: issue
reported: "Cards do not appear on /flashcards after saving. Also, only 7 cards were generated from ~14 distinct concepts in the pasted text."
severity: major

## Summary

total: 7
passed: 6
issues: 1
skipped: 0
blocked: 0
pending: 0

## Gaps

- truth: "Accepted cards are saved to Zustand store and visible on /flashcards after navigating away from /generate"
  status: failed
  reason: "User reported: cards do not appear on /flashcards after saving"
  severity: major
  test: 7
  artifacts:
    - src/app/flashcards/page.tsx
  missing:
    - "/flashcards page reads generatedCards from Zustand store when present, falling back to static FLASHCARDS data when store is empty"
  root_cause: "src/app/flashcards/page.tsx is hardcoded to use static FLASHCARDS data. It never reads generatedCards from the Zustand store. CardReview.handleSave() correctly calls setGeneratedCards() but the /flashcards page ignores it entirely."

- truth: "AI generates one flashcard per distinct concept  ~14 concepts in input should yield ~14 cards"
  status: failed
  reason: "User reported: only 7 cards generated from ~14 distinct concepts in pasted text"
  severity: major
  test: 7
  artifacts:
    - src/lib/azureAI.ts
  missing:
    - "System prompt should instruct AI to prefer definition cards and use enumeration sparingly  only for content that is genuinely a numbered/bulleted list, not for every sentence containing 'include'"
  root_cause: "System prompt instructs the AI to use enumeration type for any list-like content. The AI aggressively collapses multiple concepts (e.g. 'Advantages of database approach include X, Y, Z') into a single enumeration card instead of generating individual definition cards per concept. Result: 14 concepts collapse to ~7 cards."
