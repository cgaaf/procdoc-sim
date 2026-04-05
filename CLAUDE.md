# procdoc-sim

Epic EHR procedure documentation simulator for POCUS (Point-of-Care Ultrasound).

## Stack

- SvelteKit 5 + TypeScript
- Tailwind CSS 4
- Vitest + Playwright
- oxlint + ESLint + Prettier
- Use `pnpm` (not npm/npx)

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm check` — svelte-check type checking
- `pnpm lint` — oxlint + ESLint
- `pnpm fmt` — oxfmt + Prettier
- `pnpm test:unit` — Vitest unit tests
- `pnpm test:e2e` — Playwright E2E tests
- `pnpm storybook` — Storybook on port 6006

## Architecture

- **Routing**: `/routes/[exam]/` — each exam type resolved via `ExamConfig` in `src/lib/exams/`
- **Data-driven forms**: All smartforms are `ProcdocDefinition` objects in `src/lib/data/procdoc-definitions.ts` — UI components render from these definitions, not hardcoded markup
- **State**: Per-exam reactive state in `src/lib/state/exam-state.svelte.ts` via Svelte 5 runes
- **Note generation**: `src/lib/logic/note-assembler.ts` reads state and produces the preview text

## Smartform Design Patterns

The **FAST exam** (`fastProcdocDefinition`) is the canonical reference for layout and styling. All new or edited smartforms must follow these patterns:

- **Uniform blue selection**: All selected/toggled buttons use `--color-btn-selected-bg` / `--color-btn-selected-border` / `--color-btn-selected-text`. Do NOT use semantic red/green/orange (`--color-finding-present-icon`, `--color-finding-absent-icon`, `--color-finding-indeterminate-icon`) for button backgrounds.
- **Vertical layout for findings groups**: Use `layout: "vertical"` on `FindingsGroupSection` to stack findings in a single column. This is the preferred layout.
- **triState findings with custom labels**: Use `triState: true` with `triStateLabels` to show descriptive button text (e.g., "Pericardial Effusion" / "No Effusion" / "Indeterminate") instead of generic "Positive" / "Negative".
- **Inline labels on button groups**: Use `label` on `FindingsButtonGroupDef` (e.g., "Left Hemithorax") instead of `subHeader` items — renders the label inline with the buttons.
- **No bold-on-select**: Do not add `font-semibold` toggling or `bold-stable` CSS hacks to selected buttons.
- **Indication section**: Always the first group with `header: ""`, `label: "Indication"`, `required: true`.

## UI Guidelines

- **Button unselected state**: All toggle/selection buttons must use `--color-btn-default-bg` and `--color-btn-default-border` for their unselected state. Do NOT use `--color-finding-null-bg` / `--color-finding-null-border` for button backgrounds — those are reserved for the inner label area of +/label/- finding toggles.
- **Refer to `layout.css`** for the full set of color tokens before adding inline colors.
