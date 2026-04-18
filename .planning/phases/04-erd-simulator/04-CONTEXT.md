# Phase 4: ERD Simulator — Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Build an interactive ERD canvas where students draw Crow's Foot entity-relationship diagrams. Two modes: a free canvas for open-ended practice, and structured exercises (tied to Phase 3 normalization schemas) with reference-answer validation. Progress persists via localStorage.

</domain>

<decisions>
## Implementation Decisions

### D-01: Entity Node — Inline Editing on Canvas
Nodes are fully editable inline on the canvas. No side panel, no modal opens. The node displays:
- Table name at the top — click to rename inline
- Attribute rows below — each row has a name field (click to edit), a PK/FK/Attribute dropdown, and a remove (×) button
- An "+ Add attribute" button at the bottom of the node

The node renders live-editable while sitting on the canvas alongside other entities.

### D-02: Attribute Marker — Dropdown per Row
Each attribute row has a small dropdown with exactly three options:
- Primary Key (PK)
- Foreign Key (FK)
- Attribute (regular, no marker)

This is more explicit than a cycling badge and avoids ambiguity about which state you're in.

### D-03: Relationships — Drag from Node Handle
Relationships are created by dragging from a connection handle on one entity node to another. Standard React Flow handle interaction. Each entity has handles on its edges.

### D-04: Cardinality — Click Edge → Inline Popover
Clicking a relationship line opens a small floating popover. The popover contains:
- **Source end label** (text input, optional)
- **Source end cardinality** (dropdown — see D-05)
- **Target end label** (text input, optional)
- **Target end cardinality** (dropdown — see D-05)

Two labels per relationship (one per end), matching the image reference provided (e.g., "Submits" on the Customer side, "Submitted_by" on the Order side).

### D-05: Crow's Foot Cardinality Options (exactly four)
Each end of a relationship has exactly these four options:
- Mandatory One (exactly one — `||`)
- Mandatory Many (one or more — `|<`)
- Optional One (zero or one — `O|`)
- Optional Many (zero or many — `O<`)

### D-06: Two Modes — Free Canvas + Exercises
The `/erd` page offers both:
- **Free canvas** — blank canvas for open-ended ERD practice, no validation
- **Exercises** — pre-built exercises with a description prompt, validation against a reference answer, and link back/to normalization

### D-07: ERD Exercises Use Normalization Schemas
ERD exercises map 1:1 to the normalization exercises from Phase 3 (employee-project, student-course, order-item, hospital-scheduling, university-enrollment, retail-supply-chain). Students draw the ERD for the 3NF schema they normalized in Phase 3.

### D-08: Cross-Phase Link — Normalization → ERD
After a student completes a normalization exercise (reaches the 3NF step), a "Now draw the ERD →" link/button appears on the completion screen pointing to the matching ERD exercise at `/erd/[exerciseId]`. The connection is explicit in the UI.

### D-09: Validation Diff — Color-Coded Canvas Overlay + Legend
When a student clicks "Check Answer" on an exercise canvas:
- **Green** — element is correct (entity, attribute, relationship, cardinality matches)
- **Red** — element is incorrect or missing from the reference answer
- **Yellow** — extra element not in the reference answer

A legend is shown alongside the diff view explaining the three colors. The overlay is applied directly on the canvas (not a separate panel).

### D-10: Toolbar — Floating Pill/Bar on Canvas
A compact floating toolbar overlays the canvas (top-left or bottom-center positioning — Claude's discretion). Contains at minimum: Add Entity, Undo, Redo, Clear Canvas, Export PNG. Stays close to the work without eating screen space.

### D-11: Crow's Foot Legend — Fixed Bottom-Right Corner
An always-visible legend card is pinned to the bottom-right corner of the canvas, showing all four Crow's Foot markers (Mandatory One, Mandatory Many, Optional One, Optional Many) with their visual symbols. Remains visible regardless of pan/zoom position.

### Claude's Discretion
- React Flow version to install (v12 per STATE.md note — confirm latest compatible with Next.js 16 / React 19)
- Exact node handle placement (top/bottom/left/right edges)
- Shape and styling of the Crow's Foot SVG markers on edge ends
- Free canvas vs exercise mode navigation (separate tabs on `/erd`? separate routes `/erd/free` vs `/erd/exercises`?)
- Exercise list card design (reuse normalization exercise card pattern or adapt)
- Zustand store shape for ERD canvas state persistence
- How the free canvas state is saved to localStorage (auto-save vs manual save button)
- Whether "Check Answer" locks the canvas or allows continued editing after validation
- PNG export implementation (React Flow's `getViewport` + `html-to-image` or similar)
- Exact popover component implementation (headless or Radix UI — check package.json before adding deps)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, target users
- `.planning/REQUIREMENTS.md` — ERD-01 through ERD-13 (requirements this phase covers)
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria
- `.planning/STATE.md` — React Flow v12 noted as planned library; `ReactFlowProvider` + `nodeTypes`/`edgeTypes` outside render function

### Existing Foundation (what this phase builds on)
- `src/app/globals.css` — Design tokens: `--color-accent: #6366f1`, `--color-surface: #1a1a1a`, `--color-border: #27272a`, `--color-success: #22c55e`, `--color-destructive: #ef4444`, `--color-warning: #f59e0b`
- `src/app/page.tsx` — ERD Simulator card already present with `href: '/erd'` and `enabled: false` — must flip to `true`
- `src/stores/flashcardStore.ts` — Zustand persist + `skipHydration: true` pattern to replicate for ERD store
- `src/stores/normalizationStore.ts` — Second example of the Zustand persist pattern
- `src/components/StorageHydration.tsx` — SSR hydration fence — ERD store needs to be added here
- `src/data/exercises.ts` — Normalization exercise IDs (employee-project, student-course, order-item, hospital-scheduling, university-enrollment, retail-supply-chain) — ERD exercises map 1:1 to these IDs
- `src/components/normalization/NormalizationWizard.tsx` — Completion screen where "Now draw the ERD →" link must be added
- `package.json` — Check before adding any new deps (React Flow not yet installed)

### Phase Context
- `.planning/phases/03-normalization-simulator/03-CONTEXT.md` — Exercise list/detail route pattern, Zustand store pattern, design token usage
- `.planning/phases/03-normalization-simulator/03-01-SUMMARY.md` — Exercise list page pattern, route structure
- `.planning/phases/03-normalization-simulator/03-02-SUMMARY.md` — Validation + feedback patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/stores/normalizationStore.ts` — Copy Zustand persist + skipHydration pattern for `erdStore.ts`
- `src/components/StorageHydration.tsx` — Add ERD store rehydration call here (same as normalization store)
- `src/data/exercises.ts` — Export exercise IDs for ERD exercise mapping; ERD exercises reference the same `id` strings
- `src/app/globals.css` — All color tokens available; use `--color-warning: #f59e0b` for "extra" elements in diff overlay

### Established Patterns
- Exercise list page at `/[module]` → detail at `/[module]/[exerciseId]` (Phase 3 pattern — replicate for ERD)
- Async params in dynamic routes: `const { exerciseId } = await params` (Next.js 16 requirement, already established)
- `skipHydration: true` in Zustand store + rehydrate call in `StorageHydration.tsx` — mandatory SSR pattern
- `nodeTypes` and `edgeTypes` defined OUTSIDE React component render function (STATE.md explicit note — prevents infinite re-renders in React Flow)

### Integration Points
- Home page `modules` array in `src/app/page.tsx` — flip ERD card to `enabled: true`
- Normalization wizard completion screen — add "Now draw the ERD →" link for exercises that have a matching ERD exercise
- `StorageHydration.tsx` — add `useErdStore.persist.rehydrate()` call

</code_context>

<specifics>
## Specific Ideas

- Crow's Foot label reference image provided: two labels per edge (one per end), e.g., "Submits" above the Customer-side and "Submitted_by" above the Order-side of the same relationship line
- The four cardinality symbols to render: `||` (Mandatory One), `|<` (Mandatory Many), `O|` (Optional One), `O<` (Optional Many)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-erd-simulator*
*Context gathered: 2026-04-18*
