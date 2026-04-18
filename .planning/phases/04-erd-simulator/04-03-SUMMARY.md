# 04-03 SUMMARY: ERD Route Pages

## Status: COMPLETE

## What Was Built

Three ERD route pages: mode selector, free canvas, and exercise mode with validator integration.

## Key Files Created

- `src/app/erd/page.tsx` — Mode selector page with Free Canvas card + Exercises card + 3 exercise list cards
- `src/app/erd/draw/page.tsx` — Full-height free canvas page rendering `<ERDCanvas />`
- `src/app/erd/[exerciseId]/page.tsx` — Thin Server Component; uses `await params` (Next.js 16); calls `notFound()` for unknown IDs
- `src/components/erd/ErdExerciseWizard.tsx` — Client-side wizard with exercise header, Check Answer button, validation result banner, reset, and canvas

## Wiring

- `ErdExerciseWizard` reads `useErdStore()` nodes/edges → converts to `ErdAnswer` via `toErdAnswer()` → calls `compareErd()` → builds `validationOverlay` map passed to `ERDCanvas`
- Validation banner shows correct/incorrect/extra legend with counts

## Self-Check: PASSED
