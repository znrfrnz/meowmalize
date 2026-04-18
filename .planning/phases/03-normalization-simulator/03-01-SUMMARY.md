---
phase: 03-normalization-simulator
plan: "03-01"
status: complete
commit: 50d9245
---

# Plan 03-01 Summary: Data Layer + UI Shell

## What Was Built

Data foundation and navigable wizard shell for the Normalization Simulator.

## Key Files Created

- **src/types/index.ts** — appended Exercise, NormStepDef, FDPair, TableAnswer, NormFormStep, NormalizationProgress types
- **src/data/exercises.ts** — 3 full exercises (employee-project, student-course, order-item) with correct answers per step + getExercise() helper
- **src/stores/normalizationStore.ts** — Zustand persist store with skipHydration: true; actions: markStepComplete, saveStepAnswer, revealHint, getHintIndex, getCompletedSteps, getSavedAnswer, resetExercise
- **src/components/StorageHydration.tsx** — updated to rehydrate normalizationStore
- **src/components/normalization/TableBuilder.tsx** — dynamic column list + PK checkboxes + FDInput integration
- **src/components/normalization/FDInput.tsx** — LHS→RHS text inputs (comma-separated), add/remove FD rows
- **src/components/normalization/RuleCard.tsx** — static rule card with Info icon
- **src/components/normalization/WizardTabs.tsx** — 4 step tabs with completed/active/locked states
- **src/components/normalization/NormalizationWizard.tsx** — wizard orchestrator ('use client'), stub "Check Answer" button
- **src/app/normalization/page.tsx** — exercise list page (3 cards)
- **src/app/normalization/[exerciseId]/page.tsx** — thin Server Component wrapping NormalizationWizard

## Also Fixed

- **src/app/generate/page.tsx** — wrapped useSearchParams in Suspense to fix pre-existing build error

## Verification

- `npx tsc --noEmit` — passed (zero errors)
- `npm run build` — passed (normalization routes static-rendered)
- /normalization shows 3 exercise cards
- /normalization/[exerciseId] loads wizard with UNF tab, source table, step tabs
- TableBuilder + FDInput accept user input
- "Begin 1NF →" advances step

## Deviations

- Added "+ Add table" / "Remove last table" buttons in wizard shell (needed for multi-table normalization steps in 2NF/3NF); Plan 03-02 wires validation
- UNF violation highlighting inlined in NormalizationWizard instead of separate UnfTable component — Plan 03-02 will extract to proper UnfTable.tsx component
