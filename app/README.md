# Rednoxx Design System · Showcase

The living documentation for the **Rednoxx** healthcare-platform design system,
layered Carbon-style: **foundations** (colour, type, radius, elevation, motion,
iconography), **thirty-six documented components**, **twenty-two blocks** — auth
(login, OTP verification, MFA, passwords, workspace hand-off) and healthcare
patterns (patient banner, vitals, KPI card, timeline, file upload, signature, …) —
all with live examples and WCAG 2.2 AA notes — and a full **product demo** whose
thirteen screens are assembled entirely from those parts.

> Demo only: all data is mocked (`src/showcase/health.ts`); there is no backend.

## Run

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Explore

- `/` — engagement overview, the five-layer model, component and block indexes
- `/foundations` — the tokens everything is built from
- `/templates` — the five page layouts (dashboard, list, record, settings, auth)
  with schematics and links to the screens that use them
- `/components/<slug>` — one page per component across Forms (button, input,
  select, combobox, datepicker, search, checkbox, radio, slider, switch,
  color-picker, digit-input), Data display (avatar, badge, card, table,
  progress, rating, divider, kbd), Feedback (alert, toast, dialog, drawer,
  tooltip), Navigation (tabs, segmented, accordion, stepper, pagination,
  breadcrumb, sidebar, navbar) and Overlays (dropdown, popover, command-menu)
- `/blocks/<slug>` — reusable compositions: auth (layout, login, registration,
  verification, MFA, password, org access, auth states) and healthcare patterns
  (patient banner, clinical cards, vitals, KPI card, dashboard lists, filter bar,
  page header, timeline, empty states, loading, form blocks, overlays, file
  upload, digital signature)
- `/demo/*` — the routed product demo (lazy-loaded; carries the chart bundle):
  overview, analytics, reports, patients + per-patient EHR chart, appointments,
  consultations, prescriptions, lab orders, surgical orders (checklist +
  signature sign-off), payments, insurance claims, staff, settings

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (theme tokens in `src/index.css` — ink + brand violet `#5833FB`)
- react-router-dom, lucide-react, recharts (`components/ui/chart.tsx`), sonner

## Structure

```
src/
  components/
    ui/          the primitives (Button, Field/Input/Select, Combobox,
                 DatePicker/TimePicker, SearchInput, Avatar, Badge/StatusPill,
                 Alert, Toast, Modal, Drawer, Tabs, Card, DataTable, Pagination,
                 Breadcrumb, Skeleton, FileUpload, SignaturePad, charts, …)
    blocks/      reusable compositions shared by docs and demo (PatientBanner,
                 VitalsRow, KpiCard, FilterBar, Timeline)
    Logo.tsx     Rednoxx mark + logotype (/mark.svg, /logo.svg)
  showcase/
    Shell.tsx    docs shell (sidebar + mobile menu)
    registry.ts  the 19 component docs   docs/       their bodies, per group
    blocks-meta.ts  block metadata       blockdocs/  block bodies (lazy)
    pages/       Overview, Foundations, DocArticle, ComponentPage, BlockPage
    demo/        DemoShell (layout, Sidebar, Navbar) + pages/ (13 screens)
    health.ts    mock hospital-network data for the demo
  lib/           cn, useDismiss, layerStack, …
```

## Brand tokens

| Token | Hex | Use |
|-------|-----|-----|
| `navy` | `#171723` | ink text, solid buttons, dark surfaces |
| `azure` | `#5833FB` | brand accent, focus rings, data series |
| `mint` | `#15803D` | success |
| `gold` | `#E0A526` | pending / warnings |
| `rose-ink` | `#B91C1C` | danger |

**Geometry:** square corners, Carbon-style — every structural radius token in
`src/index.css` is 0px; only pills, dots, toggles and avatars stay fully round.

Legacy `forest`/`lime`/`teal`/`orange` names are aliased to the palette in
`src/index.css`, so older primitives work unchanged. Material from the previous
SFMP prototype lives in `docs/archive/sfmp/`.
