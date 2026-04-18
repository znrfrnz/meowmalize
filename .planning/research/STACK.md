# Stack Research — Infoman Reviewer

**Researched:** 2026-04-18  
**Overall confidence:** HIGH (all choices verified against live npm/official docs)

---

## Recommended Stack

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| Framework | Next.js (App Router) | 15.x | Stable, API routes keep OpenAI key server-side, native Vercel deploy, React 19 |
| Language | TypeScript | 5.x strict | Required by project; catches ERD state shape bugs at compile time |
| Styling | Tailwind CSS | v4.x | 5× faster builds, CSS-first config, zero config file, container queries built-in |
| Diagram/ERD | React Flow (`@xyflow/react`) | 12.x | Custom edge/node API enables Crow's Foot; 35.9K stars, 6M weekly installs, MIT |
| PDF + PPTX parsing | officeparser | 6.1.x | Single library handles both PDF and PPTX; AST output; ESM; browser+server |
| OpenAI | openai (official SDK) | 6.x | 18M weekly installs; Chat Completions API; server-only via Next.js API route |
| Persistence | localStorage (native) | — | No-login constraint; zero deps; serialise flashcard progress as JSON |
| Deployment | Vercel | free tier | Native Next.js deploy; no long-running server needed |
| Runtime | Node.js | 20 LTS | Required by Next.js 15 (min 18.18+), supported by all libs above |

---

## ERD Drawing Library

**Choice: React Flow (`@xyflow/react`) v12.x — CONFIDENCE: HIGH**

**Why React Flow wins:**

- **Custom edge types** are first-class citizens: `edgeTypes` prop accepts any React component as an edge renderer. Crow's Foot notation symbols (one, many, zero-or-one, etc.) are SVG markers drawn at edge endpoints — React Flow's `BaseEdge` + custom `EdgeProps` is purpose-built for this.
- **Custom node types** let each ERD entity be a fully interactive React component (table header, column list, PK/FK indicators).
- **MarkerType** API and the `<defs>` SVG injection pattern allow defining Crow's Foot SVG markers globally.
- **Save/restore** state as JSON serialises cleanly to localStorage.
- Active development: v12.10.2 released March 27, 2026; updated changelog monthly.
- MIT license, 35.9K GitHub stars, Stripe and Typeform use it in production.
- Has a dedicated Tailwind example (`/examples/styling/tailwind`).

**Alternatives considered:**

| Library | Why not |
|---------|---------|
| Konva / react-konva | Lower-level canvas API; no built-in graph/edge routing; heavy for a node-edge diagram |
| D3 | SVG imperative model clashes with React reconciler; steep learning curve for custom diagrams; no drag-drop out of box |
| Mermaid.js | Render-only, not interactive; no drag-drop; can't validate user-drawn diagrams |
| draw.io embed | External iframe, can't validate internal state; not composable with React |
| Excalidraw | Freehand-only whiteboard; no structured graph model; hard to validate topology |

**Crow's Foot implementation pattern:**

Define custom SVG `<marker>` elements for each cardinality symbol (`one`, `many`, `zero-or-one`, `one-or-many`, `zero-or-many`). Register them in a global `<defs>` block inside the `<ReactFlow>` component. Assign them to edges via custom `edgeTypes` that render an SVG path with the correct `markerStart`/`markerEnd` `url(#...)` references. Each edge carries a `data.cardinality` field (`{ source: 'one', target: 'many' }`).

---

## PDF/PPTX Parsing

**Choice: `officeparser` v6.1.x — CONFIDENCE: HIGH**

**Why officeparser:**

- Handles **both PDF and PPTX** (plus DOCX, XLSX, ODP, ODS, RTF) in a single library — no split dependency.
- v6.0.0 (Dec 2025) overhauled to rich **AST output**: `ast.toText()` returns full plain text in one call, ideal for passing to OpenAI.
- v6.1.0 (Apr 14, 2026) replaced zip extraction with `fflate` for performance; verified **browser + Vercel Edge** compatibility via ESM bundles.
- Built on `pdfjs-dist` for PDF parsing (same engine as Mozilla Firefox).
- Accepts `Buffer` or `ArrayBuffer` — works directly with Next.js `req.arrayBuffer()` in a Route Handler.
- 252K weekly downloads, actively maintained.

**Usage pattern in Next.js Route Handler:**

```ts
// app/api/parse/route.ts  (server-side only)
import { OfficeParser } from 'officeparser';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const ast = await OfficeParser.parseOffice(buffer);
  const text = ast.toText();
  // Pass `text` to OpenAI API route
  return Response.json({ text });
}
```

**Alternatives:**

| Library | Why not |
|---------|---------|
| `pdf-parse` v2.4.5 | PDF-only — needs a separate PPTX library; `officeparser` supersedes it for combined use. (Still valid fallback if PDF-only is ever needed.) |
| `pptx2json` | Abandoned (last publish 2018); no TypeScript types |
| `mammoth` | DOCX-only; no PDF/PPTX support |
| `pdfjs-dist` direct | Requires manual worker config and slide-by-slide text extraction; more boilerplate than `officeparser` which wraps it |

**Vercel serverless note:** `officeparser` uses in-memory extraction (no disk writes since v2024-10). Suitable for Vercel's ephemeral `/tmp`. The Vercel 4.5 MB uncompressed function limit is unlikely to be hit for typical lecture slides; add a 10 MB client-side file size guard.

---

## OpenAI Integration

**Choice: `openai` SDK v6.x — CONFIDENCE: HIGH**

**Version:** 6.34.0 (published April 9, 2026), 18M weekly downloads, Apache-2.0.

**Architecture — server-side only via Next.js Route Handler:**

```ts
// app/api/flashcards/route.ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // never exposed to client bundle
});

export async function POST(req: Request) {
  const { text } = await req.json();

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',            // cost-efficient for structured extraction
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a study assistant. Extract flashcards from the provided lecture text as JSON: { "flashcards": [{ "term": string, "definition": string, "type": "definition"|"enumeration" }] }',
      },
      { role: 'user', content: text },
    ],
  });

  return Response.json(JSON.parse(completion.choices[0].message.content!));
}
```

**Key decisions:**
- Use `chat.completions.create` with `response_format: { type: 'json_object' }` for structured flashcard output — more reliable than prompt-only JSON extraction.
- `gpt-4o-mini` recommended over `gpt-4o` for cost at private/classroom scale.
- API key stays in `process.env.OPENAI_API_KEY` (`.env.local`, never committed). Vercel environment variable panel for production.
- Do **not** set `dangerouslyAllowBrowser: true` — API key must stay server-side per project constraints.
- The new Responses API (`client.responses.create`) is the emerging standard but Chat Completions is stable indefinitely and better documented for structured JSON output today.

---

## Normalization Exercises

**Choice: Custom React state machine — no specialized library**

No npm library exists for interactive UNF→3NF normalization exercises. The implementation is:

- Encode each exercise as a JSON data structure: `{ table, functionalDependencies, expectedSteps: { unf, onf, twonf, thnf } }`
- A React reducer handles step transitions and validates user answers
- Comparison logic: normalize column sets to sorted arrays, compare as sets
- Store exercise progress in localStorage as `{ exerciseId, currentStep, attempts }`

This is ~200 lines of TypeScript; no library adds value here.

---

## What NOT to Use

| Library | Reason to Avoid |
|---------|----------------|
| **Mermaid.js** | Static render only; cannot validate user-drawn ERDs; no programmatic node/edge state |
| **Konva / react-konva** | Canvas-based; no built-in graph routing; Crow's Foot would require full custom path math |
| **Pages Router** | Deprecated path; App Router is the 2025+ standard; Server Components simplify API key isolation |
| **Tailwind CSS v3** | v4 released Jan 2025 with 5× faster builds and CSS-first config; no reason to use v3 for new projects |
| **pptx2json** | Last published 2018, unmaintained, no TypeScript |
| **mammoth** | DOCX-only; irrelevant to PDF/PPTX requirement |
| **pdf2json** | Memory leaks documented in `pdf-parse` comparison; avoid |
| **Client-side OpenAI calls** | Exposes API key in browser — explicitly forbidden by project constraints |
| **`openai` with `dangerouslyAllowBrowser: true`** | Security violation per project V-SECRET rule |
| **D3.js for ERD** | Imperative SVG manipulation; poor React reconciler integration; React Flow already wraps the hard parts |
| **Auth libraries (NextAuth, etc.)** | Out of scope — no login per project spec |
| **Database (Prisma, Supabase, etc.)** | Out of scope — localStorage only per project spec |

---

## Confidence

**Overall: HIGH**

All library versions verified against live npm registry (April 18, 2026):

| Area | Confidence | Source |
|------|------------|--------|
| Next.js 15 App Router | HIGH | nextjs.org/blog/next-15 (official) |
| React Flow v12 for ERD | HIGH | reactflow.dev (official) + npm |
| officeparser v6.1 for PDF/PPTX | HIGH | npmjs.com/package/officeparser |
| openai SDK v6.34 | HIGH | npmjs.com/package/openai |
| Tailwind CSS v4 | HIGH | tailwindcss.com/blog/tailwindcss-v4 (official) |
| Custom state machine for normalization | HIGH | Domain knowledge; no library exists |

**Open questions:**
1. **Vercel function size limit**: `officeparser` bundles `pdfjs-dist`. Verify the compiled function stays under Vercel's 50 MB compressed limit (very likely fine, but worth a `next build` check).
2. **React Flow Pro features**: Undo/redo (`/examples/interaction/undo-redo`) and freehand draw are Pro-only. For exercise validation, the free tier is sufficient. For a polished "free draw" mode, implement a custom undo stack via `useNodesState`/`useEdgesState` snapshots.
3. **`gpt-4o-mini` JSON reliability**: For complex slides, consider using the `zod` schema + `zodResponseFormat` helper from the openai SDK v6 for stricter output parsing.
