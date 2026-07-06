/**
 * Lightweight block metadata — safe to import from the shell and overview.
 * The full docs (with live examples) load lazily with the /blocks routes.
 */

export type BlockGroup =
  | 'Auth'
  | 'Patient'
  | 'Dashboard'
  | 'Toolbars'
  | 'Records'
  | 'States'
  | 'Forms & overlays'

export interface BlockMeta {
  slug: string
  name: string
  group: BlockGroup
  summary: string
}

export const BLOCK_GROUP_ORDER: BlockGroup[] = [
  'Auth',
  'Patient',
  'Dashboard',
  'Toolbars',
  'Records',
  'States',
  'Forms & overlays',
]

export const BLOCKS_META: BlockMeta[] = [
  {
    slug: 'auth-layout',
    name: 'Auth layout',
    group: 'Auth',
    summary: 'The split shell every auth screen lives in — brand panel plus a centered form column.',
  },
  {
    slug: 'login',
    name: 'Login',
    group: 'Auth',
    summary: 'Email + password with remember me, forgot-password, SSO buttons and failure states.',
  },
  {
    slug: 'registration',
    name: 'Registration',
    group: 'Auth',
    summary: 'Sign-up form with personal and account details, terms agreement and success state.',
  },
  {
    slug: 'verification',
    name: 'Verification',
    group: 'Auth',
    summary: 'Segmented OTP entry with resend countdown, success and wrong-code states.',
  },
  {
    slug: 'mfa',
    name: 'Multi-factor auth',
    group: 'Auth',
    summary: 'Method selection, authenticator QR setup and backup codes.',
  },
  {
    slug: 'password',
    name: 'Password',
    group: 'Auth',
    summary: 'Reset and create-password forms with show/hide toggles, a live strength meter and requirements list.',
  },
  {
    slug: 'org-access',
    name: 'Organization access',
    group: 'Auth',
    summary: 'Pick an organization, facility and role after sign-in — the healthcare hand-off.',
  },
  {
    slug: 'auth-states',
    name: 'Auth states',
    group: 'Auth',
    summary: 'Locked, unauthorized, session-timeout and maintenance screens.',
  },
  {
    slug: 'patient-banner',
    name: 'Patient banner',
    group: 'Patient',
    summary: 'Identity, demographics, coverage and primary actions — the head of every patient screen.',
  },
  {
    slug: 'clinical-cards',
    name: 'Clinical cards',
    group: 'Patient',
    summary: 'Allergy, insurance, medication and care-team cards for the chart rail.',
  },
  {
    slug: 'vitals',
    name: 'Vitals',
    group: 'Patient',
    summary: 'Latest observations as tiles, with a trend chart for any measure.',
  },
  {
    slug: 'kpi-card',
    name: 'KPI card',
    group: 'Dashboard',
    summary: 'Headline value, delta vs last period, and a compact trend — the analytics tile.',
  },
  {
    slug: 'dashboard-lists',
    name: 'Dashboard lists',
    group: 'Dashboard',
    summary: 'Today’s schedule, activity feeds and quick actions for overview screens.',
  },
  {
    slug: 'filter-bar',
    name: 'Filter bar',
    group: 'Toolbars',
    summary: 'Search and right-aligned actions, with status buckets as Tabs on the table below.',
  },
  {
    slug: 'page-header',
    name: 'Page header',
    group: 'Toolbars',
    summary: 'Title, context line and page-level actions, sitting under the navbar.',
  },
  {
    slug: 'timeline',
    name: 'Timeline',
    group: 'Records',
    summary: 'Vertical event history — medical timelines, admissions, audit trails.',
  },
  {
    slug: 'empty-states',
    name: 'Empty states',
    group: 'States',
    summary: 'Illustrated, situation-specific empties that say what would be here and what to do.',
  },
  {
    slug: 'loading',
    name: 'Loading states',
    group: 'States',
    summary: 'Skeleton cards, tables and profiles, plus the inline loader.',
  },
  {
    slug: 'form-blocks',
    name: 'Form blocks',
    group: 'Forms & overlays',
    summary: 'Appointment booking and patient registration layouts assembled from Field controls.',
  },
  {
    slug: 'file-upload',
    name: 'File upload',
    group: 'Forms & overlays',
    summary: 'Drag-and-drop upload with live progress, complete and error states.',
  },
  {
    slug: 'signature',
    name: 'Digital signature',
    group: 'Forms & overlays',
    summary: 'Draw-to-sign pad for consents and sign-offs — empty, signed and cleared states.',
  },
  {
    slug: 'overlay-patterns',
    name: 'Overlay patterns',
    group: 'Forms & overlays',
    summary: 'Confirmation dialogs and filter drawers with the footer and copy conventions.',
  },
]

export function blocksInGroup(group: BlockGroup): BlockMeta[] {
  return BLOCKS_META.filter((b) => b.group === group)
}
