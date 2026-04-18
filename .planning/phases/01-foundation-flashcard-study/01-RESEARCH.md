# Phase 1 Research — Foundation + Flashcard Study

**Phase:** 01-foundation-flashcard-study  
**Researched:** 2026-04-18  
**Status:** Complete

---

## Standard Stack

| Layer | Library | Version | Notes |
|-------|---------|---------|-------|
| Framework | Next.js | 15 (latest) | App Router, Turbopack default |
| Language | TypeScript | strict mode | Built-in with Next.js |
| Styling | Tailwind CSS | v4 | PostCSS plugin approach for Next.js |
| State | Zustand | 5 | `persist` middleware for localStorage |
| React | React | 19 | Bundled with Next.js 15 |

---

## Architecture Patterns

### Next.js 15 + Tailwind v4 Setup

**Bootstrap command:**
```bash
npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir --import-alias "@/*"
```

**Tailwind v4 differs from v3** — no `tailwind.config.js`, config is CSS-first:
- Install: `npm install tailwindcss @tailwindcss/postcss postcss`
- `postcss.config.mjs`: `{ plugins: { "@tailwindcss/postcss": {} } }`
- `globals.css`: `@import "tailwindcss";` (NOT `@tailwind base/components/utilities`)
- Custom CSS variables/themes go in `globals.css` using `@theme { ... }`

**Directory structure for this project:**
```
src/
  app/
    layout.tsx          # Root layout with nav + StorageHydration
    page.tsx            # Home page (3 module cards)
    flashcards/
      page.tsx          # Flashcard study session
  components/
    StorageHydration.tsx
    FlashCard.tsx
    StudySession.tsx
  stores/
    flashcardStore.ts
  data/
    flashcards.ts       # Pre-seeded flashcard deck
  types/
    index.ts
```

### Zustand 5 + Persist + SSR Hydration Fix

**The hydration mismatch problem:** Server renders with Zustand initial state; client loads localStorage data — React throws hydration error if they differ.

**Solution: `skipHydration: true` + `StorageHydration` component**

```typescript
// stores/flashcardStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FlashcardState {
  progress: Record<string, 'known' | 'learning' | null>
  // ... actions
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      progress: {},
      markKnown: (id: string) => set(state => ({ progress: { ...state.progress, [id]: 'known' } })),
      markLearning: (id: string) => set(state => ({ progress: { ...state.progress, [id]: 'learning' } })),
      resetProgress: () => set({ progress: {} }),
    }),
    {
      name: 'infoman-flashcard-progress',
      skipHydration: true,   // ← KEY: prevents server/client mismatch
    }
  )
)
```

```typescript
// components/StorageHydration.tsx
'use client'
import { useEffect } from 'react'
import { useFlashcardStore } from '@/stores/flashcardStore'

export function StorageHydration() {
  useEffect(() => {
    useFlashcardStore.persist.rehydrate()
  }, [])
  return null
}
```

```typescript
// app/layout.tsx
import { StorageHydration } from '@/components/StorageHydration'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StorageHydration />  {/* ← rehydrates after first render */}
        <nav>...</nav>
        {children}
      </body>
    </html>
  )
}
```

### CSS 3D Flip Animation

Tailwind v4 supports arbitrary CSS values with bracket notation. For 3D flip:

```css
/* globals.css — add to @layer utilities or use arbitrary values inline */
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.5s;
}
.card-inner.flipped {
  transform: rotateY(180deg);
}
.card-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card-back {
  transform: rotateY(180deg);
}
```

**Tailwind inline equivalent:**
```tsx
<div className={`[transform-style:preserve-3d] transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
```

**Recommendation:** Use `@layer utilities` in `globals.css` for the flip classes — less verbose, more readable, reusable.

### Keyboard Navigation Pattern

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'ArrowLeft') goToPrev()
    if (e.key === ' ') { e.preventDefault(); flipCard() }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [currentIndex, isFlipped]) // deps depend on implementation
```

### Flashcard Data Types

```typescript
// types/index.ts
export type CardType = 'definition' | 'enumeration'

export interface Flashcard {
  id: string
  type: CardType
  term: string
  definition: string        // for definition type
  items?: string[]          // for enumeration type (the list)
}

export type ProgressStatus = 'known' | 'learning' | null
```

---

## Don't Hand-Roll

| Need | Use |
|------|-----|
| localStorage persistence | Zustand `persist` middleware — no manual `localStorage.getItem/setItem` |
| Shuffle | Fisher-Yates in a store action or util function |
| UUID generation | `crypto.randomUUID()` built into Node/browser |
| CSS transitions | Tailwind transition utilities |

---

## Common Pitfalls

1. **Hydration mismatch** — ALWAYS use `skipHydration: true` + `StorageHydration` component. Never read localStorage directly during render.
2. **Tailwind v4 config** — No `tailwind.config.js`. CSS-first. Custom colors use `@theme { --color-primary: ... }` in `globals.css`.
3. **`backface-visibility`** — Must set on BOTH front and back faces, not just the container.
4. **Keyboard listener cleanup** — Always return cleanup fn from `useEffect` to avoid duplicate listeners on re-render.
5. **`[transform-style:preserve-3d]`** — Tailwind purges arbitrary values only if used in static strings. Avoid dynamic string concatenation for class names containing arbitrary values; use `cn()` with explicit branches.
6. **Enumeration card** — Show item count hint BEFORE flip (e.g., "List 4 items"), full list AFTER flip. Don't reveal on front face.
7. **`create-next-app` with `--yes`** — Accepts defaults but does NOT set `--src-dir` or custom alias; use explicit flags for project structure control.

---

## Phase Plan Recommendation

**2 plans, sequential (Plan 02 depends on Plan 01):**

### Plan 01 — App Shell + Zustand Foundation (Wave 1)
- Task 1: Bootstrap Next.js 15 app + Tailwind v4 configuration
- Task 2: Zustand flashcard store (persist + skipHydration) + StorageHydration component + root layout with nav
- Task 3: Home page with 3 module cards (Flashcards, Normalization, ERD)

### Plan 02 — Flashcard Study UI (Wave 2, depends on Plan 01)
- Task 1: Flashcard types + pre-seeded data (12 sample cards covering Definition + Enumeration types)
- Task 2: FlashCard component — 3D flip animation, front (term + type badge + item count hint), back (definition/list)
- Task 3: Study session page — keyboard nav, progress indicator, "Know it"/"Still learning" marking, filter, shuffle, completion screen, reset
