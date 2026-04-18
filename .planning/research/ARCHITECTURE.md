# Architecture Research — Infoman Reviewer

**Researched:** 2026-04-18
**Confidence:** HIGH — derived from verified STACK.md + FEATURES.md + Next.js App Router patterns

---

## App Structure

### Route Tree

```
app/
├── layout.tsx                    # Root layout: global nav, Tailwind base, store hydration guard
├── page.tsx                      # Home — module cards (Flashcards / Normalization / ERD)
│
├── api/                          # SERVER-ONLY — never imported by client
│   ├── parse/
│   │   └── route.ts              # POST: multipart file → officeparser → { text: string }
│   └── flashcards/
│       └── route.ts              # POST: { text } → OpenAI → { flashcards: Flashcard[] }
│
├── flashcards/
│   ├── page.tsx                  # Deck list + "Generate new" CTA + progress summary
│   ├── generate/
│   │   └── page.tsx              # Upload/paste → parse → AI review → save to store
│   └── [deckId]/
│       └── page.tsx              # Active study session (flip, known/unknown, keyboard nav)
│
├── normalization/
│   ├── page.tsx                  # Exercise list with completion badges
│   └── [exerciseId]/
│       └── page.tsx              # Step wizard: UNF → 1NF → 2NF → 3NF
│
└── erd/
    ├── page.tsx                  # Mode selector: Free Draw or Exercise list
    ├── draw/
    │   └── page.tsx              # Blank canvas — free ERD drawing, saveable to localStorage
    └── [exerciseId]/
        └── page.tsx              # Exercise mode — pre-built scenario, student validates
```

### API Route Responsibilities

| Route | Method | Input | Output | Auth |
|-------|--------|-------|--------|------|
| `/api/parse` | POST | `FormData` (file: PDF or PPTX) | `{ text: string }` | None (internal use) |
| `/api/flashcards` | POST | `{ text: string }` | `{ flashcards: Flashcard[] }` | None (internal use) |

Both routes are server-only. The OpenAI key is read from `process.env.OPENAI_API_KEY` — never exported to any client bundle.

---

## Key Components

### Layout / Shell

| Component | File | Responsibility |
|-----------|------|----------------|
| `RootLayout` | `app/layout.tsx` | Global HTML shell, nav bar, localStorage hydration fence |
| `ModuleNav` | `components/ModuleNav.tsx` | Top navigation: Home / Flashcards / Normalization / ERD |
| `HomePage` | `app/page.tsx` | Three module cards with progress rings; entry point |

### Flashcard Module

| Component | File | Responsibility |
|-----------|------|----------------|
| `DeckListPage` | `app/flashcards/page.tsx` | Lists all decks, completion %, "Generate new" button |
| `GeneratePage` | `app/flashcards/generate/page.tsx` | Orchestrates upload → parse → generate → review flow |
| `FileUploadZone` | `components/flashcards/FileUploadZone.tsx` | Drag-drop + click-to-browse for PDF/PPTX; 10 MB guard |
| `TextPasteInput` | `components/flashcards/TextPasteInput.tsx` | Textarea fallback for raw text input |
| `GenerateButton` | `components/flashcards/GenerateButton.tsx` | Triggers API call; shows loading state |
| `FlashcardReview` | `components/flashcards/FlashcardReview.tsx` | Grid of generated cards; inline edit, accept, reject per card |
| `StudySession` | `app/flashcards/[deckId]/page.tsx` | Session container: shuffle, keyboard nav, completion screen |
| `FlashcardCard` | `components/flashcards/FlashcardCard.tsx` | Single card; CSS 3D flip animation; type badge (definition/enumeration) |
| `SessionProgress` | `components/flashcards/SessionProgress.tsx` | "Card 4 of 20" + known/still-learning counters |
| `SessionComplete` | `components/flashcards/SessionComplete.tsx` | End-of-session summary; restart / exit buttons |

### Normalization Module

| Component | File | Responsibility |
|-----------|------|----------------|
| `ExerciseListPage` | `app/normalization/page.tsx` | Exercise cards with step completion indicators |
| `NormalizationWizard` | `app/normalization/[exerciseId]/page.tsx` | Root container; drives step machine |
| `StepIndicator` | `components/norm/StepIndicator.tsx` | Breadcrumb: UNF → 1NF → 2NF → 3NF with completion states |
| `NormRuleCard` | `components/norm/NormRuleCard.tsx` | Contextual rule box for current step (e.g., "1NF: No repeating groups") |
| `TableDisplay` | `components/norm/TableDisplay.tsx` | Read-only table renderer; used for UNF source and expected answers |
| `TableBuilder` | `components/norm/TableBuilder.tsx` | Student input: define column names, mark PKs, enter data rows |
| `FDList` | `components/norm/FDList.tsx` | Lists functional dependencies (e.g., StudentID → Name, Major) |
| `ValidationResult` | `components/norm/ValidationResult.tsx` | Pass/fail feedback with diff between student answer and expected |
| `HintPanel` | `components/norm/HintPanel.tsx` | Progressive hint disclosure; reveals on demand |

### ERD Module

| Component | File | Responsibility |
|-----------|------|----------------|
| `ERDModePage` | `app/erd/page.tsx` | Mode selector: Free Draw vs Exercise list |
| `ERDCanvas` | `components/erd/ERDCanvas.tsx` | React Flow wrapper; registers custom node/edge types; manages viewport |
| `EntityNode` | `components/erd/EntityNode.tsx` | Custom RF node: entity name header + attribute list with role badges (PK/FK/attr) |
| `CrowsFootEdge` | `components/erd/CrowsFootEdge.tsx` | Custom RF edge: SVG path with Crow's Foot markers at both ends; label |
| `CardinalityPicker` | `components/erd/CardinalityPicker.tsx` | Dropdown for selecting cardinality on each end of a new edge |
| `ERDToolbar` | `components/erd/ERDToolbar.tsx` | Add entity, add relationship, undo, redo, clear, export PNG |
| `NotationLegend` | `components/erd/NotationLegend.tsx` | Always-visible Crow's Foot symbol reference card |
| `ERDExercisePage` | `app/erd/[exerciseId]/page.tsx` | Exercise mode: scenario text + canvas + validate button |
| `ValidationDiff` | `components/erd/ValidationDiff.tsx` | Side-by-side: student diagram vs reference, mismatches highlighted |

### Shared / Utility

| Component | File | Responsibility |
|-----------|------|----------------|
| `ProgressRing` | `components/shared/ProgressRing.tsx` | SVG circular progress indicator for module completion |
| `ErrorBanner` | `components/shared/ErrorBanner.tsx` | Inline error display (API failures, parse errors) |
| `LoadingSpinner` | `components/shared/LoadingSpinner.tsx` | Generic loading state |
| `StorageHydration` | `components/shared/StorageHydration.tsx` | Prevents localStorage hydration mismatch on SSR (renders children only after mount) |

---

## Data Flow

### Flow 1 — File Upload → AI Generation → Save to Deck

```
User selects PDF/PPTX
        │
        ▼
FileUploadZone (client)
  • Validates file type and size (≤ 10 MB)
  • Creates FormData
        │
        ▼
POST /api/parse  (server Route Handler)
  • req.formData() → file as Buffer
  • officeparser.parseOffice(buffer).toText()
  • Returns { text: string }
        │  (text never stored server-side — ephemeral)
        ▼
GeneratePage (client) receives text
  • Shows "Parsed X characters. Generating flashcards..."
        │
        ▼
POST /api/flashcards  (server Route Handler)
  • Receives { text }
  • Calls OpenAI chat.completions with response_format: json_object
  • Returns { flashcards: Flashcard[] }
        │
        ▼
FlashcardReview (client)
  • Displays generated cards in editable grid
  • User edits terms/definitions inline
  • User accepts or rejects individual cards
        │
        ▼
"Save to Deck" button
  • useFlashcardStore.addDeck({ id, title, cards: accepted })
  • Zustand persist middleware writes to localStorage key: infoman:flashcards
        │
        ▼
Redirect → /flashcards/[deckId]  (study session)
```

### Flow 2 — Normalization Exercise Attempt

```
User opens /normalization/[exerciseId]
        │
        ▼
NormalizationWizard
  • Reads exercise definition from EXERCISES constant (static data file)
  • Reads progress from useNormalizationStore (localStorage)
  • Determines current step (UNF → 1NF → 2NF → 3NF)
        │
        ▼
At each step:
  TableDisplay shows source table
  NormRuleCard shows current NF rule
  TableBuilder collects student's answer
        │
        ▼
"Check Answer" click
  • validateStep(studentTables, exercise.steps[currentStep].expectedTables)
    → Column set comparison (sorted, case-insensitive)
    → Table count check
    → PK identification check
    → FD violation check (for 2NF/3NF)
  • Returns { correct: boolean, feedback: string, diff: Diff[] }
        │
  ┌─────┴──────┐
  │ PASS        │ FAIL
  ▼             ▼
Advance step  ValidationResult shows diff
Mark step     HintPanel available
complete      Increment attempt counter
  │             │
  └──────┬──────┘
         ▼
  useNormalizationStore.saveProgress(...)
  → Persisted to localStorage key: infoman:normalization
```

### Flow 3 — ERD Exercise Attempt

```
User opens /erd/[exerciseId]
        │
        ▼
ERDExercisePage
  • Loads exercise (scenario, optional seed entities) from EXERCISES constant
  • Restores student diagram from useERDStore if partially saved
        │
        ▼
ERDCanvas active editing
  • EntityNode: click to add attributes, rename, mark PK/FK
  • CrowsFootEdge: connect two entities, pick cardinality at each end
  • All edits → useERDStore.updateDiagram(nodes, edges)
  • Undo/redo via zundo temporal middleware snapshot
  • Auto-save to localStorage on every state change
        │
        ▼
"Validate" button click
  • compareERD(studentDiagram, exercise.referenceAnswer)
    → Entity name match (case-insensitive)
    → Relationship topology match (source/target entity pair)
    → Cardinality match at each edge end
  • Returns { score, missingEntities, wrongCardinalities, extraRelationships }
        │
        ▼
ValidationDiff
  • Side-by-side view: student diagram vs reference
  • Mismatched edges highlighted in red
  • Missing entities shown in reference panel
```

### Flow 4 — Progress Persistence (cross-session)

```
Any store mutation (markKnown, saveProgress, updateDiagram)
        │
        ▼
Zustand persist middleware
  • Serialises store slice to JSON
  • Writes to window.localStorage under namespaced key
        │
        ▼
On next page load:
  StorageHydration component (mounted = true guard)
  • Prevents SSR/CSR mismatch
  • Zustand rehydrates from localStorage before first render
```

---

## Data Models

### Flashcard

```typescript
type CardType = 'definition' | 'enumeration';

interface Flashcard {
  id: string;                  // crypto.randomUUID()
  type: CardType;
  term: string;
  definition: string;          // used when type === 'definition'
  items?: string[];            // ordered list when type === 'enumeration'
  sourceExcerpt?: string;      // original text chunk from parsed file
}

interface FlashcardDeck {
  id: string;                  // crypto.randomUUID()
  title: string;               // filename or user-set title
  createdAt: string;           // ISO 8601
  cards: Flashcard[];
}

// Persisted in: infoman:flashcards
interface FlashcardStoreState {
  decks: FlashcardDeck[];
  progress: Record<string, {   // keyed by deckId
    known: string[];           // card IDs (Set serialises as array in JSON)
    stillLearning: string[];
    lastStudied: string;       // ISO 8601
  }>;
}
```

### Normalization Exercise

```typescript
type NormalForm = 'UNF' | '1NF' | '2NF' | '3NF';

interface NormColumn {
  name: string;
  isPK: boolean;
  isFK: boolean;
  // UNF can have multi-valued cells (repeating groups)
  isRepeatingGroup?: boolean;
}

interface NormTable {
  name: string;
  columns: NormColumn[];
  // Sample rows shown in the UNF display (strings or string[] for repeating groups)
  sampleRows?: Record<string, string | string[]>[];
}

interface FunctionalDependency {
  determinants: string[];      // e.g., ['StudentID', 'CourseID']
  dependents: string[];        // e.g., ['Grade']
  label?: string;              // e.g., 'Partial dependency'
}

interface NormalizationStep {
  targetForm: NormalForm;
  instruction: string;         // "Eliminate repeating groups..."
  rule: string;                // Short rule shown in NormRuleCard
  hint?: string;
  expectedTables: NormTable[]; // The correct answer for validation
  explanation: string;         // Shown after failure: why the expected answer is correct
}

// Static data file — not persisted (exercises are fixed content)
interface NormalizationExercise {
  id: string;                  // e.g., 'student-enrollment'
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceTable: NormTable;      // The UNF starting point
  functionalDependencies: FunctionalDependency[];
  steps: NormalizationStep[];  // Always length 3: [1NF, 2NF, 3NF]
}

// Persisted in: infoman:normalization
interface NormalizationStoreState {
  progress: Record<string, {   // keyed by exerciseId
    currentStep: NormalForm;
    completedSteps: NormalForm[];
    attempts: Partial<Record<NormalForm, number>>;
    completed: boolean;
    completedAt?: string;
  }>;
}
```

**Validation logic note:** Answer comparison normalises column names (trim, lowercase), sorts column arrays, and compares as sets. Table names are compared case-insensitively. PK designation is checked. For 2NF: partial dependencies detected. For 3NF: transitive dependencies detected. Partial-credit feedback isolates which check failed.

### ERD Exercise

```typescript
type Cardinality = 'one-mandatory' | 'one-optional' | 'many-mandatory' | 'many-optional';

// Matches React Flow Node data shape
interface ERDEntityData {
  name: string;
  attributes: {
    id: string;
    name: string;
    role: 'pk' | 'fk' | 'attribute';
  }[];
}

// Matches React Flow Edge data shape
interface ERDRelationshipData {
  label: string;
  sourceCardinality: Cardinality;
  targetCardinality: Cardinality;
}

// ERD diagram = React Flow graph state
interface ERDDiagram {
  nodes: Node<ERDEntityData>[];    // @xyflow/react Node type
  edges: Edge<ERDRelationshipData>[];  // @xyflow/react Edge type
}

// Static data file — not persisted
interface ERDExercise {
  id: string;                  // e.g., 'library-system'
  title: string;
  scenario: string;            // Business problem description shown to student
  difficulty: 'easy' | 'medium' | 'hard';
  seedEntities?: ERDEntityData[]; // Optional: pre-placed entities student cannot remove
  referenceAnswer: ERDDiagram;  // Hidden until validation
  hints?: string[];
}

// Persisted in: infoman:erd
interface ERDStoreState {
  // Free draw canvases: keyed by a user-named save slot or 'default'
  savedDiagrams: Record<string, ERDDiagram & { title: string; savedAt: string }>;
  // Per-exercise student work
  exerciseProgress: Record<string, {  // keyed by exerciseId
    studentDiagram: ERDDiagram;
    validated: boolean;
    lastScore?: {
      entitiesCorrect: number;
      entitiesTotal: number;
      relationshipsCorrect: number;
      relationshipsTotal: number;
    };
  }>;
}
```

**Crow's Foot SVG markers:** Defined as `<defs>` inside the React Flow SVG root. Five marker IDs: `cf-one-mandatory`, `cf-one-optional`, `cf-many-mandatory`, `cf-many-optional`. `CrowsFootEdge` references them via `markerStart={url(#...)}` / `markerEnd={url(#...)}`. Edge `data.sourceCardinality` and `data.targetCardinality` determine which marker IDs to apply.

### Progress / State

```typescript
// Top-level localStorage key namespace: 'infoman:'
const STORAGE_KEYS = {
  FLASHCARDS:     'infoman:flashcards',    // FlashcardStoreState
  NORMALIZATION:  'infoman:normalization', // NormalizationStoreState
  ERD:            'infoman:erd',           // ERDStoreState
} as const;

// Home page derives overall progress from the three stores:
interface ModuleProgress {
  flashcards: {
    totalDecks: number;
    totalCards: number;
    knownCards: number;
  };
  normalization: {
    totalExercises: number;
    completedExercises: number;
  };
  erd: {
    totalExercises: number;
    completedExercises: number;
  };
}
```

---

## State Management

**Recommendation: Zustand 5 with `persist` middleware + `zundo` for ERD undo/redo**

### Three Isolated Stores

```typescript
// stores/flashcardStore.ts
export const useFlashcardStore = create<FlashcardStoreState>()(
  persist(
    (set, get) => ({
      decks: [],
      progress: {},
      addDeck: (deck) => set((s) => ({ decks: [...s.decks, deck] })),
      markKnown: (deckId, cardId) => set((s) => ({ ... })),
      resetProgress: (deckId) => set((s) => ({ ... })),
    }),
    { name: STORAGE_KEYS.FLASHCARDS }
  )
)

// stores/normalizationStore.ts
export const useNormalizationStore = create<NormalizationStoreState>()(
  persist(
    (set) => ({ progress: {}, saveProgress: (...) => set(...) }),
    { name: STORAGE_KEYS.NORMALIZATION }
  )
)

// stores/erdStore.ts — uses zundo for undo/redo
export const useERDStore = createWithEqualityFn<ERDStoreState>()(
  temporal(
    persist(
      (set) => ({ ... }),
      { name: STORAGE_KEYS.ERD }
    )
  )
)
```

### Why Zustand Over Alternatives

| Option | Why Not |
|--------|---------|
| React Context | Re-renders entire subtree on any change — fatal for ERD canvas with 20+ nodes |
| TanStack Query | Designed for server cache invalidation; overkill for localStorage-only app |
| Jotai atoms | Fine alternative, but Zustand's `persist` + `zundo` combo is better tested for this pattern |
| URL state | Good supplement for exercise ID routing (already handled by Next.js dynamic segments); not suitable for diagram state |
| Redux Toolkit | Too much boilerplate for a focused single-user app |

### SSR Hydration Guard

Zustand `persist` runs only in the browser. Wrap any component that reads store state in a `mounted` guard to prevent SSR/CSR mismatch:

```typescript
// components/shared/StorageHydration.tsx
'use client'
export function StorageHydration({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null  // or a skeleton
  return <>{children}</>
}
```

Apply this wrapper to pages that read from localStorage stores (flashcards deck list, exercise list with progress badges).

---

## Build Order

Build sequence optimised for earliest working learning loop and lowest dependency risk.

### Phase 1 — Project Scaffold
**Deliverable:** Deployed blank Next.js app on Vercel

- Init Next.js 15 + TypeScript strict + Tailwind 4 + ESLint
- Configure `tsconfig.json` paths (`@/` alias)
- Create `/health` route returning `{ status: 'ok' }`
- Push to GitHub, connect Vercel, confirm CI/CD pipeline
- Add `.env.local` with `OPENAI_API_KEY` placeholder

**Why first:** No code is safe until CI/CD is verified. Catches Vercel config issues early.

---

### Phase 2 — Flashcard Study UI (static data)
**Deliverable:** Flip-card study session with hardcoded deck

- `FlashcardCard` with CSS 3D flip animation
- `StudySession` with shuffle, known/unknown marking, keyboard nav
- `FlashcardStoreState` + Zustand persist (localStorage)
- `StorageHydration` guard
- `/flashcards` deck list page
- `/flashcards/[deckId]` study session page
- Session completion screen

**Why second:** This is the core value prop. Static data removes API dependency — validates UX before touching the server. Produces the first learning-loop moment.

---

### Phase 3 — AI Flashcard Generation
**Deliverable:** Upload PDF/PPTX → get flashcards → study them

- `POST /api/parse` route (officeparser)
- `POST /api/flashcards` route (openai SDK)
- `FileUploadZone` + `TextPasteInput`
- `FlashcardReview` (edit/accept/reject generated cards)
- Wire `generate/page.tsx` end-to-end
- 10 MB file size guard, error states, loading indicator

**Why third:** Phase 2 provides the consumer of generated flashcards — Phase 3 has something to plug into immediately. Validates the full upload → study loop.

---

### Phase 4 — Normalization Exercises
**Deliverable:** 3 working exercises: UNF → 1NF → 2NF → 3NF with validation

- `NormalizationExercise` data model + 3 pre-built exercise data files
- `NormalizationStoreState` + persist
- `NormalizationWizard` step machine
- `TableDisplay` + `TableBuilder` + `FDList` components
- `validateStep()` comparison function
- `ValidationResult` with diff display
- `HintPanel`

**Why fourth:** Self-contained module with no external API dependency. Exercises the "pre-built content + validation" pattern that ERD exercises will also use.

---

### Phase 5 — ERD Free Draw
**Deliverable:** Functional Crow's Foot ERD drawing tool with save/load

- React Flow integration + custom `EntityNode` + custom `CrowsFootEdge`
- Crow's Foot SVG marker `<defs>` (5 markers)
- `CardinalityPicker` in edge creation flow
- `ERDToolbar`: add entity, add relationship, undo, redo, clear
- `ERDStoreState` + zundo temporal middleware (undo/redo)
- `NotationLegend` always-visible sidebar
- Save / load diagrams in localStorage
- Export as PNG (React Flow's `getViewportAsImage` or `html2canvas`)

**Why fifth:** The drawing tool is the foundation. ERD exercises (Phase 6) layer a validation mode on top of the same canvas.

---

### Phase 6 — ERD Exercises
**Deliverable:** 3 pre-built ERD exercises with validation

- 3 pre-built `ERDExercise` data files (with `referenceAnswer`)
- `ERDExercisePage` with scenario text + canvas + validate button
- `compareERD()` validation function
- `ValidationDiff` side-by-side view
- `ERDStoreState` exercise progress slots

**Why sixth:** Depends on Phase 5's canvas being solid. Reuses all drawing components — only adds the exercise wrapper and validator.

---

### Phase 7 — Home Dashboard + Polish
**Deliverable:** Polished home page with module progress + UX improvements

- Home page `ProgressRing` per module
- Cross-module progress derivation from all three stores
- Progress reset per module
- Keyboard navigation audit
- Mobile responsive pass
- Error boundary wrappers on all pages

**Why last:** Polish has no blockers but benefits from all modules being complete to see the full state surface.

---

## Dependency Map

```
Phase 1 (scaffold)
    └── Phase 2 (flashcard UI)
            └── Phase 3 (AI generation)       [needs card viewer from P2]
    └── Phase 4 (normalization)               [independent; uses P1 scaffold only]
    └── Phase 5 (ERD free draw)
            └── Phase 6 (ERD exercises)       [needs canvas from P5]

Phase 7 (polish) → depends on P2, P4, P5 all complete
```

Phases 3, 4, and 5 can be parallelised if multiple people are working. For a solo build, the order above (2→3→4→5→6→7) is optimal.
