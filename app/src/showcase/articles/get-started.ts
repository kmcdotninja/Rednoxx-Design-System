import type { Article } from './types'

const GUIDE = 'docs/design-system/EHR-DESIGN-GUIDE.md'

/**
 * Get started — orientation for whoever just opened the design system.
 *
 * The section's overview is the site landing (`/design`), not a page here: one
 * of the two was always going to repeat the other's section grid.
 */
export const GET_STARTED_ARTICLES: Article[] = [
  {
    slug: 'design-principles',
    title: 'Design principles',
    summary: 'Five commitments that decide arguments when the guidance runs out.',
    blocks: [
      { kind: 'h', text: '1 · Safety outranks speed' },
      {
        kind: 'p',
        text: 'Where a faster interaction and a safer one conflict, the safer one wins. Confirmation steps, mandatory reasons and server-confirmed writes are deliberate friction placed exactly where a mistake would reach a patient.',
      },
      { kind: 'h', text: '2 · The strictest applicable default' },
      {
        kind: 'p',
        text: 'If a screen or component is not covered by an explicit rule, default to the strictest applicable pattern — more confirmation, more context, more accessibility — never the fastest to build.',
      },
      { kind: 'h', text: '3 · Identity is never out of view' },
      {
        kind: 'p',
        text: 'On a clinical screen the patient banner is sticky, and identity is restated wherever an action commits. Wrong-patient error is the failure mode this system is most designed against.',
      },
      { kind: 'h', text: '4 · Never colour alone' },
      {
        kind: 'p',
        text: 'Every status carries a soft fill, AA-contrast text and the word. A red chip that only means something to a colour-sighted user in good light is not a status — it is decoration.',
      },
      { kind: 'h', text: '5 · Compose, never fork' },
      {
        kind: 'p',
        text: 'Extend primitives through props; build screens from blocks. A forked component drifts, and a drifted clinical component is a safety liability, not just a visual inconsistency.',
      },
    ],
    source: GUIDE,
  },
  {
    slug: 'altitudes',
    title: 'Component vs block vs template',
    summary: 'Three altitudes. Knowing which one you need is most of the decision.',
    blocks: [
      {
        kind: 'table',
        head: ['Altitude', 'Lives in', 'Owns', 'Example'],
        rows: [
          ['Component', 'components/ui', 'One interaction, no domain knowledge', 'Button, Field, Table'],
          ['Block', 'components/blocks', 'A composition with product meaning', 'Patient banner, Filter bar'],
          ['Template', 'Blocks → Templates', 'A whole page skeleton', 'Record, List, Dashboard'],
        ],
      },
      { kind: 'h', text: 'How to choose' },
      {
        kind: 'list',
        items: [
          'If it knows nothing about healthcare, it is a component.',
          'If it knows what a patient or an encounter is, it is a block.',
          'If it decides where things sit on a full page, it is a template.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'A common mistake',
        text: 'Navbar, Sidebar, Module switcher and User menu look like navigation components but ship from components/blocks — they carry product knowledge. They are documented under Blocks → Navigation for exactly that reason.',
      },
    ],
  },
  {
    slug: 'designers',
    title: 'For designers',
    summary: 'Working in Figma against a system whose source of truth is code.',
    blocks: [
      {
        kind: 'list',
        items: [
          'The token values in Foundations are generated from frontend/src/index.css — that file wins any disagreement with a Figma library.',
          'The type scale is closed: ten styles. A new size is a system change, not a screen decision.',
          'Corners are square. rounded-full is reserved for pills, dots, toggles and avatars.',
          'Annotate focus order and landmarks on clinical screens — keyboard behaviour is part of the design, not an implementation detail.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Design against the states, not the happy path',
        text: 'Every screen needs loading, empty, error and sync states before it is reviewable. Blocks → States has the canonical set.',
      },
    ],
  },
  {
    slug: 'developers',
    title: 'For developers',
    summary: 'Importing the system, and the rules that are enforced in review.',
    blocks: [
      { kind: 'h', text: 'Import from the two entry points' },
      {
        kind: 'code',
        label: 'Never reach past the barrel into a component file',
        code: `import { Button, Field, DataTable } from '@/components/ui'
import { PatientBanner, FilterBar } from '@/components/blocks'`,
      },
      { kind: 'h', text: 'Hard rules — violations are defects' },
      {
        kind: 'list',
        items: [
          'Tokens only. No raw hex; @theme in frontend/src/index.css is the source.',
          'gold is never text; azure-300 and lighter are never text.',
          'The type scale is closed — ten styles. Updating numbers wear .tnum.',
          '4px grid; touch targets ≥ 40px; square corners.',
          'Every input sits in Field; passwords use PasswordInput; long forms get a top error summary with anchor links.',
          'Status is never colour-alone — soft fill, AA text, and the word.',
          'Focus recipes are never suppressed.',
          'Motion off under prefers-reduced-motion; exits faster than entrances.',
        ],
      },
      { kind: 'h', text: 'Before you open a PR' },
      {
        kind: 'code',
        code: `npm --prefix frontend run type-check
npm --prefix frontend run lint
npm --prefix frontend run design-lint`,
      },
    ],
    source: 'docs/design-system/CONSUMING.md',
  },
  {
    slug: 'contributing',
    title: 'Adding to the system',
    summary: 'The path for a component that does not exist yet.',
    blocks: [
      {
        kind: 'steps',
        items: [
          'Confirm it is missing — check Components, Blocks, and the “When to use” tab of the nearest sibling.',
          'Try props first. Extending an existing primitive is nearly always right.',
          'Decide the altitude: primitive (components/ui) or composition (components/blocks).',
          'Build it against the tokens, with all states — loading, empty, error, disabled, focus.',
          'Add metadata to components-meta.ts or blocks-meta.ts, and a doc body under docs/ or blockdocs/.',
          'Add a playground spec in playground/specs.tsx so the Controls rail can drive it.',
          'Run the Definition of Done before opening the PR.',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Do not build the screen first',
        text: 'A component invented inside a feature folder and promoted later arrives with the feature’s assumptions baked in. Add it to the system first, then build the page against it.',
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Design system terms',
    summary: 'The vocabulary this documentation uses consistently.',
    blocks: [
      {
        kind: 'table',
        head: ['Term', 'Means'],
        rows: [
          ['Token', 'A named design decision (--color-azure) that components reference instead of a literal.'],
          ['Primitive', 'A component in components/ui with no domain knowledge.'],
          ['Block', 'A composition in components/blocks that knows about the product.'],
          ['Template', 'A full-page skeleton assembled from blocks.'],
          ['Pattern', 'A rule about behaviour that spans components — usually a safety control.'],
          ['Pair', 'A status treatment: soft fill plus AA-contrast text, always with a word.'],
          ['Playground spec', 'The data that drives a component’s live Preview and Controls rail.'],
          ['Gate', 'A check that blocks release rather than merely advising.'],
        ],
      },
    ],
  },
]
