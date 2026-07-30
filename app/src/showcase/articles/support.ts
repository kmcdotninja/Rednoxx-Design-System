import type { Article } from './types'

const DOD_SOURCE = '.claude/skills/ehr-design/references/definition-of-done.md'
const A11Y_SOURCE = '.claude/skills/ehr-design/references/accessibility.md'

/** Support — how to reach the system, and the gates work has to clear. */
export const SUPPORT_ARTICLES: Article[] = [
  {
    slug: 'overview',
    title: 'Overview',
    summary: 'How to get help from the design system, and what it asks of you in return.',
    blocks: [
      {
        kind: 'p',
        text: 'The design system is a shared surface: everything in it is used by more than one team, so changes go through a light but real process. This section is that process — where requests go, and which checklists a change has to clear before it merges.',
      },
      { kind: 'h', text: 'Where to go' },
      {
        kind: 'table',
        head: ['I want to…', 'Go to'],
        rows: [
          ['Use something that already exists', 'Components, Blocks or Patterns'],
          ['Ask for something that does not exist', 'Request a component'],
          ['Report that something is broken', 'Report a bug'],
          ['Get a screen reviewed before merge', 'Design review'],
          ['Know whether my work is finished', 'Definition of Done'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'The system is the single source of truth',
        text: 'Build pages only from components/ui and components/blocks. If something is missing, add it to the system first, then build the page — never fork a primitive into a feature folder.',
      },
    ],
  },
  {
    slug: 'requests',
    title: 'Request a component',
    summary: 'The path for something the system does not have yet.',
    blocks: [
      {
        kind: 'steps',
        items: [
          'Check Components and Blocks first — including the “When to use” tab, which names the sibling you might actually want.',
          'Check whether an existing primitive can be extended by props. Composing beats forking, always.',
          'If it is genuinely new, open a request describing the clinical task it serves — not the visual you have in mind.',
          'Build it in components/ui (primitive) or components/blocks (composition), document it, then use it.',
        ],
      },
      {
        kind: 'dodont',
        do: [
          'Extend a primitive through props.',
          'Compose a new block from existing primitives.',
          'Name the workflow the component serves.',
        ],
        dont: [
          'Copy a component into a feature folder and edit it.',
          'Add a one-off variant that only one screen uses.',
          'Introduce a new colour, radius or type size to accommodate it.',
        ],
      },
    ],
  },
  {
    slug: 'bugs',
    title: 'Report a bug',
    summary: 'What to include so a defect can be reproduced and triaged.',
    blocks: [
      {
        kind: 'list',
        items: [
          'The component or block, and the page you saw it on.',
          'What you expected, what happened, and the steps between.',
          'Whether it is a clinical-safety defect — a missed confirmation, an unaudited action, a colour-only status. These are triaged ahead of visual issues.',
          'Viewport and input method: keyboard-only and screen-reader failures are defects, not enhancements.',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Safety defects jump the queue',
        text: 'Anything that could contribute to a wrong-patient, wrong-medication, wrong-order, duplicate-record or wrong-billing event is triaged first, regardless of how small the visual change looks.',
      },
    ],
  },
  {
    slug: 'design-review',
    title: 'Design review',
    summary: 'The five questions asked of every PR, in order.',
    blocks: [
      {
        kind: 'steps',
        items: [
          'Would this screen be safe and fast for a busy, possibly first-time user under real facility conditions — poor connectivity, tablet, high volume?',
          'Could it contribute to a wrong-patient, wrong-medication, wrong-order, duplicate-record or wrong-billing error? If yes, have the clinical safety patterns been applied?',
          'Could a keyboard-only or screen-reader user complete this task? If unsure, test — do not assume.',
          'Does every colour-conveyed state also have a text label?',
          'Is every new or changed field’s FHIR mapping and validation rule documented somewhere findable?',
        ],
      },
    ],
    source: DOD_SOURCE,
  },
  {
    slug: 'definition-of-done',
    title: 'Definition of Done',
    summary:
      'Run these before marking any component, screen or PR complete. A skipped item must be explicitly justified as low-risk or not applicable — never skipped silently.',
    blocks: [
      { kind: 'h', text: 'Screen review — every screen, every sprint' },
      {
        kind: 'list',
        items: [
          'Current patient clearly visible on all clinical screens (banner).',
          'Main workflow completes without unnecessary navigation — clicks counted.',
          'Fields labelled and mapped to the data dictionary / FHIR profile.',
          'Errors inline and summarised with anchors on long forms.',
          'Keyboard-only operable; focus visible throughout.',
          'Contrast and target sizes meet the accessibility gates.',
          'High-risk actions confirmed per the clinical safety patterns, and audited.',
          'Wrong-patient, duplicate, wrong-med, wrong-order and wrong-bill errors designed against.',
          'Loading (skeleton), empty, error and sync states all present.',
          'Tested — or scheduled — with representative facility users.',
        ],
      },
      { kind: 'h', text: 'Component / feature DoD' },
      {
        kind: 'list',
        items: [
          'Uses approved tokens and primitives — no raw hex, no forked components.',
          'TypeScript types explicit for all props touching clinical or patient data — no any.',
          'Responsive across desktop, tablet and common facility screens; 320px holds.',
          'Unit tests cover validation logic and critical UI state transitions.',
          'axe-core passes; manual keyboard pass completed.',
          'Clinical safety controls implemented where applicable.',
          'All copy reviewed: labels, errors, empty states, help text.',
          'API contract maps to the data dictionary and FHIR mapping.',
          'Audit events emitted.',
          'Verified end-to-end in a running browser before merge.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A passing build is not verification',
        text: 'The last item is the one most often skipped. Run the flow in a real browser before you call it done.',
      },
      { kind: 'h', text: 'Performance budgets' },
      {
        kind: 'list',
        items: [
          'Shell JS ≤ 200KB gzip; charts and heavy modules lazy-loaded per route.',
          'Interactive in under 3s on a mid-range Android tablet over 3G.',
          '60fps scrolling on 1,000-row virtualised tables.',
          'Autosave and retry queue keep working under intermittent connectivity; failed writes are visible, never silent.',
        ],
      },
    ],
    source: DOD_SOURCE,
  },
  {
    slug: 'pre-pr-checklist',
    title: 'Pre-PR checklist',
    summary: 'The short version — run this before you open the pull request.',
    blocks: [
      {
        kind: 'list',
        items: [
          'No raw hex, no forked primitives — tokens and the existing library only.',
          'Every input sits in Field; long forms carry a top error summary with anchor links.',
          'Status is never colour-alone — soft fill, AA text, and the word.',
          'Focus recipes intact and never suppressed.',
          '4px grid; touch targets ≥ 40px; square corners except pills, dots, toggles and avatars.',
          'Motion disabled under prefers-reduced-motion; exits faster than entrances.',
          'High-risk actions carry the confirmation modal and emit audit events.',
          'Verified in a running browser.',
        ],
      },
      { kind: 'h', text: 'Automated checks' },
      { kind: 'code', label: 'From the repo root', code: `npm --prefix frontend run type-check
npm --prefix frontend run lint
npm --prefix frontend run design-lint
npm --prefix frontend test` },
    ],
    source: DOD_SOURCE,
  },
  {
    slug: 'accessibility-gate',
    title: 'Accessibility gate',
    summary: 'WCAG 2.2 AA is the floor, not the target. These gates block release.',
    blocks: [
      { kind: 'h', text: 'Focus & interaction' },
      {
        kind: 'code',
        label: 'The two focus recipes — never suppressed',
        code: `// Inputs
focus:border-azure focus:ring-4 focus:ring-azure-50

// Buttons and interactive chrome
focus-visible:ring-2 focus-visible:ring-azure/50`,
      },
      { kind: 'h', text: 'Release gates' },
      {
        kind: 'list',
        items: [
          'axe-core passes with no violations.',
          'A manual keyboard pass is completed for every screen — tab order matches visual order, nothing is reachable but unusable, nothing is usable but unreachable.',
          'Contrast meets AA for text and for meaningful non-text.',
          'Touch targets are at least 40px.',
          'Every colour-conveyed state also carries a text label.',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Keyboard failures are defects',
        text: 'A screen a keyboard-only or screen-reader user cannot complete is broken, not partially finished. It does not ship.',
      },
    ],
    source: A11Y_SOURCE,
  },
]
