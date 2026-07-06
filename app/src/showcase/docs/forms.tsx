import { useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, CalendarPlus, Download, Plus } from 'lucide-react'
import {
  Button,
  ButtonGroup,
  Checkbox,
  CodeInput,
  ColorPicker,
  Combobox,
  DatePicker,
  Field,
  FileUpload,
  Input,
  PasswordInput,
  RadioGroup,
  SearchInput,
  Select,
  Slider,
  Tag,
  Textarea,
  TimePicker,
  Toggle,
} from '@/components/ui'
import { FACILITIES } from '../health'
import type { ComponentDoc } from '../types'

function ComboboxExample() {
  const [value, setValue] = useState<string | undefined>('f2')
  return (
    <div className="w-72">
      <Combobox
        options={FACILITIES.map((f) => ({ value: f.id, label: f.name, hint: f.city }))}
        value={value}
        onChange={setValue}
        placeholder="Select a facility"
        searchPlaceholder="Search facilities…"
      />
    </div>
  )
}

function DatePickerExample() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-3">
      <Field label="Appointment date">
        <DatePicker value={date} onChange={setDate} />
      </Field>
      <Field label="Time">
        <TimePicker value={time} onChange={setTime} />
      </Field>
    </div>
  )
}

function CheckboxExample() {
  const [consents, setConsents] = useState({ data: true, sms: true, research: false })
  const set = (key: keyof typeof consents) => (next: boolean) =>
    setConsents((c) => ({ ...c, [key]: next }))
  return (
    <div className="w-full max-w-md space-y-3.5">
      <Checkbox
        checked={consents.data}
        onChange={set('data')}
        label="Share records across facilities"
        description="Clinicians at any member facility can view this patient's history."
      />
      <Checkbox
        checked={consents.sms}
        onChange={set('sms')}
        label="SMS appointment reminders"
      />
      <Checkbox
        checked={consents.research}
        onChange={set('research')}
        label="Anonymised research participation"
        description="De-identified data only; withdrawable at any time."
      />
      <Checkbox checked={false} onChange={() => {}} label="Managed by the organization" disabled />
    </div>
  )
}

function RadioExample() {
  const [priority, setPriority] = useState('routine')
  return (
    <div className="w-full max-w-md">
      <RadioGroup
        label="Order priority"
        value={priority}
        onChange={setPriority}
        options={[
          { value: 'routine', label: 'Routine', description: 'Results within 24 hours.' },
          { value: 'urgent', label: 'Urgent', description: 'Results within 4 hours; flagged to the lab.' },
          { value: 'stat', label: 'STAT', description: 'Immediate — clinician is paged on completion.' },
        ]}
      />
    </div>
  )
}

function RadioInlineExample() {
  const [sex, setSex] = useState('female')
  return (
    <RadioGroup
      inline
      label="Sex at birth"
      value={sex}
      onChange={setSex}
      options={[
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
        { value: 'intersex', label: 'Intersex' },
        { value: 'unknown', label: 'Not recorded', disabled: true },
      ]}
    />
  )
}

function SliderExample() {
  const [pain, setPain] = useState(4)
  const [dose, setDose] = useState(500)
  return (
    <div className="w-full max-w-md space-y-6">
      <Slider label="Pain score" value={pain} onChange={setPain} min={0} max={10} format={(v) => `${v} / 10`} />
      <Slider label="Amoxicillin dose" value={dose} onChange={setDose} min={250} max={1000} step={250} format={(v) => `${v} mg`} />
    </div>
  )
}

function SwitchExample() {
  const [on, setOn] = useState(true)
  return <Toggle checked={on} onChange={setOn} label="SMS appointment reminders" />
}

function ColorPickerExample() {
  const [color, setColor] = useState('#5833fb')
  return (
    <div className="space-y-3">
      <ColorPicker value={color} onChange={setColor} label="Calendar colour" />
      <p className="flex items-center gap-2 text-[13px] text-forest-400">
        Selected
        <Tag className="tnum">{color}</Tag>
      </p>
    </div>
  )
}

function DigitInputExample() {
  const [code, setCode] = useState('')
  return (
    <div className="space-y-3">
      <CodeInput value={code} onChange={setCode} />
      <p className="tnum text-[13px] text-forest-400">Value: {code.replace(/ /g, '·') || '—'}</p>
    </div>
  )
}

export const FORM_DOCS: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'Forms',
    summary: 'Actions and commands — six variants, three sizes, optional icon slots.',
    props: [
      { name: 'variant', type: "'primary' | 'lime' | 'secondary' | 'subtle' | 'ghost' | 'danger'", default: "'primary'", description: 'Visual weight; lime is the legacy name for the solid-ink style.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'sm is the compact button for dense toolbars and rows.' },
      { name: 'block', type: 'boolean', default: 'false', description: 'Stretch to the full width of the container.' },
      { name: 'leftIcon / rightIcon', type: 'ReactNode', description: 'Icon slots with built-in spacing.' },
      { name: '…rest', type: 'ButtonHTMLAttributes', description: 'Everything a native button accepts (onClick, disabled, type…). ButtonLink takes LinkProps instead.' },
    ],
    description:
      'Primary is the brand-violet call to action — one per view. Ink is the quiet solid for dark-on-light emphasis; secondary and subtle carry everything routine; ghost sits inside toolbars; danger is reserved for destructive confirmation. Size sm is the compact button; ButtonLink renders a router link in any of these clothes.',
    code: `<Button leftIcon={<Plus size={15} />}>New enrolment</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Void prescription</Button>`,
    examples: [
      {
        title: 'Variants',
        body: (
          <>
            <Button>Primary</Button>
            <Button variant="lime">Ink</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </>
        ),
      },
      {
        title: 'Sizes & icons',
        note: 'Icons ride the built-in slots so spacing stays consistent.',
        body: (
          <>
            <Button size="lg" leftIcon={<Plus size={16} />}>
              New enrolment
            </Button>
            <Button leftIcon={<Download size={15} />} variant="secondary">
              Export
            </Button>
            <Button size="sm" variant="subtle" leftIcon={<CalendarPlus size={14} />}>
              Schedule
            </Button>
          </>
        ),
      },
      {
        title: 'States',
        note: 'Disabled drops to 40% opacity and ignores pointer events; press scales to 0.96.',
        body: (
          <>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </>
        ),
      },
      {
        title: 'Full width',
        note: 'block stretches the button to its container — form footers and auth cards.',
        wide: true,
        body: (
          <div className="max-w-xs">
            <Button block>Sign in</Button>
          </div>
        ),
      },
      {
        title: 'Button group',
        note: 'Attached buttons acting as one control — borders collapse between them.',
        body: (
          <>
            <ButtonGroup aria-label="Text alignment">
              <Button variant="secondary" size="sm" aria-label="Align left">
                <AlignLeft size={15} />
              </Button>
              <Button variant="secondary" size="sm" aria-label="Align centre">
                <AlignCenter size={15} />
              </Button>
              <Button variant="secondary" size="sm" aria-label="Align right">
                <AlignRight size={15} />
              </Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Period">
              <Button variant="secondary" size="sm">
                Day
              </Button>
              <Button variant="secondary" size="sm" className="bg-panel">
                Week
              </Button>
              <Button variant="secondary" size="sm">
                Month
              </Button>
            </ButtonGroup>
          </>
        ),
      },
    ],
    a11y: [
      'Focus is always visible — a 2px brand ring offset from the button.',
      'md and lg meet the 40px hit-area minimum; use sm only inside dense rows that are themselves clickable.',
      'Icon-only buttons must pass an aria-label; the icon itself is decorative.',
      'Disabled buttons stay in the accessibility tree so context is not lost.',
    ],
  },
  {
    slug: 'input',
    name: 'Input',
    group: 'Forms',
    summary: 'Single-line text entry with label, hint, required, disabled and password states.',
    props: [
      { name: 'label', type: 'ReactNode', description: 'Field — the visible label above the control.' },
      { name: 'hint', type: 'ReactNode', description: 'Field — helper text under the control.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Field — shows the asterisk on the label.' },
      { name: 'optional', type: 'boolean', default: 'false', description: 'Field — shows a quiet “Optional” tag.' },
      { name: 'error', type: 'ReactNode', description: 'Field — validation message; replaces the hint and announces as role="alert".' },
      { name: 'invalid', type: 'boolean', default: 'false', description: 'Input/Textarea/Select — danger border and focus ring, sets aria-invalid.' },
      { name: '…rest', type: 'InputHTMLAttributes', description: 'Input/Textarea pass through all native props (type, value, placeholder, disabled…).' },
    ],
    description:
      'Always pair inputs with Field — it renders the label, the required asterisk, the optional tag and the hint, and wires the click-to-focus association. Placeholders are examples, never labels.',
    code: `<Field label="National ID" required hint="11 digits, no spaces.">
  <Input placeholder="e.g. 35112204711" />
</Field>`,
    examples: [
      {
        title: 'With label and hint',
        wide: true,
        body: (
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="Patient name" required>
              <Input placeholder="Full legal name" />
            </Field>
            <Field label="Phone" optional hint="Used for appointment reminders.">
              <Input type="tel" placeholder="+234 …" />
            </Field>
          </div>
        ),
      },
      {
        title: 'Error state',
        note: 'invalid paints the control; Field’s error replaces the hint and announces as an alert.',
        wide: true,
        body: (
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="National ID" required error="Must be exactly 11 digits — this has 9.">
              <Input invalid defaultValue="351122047" />
            </Field>
            <Field label="Work email" required error="Use your facility-issued address.">
              <Input invalid type="email" defaultValue="amina@gmail.com" />
            </Field>
          </div>
        ),
      },
      {
        title: 'Password',
        note: 'PasswordInput hides the value behind type="password" and adds an eye toggle to reveal it. The invalid and disabled states carry over from Input.',
        wide: true,
        body: (
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="Password" required hint="Click the eye to reveal what you typed.">
              <PasswordInput defaultValue="Garki@2026" />
            </Field>
            <Field label="Confirm password" required error="Passwords don’t match yet.">
              <PasswordInput invalid defaultValue="Garki@202" />
            </Field>
          </div>
        ),
      },
      {
        title: 'Disabled and multiline',
        wide: true,
        body: (
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="Enrolment ID" hint="Assigned automatically.">
              <Input value="RDX-2026-018274" disabled readOnly />
            </Field>
            <Field label="Clinical notes">
              <Textarea rows={3} placeholder="Presenting complaint, history…" />
            </Field>
          </div>
        ),
      },
      {
        title: 'File upload',
        note: 'Fully interactive — drop files to watch progress; anything over 2 MB fails so the error state is reachable. Documented in depth under Blocks → File upload.',
        wide: true,
        body: (
          <div className="max-w-md">
            <FileUpload label="Upload referral letter" maxSizeMB={2} />
          </div>
        ),
      },
    ],
    a11y: [
      'Field wraps the control in a real <label>, so clicking the label focuses the input.',
      'Required is marked visually and should be enforced in validation copy, not colour alone.',
      'Placeholder text meets 4.5:1 contrast but never substitutes for a label.',
      'Disabled inputs keep their value readable at AA contrast on the gray panel.',
      'The password eye is a real button — labelled “Show password”, keyboard reachable, with aria-pressed reflecting the state.',
    ],
  },
  {
    slug: 'select',
    name: 'Select',
    group: 'Forms',
    summary: 'Native single-choice dropdown styled to the field baseline.',
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Native <option> and <optgroup> elements.' },
      { name: '…rest', type: 'SelectHTMLAttributes', description: 'All native select props (value, defaultValue, onChange, disabled…).' },
    ],
    description:
      'A styled native <select> — it inherits platform keyboard handling, screen-reader semantics and the mobile picker for free. Reach for Combobox only when the list is long enough to need search.',
    code: `<Field label="Department">
  <Select defaultValue="gp">
    <option value="gp">General practice</option>
    <option value="paed">Paediatrics</option>
  </Select>
</Field>`,
    examples: [
      {
        title: 'Basic',
        wide: true,
        body: (
          <div className="max-w-xs">
            <Field label="Department">
              <Select defaultValue="General practice">
                {['General practice', 'Paediatrics', 'Cardiology', 'Laboratory', 'Surgery'].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
            </Field>
          </div>
        ),
      },
      {
        title: 'Grouped options',
        wide: true,
        body: (
          <div className="max-w-xs">
            <Field label="Order type">
              <Select defaultValue="Full blood count">
                <optgroup label="Laboratory">
                  <option>Full blood count</option>
                  <option>Lipid panel</option>
                  <option>Malaria RDT</option>
                </optgroup>
                <optgroup label="Imaging">
                  <option>Chest X-ray</option>
                  <option>Abdominal ultrasound</option>
                </optgroup>
              </Select>
            </Field>
          </div>
        ),
      },
      {
        title: 'Error and disabled',
        wide: true,
        body: (
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Field label="Department" required error="Pick the department before continuing.">
              <Select invalid defaultValue="">
                <option value="" disabled>
                  Select a department
                </option>
                <option>General practice</option>
                <option>Cardiology</option>
              </Select>
            </Field>
            <Field label="Facility" hint="Set by your workspace.">
              <Select disabled defaultValue="Garki General Hospital">
                <option>Garki General Hospital</option>
              </Select>
            </Field>
          </div>
        ),
      },
    ],
    a11y: [
      'Native semantics: arrow keys, type-ahead and screen-reader announcement work out of the box.',
      'The chevron is decorative; the closed control announces the selected option.',
      'On touch devices the platform picker opens, which is the most accessible pattern available.',
    ],
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    group: 'Forms',
    summary: 'Searchable select for long lists — type to filter, full keyboard support.',
    props: [
      { name: 'options', type: 'ComboOption[]', required: true, description: '{ value, label, hint? } — hint renders as quiet right-aligned meta.' },
      { name: 'value', type: 'string', description: 'The selected option value (controlled).' },
      { name: 'onChange', type: '(value: string) => void', description: 'Fired when an option is chosen.' },
      { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Trigger text before a selection exists.' },
      { name: 'searchPlaceholder', type: 'string', default: "'Search…'", description: 'Placeholder inside the filter input.' },
      { name: 'emptyText', type: 'string', default: "'No matches found'", description: 'Shown when the filter matches nothing.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the trigger.' },
    ],
    description:
      'Use for lists long enough that scanning fails — facilities, drugs, ICD codes. Under ~10 options, prefer the plain Select. The optional hint column carries quiet metadata like a city or code.',
    code: `<Combobox
  options={facilities.map((f) => ({ value: f.id, label: f.name, hint: f.city }))}
  value={value}
  onChange={setValue}
  placeholder="Select a facility"
/>`,
    examples: [
      {
        title: 'Filterable list',
        note: 'Arrow keys move, Enter selects, Escape closes. Try typing “clinic”.',
        body: <ComboboxExample />,
      },
      {
        title: 'Disabled',
        body: (
          <div className="w-72">
            <Combobox options={[]} disabled placeholder="Locked by your role" />
          </div>
        ),
      },
    ],
    a11y: [
      'Implements the ARIA combobox pattern: aria-expanded, role="listbox" options and aria-activedescendant tracking.',
      'Full keyboard support — ArrowUp/Down, Home/End, Enter to choose, Escape to dismiss.',
      'The filter input is auto-focused on open so keyboard users land in the right place.',
      'Selection is shown with a check icon and bold text, not colour alone.',
    ],
  },
  {
    slug: 'datepicker',
    name: 'DatePicker',
    group: 'Forms',
    summary: 'Calendar picker with a year grid for far-back dates; emits ISO strings.',
    props: [
      { name: 'value', type: 'string', description: 'ISO date (yyyy-mm-dd), controlled. Omit and use defaultValue for uncontrolled.' },
      { name: 'defaultValue', type: 'string', description: 'Initial value when uncontrolled.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Fired with the ISO string on selection.' },
      { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Trigger text before a date is chosen.' },
      { name: 'align', type: "'left' | 'right'", default: "'left'", description: 'Popover alignment when the trigger sits near an edge. TimePicker shares this API and emits HH:mm.' },
    ],
    description:
      'Click the month header to flip into a 12-year grid — dates of birth are two taps away instead of sixty clicks. Values are plain `yyyy-mm-dd` strings, so they serialise cleanly.',
    code: `<Field label="Appointment date">
  <DatePicker value={date} onChange={setDate} />
</Field>`,
    examples: [
      {
        title: 'Date and time',
        note: 'TimePicker shares the trigger style and emits HH:mm.',
        wide: true,
        body: <DatePickerExample />,
      },
    ],
    a11y: [
      'Month/year navigation buttons carry explicit aria-labels.',
      'Today is marked with a ring in addition to its position; the selection is solid ink.',
      'Escape or an outside click closes the popover without changing the value.',
      'Numbers use tabular figures so the grid never shifts while browsing.',
    ],
  },
  {
    slug: 'search',
    name: 'Search',
    group: 'Forms',
    summary: 'Query input with a leading icon, used across every list screen.',
    props: [
      { name: 'aria-label', type: 'string', required: true, description: 'Names what is being searched — the icon is decorative.' },
      { name: 'wrapClassName', type: 'string', description: 'Classes for the outer wrapper (width, flex).' },
      { name: '…rest', type: 'InputHTMLAttributes', description: 'All native input props (value, onChange, placeholder…).' },
    ],
    description:
      'One search pattern everywhere: icon on the left, value-based filtering as you type. Pair it with actions in the same toolbar row, and Tabs for status buckets on the table below.',
    code: `<SearchInput placeholder="Search patients…" aria-label="Search patients" />`,
    examples: [
      {
        title: 'Basic',
        wide: true,
        body: (
          <div className="max-w-sm">
            <SearchInput placeholder="Search patients, MRNs, phone…" aria-label="Search patients" />
          </div>
        ),
      },
      {
        title: 'In a toolbar',
        note: 'Search owns the left edge; actions keep to the right.',
        wide: true,
        body: (
          <div className="flex max-w-2xl flex-wrap items-center gap-2">
            <SearchInput placeholder="Search lab orders…" aria-label="Search lab orders" wrapClassName="flex-1 min-w-56" />
            <Button variant="secondary" size="sm">
              Status
            </Button>
            <Button size="sm" leftIcon={<Plus size={14} />}>
              New order
            </Button>
          </div>
        ),
      },
    ],
    a11y: [
      'Pass an aria-label naming what is being searched — the icon is decorative.',
      'Results should update politely (no focus steal) as the query changes.',
      'The field keeps the shared 4px brand focus ring for visibility.',
    ],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    summary: 'Binary choices and consent lists, with label and supporting description.',
    props: [
      { name: 'checked', type: 'boolean', required: true, description: 'Controlled checked state.' },
      { name: 'onChange', type: '(checked: boolean) => void', required: true, description: 'Fired on toggle.' },
      { name: 'label', type: 'ReactNode', required: true, description: 'The visible label; clicking it toggles.' },
      { name: 'description', type: 'ReactNode', description: 'Supporting copy under the label, announced with it.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the control at reduced opacity.' },
    ],
    description:
      'A native input under the system box — checkboxes are for choices that take effect on save. Something that applies immediately is a Switch instead.',
    code: `<Checkbox
  checked={consent}
  onChange={setConsent}
  label="Share records across facilities"
  description="Clinicians at any member facility can view this history."
/>`,
    examples: [{ title: 'Consent list', wide: true, body: <CheckboxExample /> }],
    a11y: [
      'A real <input type="checkbox"> inside its label — click anywhere to toggle, Space works.',
      'Descriptions sit inside the label, so screen readers announce the full meaning.',
      'Disabled boxes keep their state visible at reduced opacity.',
    ],
  },
  {
    slug: 'radio',
    name: 'Radio',
    group: 'Forms',
    summary: 'Single choice among a few always-visible options.',
    props: [
      { name: 'options', type: 'RadioOption[]', required: true, description: '{ value, label, description?, disabled? } per option.' },
      { name: 'value', type: 'string', required: true, description: 'The selected option value.' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Fired when a different option is chosen.' },
      { name: 'label', type: 'string', required: true, description: 'Accessible name for the radiogroup.' },
      { name: 'inline', type: 'boolean', default: 'false', description: 'Lay options in a row instead of a column.' },
    ],
    description:
      'Use when all options should be read before choosing — priorities, plans, methods. More than ~5 options, or options that need search, belong in a Select or Combobox.',
    code: `<RadioGroup
  label="Order priority"
  value={priority}
  onChange={setPriority}
  options={[{ value: 'stat', label: 'STAT', description: 'Immediate.' }, …]}
/>`,
    examples: [
      { title: 'With descriptions', wide: true, body: <RadioExample /> },
      {
        title: 'Inline, with a disabled option',
        wide: true,
        body: <RadioInlineExample />,
      },
    ],
    a11y: [
      'Native radios in a named radiogroup — arrow keys move the selection.',
      'Descriptions are part of each label, announced with the option.',
      'The checked state is a filled ring plus position, not colour alone.',
    ],
  },
  {
    slug: 'slider',
    name: 'Slider',
    group: 'Forms',
    summary: 'Range input with a filled track and live readout — pain scores, doses.',
    props: [
      { name: 'value', type: 'number', required: true, description: 'Current value (controlled).' },
      { name: 'onChange', type: '(value: number) => void', required: true, description: 'Fired while dragging or stepping.' },
      { name: 'label', type: 'string', required: true, description: 'Accessible name; also shown above the track.' },
      { name: 'min / max', type: 'number', default: '0 / 100', description: 'Range bounds, anchored under the track.' },
      { name: 'step', type: 'number', default: '1', description: 'Snap increment (e.g. 250 for mg doses).' },
      { name: 'format', type: '(value: number) => string', default: 'String', description: 'Formats the readout and the min/max anchors.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the control at reduced opacity.' },
    ],
    description:
      'Built on the native range input so keyboard and assistive tech come free. The value reads out beside the label, with min/max anchored under the track.',
    code: `<Slider
  label="Pain score"
  value={pain}
  onChange={setPain}
  min={0} max={10}
  format={(v) => \`\${v} / 10\`}
/>`,
    examples: [
      { title: 'Pain score & dosage', wide: true, body: <SliderExample /> },
      {
        title: 'Disabled',
        wide: true,
        body: (
          <div className="max-w-md">
            <Slider label="Max daily dose (set by protocol)" value={2000} onChange={() => {}} min={0} max={4000} format={(v) => `${v} mg`} disabled />
          </div>
        ),
      },
    ],
    a11y: [
      'A real input[type=range]: arrows step, Home/End jump, values announce.',
      'The current value is always visible text — the thumb position is never the only cue.',
      'Steps snap to clinically meaningful increments (e.g. 250 mg).',
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    group: 'Forms',
    summary: 'On/off settings that apply immediately.',
    props: [
      { name: 'checked', type: 'boolean', required: true, description: 'Controlled on/off state.' },
      { name: 'onChange', type: '(next: boolean) => void', required: true, description: 'Fired on toggle.' },
      { name: 'label', type: 'ReactNode', description: 'Optional inline label beside the switch.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the switch at reduced opacity.' },
    ],
    description:
      'The Toggle flips state the moment it is pressed — notification preferences, feature flags, checklist items. If the change only applies on save, use a Checkbox.',
    code: `<Toggle checked={enabled} onChange={setEnabled} label="SMS appointment reminders" />`,
    examples: [
      { title: 'With label', body: <SwitchExample /> },
      {
        title: 'States',
        note: 'Off, on, and disabled in both positions.',
        body: (
          <>
            <Toggle checked={false} onChange={() => {}} label="Off" />
            <Toggle checked onChange={() => {}} label="On" />
            <Toggle checked={false} onChange={() => {}} label="Disabled" disabled />
            <Toggle checked onChange={() => {}} label="Disabled on" disabled />
          </>
        ),
      },
      {
        title: 'In a settings row',
        wide: true,
        body: (
          <div className="flex max-w-md items-center justify-between gap-4 rounded-3xl bg-panel px-4 py-3">
            <span>
              <span className="block text-sm font-medium text-forest">Lab results ready</span>
              <span className="block text-[13px] text-forest-400">Notify the ordering clinician</span>
            </span>
            <Toggle checked onChange={() => {}} />
          </div>
        ),
      },
    ],
    a11y: [
      'role="switch" with aria-checked; Space and Enter toggle.',
      'The knob position is reinforced by the track colour — ink for on, hairline for off.',
      'Effects are immediate, so no unsaved-changes state to communicate.',
    ],
  },
  {
    slug: 'color-picker',
    name: 'Color picker',
    group: 'Forms',
    summary: 'A fixed, accessible swatch palette — calendar categories, ward coding.',
    props: [
      { name: 'value', type: 'string', required: true, description: 'Selected hex (case-insensitive).' },
      { name: 'onChange', type: '(hex: string) => void', required: true, description: 'Fired with the chosen swatch.' },
      { name: 'swatches', type: 'string[]', default: 'SWATCHES', description: 'Override the palette; the exported default has ten validated hues.' },
      { name: 'label', type: 'string', default: "'Colour'", description: 'Accessible name for the swatch radiogroup.' },
    ],
    description:
      'Deliberately not a freeform wheel: a curated palette keeps category colours consistent product-wide and every swatch pre-validated for contrast.',
    code: `<ColorPicker value={color} onChange={setColor} label="Calendar colour" />`,
    examples: [{ title: 'Swatches', wide: true, body: <ColorPickerExample /> }],
    a11y: [
      'A radiogroup of labelled swatches — each announces its hex value.',
      'Selection shows a check mark and ring, never colour difference alone.',
      'The palette is fixed, so meaning attached to colours stays stable.',
    ],
  },
  {
    slug: 'digit-input',
    name: 'Digit input',
    group: 'Forms',
    summary: 'Segmented one-time-code entry — auto-advance, backspace, paste.',
    props: [
      { name: 'value', type: 'string', required: true, description: 'The code so far (controlled).' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Fired on every edit.' },
      { name: 'onComplete', type: '(value: string) => void', description: 'Fired once when every cell is filled.' },
      { name: 'length', type: 'number', default: '6', description: 'Number of cells.' },
      { name: 'error', type: 'boolean', default: 'false', description: 'Paints the cells in the danger tone.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks all cells.' },
    ],
    description:
      'The CodeInput behind every verification step. Type and it advances; paste distributes the whole code; Backspace walks backwards. See it wired into a full flow under Blocks → Verification.',
    code: `<CodeInput value={code} onChange={setCode} onComplete={verify} error={failed} />`,
    examples: [
      { title: 'Six digits', wide: true, body: <DigitInputExample /> },
      {
        title: 'Error and disabled',
        wide: true,
        body: (
          <div className="space-y-4">
            <CodeInput value="424241" onChange={() => {}} error />
            <CodeInput value="42" onChange={() => {}} disabled />
          </div>
        ),
      },
    ],
    a11y: [
      'Each cell is labelled “Digit n of 6”; the first carries autocomplete="one-time-code".',
      'Arrow keys move between cells; paste fills from any position.',
      'The error state pairs red cells with a text explanation (see the Verification block).',
    ],
  },
]
