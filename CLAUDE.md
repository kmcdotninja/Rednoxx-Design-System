# Rednoxx — Healthcare Platform Design System & EHR

React 19 + TS + Vite 8 + Tailwind v4 (CSS-first — tokens live in the `@theme`
block of `app/src/index.css`; there is no tailwind.config). All UI primitives
are hand-rolled in `app/src/components/ui/` (no shadcn/Radix).

## Commands (from repo root)

- `npm run dev` — Vite dev server (picks next free port if 5173 is busy)
- `npm run build` — `tsc -b` + production build
- `npm run lint` — oxlint (pre-existing fast-refresh warnings are not regressions)

## Rules

- **Any UI work must follow the `ehr-design` skill** (`.claude/skills/ehr-design/`),
  which digests the normative spec in `docs/EHR-DESIGN-GUIDE.md` — tokens,
  type scale, WCAG 2.2 AA gates, clinical safety patterns, FHIR mappings.
- Compose from existing primitives/blocks; never fork a component per screen.
- Charts import directly from `components/ui/AreaChart` etc. — never re-export
  recharts through the ui barrel (bundle split).
- The demo (`/demo/*`) is lazy-loaded; don't import demo modules into the shell.
