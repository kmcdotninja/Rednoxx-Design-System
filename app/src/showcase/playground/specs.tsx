import { useState } from 'react'
import { Bell, Download, Plus, Search as SearchIcon } from 'lucide-react'
import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardHeader,
  Checkbox,
  CodeBlock,
  CodeInput,
  ColorPicker,
  Combobox,
  CommandMenu,
  DataTable,
  DatePicker,
  Divider,
  DotStepper,
  faceUrl,
  Field,
  Drawer,
  Dropdown,
  HorizontalStepper,
  Input,
  Kbd,
  Modal,
  Pagination,
  Popover,
  ProgressBar,
  ProgressCircle,
  ProgressMeter,
  RadioGroup,
  Rating,
  SearchInput,
  Segmented,
  Select,
  SelectMenu,
  SWATCHES,
  Slider,
  StatusPill,
  Stepper,
  Tabs,
  Tag,
  Toggle,
  Tooltip,
  InfoTip,
  VerticalTabs,
  useToast,
  type TabItem,
} from '@/components/ui'
import { cn } from '@/lib/cn'
import { attr, toList, type PlaygroundSpec } from './types'

/** Narrow a raw control value to one of a component's literal union options. */
function pick<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return (options as readonly string[]).includes(value as string) ? (value as T) : fallback
}

/* Icon slots (Button leftIcon/rightIcon, Dropdown item icons) are ReactNode
   props, so the rail offers a named set rather than free text. */
const ICONS = { none: null, plus: Plus, download: Download, bell: Bell, search: SearchIcon } as const
export const ICON_NAMES = Object.keys(ICONS)

function icon(value: unknown) {
  const Icon = ICONS[String(value) as keyof typeof ICONS]
  return Icon ? <Icon size={15} /> : undefined
}

/** The JSX an icon control produces, for the generated snippet. */
function iconAttr(prop: string, value: unknown) {
  const name = String(value)
  if (name === 'none') return ''
  const component = name.charAt(0).toUpperCase() + name.slice(1)
  return ` ${prop}={<${component === 'Search' ? 'Search' : component} size={15} />}`
}

const s = (v: unknown) => String(v)
const b = (v: unknown) => Boolean(v)
const n = (v: unknown) => Number(v)

/* ================================== Forms ================================= */

const BTN_VARIANTS = ['primary', 'secondary', 'ghost', 'subtle', 'danger', 'lime'] as const
const BTN_SIZES = ['sm', 'md', 'lg'] as const

const buttonSpec: PlaygroundSpec = {
  presets: [
    { id: 'primary', label: 'Primary action', values: { variant: 'primary', label: 'Save changes' } },
    { id: 'destructive', label: 'Destructive', values: { variant: 'danger', label: 'Void order' } },
    { id: 'toolbar', label: 'Toolbar ghost', values: { variant: 'ghost', size: 'sm', label: 'Export' } },
    { id: 'loading', label: 'Saving state', values: { variant: 'primary', label: 'Saving…', loading: true } },
  ],
  controls: [
    { name: 'variant', kind: 'radio', options: [...BTN_VARIANTS], default: 'primary' },
    { name: 'size', kind: 'select', options: [...BTN_SIZES], default: 'md' },
    { name: 'label', kind: 'text', default: 'Save changes' },
    { name: 'leftIcon', kind: 'icon', options: ICON_NAMES, default: 'none' },
    { name: 'rightIcon', kind: 'icon', options: ICON_NAMES, default: 'none' },
    { name: 'block', kind: 'boolean', default: false },
    { name: 'loading', kind: 'boolean', default: false },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => (
    <Button
      variant={pick(v.variant, BTN_VARIANTS, 'primary')}
      size={pick(v.size, BTN_SIZES, 'md')}
      leftIcon={icon(v.leftIcon)}
      rightIcon={icon(v.rightIcon)}
      block={b(v.block)}
      loading={b(v.loading)}
      disabled={b(v.disabled)}
    >
      {s(v.label)}
    </Button>
  ),
  code: (v) =>
    `<Button${attr('variant', s(v.variant), 'primary')}${attr('size', s(v.size), 'md')}` +
    `${iconAttr('leftIcon', v.leftIcon)}${iconAttr('rightIcon', v.rightIcon)}` +
    `${attr('block', b(v.block))}${attr('loading', b(v.loading))}${attr('disabled', b(v.disabled))}>\n` +
    `  ${v.label}\n</Button>`,
}

const inputSpec: PlaygroundSpec = {
  presets: [
    { id: 'default', label: 'Default', values: { label: 'Patient name', hint: '', invalid: false, error: '' } },
    { id: 'required', label: 'Required', values: { label: 'Surname', required: true, hint: 'As written on the ID document' } },
    { id: 'invalid', label: 'Invalid', values: { label: 'Date of birth', invalid: true, error: 'That date is in the future.' } },
    { id: 'disabled', label: 'Disabled', values: { label: 'MRN', disabled: true, value: 'GGH-004213' } },
  ],
  canvasClassName: 'w-full max-w-sm',
  controls: [
    { name: 'label', kind: 'text', default: 'Patient name' },
    { name: 'placeholder', kind: 'text', default: 'e.g. Amina Bello' },
    { name: 'hint', kind: 'text', default: '' },
    { name: 'error', kind: 'text', default: '', showWhen: (v) => b(v.invalid) },
    { name: 'required', kind: 'boolean', default: false },
    { name: 'optional', kind: 'boolean', default: false },
    { name: 'invalid', kind: 'boolean', default: false },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => (
    <div className="w-full">
      {/* Every input sits in Field — Field owns the label, hint and error. */}
      <Field
        label={s(v.label)}
        hint={s(v.hint) || undefined}
        error={b(v.invalid) ? s(v.error) || undefined : undefined}
        required={b(v.required)}
        optional={b(v.optional)}
      >
        <Input
          placeholder={s(v.placeholder)}
          invalid={b(v.invalid)}
          disabled={b(v.disabled)}
          defaultValue={s(v.value ?? '')}
        />
      </Field>
    </div>
  ),
  code: (v) =>
    `<Field\n  label="${v.label}"` +
    `${v.hint ? `\n  hint="${v.hint}"` : ''}` +
    `${b(v.invalid) && v.error ? `\n  error="${v.error}"` : ''}` +
    `${b(v.required) ? '\n  required' : ''}${b(v.optional) ? '\n  optional' : ''}\n>\n` +
    `  <Input placeholder="${v.placeholder}"${b(v.invalid) ? ' invalid' : ''}${b(v.disabled) ? ' disabled' : ''} />\n</Field>`,
}

const selectSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-sm',
  controls: [
    { name: 'label', kind: 'text', default: 'Facility' },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => (
    <div className="w-full">
      <Field label={s(v.label)}>
        <Select disabled={b(v.disabled)} defaultValue="ggh">
          <option value="ggh">Garki General Hospital</option>
          <option value="wch">Wuse Cottage Hospital</option>
          <option value="nch">Nyanya Community Health Centre</option>
        </Select>
      </Field>
    </div>
  ),
  code: (v) =>
    `<Field label="${v.label}">\n  <Select${b(v.disabled) ? ' disabled' : ''}>\n` +
    `    <option value="ggh">Garki General Hospital</option>\n  </Select>\n</Field>`,
}

function SelectMenuPreview({ invalid, disabled, placeholder }: { invalid: boolean; disabled: boolean; placeholder: string }) {
  const [value, setValue] = useState('p2')
  return (
    <SelectMenu
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      invalid={invalid}
      disabled={disabled}
      options={[
        { value: 'p1', label: 'Ngozi Amara Eze', hint: 'GGH-004213' },
        { value: 'p2', label: 'Tunde Olusegun Bakare', hint: 'GGH-004876' },
        { value: 'p3', label: 'Hassan Danladi', hint: 'GGH-003448', disabled: true },
      ]}
      className="w-72"
    />
  )
}

const selectMenuSpec: PlaygroundSpec = {
  controls: [
    { name: 'placeholder', kind: 'text', default: 'Choose a patient' },
    { name: 'invalid', kind: 'boolean', default: false },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => (
    <SelectMenuPreview invalid={b(v.invalid)} disabled={b(v.disabled)} placeholder={s(v.placeholder)} />
  ),
  code: (v) =>
    `const [value, setValue] = useState('p2')\n\n<SelectMenu\n  value={value}\n  onChange={setValue}\n` +
    `  placeholder="${v.placeholder}"${b(v.invalid) ? '\n  invalid' : ''}${b(v.disabled) ? '\n  disabled' : ''}\n` +
    `  options={[\n    { value: 'p1', label: 'Ngozi Amara Eze', hint: 'GGH-004213' },\n  ]}\n/>`,
}

function ComboboxPreview({ placeholder, searchPlaceholder, emptyText, disabled }: Record<string, string | boolean>) {
  const [value, setValue] = useState('')
  return (
    <Combobox
      value={value}
      onChange={setValue}
      placeholder={s(placeholder)}
      searchPlaceholder={s(searchPlaceholder)}
      emptyText={s(emptyText)}
      disabled={b(disabled)}
      options={[
        { value: 'j45', label: 'J45 — Asthma' },
        { value: 'e11', label: 'E11 — Type 2 diabetes mellitus' },
        { value: 'i10', label: 'I10 — Essential hypertension' },
      ]}
      className="w-72"
    />
  )
}

const comboboxSpec: PlaygroundSpec = {
  controls: [
    { name: 'placeholder', kind: 'text', default: 'Search diagnoses' },
    { name: 'searchPlaceholder', kind: 'text', default: 'Type a code or term' },
    { name: 'emptyText', kind: 'text', default: 'No matching code' },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => <ComboboxPreview {...v} />,
  code: (v) =>
    `<Combobox\n  value={value}\n  onChange={setValue}\n  placeholder="${v.placeholder}"\n` +
    `  searchPlaceholder="${v.searchPlaceholder}"\n  emptyText="${v.emptyText}"\n  options={CODES}\n/>`,
}

const datePickerSpec: PlaygroundSpec = {
  controls: [{ name: 'placeholder', kind: 'text', default: 'Select a date' }],
  render: (v) => (
    <div className="w-64">
      <DatePicker placeholder={s(v.placeholder)} />
    </div>
  ),
  code: (v) => `<DatePicker placeholder="${v.placeholder}" onChange={setDate} />`,
}

const searchSpec: PlaygroundSpec = {
  controls: [
    { name: 'placeholder', kind: 'text', default: 'Search patients by name or MRN' },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => (
    <div className="w-80">
      <SearchInput placeholder={s(v.placeholder)} disabled={b(v.disabled)} aria-label="Search patients" />
    </div>
  ),
  code: (v) => `<SearchInput placeholder="${v.placeholder}" aria-label="Search patients" />`,
}

function CheckboxPreview({ label, description, disabled }: Record<string, string | boolean>) {
  const [checked, setChecked] = useState(true)
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label={s(label)}
      description={s(description) || undefined}
      disabled={b(disabled)}
    />
  )
}

const checkboxSpec: PlaygroundSpec = {
  presets: [
    { id: 'plain', label: 'Plain', values: { label: 'Send SMS reminder', description: '' } },
    {
      id: 'verification',
      label: 'Safety verification',
      values: {
        label: 'I have verified these are the same patient',
        description: 'Required before a merge can be confirmed.',
      },
    },
  ],
  controls: [
    { name: 'label', kind: 'text', default: 'Send SMS reminder' },
    { name: 'description', kind: 'text', default: '' },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => <CheckboxPreview {...v} />,
  code: (v) =>
    `<Checkbox\n  checked={checked}\n  onChange={setChecked}\n  label="${v.label}"` +
    `${v.description ? `\n  description="${v.description}"` : ''}\n/>`,
}

function RadioPreview({ label, inline }: Record<string, string | boolean>) {
  const [value, setValue] = useState('routine')
  return (
    <RadioGroup
      label={s(label)}
      inline={b(inline)}
      value={value}
      onChange={setValue}
      options={[
        { value: 'routine', label: 'Routine' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'stat', label: 'STAT' },
      ]}
    />
  )
}

const radioSpec: PlaygroundSpec = {
  controls: [
    { name: 'label', kind: 'text', default: 'Order priority' },
    { name: 'inline', kind: 'boolean', default: false },
  ],
  render: (v) => <RadioPreview {...v} />,
  code: (v) =>
    `<RadioGroup\n  label="${v.label}"${b(v.inline) ? '\n  inline' : ''}\n  value={value}\n  onChange={setValue}\n` +
    `  options={[{ value: 'routine', label: 'Routine' }]}\n/>`,
}

function SliderPreview({ label, min, max, step, disabled }: Record<string, string | number | boolean>) {
  const [value, setValue] = useState(6)
  return (
    <div className="w-72">
      <Slider
        label={s(label)}
        min={n(min)}
        max={n(max)}
        step={n(step)}
        disabled={b(disabled)}
        value={value}
        onChange={setValue}
      />
    </div>
  )
}

const sliderSpec: PlaygroundSpec = {
  controls: [
    { name: 'label', kind: 'text', default: 'Pain score' },
    { name: 'min', kind: 'number', default: 0, min: 0, max: 10 },
    { name: 'max', kind: 'number', default: 10, min: 1, max: 100 },
    { name: 'step', kind: 'number', default: 1, min: 1, max: 10 },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => <SliderPreview {...v} />,
  code: (v) =>
    `<Slider\n  label="${v.label}"\n  min={${v.min}}\n  max={${v.max}}\n  step={${v.step}}\n` +
    `  value={value}\n  onChange={setValue}\n/>`,
}

function TogglePreview({ label, disabled }: Record<string, string | boolean>) {
  const [checked, setChecked] = useState(true)
  return <Toggle checked={checked} onChange={setChecked} label={s(label)} disabled={b(disabled)} />
}

const switchSpec: PlaygroundSpec = {
  controls: [
    { name: 'label', kind: 'text', default: 'Notify on critical results' },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => <TogglePreview {...v} />,
  code: (v) => `<Toggle checked={on} onChange={setOn} label="${v.label}" />`,
}

function ColorPickerPreview({ label }: Record<string, string>) {
  // Seed from the component's own palette rather than a literal hex.
  const [value, setValue] = useState(SWATCHES[0])
  return <ColorPicker label={s(label)} value={value} onChange={setValue} />
}

const colorPickerSpec: PlaygroundSpec = {
  controls: [{ name: 'label', kind: 'text', default: 'Department colour' }],
  render: (v) => <ColorPickerPreview label={s(v.label)} />,
  code: (v) => `<ColorPicker label="${v.label}" value={colour} onChange={setColour} />`,
}

function CodeInputPreview({ length, error, disabled }: Record<string, string | number | boolean>) {
  const [value, setValue] = useState('')
  return <CodeInput length={n(length)} error={b(error)} disabled={b(disabled)} value={value} onChange={setValue} />
}

const digitInputSpec: PlaygroundSpec = {
  controls: [
    { name: 'length', kind: 'number', default: 6, min: 4, max: 8 },
    { name: 'error', kind: 'boolean', default: false },
    { name: 'disabled', kind: 'boolean', default: false },
  ],
  render: (v) => <CodeInputPreview {...v} />,
  code: (v) =>
    `<CodeInput length={${v.length}}${b(v.error) ? ' error' : ''} value={code} onChange={setCode} onComplete={verify} />`,
}

/* ============================== Data display ============================== */

const AVATAR_SIZES = ['xs', 'sm', 'md', 'lg'] as const
const AVATAR_KINDS = ['Avatar', 'AvatarGroup'] as const
const SAMPLE_FACE = faceUrl('amina')

const avatarSpec: PlaygroundSpec = {
  presets: [
    { id: 'initials', label: 'Initials', values: { kind: 'Avatar', src: false, size: 'md' } },
    { id: 'photo', label: 'With photo', values: { kind: 'Avatar', src: true, size: 'lg' } },
    { id: 'stack', label: 'Care team stack', values: { kind: 'AvatarGroup', max: 4, compact: false } },
    { id: 'dense', label: 'Dense row', values: { kind: 'AvatarGroup', max: 3, compact: true } },
  ],
  controls: [
    { name: 'kind', kind: 'radio', label: 'Component', options: [...AVATAR_KINDS], default: 'Avatar' },
    { name: 'size', kind: 'select', options: [...AVATAR_SIZES], default: 'md' },
    { name: 'ring', kind: 'boolean', default: true },
    { name: 'name', kind: 'text', default: 'Amina Bello', showWhen: (v) => v.kind === 'Avatar' },
    { name: 'src', kind: 'boolean', label: 'Photo', default: false, showWhen: (v) => v.kind === 'Avatar' },
    {
      name: 'names',
      kind: 'list',
      label: 'Names',
      placeholder: 'Add a team member',
      default: 'Amina Bello, Dayo Adeleke, Dara Nwosu, Deborah Boyi, Efe Otu, Nkechi Eze',
      showWhen: (v) => v.kind === 'AvatarGroup',
    },
    { name: 'max', kind: 'number', default: 4, min: 1, max: 8, indent: true, showWhen: (v) => v.kind === 'AvatarGroup' },
    { name: 'compact', kind: 'boolean', default: false, indent: true, showWhen: (v) => v.kind === 'AvatarGroup' },
  ],
  render: (v) =>
    v.kind === 'AvatarGroup' ? (
      <AvatarGroup
        names={toList(v.names)}
        max={n(v.max)}
        compact={b(v.compact)}
        // AvatarGroup tops out at md — a stack of lg avatars would break the row.
        size={pick(v.size, ['xs', 'sm', 'md'] as const, 'md')}
      />
    ) : (
      <Avatar
        name={s(v.name)}
        src={b(v.src) ? SAMPLE_FACE : undefined}
        size={pick(v.size, AVATAR_SIZES, 'md')}
        ring={b(v.ring)}
      />
    ),
  code: (v) =>
    v.kind === 'AvatarGroup'
      ? `<AvatarGroup\n  names={${JSON.stringify(toList(v.names))}}\n  max={${v.max}}` +
        `${attr('size', s(v.size), 'md')}${b(v.compact) ? '\n  compact' : ''}\n/>`
      : `<Avatar name="${v.name}"${b(v.src) ? ' src={photoUrl}' : ''}` +
        `${attr('size', s(v.size), 'md')}${b(v.ring) ? '' : ' ring={false}'} />`,
}

const BADGE_TONES = ['neutral', 'success', 'warning', 'danger', 'info', 'lime'] as const

const BADGE_KINDS = ['Badge', 'Tag', 'StatusPill'] as const

const badgeSpec: PlaygroundSpec = {
  presets: [
    { id: 'active', label: 'Active', values: { kind: 'Badge', tone: 'success', label: 'Active', dot: true } },
    { id: 'critical', label: 'Critical result', values: { kind: 'Badge', tone: 'danger', label: 'Critical', dot: true } },
    { id: 'tag', label: 'Tag', values: { kind: 'Tag', label: 'Forms' } },
    { id: 'status', label: 'Status pill', values: { kind: 'StatusPill', status: 'In progress' } },
  ],
  controls: [
    { name: 'kind', kind: 'radio', label: 'Component', options: [...BADGE_KINDS], default: 'Badge' },
    { name: 'tone', kind: 'select', options: [...BADGE_TONES], default: 'success', showWhen: (v) => v.kind === 'Badge' },
    { name: 'dot', kind: 'boolean', default: true, showWhen: (v) => v.kind === 'Badge' },
    { name: 'label', kind: 'text', label: 'children', default: 'Active', showWhen: (v) => v.kind !== 'StatusPill' },
    { name: 'status', kind: 'text', default: 'In progress', showWhen: (v) => v.kind === 'StatusPill' },
  ],
  render: (v) => {
    if (v.kind === 'Tag') return <Tag>{s(v.label)}</Tag>
    if (v.kind === 'StatusPill') return <StatusPill status={s(v.status)} />
    return (
      <Badge tone={pick(v.tone, BADGE_TONES, 'neutral')} dot={b(v.dot)}>
        {s(v.label)}
      </Badge>
    )
  },
  code: (v) =>
    v.kind === 'Tag'
      ? `<Tag>${v.label}</Tag>`
      : v.kind === 'StatusPill'
        ? `<StatusPill status="${v.status}" />`
        : `<Badge${attr('tone', s(v.tone), 'neutral')}${attr('dot', b(v.dot))}>${v.label}</Badge>`,
}

const cardSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-md',
  presets: [
    { id: 'plain', label: 'Plain', values: { header: false, inset: false, dark: false, pad: true } },
    { id: 'header', label: 'With header', values: { header: true, action: false } },
    { id: 'action', label: 'Header + action', values: { header: true, action: true } },
    { id: 'dark', label: 'Dark', values: { header: true, dark: true } },
  ],
  controls: [
    { name: 'header', kind: 'boolean', label: 'CardHeader', default: true },
    { name: 'title', kind: 'text', default: 'Recent vitals', indent: true, showWhen: (v) => b(v.header) },
    { name: 'subtitle', kind: 'text', default: 'Last recorded 09:41', indent: true, showWhen: (v) => b(v.header) },
    { name: 'action', kind: 'boolean', default: false, indent: true, showWhen: (v) => b(v.header) },
    { name: 'inset', kind: 'boolean', default: false },
    { name: 'dark', kind: 'boolean', default: false },
    { name: 'pad', kind: 'boolean', default: true },
  ],
  render: (v) => (
    <Card inset={b(v.inset)} dark={b(v.dark)} pad={b(v.pad)} className="w-full">
      {b(v.header) && (
        <CardHeader
          title={s(v.title)}
          subtitle={s(v.subtitle) || undefined}
          action={b(v.action) ? <Button size="sm" variant="ghost">View all</Button> : undefined}
        />
      )}
      <p className={cn('text-[13px]', b(v.dark) ? 'text-navy-100' : 'text-forest-400', b(v.header) && 'mt-3')}>
        BP 128/84 · HR 72 · Temp 36.8 °C
      </p>
    </Card>
  ),
  code: (v) =>
    `<Card${b(v.inset) ? ' inset' : ''}${b(v.dark) ? ' dark' : ''}${b(v.pad) ? '' : ' pad={false}'}>\n` +
    (b(v.header)
      ? `  <CardHeader title="${v.title}"${v.subtitle ? ` subtitle="${v.subtitle}"` : ''}` +
        `${b(v.action) ? ' action={<Button size="sm" variant="ghost">View all</Button>}' : ''} />\n`
      : '') +
    `  …\n</Card>`,
}

interface OrderRow {
  id: string
  patient: string
  test: string
  priority: 'Routine' | 'Urgent' | 'Stat'
  /** Turnaround in minutes — the numeric column, sorted numerically. */
  tat: number
  status: 'Ready' | 'In progress' | 'Collected'
}

const ORDER_ROWS: OrderRow[] = [
  { id: 'FBC-20841', patient: 'Ngozi Eze', test: 'Full blood count', priority: 'Routine', tat: 42, status: 'Ready' },
  { id: 'U&E-20842', patient: 'Tunde Bakare', test: 'Urea & electrolytes', priority: 'Urgent', tat: 28, status: 'Ready' },
  { id: 'LFT-20843', patient: 'Hauwa Musa', test: 'Liver function', priority: 'Routine', tat: 96, status: 'In progress' },
  { id: 'CRP-20844', patient: 'Ikenna Obi', test: 'C-reactive protein', priority: 'Stat', tat: 15, status: 'Ready' },
  { id: 'HBA-20845', patient: 'Zainab Lawal', test: 'HbA1c', priority: 'Routine', tat: 188, status: 'Collected' },
  { id: 'TFT-20846', patient: 'Yemi Adeola', test: 'Thyroid function', priority: 'Routine', tat: 124, status: 'Collected' },
  { id: 'MCS-20847', patient: 'Emeka Uche', test: 'Urine M/C/S', priority: 'Urgent', tat: 61, status: 'In progress' },
  { id: 'MPS-20848', patient: 'Aisha Bello', test: 'Malaria parasites', priority: 'Stat', tat: 9, status: 'Ready' },
  { id: 'CLT-20849', patient: 'Chidi Nwosu', test: 'Clotting screen', priority: 'Urgent', tat: 33, status: 'Ready' },
  { id: 'GXP-20850', patient: 'Fatima Sani', test: 'GeneXpert TB', priority: 'Routine', tat: 240, status: 'Collected' },
  { id: 'BLC-20851', patient: 'Segun Ojo', test: 'Blood culture', priority: 'Stat', tat: 18, status: 'In progress' },
  { id: 'VIT-20852', patient: 'Grace Okon', test: 'Vitamin D', priority: 'Routine', tat: 310, status: 'Collected' },
]

const TABLE_DENSITIES = ['compact', 'default', 'relaxed'] as const
const HEAD_TONES = ['plain', 'panel'] as const
const PAGINATION_MODES = ['auto', 'always', 'none'] as const

const PRIORITY_TONE = { Routine: 'neutral', Urgent: 'warning', Stat: 'danger' } as const
const STATUS_TONE = { Ready: 'success', 'In progress': 'info', Collected: 'neutral' } as const

function orderColumns(sortable: boolean) {
  return [
    { key: 'id', header: 'Order', sortable, cell: (r: OrderRow) => <span className="tnum font-medium text-forest">{r.id}</span> },
    { key: 'patient', header: 'Patient', sortable, cell: (r: OrderRow) => r.patient },
    { key: 'test', header: 'Test', cell: (r: OrderRow) => r.test },
    {
      key: 'priority',
      header: 'Priority',
      sortable,
      cell: (r: OrderRow) => <Badge tone={PRIORITY_TONE[r.priority]}>{r.priority}</Badge>,
    },
    {
      key: 'tat',
      header: 'TAT',
      align: 'right' as const,
      sortable,
      sortValue: (r: OrderRow) => r.tat,
      cell: (r: OrderRow) => <span className="tnum">{r.tat}m</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable,
      cell: (r: OrderRow) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>,
    },
  ]
}

const tableSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-4xl',
  presets: [
    {
      id: 'worklist',
      label: 'Lab worklist',
      values: {
        container: true, density: 'compact', headTone: 'panel', sortable: true, zebra: false,
        selectable: false, clickable: true, stickyHeader: false, pagination: 'auto', pageSize: 6,
        pageSizeOptions: false, showRange: true, rowCount: 12, loading: false,
      },
    },
    {
      id: 'selection',
      label: 'Selectable + rows per page',
      values: {
        container: true, density: 'default', headTone: 'panel', sortable: true, selectable: true,
        clickable: false, pagination: 'always', pageSize: 6, pageSizeOptions: true, showRange: true,
        rowCount: 12, loading: false,
      },
    },
    {
      id: 'scroll',
      label: 'Sticky header',
      values: {
        container: true, density: 'compact', headTone: 'panel', stickyHeader: true, maxHeight: 320,
        pagination: 'none', sortable: true, zebra: true, rowCount: 12, loading: false,
      },
    },
    {
      id: 'loading',
      label: 'Loading',
      values: { container: true, loading: true, rowCount: 12, density: 'default', headTone: 'panel' },
    },
    {
      id: 'empty',
      label: 'Empty state',
      values: { container: true, rowCount: 0, loading: false, pagination: 'auto' },
    },
  ],
  controls: [
    { name: 'container', kind: 'boolean', default: true },
    { name: 'density', kind: 'radio', options: [...TABLE_DENSITIES], default: 'compact' },
    { name: 'headTone', kind: 'select', options: [...HEAD_TONES], default: 'panel' },
    { name: 'caption', kind: 'text', default: 'Lab orders' },
    { name: 'rowCount', kind: 'number', label: 'rows', default: 12, min: 0, max: 12 },
    { name: 'emptyText', kind: 'text', label: 'empty', default: 'No lab orders yet.', indent: true, showWhen: (v) => n(v.rowCount) === 0 },
    { name: 'loading', kind: 'boolean', default: false },
    { name: 'sortable', kind: 'boolean', label: 'sortable columns', default: true },
    { name: 'selectable', kind: 'boolean', default: false },
    { name: 'clickable', kind: 'boolean', label: 'onRowClick', default: true },
    { name: 'zebra', kind: 'boolean', default: false },
    { name: 'hoverable', kind: 'boolean', default: true },
    { name: 'stickyHeader', kind: 'boolean', default: false },
    { name: 'maxHeight', kind: 'number', default: 320, min: 160, max: 640, step: 40, indent: true, showWhen: (v) => b(v.stickyHeader) },
    { name: 'pagination', kind: 'select', options: [...PAGINATION_MODES], default: 'auto' },
    { name: 'pageSize', kind: 'number', default: 6, min: 2, max: 12, indent: true, showWhen: (v) => s(v.pagination) !== 'none' },
    { name: 'pageSizeOptions', kind: 'boolean', label: 'rows-per-page picker', default: false, indent: true, showWhen: (v) => s(v.pagination) !== 'none' },
    { name: 'showRange', kind: 'boolean', default: true, indent: true, showWhen: (v) => s(v.pagination) !== 'none' },
  ],
  render: (v) => (
    <div className="w-full">
      <DataTable
        rows={ORDER_ROWS.slice(0, n(v.rowCount))}
        rowKey={(r) => r.id}
        columns={orderColumns(b(v.sortable))}
        caption={s(v.caption)}
        container={b(v.container)}
        density={pick(v.density, TABLE_DENSITIES, 'compact')}
        headTone={pick(v.headTone, HEAD_TONES, 'panel')}
        zebra={b(v.zebra)}
        hoverable={b(v.hoverable)}
        selectable={b(v.selectable)}
        onRowClick={b(v.clickable) ? () => {} : undefined}
        loading={b(v.loading)}
        stickyHeader={b(v.stickyHeader)}
        maxHeight={b(v.stickyHeader) ? n(v.maxHeight) : undefined}
        pagination={pick(v.pagination, PAGINATION_MODES, 'auto')}
        pageSize={n(v.pageSize)}
        pageSizeOptions={b(v.pageSizeOptions) ? [6, 8, 12] : undefined}
        showRange={b(v.showRange)}
        defaultSort={b(v.sortable) ? { key: 'tat', dir: 'asc' } : undefined}
        empty={s(v.emptyText)}
      />
    </div>
  ),
  code: (v) => {
    const paged = s(v.pagination) !== 'none'
    return (
      `<DataTable\n  rows={orders}\n  rowKey={(r) => r.id}\n  columns={columns}\n` +
      `  caption="${v.caption}"\n` +
      `${b(v.container) ? '  container\n' : ''}` +
      `${s(v.density) === 'default' ? '' : `  density="${v.density}"\n`}` +
      `${s(v.headTone) === 'panel' ? '  headTone="panel"\n' : ''}` +
      `${b(v.zebra) ? '  zebra\n' : ''}` +
      `${b(v.hoverable) ? '' : '  hoverable={false}\n'}` +
      `${b(v.selectable) ? '  selectable\n' : ''}` +
      `${b(v.clickable) ? '  onRowClick={(row) => open(row)}\n' : ''}` +
      `${b(v.loading) ? '  loading\n' : ''}` +
      `${b(v.stickyHeader) ? `  stickyHeader\n  maxHeight={${v.maxHeight}}\n` : ''}` +
      `${paged ? '' : '  pagination="none"\n'}` +
      `${s(v.pagination) === 'always' ? '  pagination="always"\n' : ''}` +
      `${paged ? `  pageSize={${v.pageSize}}\n` : ''}` +
      `${paged && b(v.pageSizeOptions) ? '  pageSizeOptions={[6, 8, 12]}\n' : ''}` +
      `${paged && !b(v.showRange) ? '  showRange={false}\n' : ''}` +
      `${b(v.sortable) ? '  defaultSort={{ key: \'tat\', dir: \'asc\' }}\n' : ''}` +
      `${n(v.rowCount) === 0 ? `  empty="${v.emptyText}"\n` : ''}` +
      `/>`
    )
  },
}

const PROGRESS_TONES = ['brand', 'success', 'warning', 'danger'] as const

const PROGRESS_KINDS = ['ProgressBar', 'ProgressCircle', 'ProgressMeter'] as const

const progressSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-sm',
  presets: [
    { id: 'bar', label: 'Bar', values: { kind: 'ProgressBar', value: 68, tone: 'brand', showValue: true } },
    { id: 'circle', label: 'Circle', values: { kind: 'ProgressCircle', value: 72, size: 56, strokeWidth: 5 } },
    { id: 'meter', label: 'Meter', values: { kind: 'ProgressMeter', value: 91, tone: 'danger' } },
  ],
  controls: [
    { name: 'kind', kind: 'radio', label: 'Component', options: [...PROGRESS_KINDS], default: 'ProgressBar' },
    { name: 'value', kind: 'number', default: 68, min: 0, max: 100, step: 1 },
    { name: 'tone', kind: 'select', options: [...PROGRESS_TONES], default: 'brand' },
    { name: 'label', kind: 'text', default: 'Bed occupancy', showWhen: (v) => v.kind !== 'ProgressMeter' },
    { name: 'showValue', kind: 'boolean', default: true, showWhen: (v) => v.kind !== 'ProgressMeter' },
    { name: 'size', kind: 'number', default: 56, min: 16, max: 120, indent: true, showWhen: (v) => v.kind !== 'ProgressBar' },
    { name: 'strokeWidth', kind: 'number', default: 5, min: 2, max: 12, indent: true, showWhen: (v) => v.kind !== 'ProgressBar' },
  ],
  render: (v) => {
    const tone = pick(v.tone, PROGRESS_TONES, 'brand')
    if (v.kind === 'ProgressCircle')
      return (
        <ProgressCircle
          value={n(v.value)}
          tone={tone}
          label={s(v.label)}
          showValue={b(v.showValue)}
          size={n(v.size)}
          strokeWidth={n(v.strokeWidth)}
        />
      )
    // ProgressMeter is the compact dial — no label or value readout.
    if (v.kind === 'ProgressMeter')
      return <ProgressMeter value={n(v.value)} tone={tone} size={n(v.size)} strokeWidth={n(v.strokeWidth)} />
    return (
      <div className="w-full">
        <ProgressBar value={n(v.value)} tone={tone} label={s(v.label)} showValue={b(v.showValue)} />
      </div>
    )
  },
  code: (v) =>
    v.kind === 'ProgressCircle'
      ? `<ProgressCircle value={${v.value}}${attr('tone', s(v.tone), 'brand')} size={${v.size}} strokeWidth={${v.strokeWidth}} />`
      : v.kind === 'ProgressMeter'
        ? `<ProgressMeter value={${v.value}}${attr('tone', s(v.tone), 'brand')} size={${v.size}} />`
      : `<${v.kind} value={${v.value}}${attr('tone', s(v.tone), 'brand')} label="${v.label}"${b(v.showValue) ? ' showValue' : ''} />`,
}

function RatingPreview({ max, size }: Record<string, number | string | boolean>) {
  const [value, setValue] = useState(4)
  return <Rating value={value} onChange={setValue} max={n(max)} size={n(size)} />
}

const ratingSpec: PlaygroundSpec = {
  controls: [
    { name: 'max', kind: 'number', default: 5, min: 3, max: 10 },
    { name: 'size', kind: 'number', default: 18, min: 12, max: 36 },
  ],
  render: (v) => <RatingPreview {...v} />,
  code: (v) => `<Rating value={score} onChange={setScore} max={${v.max}} size={${v.size}} />`,
}

const dividerSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-sm',
  controls: [
    { name: 'label', kind: 'text', default: 'or' },
    { name: 'vertical', kind: 'boolean', default: false },
  ],
  render: (v) =>
    b(v.vertical) ? (
      <div className="flex h-16 items-center gap-4">
        <span className="text-[13px] text-forest-400">Left</span>
        <Divider vertical />
        <span className="text-[13px] text-forest-400">Right</span>
      </div>
    ) : (
      <div className="w-full">
        <Divider label={s(v.label) || undefined} />
      </div>
    ),
  code: (v) => (b(v.vertical) ? `<Divider vertical />` : `<Divider label="${v.label}" />`),
}

const kbdSpec: PlaygroundSpec = {
  controls: [{ name: 'keys', kind: 'text', default: '⌘K' }],
  render: (v) => <Kbd>{s(v.keys)}</Kbd>,
  code: (v) => `<Kbd>${v.keys}</Kbd>`,
}

const codeBlockSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-lg',
  controls: [
    { name: 'label', kind: 'text', default: 'Usage' },
    { name: 'variant', kind: 'select', options: ['dark', 'plain'], default: 'dark' },
  ],
  render: (v) => (
    <div className="w-full">
      <CodeBlock
        label={s(v.label) || undefined}
        variant={pick(v.variant, ['dark', 'plain'] as const, 'dark')}
        code={'<Button variant="primary">Save changes</Button>'}
      />
    </div>
  ),
  code: (v) => `<CodeBlock label="${v.label}" variant="${v.variant}" code={snippet} />`,
}

/* ================================ Feedback ================================ */

const ALERT_TONES = ['info', 'success', 'warning', 'danger'] as const

const alertSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-lg',
  presets: [
    { id: 'info', label: 'Informational', values: { tone: 'info', title: 'Working offline', body: '2 items will sync when connection returns.' } },
    { id: 'allergy', label: 'Allergy warning', values: { tone: 'danger', title: 'Penicillin allergy on record', body: 'Amoxicillin is a penicillin-class antibiotic.' } },
    { id: 'saved', label: 'Success', values: { tone: 'success', title: 'Order sent to pharmacy', body: '' } },
  ],
  controls: [
    { name: 'tone', kind: 'radio', options: [...ALERT_TONES], default: 'info' },
    { name: 'title', kind: 'text', default: 'Working offline' },
    { name: 'body', kind: 'text', default: '2 items will sync when connection returns.' },
    { name: 'dismissible', kind: 'boolean', default: false },
    { name: 'action', kind: 'boolean', default: false },
  ],
  render: (v) => (
    <div className="w-full">
      <Alert
        tone={pick(v.tone, ALERT_TONES, 'info')}
        title={s(v.title)}
        onDismiss={b(v.dismissible) ? () => {} : undefined}
        action={b(v.action) ? <Button size="sm" variant="secondary">Retry</Button> : undefined}
      >
        {s(v.body) || undefined}
      </Alert>
    </div>
  ),
  code: (v) =>
    `<Alert${attr('tone', s(v.tone), 'info')} title="${v.title}"${b(v.dismissible) ? '\n  onDismiss={dismiss}' : ''}>\n` +
    `  ${v.body}\n</Alert>`,
}

function ToastPreview({ tone, title, description }: Record<string, string | boolean>) {
  const toast = useToast()
  const fire = () => {
    const t = s(tone)
    if (t === 'success') toast.success(s(title), s(description) || undefined)
    else if (t === 'error') toast.error(s(title), s(description) || undefined)
    else toast.info(s(title), s(description) || undefined)
  }
  return <Button onClick={fire}>Show toast</Button>
}

const toastSpec: PlaygroundSpec = {
  controls: [
    { name: 'tone', kind: 'radio', options: ['success', 'error', 'info'], default: 'success' },
    { name: 'title', kind: 'text', default: 'Vitals saved' },
    { name: 'description', kind: 'text', default: 'Recorded at 09:41' },
  ],
  render: (v) => <ToastPreview {...v} />,
  code: (v) => `const toast = useToast()\n\ntoast.${v.tone}('${v.title}', '${v.description}')`,
}

function ModalPreview({ size, title, subtitle }: Record<string, string | boolean>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={pick(size, ['md', 'lg'] as const, 'md')}
        title={s(title)}
        subtitle={s(subtitle) || undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>Merge records</Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-forest-500">
          This cannot be undone from this screen and will be recorded in the audit log.
        </p>
      </Modal>
    </>
  )
}

const dialogSpec: PlaygroundSpec = {
  controls: [
    { name: 'size', kind: 'select', options: ['md', 'lg'], default: 'md' },
    { name: 'title', kind: 'text', default: 'Merge patient records' },
    { name: 'subtitle', kind: 'text', default: 'Amina Bello · MRN 004213' },
  ],
  render: (v) => <ModalPreview {...v} />,
  code: (v) =>
    `<Modal\n  open={open}\n  onClose={close}\n  size="${v.size}"\n  title="${v.title}"\n  subtitle="${v.subtitle}"\n  footer={<>…</>}\n>\n  …\n</Modal>`,
}

function DrawerPreview({ size, title, subtitle }: Record<string, string | boolean>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        size={pick(size, ['md', 'lg', 'xl', '2xl'] as const, 'md')}
        title={s(title)}
        subtitle={s(subtitle) || undefined}
        footer={<Button onClick={() => setOpen(false)}>Apply filters</Button>}
      >
        <p className="text-sm leading-relaxed text-forest-500">Filter controls go here.</p>
      </Drawer>
    </>
  )
}

const drawerSpec: PlaygroundSpec = {
  controls: [
    { name: 'size', kind: 'select', options: ['md', 'lg', 'xl', '2xl'], default: 'md' },
    { name: 'title', kind: 'text', default: 'Filter lab orders' },
    { name: 'subtitle', kind: 'text', default: '' },
  ],
  render: (v) => <DrawerPreview {...v} />,
  code: (v) => `<Drawer open={open} onClose={close} size="${v.size}" title="${v.title}">\n  …\n</Drawer>`,
}

const TOOLTIP_SIDES = ['top', 'bottom', 'left', 'right'] as const
const TOOLTIP_SIZES = ['xs', 'sm', 'md'] as const

const tooltipSpec: PlaygroundSpec = {
  controls: [
    { name: 'kind', kind: 'radio', label: 'Component', options: ['Tooltip', 'InfoTip'], default: 'Tooltip' },
    { name: 'content', kind: 'text', default: 'Recorded by Dr. Femi Alade' },
    { name: 'side', kind: 'radio', options: [...TOOLTIP_SIDES], default: 'top', showWhen: (v) => v.kind === 'Tooltip' },
    { name: 'size', kind: 'select', options: [...TOOLTIP_SIZES], default: 'sm', showWhen: (v) => v.kind === 'Tooltip' },
  ],
  render: (v) =>
    v.kind === 'InfoTip' ? (
      <InfoTip content={s(v.content)} />
    ) : (
      <Tooltip
        content={s(v.content)}
        side={pick(v.side, TOOLTIP_SIDES, 'top')}
        size={pick(v.size, TOOLTIP_SIZES, 'sm')}
      >
        <Button variant="secondary" leftIcon={<Bell size={15} />}>
          Hover me
        </Button>
      </Tooltip>
    ),
  code: (v) =>
    v.kind === 'InfoTip'
      ? `<InfoTip content="${v.content}" />`
      : `<Tooltip content="${v.content}"${attr('side', s(v.side), 'top')}${attr('size', s(v.size), 'sm')}>\n  <Button>Hover me</Button>\n</Tooltip>`,
}

/* =============================== Navigation =============================== */

const TAB_SIZES = ['md', 'lg'] as const

function TabsPreview({ size, counts }: { size: 'md' | 'lg'; counts: boolean }) {
  const [value, setValue] = useState('upcoming')
  const items: TabItem<string>[] = [
    { value: 'upcoming', label: 'Upcoming', count: counts ? 18 : undefined },
    { value: 'past', label: 'Past', count: counts ? 214 : undefined },
    { value: 'cancelled', label: 'Cancelled', count: counts ? 3 : undefined },
  ]
  return (
    <div className="w-full max-w-md border-b border-hair">
      <Tabs size={size} items={items} value={value} onChange={setValue} />
    </div>
  )
}

function VerticalTabsPreview({ counts }: { counts: boolean }) {
  const [value, setValue] = useState('upcoming')
  const items: TabItem<string>[] = [
    { value: 'upcoming', label: 'Upcoming', count: counts ? 18 : undefined },
    { value: 'past', label: 'Past', count: counts ? 214 : undefined },
    { value: 'cancelled', label: 'Cancelled', count: counts ? 3 : undefined },
  ]
  return (
    <div className="w-56">
      <VerticalTabs items={items} value={value} onChange={setValue} />
    </div>
  )
}

const tabsSpec: PlaygroundSpec = {
  canvasClassName: 'w-full',
  presets: [
    { id: 'horizontal', label: 'Horizontal', values: { kind: 'Tabs', size: 'md', counts: true } },
    { id: 'large', label: 'Large', values: { kind: 'Tabs', size: 'lg', counts: false } },
    { id: 'vertical', label: 'Vertical', values: { kind: 'VerticalTabs', counts: true } },
  ],
  controls: [
    { name: 'kind', kind: 'radio', label: 'Component', options: ['Tabs', 'VerticalTabs'], default: 'Tabs' },
    { name: 'size', kind: 'select', options: [...TAB_SIZES], default: 'md', showWhen: (v) => v.kind === 'Tabs' },
    { name: 'counts', kind: 'boolean', label: 'item.count', default: true },
  ],
  render: (v) =>
    v.kind === 'VerticalTabs' ? (
      <VerticalTabsPreview counts={b(v.counts)} />
    ) : (
      <TabsPreview size={pick(v.size, TAB_SIZES, 'md')} counts={b(v.counts)} />
    ),
  code: (v) =>
    `<Tabs${attr('size', s(v.size), 'md')}\n  value={value}\n  onChange={setValue}\n  items={[\n` +
    `    { value: 'upcoming', label: 'Upcoming'${v.counts ? ', count: 18' : ''} },\n  ]}\n/>`,
}

const SEG_SIZES = ['sm', 'md'] as const

function SegmentedPreview({ size, block }: { size: 'sm' | 'md'; block: boolean }) {
  const [value, setValue] = useState('week')
  return (
    <div className={block ? 'w-full max-w-sm' : undefined}>
      <Segmented
        size={size}
        block={block}
        value={value}
        onChange={setValue}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />
    </div>
  )
}

const segmentedSpec: PlaygroundSpec = {
  controls: [
    { name: 'size', kind: 'select', options: [...SEG_SIZES], default: 'md' },
    { name: 'block', kind: 'boolean', default: false },
  ],
  render: (v) => <SegmentedPreview size={pick(v.size, SEG_SIZES, 'md')} block={b(v.block)} />,
  code: (v) =>
    `<Segmented${attr('size', s(v.size), 'md')}${attr('block', b(v.block))}\n  value={value}\n  onChange={setValue}\n  options={RANGES}\n/>`,
}

const accordionSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-lg',
  controls: [{ name: 'multiple', kind: 'boolean', default: false }],
  render: (v) => (
    <div className="w-full">
      <Accordion
        multiple={b(v.multiple)}
        defaultOpen={[0]}
        items={[
          { title: 'Allergies', content: <p className="text-[13px] text-forest-400">Penicillin — anaphylaxis.</p> },
          { title: 'Problem list', content: <p className="text-[13px] text-forest-400">Type 2 diabetes; hypertension.</p> },
          { title: 'Medications', content: <p className="text-[13px] text-forest-400">Metformin 500 mg twice daily.</p> },
        ]}
      />
    </div>
  ),
  code: (v) => `<Accordion${b(v.multiple) ? ' multiple' : ''} defaultOpen={[0]} items={items} />`,
}

const STEPPER_KINDS = ['vertical', 'horizontal', 'dots'] as const

const stepperSpec: PlaygroundSpec = {
  canvasClassName: 'w-full max-w-md',
  controls: [
    { name: 'kind', kind: 'radio', options: [...STEPPER_KINDS], default: 'horizontal' },
    { name: 'current', kind: 'number', default: 1, min: 0, max: 3 },
  ],
  render: (v) => {
    const labels = ['Identify', 'Demographics', 'Coverage', 'Confirm']
    const kind = pick(v.kind, STEPPER_KINDS, 'horizontal')
    if (kind === 'dots') return <DotStepper count={4} current={n(v.current)} />
    if (kind === 'horizontal')
      return (
        <div className="w-full">
          <HorizontalStepper steps={labels} current={n(v.current)} />
        </div>
      )
    return (
      <div className="w-full">
        <Stepper steps={labels.map((label) => ({ title: label, label }))} current={n(v.current)} />
      </div>
    )
  },
  code: (v) =>
    v.kind === 'dots'
      ? `<DotStepper count={4} current={${v.current}} />`
      : v.kind === 'horizontal'
        ? `<HorizontalStepper steps={STEPS} current={${v.current}} />`
        : `<Stepper steps={STEPS} current={${v.current}} />`,
}

function PaginationPreview({ pages }: Record<string, string | number | boolean>) {
  const [page, setPage] = useState(1)
  return <Pagination page={Math.min(page, n(pages))} pages={n(pages)} onChange={setPage} />
}

const paginationSpec: PlaygroundSpec = {
  controls: [{ name: 'pages', kind: 'number', default: 8, min: 2, max: 30 }],
  render: (v) => <PaginationPreview {...v} />,
  code: (v) => `<Pagination page={page} pages={${v.pages}} onChange={setPage} />`,
}

const breadcrumbSpec: PlaygroundSpec = {
  controls: [{ name: 'depth', kind: 'number', default: 3, min: 1, max: 4 }],
  render: (v) => {
    const all = [
      { label: 'Patients', to: '#' },
      { label: 'Ngozi Eze', to: '#' },
      { label: 'Lab results', to: '#' },
      { label: 'FBC-20841' },
    ]
    return <Breadcrumb items={all.slice(0, n(v.depth))} />
  },
  code: (v) => `<Breadcrumb items={crumbs.slice(0, ${v.depth})} />`,
}

/* ================================ Overlays ================================ */

const dropdownSpec: PlaygroundSpec = {
  controls: [{ name: 'block', kind: 'boolean', default: false }],
  render: (v) => (
    <div className={b(v.block) ? 'w-64' : undefined}>
      <Dropdown
        block={b(v.block)}
        trigger={<Button variant="secondary" rightIcon={<Plus size={15} />}>Row actions</Button>}
        items={[
          { label: 'View record', onSelect: () => {} },
          { label: 'Download', icon: Download, onSelect: () => {} },
          { label: 'Void order', danger: true, onSelect: () => {} },
        ]}
      />
    </div>
  ),
  code: (v) => `<Dropdown${b(v.block) ? ' block' : ''}\n  trigger={<Button>Row actions</Button>}\n  items={actions}\n/>`,
}

const popoverSpec: PlaygroundSpec = {
  controls: [{ name: 'label', kind: 'text', default: 'Notifications' }],
  render: (v) => (
    <Popover trigger={<Button variant="secondary" leftIcon={<Bell size={15} />}>{s(v.label)}</Button>}>
      <div className="w-64 p-4">
        <p className="text-[13px] font-medium text-forest">3 critical results</p>
        <p className="mt-1 text-[13px] text-forest-400">Awaiting your acknowledgement.</p>
      </div>
    </Popover>
  ),
  code: (v) => `<Popover trigger={<Button>${v.label}</Button>}>\n  …\n</Popover>`,
}

function CommandMenuPreview({ placeholder }: Record<string, string | boolean>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" leftIcon={<SearchIcon size={15} />} onClick={() => setOpen(true)}>
        Open palette <Kbd>⌘K</Kbd>
      </Button>
      <CommandMenu
        open={open}
        onClose={() => setOpen(false)}
        placeholder={s(placeholder)}
        commands={[
          { id: 'patients', label: 'Find patient', group: 'Navigate', onSelect: () => setOpen(false) },
          { id: 'order', label: 'New lab order', group: 'Create', onSelect: () => setOpen(false) },
          { id: 'audit', label: 'Open audit log', group: 'Navigate', onSelect: () => setOpen(false) },
        ]}
      />
    </>
  )
}

const commandMenuSpec: PlaygroundSpec = {
  controls: [{ name: 'placeholder', kind: 'text', default: 'Search patients, orders, screens…' }],
  render: (v) => <CommandMenuPreview {...v} />,
  code: (v) =>
    `const [open, setOpen] = useCommandMenu()\n\n<CommandMenu open={open} onClose={close} placeholder="${v.placeholder}" commands={commands} />`,
}

/* --------------------------------------------------------------------------
   Registry — slug → spec. Every documented component has one, so the Preview
   tab and Controls rail are always live. */

export const PLAYGROUNDS: Record<string, PlaygroundSpec> = {
  // Forms
  button: buttonSpec,
  input: inputSpec,
  select: selectSpec,
  'select-menu': selectMenuSpec,
  combobox: comboboxSpec,
  datepicker: datePickerSpec,
  search: searchSpec,
  checkbox: checkboxSpec,
  radio: radioSpec,
  slider: sliderSpec,
  switch: switchSpec,
  'color-picker': colorPickerSpec,
  'digit-input': digitInputSpec,
  // Data display
  avatar: avatarSpec,
  badge: badgeSpec,
  card: cardSpec,
  table: tableSpec,
  progress: progressSpec,
  rating: ratingSpec,
  divider: dividerSpec,
  kbd: kbdSpec,
  'code-block': codeBlockSpec,
  // Feedback
  alert: alertSpec,
  toast: toastSpec,
  dialog: dialogSpec,
  drawer: drawerSpec,
  tooltip: tooltipSpec,
  // Navigation
  tabs: tabsSpec,
  segmented: segmentedSpec,
  accordion: accordionSpec,
  stepper: stepperSpec,
  pagination: paginationSpec,
  breadcrumb: breadcrumbSpec,
  // Overlays
  dropdown: dropdownSpec,
  popover: popoverSpec,
  'command-menu': commandMenuSpec,
}
