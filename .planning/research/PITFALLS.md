# Pitfalls Research — Infoman Reviewer

**Domain:** Next.js 15 App Router educational SPA — AI flashcards, normalization exercises, ERD drawing
**Researched:** 2026-04-18
**Sources:** React Flow v12 official docs, Vercel Functions docs, OpenAI Structured Outputs docs, Next.js 15 App Router docs, Zustand Next.js integration docs

---

## 1. Zustand + localStorage Causing SSR Hydration Mismatch

**Severity:** High

**What goes wrong:** The server renders components with Zustand's initial/empty state. On the client, Zustand's `persist` middleware (or manual hydration) immediately loads localStorage data. React sees a mismatch between what was server-rendered and what the client now holds, throwing a hydration error or silently producing a broken UI.

**Warning signs:**
- Console errors: `Text content does not match server-rendered HTML`
- Flashcard/progress state briefly shows empty then "pops in"
- `localStorage is not defined` errors in server logs
- Zustand `persist` middleware used without `skipHydration: true`

**Prevention:**
- Use Zustand's `skipHydration: true` in the `persist` config and manually call `useStore.persist.rehydrate()` inside a `useEffect`
- Gate all localStorage reads behind `typeof window !== 'undefined'` or `useEffect`
- Wrap pages that read from localStorage state in a client-only boundary with `'use client'` and delay rendering until `mounted` state is true
- All Zustand stores touching progress or ERD state must be initialized with static defaults server-side

**Phase:** Phase that introduces Zustand store + localStorage persistence (progress tracking or ERD save/load)

---

## 2. Vercel 4.5 MB Request Body Hard Limit Blocking File Uploads

**Severity:** High

**What goes wrong:** Vercel serverless functions enforce a hard, non-configurable 4.5 MB request body limit. A PPTX lecture slide deck from a professor easily exceeds this. The function returns HTTP 413 `FUNCTION_PAYLOAD_TOO_LARGE` and the upload silently fails or shows a cryptic error to the student.

**Warning signs:**
- Upload works for small test files but fails for real lecture decks (50–200 slide decks are commonly 5–30 MB)
- HTTP 413 in network tab
- No error message surfaced to UI if the limit isn't handled explicitly

**Prevention:**
- Enforce client-side file size validation before upload with a clear "Maximum 4 MB" warning message
- Accept text-paste as a primary input path to bypass the limitation entirely
- If larger files must be supported, extract text client-side using `pdf.js` (browser-native) before sending only the extracted text (~10–100x smaller) to the API route
- Add explicit `try/catch` in the API route to detect 413 and return a user-friendly message

**Phase:** Phase that implements file upload + AI flashcard generation

---

## 3. React Flow Tailwind CSS Conflict Hiding Edges

**Severity:** High

**What goes wrong:** Tailwind's CSS reset or utility classes can override the `.react-flow__edges` SVG selector with `overflow: hidden` or `.react-flow__renderer` with `position: static`. This makes all edges invisible with no error — nodes render normally, drag works, but the diagram lines just don't appear. This is one of the most commonly filed React Flow issues.

**Warning signs:**
- Nodes render and are draggable but no edges/connections visible
- Edges appear in React Dev Tools state but are invisible on canvas
- Issue appears only after Tailwind is added to the project

**Prevention:**
- Import `@xyflow/react/dist/style.css` unconditionally before Tailwind styles in the layout
- Add Tailwind safelist or explicit overrides: ensure `.react-flow__edges` has `overflow: visible`, and the wrapper `div` has `overflow: hidden` (not the SVG layer)
- Test edge visibility immediately after scaffolding React Flow before building Crow's Foot custom edges
- For Crow's Foot notation using SVG `markerEnd`, confirm the `defs` section is rendered inside the SVG and not blocked

**Phase:** Phase that introduces the ERD drawing tool

---

## 4. `nodeTypes`/`edgeTypes` Recreated on Every Render Causing Infinite Re-renders

**Severity:** Medium

**What goes wrong:** React Flow logs a warning ("It looks like you have created a new nodeTypes or edgeTypes object") and causes performance degradation or flickering when `nodeTypes` or `edgeTypes` objects are defined inside a React component's render body. Every render creates a new object reference, which React Flow interprets as a configuration change and re-initializes the renderer.

**Warning signs:**
- `nodeTypes` or `edgeTypes` defined inline in the JSX or inside the component function body
- Noticeable stutter / re-flash when moving nodes
- React Flow warning in console about new nodeTypes object

**Prevention:**
- Define `nodeTypes` and `edgeTypes` **outside** the component, at module scope — not inside `useState`, `useMemo`, or the render function
- For the ERD tool, the Crow's Foot entity node type and the relationship edge type must be stable references
- Use `useMemo` only if the types genuinely need to change at runtime (they won't for this project)

**Phase:** Phase that implements the ERD drawing tool's custom node/edge types

---

## 5. PDF/PPTX Parsing Producing Garbled or Empty Text

**Severity:** Medium

**What goes wrong:** Lecture slides often contain: (1) scanned images with no text layer — `pdf.js` extracts zero characters; (2) complex layouts with overlapping text boxes — extraction order is randomized and incoherent; (3) PPTX files where key content is inside grouped shapes or SmartArt — `pptx-parser` libraries skip these entirely. The AI then receives garbage text and generates nonsensical or hallucinated flashcards.

**Warning signs:**
- Extracted text is an empty string or just whitespace
- Extracted text is present but characters appear out of order (e.g., "NoatrimnlioazN" instead of "Normalization")
- Flashcards reference topics not in the original slide content

**Prevention:**
- Always validate extracted text length before calling OpenAI — if under ~100 characters, surface a "Could not extract text from this file. Try pasting text instead" message
- Provide a text-paste fallback as a first-class input method (not a secondary option)
- For PPTX, use `pptx-parser` or `officegen` but test against real lecture slides from the subject, not synthetic test files
- Truncate extracted text to the model's useful context window (~50K characters) to avoid token waste

**Phase:** Phase that implements file upload parsing

---

## 6. OpenAI Structured Output Schema Violations Causing API Errors

**Severity:** Medium

**What goes wrong:** OpenAI's Structured Outputs (`response_format: {type: "json_schema", strict: true}`) requires: all fields marked `required`, `additionalProperties: false` on every object, no `anyOf` at the root level, and max 10 levels of nesting. A flashcard schema designed with optional fields or using Zod discriminated unions at the root will silently fail or throw a `400` error at runtime — not at build time.

**Warning signs:**
- API returns 400 with a message about unsupported schema features
- Zod schema uses `z.discriminatedUnion` at the top level
- Schema has optional fields modeled as plain `?` instead of `type: ["string", "null"]`
- Nested array of card objects more than 10 levels deep

**Prevention:**
- Design the flashcard schema flat: `{ cards: Array<{ front: string, back: string, type: "definition"|"enumeration" }> }` — all fields required
- Model optional fields as `type: ["string", "null"]` in JSON Schema or `z.string().nullable()` in Zod
- Never use `z.discriminatedUnion` or `z.union` at the root schema level
- Always include a system-level instruction: "Return a JSON object. If the text contains no identifiable IM concepts, return `{ cards: [] }`" to prevent refusals from breaking the schema contract

**Phase:** Phase that implements AI flashcard generation

---

## 7. localStorage Quota Exceeded Silently Losing ERD State

**Severity:** Medium

**What goes wrong:** Browsers enforce a 5–10 MB localStorage quota per origin. A complex ERD diagram with 20+ entity nodes, all their field lists stored in `data`, plus React Flow's `position` and `measured` metadata, plus flashcard decks and normalization progress — can collectively approach or exceed this limit. `localStorage.setItem()` throws a `QuotaExceededError` which is a synchronous exception; if not caught, the entire save silently fails and the student loses their diagram after refreshing.

**Warning signs:**
- Student reports "my ERD disappeared after I closed the tab"
- `QuotaExceededError: Failed to execute 'setItem' on 'Storage'` in console
- Diagram state resets on page refresh intermittently

**Prevention:**
- Wrap all `localStorage.setItem` calls in `try/catch` and surface an in-app warning when save fails
- Store only essential ERD data: node positions, IDs, labels, and edge connections — not React Flow's computed internal state (`measured`, `width`, `height` are re-computed by React Flow on mount and don't need persisting)
- Implement a "clear saved data" button so students can free space
- Consider storing different features (flashcards vs ERD vs progress) under separate keys with individual size checks

**Phase:** Phase that implements ERD save/load or progress persistence

---

## 8. Normalization Validation False Negatives on Semantically Equivalent Answers

**Severity:** Medium

**What goes wrong:** A student correctly normalizes a table but uses different column names (`student_id` vs `StudentID`), reorders attributes, or spells a relation name slightly differently from the expected answer. A naive string-equality check marks a correct answer as wrong, frustrating students and making the exercise useless for studying.

**Warning signs:**
- Students report "my answer is correct but the app says it's wrong"
- Validation logic uses `===` or `.toLowerCase() ===` for attribute set comparison
- No tolerance for whitespace, underscores vs spaces, or column reordering

**Prevention:**
- Normalize comparison inputs: trim, lowercase, replace separators (`_`, `-`, ` ` → all equivalent)
- Compare attribute **sets** (order-independent) not ordered arrays — use `Set` equality
- For relation schemas like `STUDENT(id, name, dept_id)`, parse out the relation name and attribute list separately, compare each with set logic
- Accept multiple valid reference answers per exercise (e.g., both `dept_id` and `department_id` as valid FK names)
- Keep the validation scoped: check structural correctness (right attributes removed to new table, FD preserved) rather than exact string match

**Phase:** Phase that implements normalization exercise validation

---

## 9. ReactFlowProvider Missing from Server Component Tree

**Severity:** Medium

**What goes wrong:** React Flow v12 (`@xyflow/react`) uses its own internal Zustand store. Any hook like `useReactFlow()`, `useNodes()`, or `useEdges()` called outside of a component that is a child of `<ReactFlowProvider>` throws "Warning: Seems like you have not used zustand provider as an ancestor." In the Next.js 15 App Router, a page component is a Server Component by default; if the ERD page attempts to use React Flow hooks at the page level without `'use client'` and proper provider wrapping, it throws at runtime.

**Warning signs:**
- "Seems like you have not used zustand provider as an ancestor" warning in console
- `useReactFlow()` hook called in a component that's not a child of `<ReactFlow>` or `<ReactFlowProvider>`
- ERD page crashes or renders empty canvas on first load

**Prevention:**
- Mark the ERD page or its primary canvas component with `'use client'`
- Wrap the entire ERD canvas component tree with `<ReactFlowProvider>` at the outermost client boundary
- Never call React Flow hooks in the same component that renders `<ReactFlow>` — create a child component for toolbar/controls that need hook access
- If an external Zustand store (for app state) is also used, ensure no version conflict between the app's Zustand and React Flow's bundled Zustand instance (check for duplicate `zustand` in `node_modules`)

**Phase:** Phase that implements the ERD drawing tool

---

## 10. OpenAI API Route Leaking Key via NEXT_PUBLIC_ Prefix

**Severity:** High (security)

**What goes wrong:** The project relies on keeping the OpenAI API key server-side for security. If a developer accidentally names the env var `NEXT_PUBLIC_OPENAI_API_KEY` (thinking it's needed for the API route), Next.js will embed it in the client-side JavaScript bundle. The key becomes publicly visible to anyone who opens DevTools → Sources.

**Warning signs:**
- Env var name starts with `NEXT_PUBLIC_`
- Key is read directly in a component file without an API route intermediary
- OpenAI key visible in browser source

**Prevention:**
- Name the variable `OPENAI_API_KEY` (no `NEXT_PUBLIC_` prefix) — it stays server-only
- Only read it inside `src/app/api/**` route handlers, never in components or client libs
- Add `server-only` package import to any utility that touches the key
- Verify: run `grep -r "NEXT_PUBLIC_OPENAI" src/` before any commit

**Phase:** Phase 1 / any phase touching the AI API route

---

## 11. React Flow Parent Container Without Explicit Dimensions

**Severity:** Low

**What goes wrong:** React Flow measures its parent DOM element to initialize the viewport. If the parent `<div>` has no explicit height (e.g., `height: auto` or is inside a flex container without `flex: 1`), React Flow renders a 0-height canvas. Nodes and edges are technically present in state but invisible. The warning "The React Flow parent container needs a width and a height" appears in console.

**Warning signs:**
- Blank canvas, no nodes visible despite state being set
- React Flow console warning about container dimensions
- Works in isolation but breaks inside a layout with `overflow: hidden`

**Prevention:**
- Give the direct React Flow wrapper `style={{ width: '100%', height: '100vh' }}` or use Tailwind `h-screen w-full`
- Avoid wrapping in a plain `<div>` without explicit sizing
- Test canvas rendering in the actual page layout (not just a standalone component), since flex/grid context affects computed height

**Phase:** Phase that implements the ERD drawing tool

---

## 12. Normalization Edge Cases in 2NF/3NF Checker (Compound Keys)

**Severity:** Low

**What goes wrong:** 2NF validation requires identifying partial functional dependencies — only meaningful when the primary key is composite. If the exercise data model assumes simple (single-column) primary keys for all sample tables, the 2NF checker may never be exercised for the real case. When a compound key table is added later, the validation logic breaks because it wasn't designed with partial dependencies in mind.

**Warning signs:**
- All sample normalization exercises use single-column PKs
- 2NF checker always passes trivially
- No test cases with tables like `ORDER_ITEM(order_id, product_id, product_name, quantity)` where `product_name → product_id` is a partial dependency

**Prevention:**
- Design at least 2 exercise scenarios with composite PKs from the start
- Make the validation data model explicit: each exercise stores `{ primaryKey: string[], nonKeyAttributes: string[], functionalDependencies: FD[] }` and the checker operates on this model
- Validate that the checker correctly identifies `product_name` as partially dependent on `product_id` alone (a subset of the PK) in test cases before shipping

**Phase:** Phase that implements normalization exercises

---

## Summary — Top 3 Highest-Severity Pitfalls

| # | Pitfall | Severity | Why It's Critical |
|---|---------|----------|-------------------|
| 1 | **Zustand + localStorage → SSR Hydration Mismatch** | High | Affects every page using persisted state; can cause silent data loss or broken renders at first load |
| 2 | **Vercel 4.5 MB Body Limit Blocking File Uploads** | High | Core feature (AI flashcards from file upload) is non-functional without mitigating this at architecture level |
| 3 | **OpenAI API Key Leaked via NEXT_PUBLIC_ Prefix** | High (security) | Exposes owner's API key to the public internet; enables unlimited OpenAI billing abuse |
