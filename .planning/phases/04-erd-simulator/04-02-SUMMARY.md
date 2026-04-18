# 04-02 SUMMARY: ERD Canvas Components

## Status: COMPLETE

## What Was Built

React Flow canvas with all custom components for the ERD Simulator.

## Key Files Created

- `src/app/layout.tsx` — Added `@xyflow/react/dist/style.css` import as first import (before globals.css)
- `src/components/erd/ERDCanvas.tsx` — Main React Flow canvas; `nodeTypes`/`edgeTypes` at module scope; SVG defs for 4 Crow's Foot markers; keyboard undo/redo (Ctrl+Z/Y); `readOnly` + `validationOverlay` props for exercise mode
- `src/components/erd/EntityNode.tsx` — Inline-editable entity node with tableName input, attribute rows (name + PK/FK/Attribute dropdown + remove), add attribute button, 8 handles
- `src/components/erd/CrowsFootEdge.tsx` — SVG path with `markerStart`/`markerEnd` referencing `cf-*` marker IDs; source/target label rendering via EdgeLabelRenderer
- `src/components/erd/CardinalityPopover.tsx` — Fixed-position floating popover on edge click; 4 cardinality options per end + label inputs; closes on outside click
- `src/components/erd/ERDToolbar.tsx` — Floating pill toolbar: Add Entity, Undo, Redo, Clear Canvas, Export PNG
- `src/components/erd/NotationLegend.tsx` — Pinned bottom-right legend showing all 4 Crow's Foot symbols

## Decisions Made

- `useErdStore.temporal.getState()` used instead of `useTemporalStore` (which isn't exported from zundo v2)
- `getStraightPath` from `@xyflow/react` used for edge path computation
- `html-to-image` imported dynamically in export handler to avoid SSR issues

## Self-Check: PASSED
