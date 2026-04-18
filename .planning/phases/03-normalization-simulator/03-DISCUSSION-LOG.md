# Phase 3: Normalization Simulator — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 03-normalization-simulator
**Areas discussed:** Answer Input Method, Exercise Selection, Wizard Navigation Chrome, Hint UX

---

## Answer Input Method

| Option | Description | Selected |
|--------|-------------|----------|
| Structured table builder | Visual grid UI — add/remove columns, mark PKs, define FDs | ✓ |
| Text-based column list | Student types column names in text area, marks PK(s) | |
| Hybrid: column inputs + PK selector | Separate input fields per column + PK checkbox, no explicit FDs | |

**User's choice:** Structured table builder

**Follow-up — FD specification:**

| Option | Description | Selected |
|--------|-------------|----------|
| FD input fields | Explicit `[left side] → [right side]` inputs at every step | ✓ |
| Auto-inferred from PK | App assumes all non-PK columns depend on full PK; no explicit FD entry | |
| Only required for 2NF/3NF steps | FD inputs only appear at steps where they're needed | |

**User's choice:** FD input fields — explicit at all steps

---

## Exercise Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Exercise list page | `/normalization` landing page with exercise cards; wizard at `/normalization/[exerciseId]` | ✓ |
| Dropdown/selector inside the wizard | Selector at top of wizard, no separate page | |
| Exercise list page with difficulty/topic tags | Same as option 1 but with violation-type tags per card | |

**User's choice:** Exercise list page (no tags)

---

## Wizard Navigation Chrome

| Option | Description | Selected |
|--------|-------------|----------|
| Step tabs at the top | Horizontal tab bar, completed steps marked with checkmark, clickable back-nav | ✓ |
| Vertical sidebar stepper | Left sidebar with step names + status icons | |
| Progress bar + Prev/Next buttons | Minimal chrome, strictly linear navigation | |

**User's choice:** Step tabs at top

---

## Hint UX

| Option | Description | Selected |
|--------|-------------|----------|
| Click-to-reveal one hint at a time | "Show hint" button, sequential reveal, "Hint N/M" counter | ✓ |
| Accordion hint panel | Collapsible panel, hints expandable in any order | |
| Single hint button | One hint per step, show/hide toggle | |

**User's choice:** Click-to-reveal, sequential, with counter

---

## Claude's Discretion

- Exact number and schemas of pre-built exercises
- Sample data rows in UNF table display
- Hint text content per step per exercise
- Rule card copy per normal form
- Component decomposition within the wizard
- Correct-answer reveal format
- Violation highlighting style
- Zustand store shape for progress persistence

## Deferred Ideas

None
