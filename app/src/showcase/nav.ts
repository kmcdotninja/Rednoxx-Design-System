/**
 * The design-system site's information architecture — one source read by the
 * top nav, the section sidebar, the prev/next pager and the ⌘K palette.
 *
 * Shape mirrors Acorn (Firefox): a flat set of top-level sections, each opening
 * on an overview and holding at most two levels beneath it. Nothing is deeper
 * than section → group → page, so the sidebar never needs a disclosure tree.
 *
 * Only lightweight metadata is imported here — the shell must not pull the
 * component/block doc bodies into its chunk.
 */

import { BLOCKS_META, BLOCK_GROUP_ORDER, type BlockGroup } from './blocks-meta'
import { COMPONENTS_META, GROUP_ORDER, type DocGroup } from './components-meta'

export interface NavItem {
  label: string
  /** Absolute path, e.g. "/design/foundations/colour". */
  path: string
}

export interface NavGroup {
  /** Omitted for the leading ungrouped run of items (the overview link). */
  label?: string
  items: NavItem[]
}

export interface NavSection {
  id: string
  label: string
  /** Where the top-nav tab points — always the section overview. */
  path: string
  groups: NavGroup[]
}

const componentItems = (group: DocGroup): NavItem[] =>
  COMPONENTS_META.filter((c) => c.group === group).map((c) => ({
    label: c.name,
    path: `/design/components/${c.slug}`,
  }))

const blockItems = (group: BlockGroup): NavItem[] =>
  BLOCKS_META.filter((b) => b.group === group).map((b) => ({
    label: b.name,
    path: `/design/blocks/${b.slug}`,
  }))

export const TEMPLATE_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/design/blocks/template-dashboard' },
  { label: 'List', path: '/design/blocks/template-list' },
  { label: 'Record', path: '/design/blocks/template-record' },
  { label: 'Settings', path: '/design/blocks/template-settings' },
  { label: 'Auth', path: '/design/blocks/template-auth' },
]

/* ------------------------------- Sections -------------------------------- */

export const SECTIONS: NavSection[] = [
  {
    id: 'get-started',
    label: 'Get started',
    // The site landing *is* the Get started overview — one page, not two that
    // repeat each other's section grid.
    path: '/design',
    groups: [
      { items: [{ label: 'Overview', path: '/design' }] },
      {
        label: 'Principles',
        items: [
          { label: 'Design principles', path: '/design/get-started/design-principles' },
          { label: 'Component vs block vs template', path: '/design/get-started/altitudes' },
        ],
      },
      {
        label: 'Resources',
        items: [
          { label: 'For designers', path: '/design/get-started/designers' },
          { label: 'For developers', path: '/design/get-started/developers' },
          { label: 'Adding to the system', path: '/design/get-started/contributing' },
          { label: 'Design system terms', path: '/design/get-started/terms' },
        ],
      },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    path: '/design/foundations/overview',
    groups: [
      { items: [{ label: 'Overview', path: '/design/foundations/overview' }] },
      {
        label: 'Styles',
        items: [
          { label: 'Brand', path: '/design/foundations/brand' },
          { label: 'Colour', path: '/design/foundations/colour' },
          { label: 'Typography', path: '/design/foundations/typography' },
          { label: 'Spacing', path: '/design/foundations/space' },
          { label: 'Layout & grid', path: '/design/foundations/layout' },
          { label: 'Shape', path: '/design/foundations/shape' },
          { label: 'Elevation', path: '/design/foundations/elevation' },
          { label: 'Motion', path: '/design/foundations/motion' },
          { label: 'Iconography', path: '/design/foundations/iconography' },
        ],
      },
      {
        label: 'Global patterns',
        items: [{ label: 'Focus & interaction', path: '/design/foundations/focus' }],
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    path: '/design/components',
    groups: [
      { items: [{ label: 'Overview', path: '/design/components' }] },
      ...GROUP_ORDER.map((group) => ({ label: group, items: componentItems(group) })),
    ],
  },
  {
    id: 'blocks',
    label: 'Blocks',
    path: '/design/blocks',
    groups: [
      { items: [{ label: 'Overview', path: '/design/blocks' }] },
      ...BLOCK_GROUP_ORDER.map((group) => ({ label: group, items: blockItems(group) })),
      { label: 'Templates', items: TEMPLATE_ITEMS },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    path: '/design/patterns/overview',
    groups: [
      { items: [{ label: 'Overview', path: '/design/patterns/overview' }] },
      {
        label: 'Clinical safety',
        items: [
          { label: 'Patient identification', path: '/design/patterns/patient-identification' },
          { label: 'Allergies & alerts', path: '/design/patterns/alerts' },
          { label: 'Dose, units & numeric entry', path: '/design/patterns/numeric-entry' },
          { label: 'Order entry & signing', path: '/design/patterns/order-signing' },
          { label: 'Result flagging', path: '/design/patterns/result-flagging' },
          { label: 'Override & reason-for-action', path: '/design/patterns/override' },
          { label: 'Destructive actions', path: '/design/patterns/destructive-actions' },
        ],
      },
      {
        label: 'Workflow',
        items: [
          { label: 'Search before create', path: '/design/patterns/search-before-create' },
          { label: 'Queue & worklist', path: '/design/patterns/worklist' },
          { label: 'Duplicate & merge', path: '/design/patterns/merge' },
        ],
      },
      {
        label: 'Data & interoperability',
        items: [
          { label: 'FHIR resource mapping', path: '/design/patterns/fhir' },
          { label: 'Coded values', path: '/design/patterns/coded-values' },
          { label: 'Dates, times & timezones', path: '/design/patterns/dates' },
        ],
      },
      {
        label: 'Access & audit',
        items: [
          { label: 'RBAC & permission states', path: '/design/patterns/rbac' },
          { label: 'Break-glass access', path: '/design/patterns/break-glass' },
          { label: 'Audit trail display', path: '/design/patterns/audit-trail' },
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    path: '/design/content/overview',
    groups: [
      { items: [{ label: 'Overview', path: '/design/content/overview' }] },
      {
        label: 'Mechanics',
        items: [
          { label: 'Voice & tone', path: '/design/content/voice-and-tone' },
          { label: 'Capitalization', path: '/design/content/capitalization' },
          { label: 'Punctuation & numerals', path: '/design/content/numerals' },
        ],
      },
      {
        label: 'Clinical vocabulary',
        items: [
          { label: 'Word list', path: '/design/content/word-list' },
          { label: 'Do-not-use abbreviations', path: '/design/content/do-not-use' },
          { label: 'Units & dose expressions', path: '/design/content/units' },
        ],
      },
      {
        label: 'Inclusive writing',
        items: [
          { label: 'Patient-first language', path: '/design/content/patient-first' },
          { label: 'Sex, gender & pronouns', path: '/design/content/gender' },
          { label: 'Writing for accessibility', path: '/design/content/accessible-writing' },
        ],
      },
      {
        label: 'Patterns',
        items: [
          { label: 'Alert & warning copy', path: '/design/content/alert-copy' },
          { label: 'Error messages', path: '/design/content/error-messages' },
          { label: 'Empty states', path: '/design/content/empty-states' },
          { label: 'Confirmation copy', path: '/design/content/confirmation-copy' },
        ],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    path: '/design/support/overview',
    groups: [
      { items: [{ label: 'Overview', path: '/design/support/overview' }] },
      {
        label: 'Help & support',
        items: [
          { label: 'Request a component', path: '/design/support/requests' },
          { label: 'Report a bug', path: '/design/support/bugs' },
          { label: 'Design review', path: '/design/support/design-review' },
        ],
      },
      {
        label: 'Standards',
        items: [
          { label: 'Definition of Done', path: '/design/support/definition-of-done' },
          { label: 'Pre-PR checklist', path: '/design/support/pre-pr-checklist' },
          { label: 'Accessibility gate', path: '/design/support/accessibility-gate' },
        ],
      },
    ],
  },
]

/* -------------------------------- Lookups -------------------------------- */

/** Every page in the site, in sidebar order — the spine for prev/next and ⌘K. */
export const ALL_ITEMS: { item: NavItem; section: NavSection; group?: string }[] = SECTIONS.flatMap(
  (section) =>
    section.groups.flatMap((group) =>
      group.items.map((item) => ({ item, section, group: group.label })),
    ),
)

/**
 * The section a path belongs to. Matches on the longest section prefix so
 * `/design/components/button` resolves to Components, not to a stray overview.
 */
export function sectionForPath(pathname: string): NavSection | undefined {
  const direct = SECTIONS.find((s) => pathname.startsWith(`/design/${s.id}`))
  if (direct) return direct
  return ALL_ITEMS.find((entry) => entry.item.path === pathname)?.section
}

/** Neighbouring pages within the whole site, for the header's ← → pager. */
export function neighbours(pathname: string): { prev?: NavItem; next?: NavItem } {
  const index = ALL_ITEMS.findIndex((entry) => entry.item.path === pathname)
  if (index === -1) return {}
  return { prev: ALL_ITEMS[index - 1]?.item, next: ALL_ITEMS[index + 1]?.item }
}

/** The page's own nav entry — used for the header title and breadcrumbs. */
export function itemForPath(pathname: string) {
  return ALL_ITEMS.find((entry) => entry.item.path === pathname)
}
