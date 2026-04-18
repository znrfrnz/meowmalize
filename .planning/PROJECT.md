# Infoman Reviewer

## What This Is

A browser-based reviewer web app for an Information Management subject. Students can study definitions and enumerations through AI-generated flashcards, practice database normalization (UNF → 3NF) through interactive exercises, and build or solve ERD diagrams using Crow's Foot notation — all without logging in.

## Core Value

A student should be able to upload their lecture slides and immediately get interactive, self-checking practice exercises for every major IM concept.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can upload a PDF/PPTX file or paste text and receive AI-generated flashcards
- [ ] User can study flashcards (definitions and enumeration) with flip interaction
- [ ] User can attempt normalization exercises (step-by-step wizard: UNF → 1NF → 2NF → 3NF)
- [ ] User can type in a normalized answer and the app validates it against the expected result
- [ ] User can freely draw ERD diagrams using Crow's Foot notation
- [ ] User can attempt pre-built ERD exercises and validate their diagram against a reference answer
- [ ] App tracks and persists study progress via localStorage (no login required)
- [ ] App is publicly accessible with no authentication

### Out of Scope

- User accounts and server-side persistence — no login required, localStorage is sufficient for v1
- Real-time multiplayer or collaborative features — single-user study tool
- Topics beyond Information Management (UNF→3NF normalization, ERDs, IM definitions) — subject-scoped by design
- 4NF, 5NF, BCNF — only UNF through 3NF is in scope
- AI key management per-user — owner's API key is hardcoded server-side (private use)

## Context

- Subject: Information Management — covers relational databases, normalization, ERDs
- Target users: Students in the class; no login needed, public URL shared by the owner
- Flashcard content sourced from lecture slides (PDF/PPTX) via AI extraction; no admin panel needed
- AI provider: OpenAI (owner's hardcoded key, server-side via Next.js API route to keep key secure)
- ERD notation: Crow's Foot only
- Normalization scope: UNF, 1NF, 2NF, 3NF only
- Deployment: Vercel (free tier)

## Constraints

- **Security**: API key must stay server-side — Next.js API routes act as a proxy to OpenAI
- **Auth**: None — fully public, no login
- **Scope**: IM subject only — normalization stops at 3NF, ERD uses Crow's Foot notation
- **Persistence**: localStorage only — no database, no backend data storage
- **Deployment**: Vercel free tier — no long-running servers, serverless functions only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 15 + TypeScript + Tailwind | API routes keep AI key server-side; Vercel deployment is native; React handles all interactive simulators | — Pending |
| localStorage for progress | No login required, zero backend complexity, sufficient for solo study use | — Pending |
| OpenAI API (owner's key, hardcoded) | Simplest path to AI flashcard generation; private use only so no per-user auth needed | — Pending |
| ERD drawing via React Flow or Konva | Canvas-based libraries handle node/edge diagrams with Crow's Foot notation overlays | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-18 after initialization*
