import { useState } from 'react'
import { Command, Stethoscope } from 'lucide-react'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardHeader,
  Button,
  DataTable,
  Divider,
  Kbd,
  ProgressBar,
  ProgressCircle,
  Rating,
  StatusPill,
  Tag,
  faceUrl,
  type Column,
} from '@/components/ui'
import { FACILITIES, type Facility } from '../health'
import type { ComponentDoc } from '../types'

const CARE_TEAM = ['Amina Bello', 'Dr. Sani Ahmed', 'Dr. Bisi Adeyemi', 'Dr. Kemi Balogun', 'Dr. Femi Alade', 'Dr. Obi Nnamdi', 'Dr. Ada Okeke']

function RatingExample() {
  const [stars, setStars] = useState(4)
  return (
    <div className="space-y-2">
      <Rating value={stars} onChange={setStars} />
      <p className="tnum text-[13px] text-forest-400">{stars} of 5</p>
    </div>
  )
}

const tableColumns: Column<Facility>[] = [
  {
    key: 'name',
    header: 'Facility',
    cell: (f) => (
      <span className="flex items-center gap-3">
        <Avatar name={f.name} size="sm" />
        <span>
          <span className="block font-medium text-forest">{f.name}</span>
          <span className="block text-xs text-forest-400">{f.city}</span>
        </span>
      </span>
    ),
  },
  { key: 'patients', header: 'Patients', align: 'right', cell: (f) => <span className="tnum">{f.patients.toLocaleString()}</span> },
  { key: 'wait', header: 'Avg wait', align: 'right', cell: (f) => <span className="tnum">{f.waitMins}m</span> },
  { key: 'status', header: 'Status', cell: (f) => <StatusPill status={f.status} /> },
]

export const DISPLAY_DOCS: ComponentDoc[] = [
  {
    slug: 'avatar',
    name: 'Avatar',
    group: 'Data display',
    summary: 'Identity mark with an image and a deterministic-colour initials fallback.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Drives the initials, fallback colour and title.' },
      { name: 'src', type: 'string', description: 'Photo URL; broken images fall back to initials.' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: '28–48px.' },
      { name: 'ring', type: 'boolean', default: 'true', description: 'White ring for overlapping stacks.' },
      { name: 'names (AvatarGroup)', type: 'string[]', required: true, description: 'AvatarGroup — everyone in the stack.' },
      { name: 'max (AvatarGroup)', type: 'number', default: '4', description: 'AvatarGroup — avatars shown before the +N chip; hover the chip for names.' },
      { name: 'compact (AvatarGroup)', type: 'boolean', default: 'false', description: 'AvatarGroup — tighter overlap for dense rows.' },
    ],
    description:
      'Given only a name, the avatar renders initials on a colour derived from that name — the same person always gets the same colour, and a failed image falls back gracefully.',
    code: `<Avatar name="Amina Bello" size="md" />
<Avatar name="Efe Ojo" src={photoUrl} />`,
    examples: [
      {
        title: 'Sizes',
        body: (
          <>
            <Avatar name="Amina Bello" size="xs" />
            <Avatar name="Efe Ojo" size="sm" />
            <Avatar name="Ngozi Eze" size="md" />
            <Avatar name="Sani Ahmed" size="lg" />
          </>
        ),
      },
      {
        title: 'With image',
        note: 'A broken image URL silently falls back to initials.',
        body: (
          <>
            <Avatar name="Amina Bello" src={faceUrl('amina')} size="lg" />
            <Avatar name="Efe Ojo" src="https://broken.example/x.jpg" size="lg" />
          </>
        ),
      },
      {
        title: 'Avatar group',
        note: 'AvatarGroup folds the overflow into a +N chip; hover it for names.',
        body: (
          <>
            <AvatarGroup names={CARE_TEAM} max={4} />
            <AvatarGroup names={CARE_TEAM} max={3} size="xs" compact />
          </>
        ),
      },
    ],
    a11y: [
      'The name is exposed via title and image alt text; initials are presentational.',
      'Fallback colours are identity, not meaning — never encode status in an avatar.',
      'Initial pairs render at AA contrast on every colour in the fixed palette.',
    ],
  },
  {
    slug: 'badge',
    name: 'Badge',
    group: 'Data display',
    summary: 'Status and metadata pills with semantic tones.',
    props: [
      { name: 'tone', type: "'success' | 'warning' | 'danger' | 'neutral' | 'lime' | 'info'", default: "'neutral'", description: 'Semantic colour pairing (soft background + AA text).' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Leading status dot.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'The label — tones never appear without text.' },
      { name: 'status (StatusPill)', type: 'string', required: true, description: 'StatusPill — a domain status; the status→tone mapping lives in one place.' },
      { name: 'children (Tag)', type: 'ReactNode', required: true, description: 'Tag — quiet neutral meta pill (versions, counts, codes).' },
    ],
    description:
      'Badge carries semantic tones; Tag is the quiet meta pill for things like versions and counts; StatusPill maps domain statuses (draft, approved, rejected…) onto tones in one place so the same status always looks the same.',
    code: `<Badge tone="success" dot>Active</Badge>
<StatusPill status="pending" />
<Tag>v2.4</Tag>`,
    examples: [
      {
        title: 'Tones — all six',
        body: (
          <>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="lime">Lime · brand</Badge>
          </>
        ),
      },
      {
        title: 'With status dot',
        body: (
          <>
            <Badge tone="success" dot>
              Claim approved
            </Badge>
            <Badge tone="warning" dot>
              Awaiting results
            </Badge>
            <Badge tone="danger" dot>
              Rejected
            </Badge>
          </>
        ),
      },
      {
        title: 'StatusPill & Tag',
        note: 'StatusPill owns the status→tone mapping; Tag stays neutral.',
        body: (
          <>
            <StatusPill status="active" />
            <StatusPill status="pending" />
            <StatusPill status="completed" />
            <Tag>WCAG 2.2 AA</Tag>
            <Tag>v1.0</Tag>
          </>
        ),
      },
    ],
    a11y: [
      'Colour is always paired with a text label — tones alone never carry the message.',
      'All tone pairings meet 4.5:1 text contrast on their soft backgrounds.',
      'Statuses read as plain words (underscores stripped), so screen readers announce them naturally.',
    ],
  },
  {
    slug: 'card',
    name: 'Card',
    group: 'Data display',
    summary: 'The base surface — raised white, recessed panel, and dark variants.',
    props: [
      { name: 'inset', type: 'boolean', default: 'false', description: 'Recessed gray panel for nesting inside a raised card.' },
      { name: 'dark', type: 'boolean', default: 'false', description: 'Ink surface with light text, for rare emphasis.' },
      { name: 'pad', type: 'boolean', default: 'true', description: 'Built-in padding; disable to control it yourself.' },
      { name: 'title (CardHeader)', type: 'ReactNode', required: true, description: 'CardHeader — renders as a real h3.' },
      { name: 'subtitle / action (CardHeader)', type: 'ReactNode', description: 'CardHeader — context line and right-aligned action slot.' },
      { name: '…rest', type: 'HTMLAttributes', description: 'Card passes through div props (style, onClick…).' },
    ],
    description:
      'Cards are the unit of layout: white with a hairline border by default, `inset` for nested quiet panels, `dark` for the occasional ink surface. CardHeader standardises the title / subtitle / action row.',
    code: `<Card>
  <CardHeader title="Today's clinic" subtitle="18 appointments" action={<Button size="sm" variant="secondary">View</Button>} />
  …
</Card>`,
    examples: [
      {
        title: 'Variants',
        wide: true,
        body: (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm font-medium text-forest">Raised</p>
              <p className="mt-1 text-[13px] text-forest-400">White on canvas with a hairline border.</p>
            </Card>
            <Card inset>
              <p className="text-sm font-medium text-forest">Inset</p>
              <p className="mt-1 text-[13px] text-forest-400">Recessed gray for nested panels.</p>
            </Card>
            <Card dark>
              <p className="text-sm font-medium">Dark</p>
              <p className="mt-1 text-[13px] text-white/60">Ink surface for rare emphasis.</p>
            </Card>
          </div>
        ),
      },
      {
        title: 'With header',
        wide: true,
        body: (
          <Card className="max-w-md">
            <CardHeader
              title="Today's clinic"
              subtitle="18 appointments · 3 walk-ins"
              action={
                <Button size="sm" variant="secondary">
                  View all
                </Button>
              }
            />
            <div className="mt-4 flex items-center gap-3 rounded-3xl bg-panel px-4 py-3">
              <Stethoscope size={16} className="text-azure" />
              <p className="text-[13px] text-forest-500">Next: Ngozi Eze · 10:20 · Room 4</p>
            </div>
          </Card>
        ),
      },
    ],
    a11y: [
      'CardHeader renders a real heading (h3) so pages keep an outline.',
      'Nested surfaces follow concentric radius — inner tiles are one step tighter than the card.',
      'The dark variant keeps secondary text at 60% white, which passes AA on ink.',
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    group: 'Data display',
    summary: 'Data table with pagination, empty state and clickable rows.',
    props: [
      { name: 'columns', type: 'Column<Row>[]', required: true, description: '{ key, header, cell(row), align?, headClassName?, cellClassName? } per column.' },
      { name: 'rows', type: 'Row[]', required: true, description: 'The data; the component paginates it.' },
      { name: 'rowKey', type: '(row, index) => string', required: true, description: 'Stable key per row.' },
      { name: 'pageSize', type: 'number', default: '8', description: 'Rows per page; the pager appears only on overflow.' },
      { name: 'onRowClick', type: '(row) => void', description: 'Makes rows clickable with hover feedback.' },
      { name: 'empty', type: 'ReactNode', description: 'Custom empty state; defaults to the illustrated EmptyState.' },
      { name: 'rowClassName / rowId', type: '(row, index) => string', description: 'Per-row class or DOM id hooks.' },
    ],
    description:
      'Columns are declared as data — key, header, alignment and a cell renderer — so tables stay consistent without hand-rolled markup. Numbers align right in tabular figures; the pager appears only when rows overflow a page.',
    code: `<DataTable
  columns={columns}
  rows={facilities}
  rowKey={(f) => f.id}
  pageSize={6}
  onRowClick={(f) => open(f)}
/>`,
    examples: [
      {
        title: 'With pagination',
        note: 'Nine rows, six per page — the pager renders itself.',
        wide: true,
        body: (
          <DataTable columns={tableColumns} rows={FACILITIES} rowKey={(f) => f.id} pageSize={6} />
        ),
      },
      {
        title: 'Empty state',
        wide: true,
        body: <DataTable columns={tableColumns} rows={[]} rowKey={(f: Facility) => f.id} />,
      },
    ],
    a11y: [
      'Real <table> semantics with <th> headers — screen readers announce column context per cell.',
      'Numeric cells use tabular figures, so values align and comparisons scan.',
      'Clickable rows show a pointer and hover tint; keep a real link or button in the row for keyboard users.',
      'The empty state explains what the table would contain, not just “no data”.',
    ],
  },
  {
    slug: 'progress',
    name: 'Progress',
    group: 'Data display',
    summary: 'Linear and circular progress — completeness, utilisation, capacity.',
    props: [
      { name: 'value', type: 'number', required: true, description: '0–100, clamped.' },
      { name: 'tone', type: "'brand' | 'success' | 'warning' | 'danger'", default: "'brand'", description: 'Fill colour following status semantics.' },
      { name: 'label', type: 'string', description: 'Names the measure; also the aria-label.' },
      { name: 'showValue', type: 'boolean', default: 'bar: false · circle: true', description: 'Shows the percentage as text.' },
      { name: 'size / strokeWidth (Circle)', type: 'number', default: '56 / 5', description: 'ProgressCircle — outer diameter and ring width in px.' },
    ],
    description:
      'ProgressBar for inline completeness (uploads, checklists, claim batches); ProgressCircle when a single utilisation number is the point (bed occupancy, storage). Tones follow status semantics.',
    code: `<ProgressBar value={68} label="Claim batch processed" showValue />
<ProgressCircle value={82} label="Bed occupancy" />`,
    examples: [
      {
        title: 'Bars — all four tones',
        wide: true,
        body: (
          <div className="max-w-md space-y-4">
            <ProgressBar value={68} label="Claim batch processed" showValue />
            <ProgressBar value={34} label="Vaccination coverage" tone="success" showValue />
            <ProgressBar value={92} label="Bed occupancy" tone="warning" showValue />
            <ProgressBar value={98} label="ICU capacity" tone="danger" showValue />
          </div>
        ),
      },
      {
        title: 'Circles — all four tones',
        body: (
          <>
            <ProgressCircle value={82} label="Bed occupancy" />
            <ProgressCircle value={64} tone="success" label="Theatre utilisation" />
            <ProgressCircle value={88} tone="warning" label="Pharmacy stock" />
            <ProgressCircle value={95} tone="danger" label="ICU capacity" size={64} />
          </>
        ),
      },
    ],
    a11y: [
      'Both wear role="progressbar" with aria-valuenow and an aria-label naming the measure.',
      'Values show as text (showValue / centre label) — the fill is never the only signal.',
      'Tones follow status semantics and always accompany a labelled context.',
    ],
  },
  {
    slug: 'rating',
    name: 'Rating',
    group: 'Data display',
    summary: 'Star rating — interactive for feedback, read-only for scores.',
    props: [
      { name: 'value', type: 'number', required: true, description: 'Filled stars.' },
      { name: 'onChange', type: '(value: number) => void', description: 'Makes it interactive; omit for read-only.' },
      { name: 'max', type: 'number', default: '5', description: 'Total stars.' },
      { name: 'size', type: 'number', default: '18', description: 'Star size in px.' },
    ],
    description:
      'Patient-satisfaction surveys and facility scores. With onChange it is a radiogroup of stars; without, a read-only image with a text equivalent.',
    code: `<Rating value={stars} onChange={setStars} />
<Rating value={4} />  // read-only`,
    examples: [
      { title: 'Interactive', body: <RatingExample /> },
      {
        title: 'Read-only score',
        body: (
          <span className="flex items-center gap-2">
            <Rating value={4} />
            <span className="tnum text-[13px] text-forest-400">4.0 · 212 reviews</span>
          </span>
        ),
      },
    ],
    a11y: [
      'Interactive mode is a radiogroup — each star is “n stars”, arrow/click to set.',
      'Read-only mode is role="img" with “n of 5 stars” as its label.',
      'Filled vs empty differs by fill and tone, backed by the text score beside it.',
    ],
  },
  {
    slug: 'divider',
    name: 'Divider',
    group: 'Data display',
    summary: 'Hairline separators — plain, labelled, or vertical.',
    props: [
      { name: 'label', type: 'ReactNode', description: 'Centered small-caps text between the rules.' },
      { name: 'vertical', type: 'boolean', default: 'false', description: 'Full-height rule for inline meta rows.' },
      { name: 'className', type: 'string', description: 'Spacing overrides.' },
    ],
    code: `<Divider />
<Divider label="or" />
<Divider vertical />`,
    examples: [
      {
        title: 'Variants',
        wide: true,
        body: (
          <div className="max-w-md space-y-5">
            <Divider />
            <Divider label="Earlier today" />
            <div className="flex items-center text-[13px] text-forest-500">
              <span>Garki General</span>
              <Divider vertical />
              <span>Cardiology</span>
              <Divider vertical />
              <span className="tnum">Room 4</span>
            </div>
          </div>
        ),
      },
    ],
    a11y: [
      'Rendered as a separator (hr / role="separator") so structure is announced.',
      'Labelled dividers keep the label as real text between the rules.',
      'Vertical rules carry aria-orientation="vertical".',
    ],
  },
  {
    slug: 'kbd',
    name: 'Kbd',
    group: 'Data display',
    summary: 'Keyboard-key chips for shortcut hints.',
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'The key — one chip per key in a combination.' },
      { name: 'className', type: 'string', description: 'Size/colour overrides.' },
    ],
    code: `Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command menu.`,
    examples: [
      {
        title: 'In context',
        wide: true,
        body: (
          <div className="max-w-md space-y-3 text-sm text-forest-500">
            <p className="flex items-center gap-1.5">
              Press <Kbd>⌘</Kbd>
              <Kbd>K</Kbd> to open the command menu.
            </p>
            <div className="flex items-center justify-between rounded-2xl bg-panel px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-[13px] font-medium text-forest">
                <Command size={14} className="text-forest-300" />
                Quick search
              </span>
              <span className="flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </div>
          </div>
        ),
      },
    ],
    a11y: [
      'Uses the semantic <kbd> element, so assistive tech knows it is keyboard input.',
      'Chips sit beside their action’s name — never a bare shortcut with no label.',
      'Contrast on the panel background meets AA at the 11px size.',
    ],
  },
]
