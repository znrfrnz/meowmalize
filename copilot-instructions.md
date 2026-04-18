<!-- GSD:project-start source:PROJECT.md -->
## Project

**Infoman Reviewer**

A browser-based reviewer web app for an Information Management subject. Students can study definitions and enumerations through AI-generated flashcards, practice database normalization (UNF → 3NF) through interactive exercises, and build or solve ERD diagrams using Crow's Foot notation — all without logging in.

**Core Value:** A student should be able to upload their lecture slides and immediately get interactive, self-checking practice exercises for every major IM concept.

### Constraints

- **Security**: API key must stay server-side — Next.js API routes act as a proxy to OpenAI
- **Auth**: None — fully public, no login
- **Scope**: IM subject only — normalization stops at 3NF, ERD uses Crow's Foot notation
- **Persistence**: localStorage only — no database, no backend data storage
- **Deployment**: Vercel free tier — no long-running servers, serverless functions only
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
## ERD Drawing Library
- **Custom edge types** are first-class citizens: `edgeTypes` prop accepts any React component as an edge renderer. Crow's Foot notation symbols (one, many, zero-or-one, etc.) are SVG markers drawn at edge endpoints — React Flow's `BaseEdge` + custom `EdgeProps` is purpose-built for this.
- **Custom node types** let each ERD entity be a fully interactive React component (table header, column list, PK/FK indicators).
- **MarkerType** API and the `<defs>` SVG injection pattern allow defining Crow's Foot SVG markers globally.
- **Save/restore** state as JSON serialises cleanly to localStorage.
- Active development: v12.10.2 released March 27, 2026; updated changelog monthly.
- MIT license, 35.9K GitHub stars, Stripe and Typeform use it in production.
- Has a dedicated Tailwind example (`/examples/styling/tailwind`).
| Library | Why not |
|---------|---------|
| Konva / react-konva | Lower-level canvas API; no built-in graph/edge routing; heavy for a node-edge diagram |
| D3 | SVG imperative model clashes with React reconciler; steep learning curve for custom diagrams; no drag-drop out of box |
| Mermaid.js | Render-only, not interactive; no drag-drop; can't validate user-drawn diagrams |
| draw.io embed | External iframe, can't validate internal state; not composable with React |
| Excalidraw | Freehand-only whiteboard; no structured graph model; hard to validate topology |
## PDF/PPTX Parsing
- Handles **both PDF and PPTX** (plus DOCX, XLSX, ODP, ODS, RTF) in a single library — no split dependency.
- v6.0.0 (Dec 2025) overhauled to rich **AST output**: `ast.toText()` returns full plain text in one call, ideal for passing to OpenAI.
- v6.1.0 (Apr 14, 2026) replaced zip extraction with `fflate` for performance; verified **browser + Vercel Edge** compatibility via ESM bundles.
- Built on `pdfjs-dist` for PDF parsing (same engine as Mozilla Firefox).
- Accepts `Buffer` or `ArrayBuffer` — works directly with Next.js `req.arrayBuffer()` in a Route Handler.
- 252K weekly downloads, actively maintained.
| Library | Why not |
|---------|---------|
| `pdf-parse` v2.4.5 | PDF-only — needs a separate PPTX library; `officeparser` supersedes it for combined use. (Still valid fallback if PDF-only is ever needed.) |
| `pptx2json` | Abandoned (last publish 2018); no TypeScript types |
| `mammoth` | DOCX-only; no PDF/PPTX support |
| `pdfjs-dist` direct | Requires manual worker config and slide-by-slide text extraction; more boilerplate than `officeparser` which wraps it |
## OpenAI Integration
- Use `chat.completions.create` with `response_format: { type: 'json_object' }` for structured flashcard output — more reliable than prompt-only JSON extraction.
- `gpt-4o-mini` recommended over `gpt-4o` for cost at private/classroom scale.
- API key stays in `process.env.OPENAI_API_KEY` (`.env.local`, never committed). Vercel environment variable panel for production.
- Do **not** set `dangerouslyAllowBrowser: true` — API key must stay server-side per project constraints.
- The new Responses API (`client.responses.create`) is the emerging standard but Chat Completions is stable indefinitely and better documented for structured JSON output today.
## Normalization Exercises
- Encode each exercise as a JSON data structure: `{ table, functionalDependencies, expectedSteps: { unf, onf, twonf, thnf } }`
- A React reducer handles step transitions and validates user answers
- Comparison logic: normalize column sets to sorted arrays, compare as sets
- Store exercise progress in localStorage as `{ exerciseId, currentStep, attempts }`
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
## Confidence
| Area | Confidence | Source |
|------|------------|--------|
| Next.js 15 App Router | HIGH | nextjs.org/blog/next-15 (official) |
| React Flow v12 for ERD | HIGH | reactflow.dev (official) + npm |
| officeparser v6.1 for PDF/PPTX | HIGH | npmjs.com/package/officeparser |
| openai SDK v6.34 | HIGH | npmjs.com/package/openai |
| Tailwind CSS v4 | HIGH | tailwindcss.com/blog/tailwindcss-v4 (official) |
| Custom state machine for normalization | HIGH | Domain knowledge; no library exists |
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.github/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
