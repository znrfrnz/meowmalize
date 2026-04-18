# Features Research — Infoman Reviewer

**Domain:** Subject-specific educational reviewer (Information Management)
**Researched:** 2026-04-18
**Reference apps:** Quizlet, Gizmo (gizmo.ai), Anki, Khan Academy, dbdiagram.io, normalization teaching tools
**Overall confidence:** HIGH (training data + live app research)

---

## Flashcard Module

### Table Stakes

Features that every student expects from a flashcard tool. Missing any = product feels broken.

| Feature | Why Expected | Complexity |
|---------|--------------|------------|
| Flip animation (front → back) | Core mental model from physical flashcards; Quizlet/Gizmo/Anki all do this | Low |
| Term on front, definition/answer on back | Universal flashcard pattern | Low |
| Shuffle / randomize order | Prevents order-dependent memorization; Quizlet default | Low |
| Mark card as "Know it" / "Still learning" | Lets students skip mastered cards; fundamental sorting mechanism | Low |
| Keyboard navigation (arrow keys, space to flip) | Power users expect this; Quizlet supports it | Low |
| Progress indicator within a session (e.g., "Card 4 of 20") | Orientation; reduces anxiety about session length | Low |
| Session completion screen ("You've reviewed all cards") | Clear stopping point; positive reinforcement | Low |
| Restart / reshuffle deck | Students review multiple times in one sitting | Low |

### Differentiators

Features specific to this app's IM context that set it apart from generic flashcard tools.

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| Two distinct card types: **Definition** vs **Enumeration** | IM exams mix "what is X?" questions with "list the 5 steps of Y" — these require different recall strategies; no general-purpose app models this distinction | Medium |
| Enumeration cards show item count as hint ("List 4 items") | Tells students how many items to recall before revealing answer; matches exam format | Low |
| Visual badge/color indicator per card type (e.g., blue = definition, orange = enumeration) | Quick visual scanning of deck composition before studying | Low |
| Ordered enumeration answers (numbered list on back) | Enumeration answers in IM are often sequentially ordered (normalization steps, SDLC phases) — order matters | Low |
| Filter deck by card type (study only definitions, or only enumerations) | Targeted study sessions for weak areas | Low |

### Anti-Features

Deliberately excluded to keep scope tight and avoid overengineering.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Spaced repetition algorithm (SM-2 / FSRS) | Requires per-card scheduling state and date tracking; heavy localStorage footprint; overkill for a semester reviewer | Simple known/unknown split is sufficient |
| Rich media on cards (images, audio) | IM flashcards are text-based; adds upload/storage complexity | Text-only with clean typography |
| Public deck sharing / social features | This is a private class tool, not a platform | No sharing; content is pre-loaded |
| Streak tracking / gamification badges | Requires persistent session history and user identity; no accounts in scope | Show simple session summary instead |
| "Write the answer" typed input mode | Adds validation complexity; IM definitions are long-form, hard to auto-grade | Flip-and-self-assess is the right UX |
| Multiple study modes (match game, spelling test) | Quizlet feature bloat; distraction for a focused reviewer | One mode done well (flip cards) |

---

## Normalization Simulator

### Table Stakes

Standard features expected from any database normalization teaching tool.

| Feature | Why Expected | Complexity |
|---------|--------------|------------|
| Display starting unnormalized table (UNF) with sample data rows | Students need concrete data to work with, not abstract rules | Low |
| Step-by-step wizard: UNF → 1NF → 2NF → 3NF | Normalization is sequential; each normal form builds on the last; Khan Academy, textbooks, and tutorials all use this pattern | Medium |
| Input fields to enter the normalized result at each step | Active recall beats passive reading; students must construct the answer | Medium |
| Validate student answer against expected result | Immediate feedback is the core value; without it, this is just a display | High |
| Show correct answer on failure | Students need to see what "right" looks like to learn | Low |
| Explain WHY an answer is wrong | "Wrong" with no explanation teaches nothing | Medium |
| Indicate which step the student is currently on | Orientation within a multi-step workflow | Low |
| Allow revising the previous step before continuing | Students make mistakes; blocking them creates frustration | Medium |

### Differentiators

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| Highlight violating cells in the UNF table | Visually show which attributes/rows break the current normal form rule before the student attempts the fix; no existing tool does this well | High |
| Contextual rule card at each step ("1NF Rule: No repeating groups, atomic values only") | Students don't memorize rules between steps; inline reference reduces friction | Low |
| Partial step validation ("Your table structure is correct but you missed a functional dependency") | Better than binary pass/fail; guides students toward the right answer | High |
| Pre-built exercises modeled on past IM exam question styles | Generic normalization tools use invented schemas; IM-specific schemas (student records, library tables) are more relevant | Medium |
| Step-level hints ("Hint: Look at the StudentName column — is it a repeating group?") | Progressive disclosure of help without giving away the answer | Medium |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| 4NF, 5NF, BCNF exercises | Explicitly out of scope per PROJECT.md; adds cognitive load | Hard-stop at 3NF |
| Free-form SQL DDL input for answers | Obscures normalization learning behind SQL syntax; students debug SQL instead of learning normalization | Structured table builder UI instead |
| Drag-and-drop column reassignment as primary answer mechanism | Fun but imprecise; doesn't match exam format where students write tables on paper | Text-based table input with labeled columns |
| Multiple schemas open simultaneously | Confusing; normalization requires focused attention on one schema at a time | One exercise at a time |

---

## ERD Simulator

### Crow's Foot Notation

Crow's Foot uses line-end markers to express cardinality and participation. Required symbols:

| Symbol Name | Meaning | Marker Shape |
|-------------|---------|--------------|
| One (mandatory) | Exactly one | Single vertical bar |
| One (optional) | Zero or one | Circle + single bar |
| Many (mandatory) | One or more | Single bar + crow's foot |
| Many (optional) | Zero or more | Circle + crow's foot |

All relationship lines carry a marker at **both ends** (source cardinality + target cardinality).

### Table Stakes

| Feature | Why Expected | Complexity |
|---------|--------------|------------|
| Create entity boxes (table name + attribute list) | Basic ERD node; all diagramming tools provide this | Medium |
| Draw relationships between entities | Core ERD action | Medium |
| Assign Crow's Foot cardinality markers to each end of a relationship | Notation-specific; without this, it's not a Crow's Foot ERD tool | High |
| Label relationships (e.g., "enrolls in", "teaches") | Textbooks require relationship labels; standard in academic ERDs | Low |
| Pan and zoom the canvas | Essential for larger diagrams; React Flow provides this out of the box | Low |
| Select, move, and delete entities and relationships | Basic editing; all diagram tools do this | Low |
| Undo / redo | Students make mistakes; Ctrl+Z is muscle memory | Medium |
| Clear canvas / reset exercise | Start over without refreshing the page | Low |

### Differentiators

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| Pre-built ERD exercises: student builds the diagram, then validates against reference answer | Transforms free-draw into a self-checking exercise; unique to this tool in the classroom context | High |
| Diff view on validation: show student diagram vs reference side-by-side with mismatches highlighted | Students see exactly what they missed; more useful than pass/fail | High |
| Crow's Foot symbol picker in the edge creation UI (dropdown: one/many/optional/mandatory) | Explicit affordance for correct notation; students don't have to remember shortcut keys | Medium |
| Attribute type labels on entities (PK, FK, attribute) | IM ERDs require PK/FK distinction; no generic diagramming tool adds IM-specific semantics | Medium |
| Inline notation legend (always-visible Crow's Foot reference card) | Students learning the notation need a reference; prevents tab-switching to look it up | Low |
| Export diagram as PNG | Students want to save their work or include in reports | Low |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Alternative notations (Chen notation, UML class diagrams, IE notation) | Crow's Foot only per PROJECT.md; multiple notations fragment focus | Hard-coded Crow's Foot only |
| SQL DDL generation from ERD | Outside IM exam scope; adds significant complexity | Keep as diagram-only tool |
| Import from SQL schema or existing DDL | Nice-to-have but adds a parser and schema-to-diagram mapping layer | Pre-built exercises cover the use case |
| Freehand drawing or arbitrary shape tools | Makes diagrams unvalidatable; structured nodes/edges only | React Flow structured graph model only |
| Collaboration / multi-cursor drawing | Out of scope; single-user tool | No real-time features |

---

## AI Flashcard Generation

### Table Stakes

Features that any AI content generation tool must have to be usable.

| Feature | Why Expected | Complexity |
|---------|--------------|------------|
| Upload PDF or PPTX → generate flashcard deck | Core use case; Gizmo, Quizlet AI, and similar tools all do this | Medium |
| Paste raw text → generate flashcard deck | Fallback for students who don't have lecture files | Low |
| Review generated flashcards before adding to study deck | Generated content is imperfect; students must verify before studying | Low |
| Edit generated flashcards inline (fix typos, reword) | AI output needs human correction | Low |
| Generate both Definition and Enumeration card types automatically | IM content has both; the AI should classify them during generation | Medium |
| Loading / progress indicator during AI processing | Generation takes 5–20 seconds; blank screen looks broken | Low |
| Graceful error handling if AI call fails ("Generation failed, try again") | Network/API errors happen; users need clear feedback | Low |

### Differentiators

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| AI automatically classifies cards as Definition vs Enumeration | Unique to this app's two-type system; no generic flashcard AI does this | Medium |
| Show the source excerpt that generated each card | Students can verify accuracy against the original slide; builds trust in AI output | Medium |
| Regenerate a single card without reprocessing the whole file | Quick fix without starting over | Low |
| Batch accept all / batch reject all generated cards | Fast workflow for a 30-card deck from one lecture | Low |
| Card count estimate shown before generation starts ("We found ~25 concepts in your file") | Sets expectations; reduces anxiety about a large or small output | Medium |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Auto-add generated cards to deck without review step | AI errors become study material; damages trust and learning | Always gate behind a review step |
| Per-user API key management | Out of scope per PROJECT.md; owner's key is hardcoded server-side | Single owner API key in env var |
| Generate quiz questions / multiple choice from file | Out of scope for v1; flashcards only | Defer to backlog |
| Streaming token-by-token output display | Looks impressive but complicates review UX; better to show complete cards | Show completed deck after full generation |
| Cloud storage of uploaded files | Privacy risk; files should be processed and discarded server-side | Process in memory, return results, discard file |

---

## Progress Tracking

### Table Stakes

Minimum tracking students expect from a self-study tool.

| Feature | Why Expected | Complexity |
|---------|--------------|------------|
| Track known / still-learning split per flashcard deck (persisted in localStorage) | Students return across sessions; progress should not reset | Low |
| Session summary screen: "X of Y cards mastered this session" | Closing loop on a study session; motivating | Low |
| Overall completion percentage per module (Flashcards / Normalization / ERD) | Students want to know how much they've covered | Low |
| Persist progress between browser sessions via localStorage | No accounts; localStorage is the only option; must survive tab close | Low |
| Reset progress per module | Students want a clean slate before exams | Low |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Account-based progress sync across devices | No auth in scope; localStorage is sufficient for solo use | localStorage only |
| Learning curve graphs / detailed analytics dashboard | Complex to build; overkill for a semester-long reviewer used by one class | Simple percentage indicators |
| Study streaks (daily usage tracking) | Requires timestamps and date-aware logic; gamification adds code complexity for little study value | Session summary is enough |
| Export progress as PDF/CSV report | No use case for a private class tool | Not implemented |
| Server-side progress backup | No database, no backend storage per PROJECT.md | localStorage is the data layer |

---

## Feature Dependencies

```
AI Flashcard Generation → Flashcard Module (generated cards feed into study mode)
Normalization Simulator  → (standalone, no dependencies)
ERD Simulator            → (standalone, no dependencies)
Progress Tracking        → Flashcard Module + Normalization Simulator + ERD Simulator
                           (tracks state from all three modules)
```

---

## MVP Recommendation

Build in this order based on dependency and value:

1. **Flashcard Module** — core study loop; highest daily usage; simplest to build
2. **AI Flashcard Generation** — the main content pipeline; unlocks actual study material
3. **Normalization Simulator** — high exam relevance; second most complex module
4. **ERD Simulator** — most technically complex (React Flow custom edges); build last
5. **Progress Tracking** — wire in during or after each module; localStorage writes are low effort

Defer to backlog:
- Card-type filtering (useful but not day-one critical)
- ERD PNG export (nice-to-have)
- Card source excerpt display (medium priority)

---

## Sources

- Quizlet flashcard features: https://quizlet.com/features/flashcards (live, 2026-04-18)
- Quizlet Learn (adaptive practice): https://quizlet.com/features/learn (live, 2026-04-18)
- Gizmo AI features: https://gizmo.ai (live, 2026-04-18)
- Anki overview: https://ankiweb.net/about (live, 2026-04-18)
- Khan Academy CS Principles (data/DB patterns): https://www.khanacademy.org/computing/ap-computer-science-principles/data-analysis-101 (live, 2026-04-18)
- PROJECT.md constraints and scope: D:\Personal Projects\Infoman Game\.planning\PROJECT.md
- Training data: normalization pedagogy patterns, Crow's Foot notation standards, educational UX patterns
