# Phase 4: ERD Simulator — Research

**Phase:** 04-erd-simulator  
**Researched:** 2026-04-18  
**Confidence:** HIGH — built on verified project-level research + React Flow v12 docs

---

## TL;DR — What the planner needs to know

1. Install `@xyflow/react` v12 + `zundo` for undo/redo + `html-to-image` for PNG export
2. Define `nodeTypes` / `edgeTypes` **at module scope** (not inside component body) — React Flow hard requirement
3. Crow's Foot markers are SVG `<marker>` elements in a `<defs>` block; edge components reference them via `url(#marker-id)`
4. Import `@xyflow/react/dist/style.css` BEFORE Tailwind in layout — omitting this hides all edges (known Tailwind conflict)
5. The cardinality popover (D-04) opens on edge click — use React Flow's `onEdgeClick` callback
6. ERD validation = entity-set + attribute-set + relationship-set comparison (similar to normalization validator)
7. PNG export = `html-to-image` `toPng()` on the `.react-flow__viewport` DOM node
8. Zustand store uses `zundo` middleware for undo/redo stack — replaces React Flow's built-in history

---

## Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| `@xyflow/react` | `^12.0.0` | ERD canvas, custom nodes/edges |
| `zundo` | `^2.3.0` | Undo/redo middleware for Zustand |
| `html-to-image` | `^1.11.11` | PNG export from canvas DOM node |

**Install command:**
```bash
npm install @xyflow/react zundo html-to-image
```

**Check before install:** `package.json` currently has none of these. All three are new deps.

---

## React Flow v12 (@xyflow/react) — Key APIs

### Setup Pattern

```tsx
// MUST be at module scope — NOT inside component
const nodeTypes = { entityNode: EntityNode }
const edgeTypes = { crowsFoot: CrowsFootEdge }

export function ERDCanvas() {
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </ReactFlowProvider>
  )
}
```

### Custom Node Props (EntityNode)

```tsx
import { NodeProps, Handle, Position } from '@xyflow/react'

export function EntityNode({ data, selected }: NodeProps) {
  // data shape: { tableName: string, attributes: { name: string, role: 'PK'|'FK'|'Attribute' }[] }
  return (
    <div className="...">
      <Handle type="source" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      {/* inline editing UI */}
      <Handle type="target" position={Position.Top} id="top-target" />
      {/* ... */}
    </div>
  )
}
```

### Custom Edge Props (CrowsFootEdge)

```tsx
import { EdgeProps, BaseEdge, getStraightPath, useReactFlow } from '@xyflow/react'

export function CrowsFootEdge({
  id, sourceX, sourceY, targetX, targetY, data
}: EdgeProps) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={`url(#cf-${data?.sourceCardinality})`}
        markerEnd={`url(#cf-${data?.targetCardinality})`}
      />
      {/* source label, target label */}
    </>
  )
}
```

### State Serialization (save/restore to localStorage)

```tsx
import { useReactFlow } from '@xyflow/react'

const { getNodes, getEdges, setNodes, setEdges } = useReactFlow()

// Save
const state = { nodes: getNodes(), edges: getEdges() }
// Restore
setNodes(state.nodes)
setEdges(state.edges)
```

### Edge Click for Cardinality Popover

```tsx
const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
  setActiveEdgeId(edge.id)
  setPopoverPos({ x: event.clientX, y: event.clientY })
}, [])

<ReactFlow onEdgeClick={onEdgeClick} ... />
```

### PNG Export

```tsx
import { toPng } from 'html-to-image'

const exportPng = async () => {
  const el = document.querySelector('.react-flow__viewport') as HTMLElement
  const dataUrl = await toPng(el, { cacheBust: true })
  const link = document.createElement('a')
  link.download = 'erd.png'
  link.href = dataUrl
  link.click()
}
```

---

## Crow's Foot SVG Markers

Define all four symbols as SVG `<marker>` elements in a `<defs>` block rendered inside `<ReactFlow>`. 

**Marker IDs (use consistently across edgeTypes and legend):**

| Symbol | Marker ID | Crow's Foot Symbol |
|--------|-----------|-------------------|
| Mandatory One | `cf-mandatory-one` | `\|\|` (double vertical bar) |
| Mandatory Many | `cf-mandatory-many` | `\|<` (bar + crow's foot) |
| Optional One | `cf-optional-one` | `O\|` (circle + bar) |
| Optional Many | `cf-optional-many` | `O<` (circle + crow's foot) |

**SVG marker implementation pattern:**

```tsx
// Inside ERDCanvas, rendered within <ReactFlow>
function ERDMarkerDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <marker id="cf-mandatory-one" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          {/* Two vertical lines */}
          <line x1="8" y1="0" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1.5" />
        </marker>
        <marker id="cf-mandatory-many" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto">
          {/* Crow's foot + bar */}
          <line x1="9" y1="0" x2="9" y2="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="9" y1="5" x2="1" y2="0" stroke="currentColor" strokeWidth="1.5" />
          <line x1="9" y1="5" x2="1" y2="10" stroke="currentColor" strokeWidth="1.5" />
        </marker>
        <marker id="cf-optional-one" markerWidth="14" markerHeight="10" refX="12" refY="5" orient="auto">
          {/* Circle + bar */}
          <circle cx="3" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="10" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
        </marker>
        <marker id="cf-optional-many" markerWidth="14" markerHeight="10" refX="12" refY="5" orient="auto">
          {/* Circle + crow's foot */}
          <circle cx="3" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="11" y1="5" x2="6" y2="0" stroke="currentColor" strokeWidth="1.5" />
          <line x1="11" y1="5" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" />
        </marker>
      </defs>
    </svg>
  )
}
```

---

## Undo/Redo — zundo Middleware

`zundo` wraps Zustand and maintains a temporal history. Use `useTemporalStore` to access undo/redo.

```tsx
import { create } from 'zustand'
import { temporal } from 'zundo'
import { persist } from 'zustand/middleware'

// Apply temporal BEFORE persist
export const useErdStore = create<ErdState>()(
  temporal(
    persist(
      (set, get) => ({
        nodes: [],
        edges: [],
        // ... actions
      }),
      { name: 'infoman:erd', skipHydration: true }
    )
  )
)

// In components
const { undo, redo, clear } = useTemporalStore(useErdStore, (state) => state)
```

**Keyboard binding (in ERDCanvas `useEffect`):**
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) undo()
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) redo()
}
```

---

## ERD Exercise Data Structure

ERD exercises map 1:1 to normalization exercise IDs. Define reference answers as typed objects:

```typescript
export interface ErdAttribute {
  name: string
  role: 'PK' | 'FK' | 'Attribute'
}

export interface ErdEntity {
  id: string          // e.g., 'Employee'
  tableName: string
  attributes: ErdAttribute[]
}

export interface ErdRelationship {
  id: string
  sourceEntityId: string
  targetEntityId: string
  sourceCardinality: 'mandatory-one' | 'mandatory-many' | 'optional-one' | 'optional-many'
  targetCardinality: 'mandatory-one' | 'mandatory-many' | 'optional-one' | 'optional-many'
  sourceLabel?: string
  targetLabel?: string
}

export interface ErdAnswer {
  entities: ErdEntity[]
  relationships: ErdRelationship[]
}

export interface ErdExercise {
  id: string                    // matches normalization exercise ID
  title: string
  description: string           // scenario prompt shown to student
  referenceAnswer: ErdAnswer
}
```

**Exercise IDs (must match `src/data/exercises.ts` IDs):**
- `employee-project`
- `student-course`
- `order-item`

*(hospital-scheduling, university-enrollment, retail-supply-chain were referenced in CONTEXT.md but only 3 exercises exist in `src/data/exercises.ts` — implement for existing 3 only)*

---

## ERD Validation Algorithm

```typescript
export interface ErdValidationResult {
  entityResults: {
    entityId: string
    status: 'correct' | 'incorrect' | 'extra'
    attributeResults: { name: string; status: 'correct' | 'incorrect' | 'extra' }[]
  }[]
  relationshipResults: {
    relationshipId: string
    status: 'correct' | 'incorrect' | 'extra'
  }[]
}

export function compareErd(
  studentAnswer: ErdAnswer,
  referenceAnswer: ErdAnswer
): ErdValidationResult {
  // 1. Match entities by normalized tableName (case-insensitive)
  // 2. For matched entities: compare attribute sets (name + role)
  // 3. Match relationships by (sourceEntity, targetEntity) pair (order-insensitive)
  // 4. For matched relationships: compare cardinalities at both ends
  // 5. Unmatched student items → 'extra' (yellow)
  // 6. Unmatched reference items → 'incorrect' (red on student canvas)
}
```

**Color mapping for diff overlay:**
- `correct` → `--color-success: #22c55e` (green)
- `incorrect` / missing → `--color-destructive: #ef4444` (red)
- `extra` → `--color-warning: #f59e0b` (yellow)

---

## Route Structure

Per architecture research and CONTEXT.md:

```
app/erd/
├── page.tsx                    ← Mode selector (Free Canvas tab / Exercises tab)
├── draw/
│   └── page.tsx                ← Free canvas — blank ERDCanvas, localStorage auto-save
└── [exerciseId]/
    └── page.tsx                ← Exercise mode — description + ERDCanvas + Check Answer
```

**Async params pattern (Next.js 16 — already established in codebase):**
```tsx
export default async function ErdExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params
  // ...
}
```

---

## Integration Points

### 1. Home Page — Enable ERD Card

```typescript
// src/app/page.tsx — change enabled: false → enabled: true
{ title: 'ERD Simulator', href: '/erd', enabled: true, ... }
```

### 2. StorageHydration — Add ERD Store

```typescript
// src/components/StorageHydration.tsx
import { useErdStore } from '@/stores/erdStore'

useEffect(() => {
  useFlashcardStore.persist.rehydrate()
  useDeckStore.persist.rehydrate()
  useNormalizationStore.persist.rehydrate()
  useErdStore.persist.rehydrate()   // ← add this
}, [])
```

### 3. NormalizationWizard — Cross-Phase Link (D-08)

```tsx
// src/components/normalization/NormalizationWizard.tsx
// In the allStepsComplete banner, after existing Trophy text:
{allStepsComplete && (
  <div className="mt-4">
    <Link href={`/erd/${exercise.id}`} className="...">
      Now draw the ERD →
    </Link>
  </div>
)}
```

Only show the link when a matching ERD exercise exists. Check `getErdExercise(exercise.id)` returns non-null before rendering.

---

## CSS Import — Critical

In `src/app/layout.tsx`, import React Flow styles BEFORE Tailwind:

```tsx
import '@xyflow/react/dist/style.css'
import './globals.css'
```

Omitting or reversing this order causes edges to be invisible (Tailwind's `overflow: hidden` reset conflicts with `.react-flow__edges` SVG layer).

---

## Validation Architecture

The ERD validator follows the same pure-function, testable pattern as `normalizationValidator.ts`:

- Input: `(studentAnswer: ErdAnswer, referenceAnswer: ErdAnswer)`
- Output: `ErdValidationResult` with per-entity, per-attribute, per-relationship statuses
- No side effects, no React dependencies
- 100% unit-testable with vitest

**Test file:** `src/lib/erdValidator.test.ts` — write tests first (TDD), then implement `src/lib/erdValidator.ts`.

---

## Pitfalls Specific to This Phase

| Risk | Mitigation |
|------|------------|
| `nodeTypes`/`edgeTypes` inside component body → infinite re-renders | Define at module scope (STATE.md explicit note) |
| Tailwind resets hide edges | Import `@xyflow/react/dist/style.css` before `globals.css` in layout |
| `zundo` + `persist` middleware order matters | Wrap: `create(temporal(persist(...)))` — temporal outermost |
| SSR: React Flow calls `document` APIs | Wrap `<ReactFlow>` in `'use client'` component; never import in Server Components |
| `useReactFlow()` used outside `ReactFlowProvider` | `ERDCanvas.tsx` must be wrapped in `<ReactFlowProvider>` or be a child of one |
| PNG export: `html-to-image` ignores external stylesheets | Inline critical styles or use `toPng` with `fontEmbedCSS` option |
| zundo `skipHydration` — temporal state not hydrated from localStorage | Only the Zustand persist state is hydrated; temporal history resets on page load (acceptable) |

---

## ## RESEARCH COMPLETE

**Phase 4 is well-understood. Ready for planning.**

Key inputs for planner:
- 3 new npm deps: `@xyflow/react`, `zundo`, `html-to-image`
- 11 locked decisions from CONTEXT.md (D-01 through D-11), all implementable
- Route structure: `/erd`, `/erd/draw`, `/erd/[exerciseId]`
- ~15 new files (store, types, components, pages, data, validator, tests)
- 3 integration points in existing files (page.tsx, StorageHydration.tsx, NormalizationWizard.tsx)
- Recommended: TDD plan for `erdValidator.ts` (pure function, clear I/O contract)
- Suggested split: 3–4 plans (data+types, canvas+components, validation+exercises, wiring+integration)
