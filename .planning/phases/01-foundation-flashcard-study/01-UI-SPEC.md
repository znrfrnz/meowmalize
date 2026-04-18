---
phase: 1
slug: foundation-flashcard-study
status: approved
shadcn_initialized: false
preset: none
created: 2026-04-18
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for frontend phases. Generated for Phase 1: Foundation + Flashcard Study.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (Tailwind v4 utilities only) |
| Preset | not applicable |
| Component library | none (custom components) |
| Icon library | lucide-react |
| Font | Geist (bundled with Next.js via `next/font/local`) |

**Rationale:** No shadcn/ui or Radix — this is a focused student reviewer app. Custom components with Tailwind v4 utilities keep the bundle lean and the flip animation fully controllable. `lucide-react` provides clean, consistent icons at minimal weight.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, badge padding |
| sm | 8px | Button internal padding, tag spacing |
| md | 16px | Card inner padding, input padding |
| lg | 24px | Section gaps, card gap in grid |
| xl | 32px | Page section breaks |
| 2xl | 48px | Hero/content vertical rhythm |
| 3xl | 64px | Page top/bottom padding |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 500 | 1.4 |
| Heading (card) | 20px | 600 | 1.3 |
| Heading (page) | 30px | 700 | 1.2 |
| Display (term on card) | 24px | 700 | 1.25 |
| Caption | 13px | 400 | 1.4 |

Font: **Geist Sans** for UI text. **Geist Mono** for item count hints and progress indicators ("Card 4 of 20").

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#0f0f0f` (dark) / `#fafafa` (light) | Page background |
| Secondary (30%) | `#1a1a1a` (dark) / `#ffffff` (light) | Cards, nav, surfaces |
| Accent (10%) | `#6366f1` (indigo-500) | CTA buttons, progress fill, active nav indicator |
| Success | `#22c55e` (green-500) | "Know it" badge, completion screen |
| Warning | `#f59e0b` (amber-500) | "Still learning" badge |
| Destructive | `#ef4444` (red-500) | Reset progress button only |
| Muted | `#71717a` (zinc-500) | Secondary labels, hints, captions |
| Border | `#27272a` (dark) / `#e4e4e7` (light) | Card borders, dividers |

**Color scheme: dark-first.** The app ships in dark mode by default (matches typical late-night study sessions). Tailwind's `dark:` variant is not needed — use CSS variables in `@theme` to set the default dark palette.

Accent reserved for: primary CTAs ("Start Studying", "Save Progress"), progress bar fill, currently active nav link underline.

**Type badges:**
- `Definition` → indigo-100/indigo-700 (light) or indigo-900/indigo-300 (dark)
- `Enumeration` → violet-100/violet-700 (light) or violet-900/violet-300 (dark)

---

## Component Contracts

### Navigation Bar
- Height: 56px
- Logo/app name left-aligned: "Infoman Reviewer"
- Three nav links: "Flashcards" · "Normalization" · "ERD"
- Active link: accent-colored bottom border (2px), font-weight 600
- No hamburger menu — three links always visible

### Home Page Module Cards (3 cards in grid)
- Layout: 3-column grid (lg), 1-column (mobile)
- Card structure: icon (40×40) · title · short description · CTA button
- Flashcards card: BookOpen icon, "Flashcard Deck", "Study term-definition pairs with spaced repetition-style marking"
- Normalization card: Table2 icon (lucide), "Normalization Simulator", "Practice UNF→1NF→2NF→3NF step-by-step" (disabled in Phase 1 — show "Coming Soon" badge)
- ERD card: GitFork icon (lucide), "ERD Simulator", "Draw Crow's Foot entity-relationship diagrams" (disabled in Phase 1)
- Disabled cards: 40% opacity, no hover state, CTA replaced with "Coming Soon" pill badge

### Flashcard Component
- Container: full-width, max-w-2xl, centered
- Aspect ratio: ~16:9 (landscape) — wide enough to show full enumeration lists
- Front face:
  - Top-right: type badge (Definition | Enumeration)
  - Center: term in Display typography
  - Bottom-center (Enumeration only): "List N items" in Geist Mono, muted color
  - Bottom hint: "Press Space or click to flip"
- Back face:
  - For Definition: definition text in Body size, centered
  - For Enumeration: numbered list, left-aligned, Body size
  - Bottom hint: "Press Space or click to flip back"
- Flip animation: CSS 3D rotateY(180deg), 500ms ease-in-out, `transform-style: preserve-3d`
- Border: 1px border using Border color token; on hover (front face) subtle border-accent glow

### Progress Indicator
- Format: "Card 4 of 20" — Geist Mono, 14px, muted
- Position: above the card, right-aligned
- Also show: small pill counts — "{N} Known · {M} Learning" in green-500 and amber-500

### Action Buttons (below card)
- "Know it" — green-500 background, white text, CheckCircle icon left
- "Still learning" — amber-500 background, white text, RotateCcw icon left
- Both: 44px height (touch-friendly), rounded-lg, full-width on mobile / auto-width on desktop

### Filter + Control Bar
- Position: above progress indicator
- Controls: "All" · "Definitions" · "Enumerations" — pill toggle buttons
- Actions: shuffle button (Shuffle icon), reset button (Trash2 icon, destructive color)
- Layout: space-between row

### Session Completion Screen
- Full-card overlay (same dimensions as flashcard)
- Trophy icon (lucide) 48px, accent color
- Heading: "Deck Complete!"
- Stats: "{N} Known · {M} Still Learning"
- Two CTAs: "Review Still Learning" (primary) · "Reshuffle All" (secondary/outline)

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA (home) | "Start Studying" |
| Nav brand | "Infoman Reviewer" |
| Empty state heading | "No cards match this filter" |
| Empty state body | "Try selecting a different type, or reset your filter." |
| Reset confirmation | "Reset Progress: All your Known/Still Learning marks will be cleared. This cannot be undone." |
| Error state | "Something went wrong loading the deck. Refresh to try again." |
| Coming soon badge | "Coming Soon" |
| Completion heading | "Deck Complete!" |
| Flip hint (front) | "Space or click to flip" |
| Flip hint (back) | "Space or click to flip back" |
| Enumeration item count hint | "List {N} items" |

---

## Keyboard Navigation Contract

| Key | Action |
|-----|--------|
| Space | Flip card |
| → / ArrowRight | Next card |
| ← / ArrowLeft | Previous card |
| K | Mark "Know it" |
| L | Mark "Still learning" |

Show keyboard shortcuts in a small legend below the action buttons (14px, muted, icon + key label pairs).

---

## Animation Contract

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Card flip | rotateY(180deg) | 500ms | ease-in-out |
| Card entrance | opacity 0→1, translateY 8px→0 | 200ms | ease-out |
| Progress bar fill | width transition | 300ms | ease |
| Action button press | scale(0.97) | 100ms | ease |
| Module card hover | translateY(-2px) | 150ms | ease |

All animations: use `will-change: transform` only during active animation (add/remove class). No continuous animations.

---

## Accessibility Contract

- All interactive elements: minimum 44×44px touch target
- Cards have `role="button"` and `tabIndex={0}` with `onKeyDown` for Space
- Type badges: not color-only — include text label
- Progress: `aria-label="Card 4 of 20"` on the counter
- Action buttons: descriptive `aria-label` (e.g., `aria-label="Mark as Know it"`)
- Focus ring: 2px indigo-500 outline, offset 2px — never suppressed

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| lucide-react | BookOpen, Table2, GitFork, CheckCircle, RotateCcw, Shuffle, Trash2, Trophy | not required — official package |

No third-party component registries used.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS — all states have specific copy, no Lorem ipsum
- [x] Dimension 2 Visuals: PASS — component contracts defined for all Phase 1 UI elements
- [x] Dimension 3 Color: PASS — 60/30/10 rule applied, accent reserved for specific elements
- [x] Dimension 4 Typography: PASS — scale defined for all roles, Geist Mono for data
- [x] Dimension 5 Spacing: PASS — 4px base grid, all tokens declared
- [x] Dimension 6 Registry Safety: PASS — only lucide-react, official package

**Approval:** approved 2026-04-18
