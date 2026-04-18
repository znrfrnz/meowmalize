---
phase: 02-ai-flashcard-generation
plan: 04
subsystem: api
tags: [azure-openai, ai, system-prompt, flashcards]

requires:
  - phase: 02-ai-flashcard-generation/02-01
    provides: azureAI.ts with callAI() and SYSTEM_PROMPT

provides:
  - Updated SYSTEM_PROMPT that generates one flashcard per concept
  - Enumeration type reserved for genuinely list-shaped content only

affects: [ai-generation, flashcard-quality, azureAI]

tech-stack:
  added: []
  patterns: ['definition-first AI prompt design', 'explicit DO NOT COLLAPSE rule for concept lists']

key-files:
  created: []
  modified: [src/lib/azureAI.ts]

key-decisions:
  - "DEFAULT TO DEFINITION rule makes definition the assumed card type"
  - "ENUMERATION IS RARE explicitly disqualifies sentences with 'include', 'consist of', 'are', 'have'"
  - "DO NOT COLLAPSE rule addresses observed failure: 14 concepts → 7 enumeration cards"
  - "QUANTITY rule anchors expected output count to concept count"

patterns-established:
  - "AI prompts should explicitly state what NOT to do, not just what to do"
  - "Enumeration reserved for numbered lists, ordered steps, explicit hierarchies only"

requirements-completed: [AI-01]

duration: 5min
completed: 2026-04-18
---

# Phase 02-04: Fix AI Prompt for One-Card-Per-Concept Generation

**Rewrote SYSTEM_PROMPT with definition-first rules and an explicit DO NOT COLLAPSE directive, preventing 14 distinct concepts from collapsing into ~7 enumeration cards.**

## Performance

- **Duration:** 5 min
- **Completed:** 2026-04-18
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Replaced old `Rules:` section in SYSTEM_PROMPT with 5 explicit numbered rules
- Rule 1 (DEFAULT TO DEFINITION): definition is the assumed type — one concept = one card
- Rule 2 (ENUMERATION IS RARE): enumeration requires clearly numbered list/ordered steps; disqualifies sentences with "include", "consist of", "are", "have"
- Rule 3 (DO NOT COLLAPSE): named concepts must each get their own definition card
- Rule 4 (QUANTITY): output card count should match distinct concept count (~14 concepts = ~14 cards)
- Rule 5: output JSON only

## Verification

- `npx tsc --noEmit` passes with zero errors
- Commit: `feat(02-04): tighten SYSTEM_PROMPT to generate one card per concept, reserve enumeration for list-shaped content`
