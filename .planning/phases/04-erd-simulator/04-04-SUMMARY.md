# 04-04 SUMMARY: App Wiring

## Status: COMPLETE

## What Was Built

Phase 4 integration into the existing app — ERD home card enabled, ERD store rehydrated, cross-phase link from NormalizationWizard.

## Key Files Modified

- `src/app/page.tsx` — ERD Simulator card changed from `enabled: false` → `enabled: true`
- `src/components/StorageHydration.tsx` — Added `useErdStore` import and `useErdStore.persist.rehydrate()` call
- `src/components/normalization/NormalizationWizard.tsx` — Added `Link`, `getErdExercise` imports; `matchingErdExercise` variable; conditional "Now draw the ERD" link in completion banner

## Build Verification

- `npx tsc --noEmit` → zero errors
- `npm run build` → passes, routes `/erd`, `/erd/draw`, `/erd/[exerciseId]` all present

## Self-Check: PASSED
