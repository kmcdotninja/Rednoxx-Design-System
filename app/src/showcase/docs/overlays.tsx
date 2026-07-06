import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarClock,
  ChartLine,
  CircleHelp,
  Ellipsis,
  FlaskConical,
  Home,
  Pill,
  Search,
  Stethoscope,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import {
  Badge,
  Button,
  CommandMenu,
  Divider,
  Dropdown,
  Kbd,
  Popover,
  useCommandMenu,
  useToast,
  type Command,
} from '@/components/ui'
import { PATIENTS } from '../health'
import type { ComponentDoc } from '../types'

function DropdownExample() {
  const { success } = useToast()
  return (
    <Dropdown
      trigger={
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-hair bg-white text-forest-400 transition-colors hover:bg-panel hover:text-forest">
          <Ellipsis size={16} />
        </span>
      }
      items={[
        { label: 'View chart', icon: Stethoscope, onSelect: () => success('Opening chart') },
        { label: 'Schedule appointment', icon: CalendarClock, hint: 'A', onSelect: () => success('Scheduler opened') },
        { label: 'New prescription', icon: Pill, onSelect: () => success('Prescription started') },
        { label: 'Merge duplicate record', icon: Users, disabled: true },
        { label: 'Archive patient', icon: Trash2, danger: true, separator: true, onSelect: () => success('Patient archived') },
      ]}
    />
  )
}

const NOTIFICATIONS = [
  { id: 'n1', icon: FlaskConical, title: 'FBC results ready — Ngozi Eze', time: '2m', unread: true },
  { id: 'n2', icon: Pill, title: 'RX-20838 dispensed at Ikeja pharmacy', time: '18m', unread: true },
  { id: 'n3', icon: CalendarClock, title: 'Tunde Bakare confirmed 09:40 tomorrow', time: '1h', unread: false },
  { id: 'n4', icon: Users, title: 'Dr. Ada Okeke joined Garki General', time: '3h', unread: false },
]

function NotificationPopover() {
  const { success } = useToast()
  return (
    <Popover
      align="left"
      trigger={
        <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-hair bg-white text-forest-400 transition-colors hover:bg-panel hover:text-forest">
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-azure" />
        </span>
      }
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-3.5">
        <p className="text-sm font-medium text-forest">Notifications</p>
        <button
          type="button"
          onClick={() => success('All caught up')}
          className="text-[12px] font-medium text-azure-600 hover:underline"
        >
          Mark all read
        </button>
      </div>
      <ul className="max-h-72 overflow-y-auto p-1.5 pt-0">
        {NOTIFICATIONS.map(({ id, icon: Icon, title, time, unread }) => (
          <li key={id}>
            <button
              type="button"
              className="flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-panel"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-panel text-forest-400">
                <Icon size={14} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[13px] ${unread ? 'font-medium text-forest' : 'text-forest-500'}`}>
                  {title}
                </span>
                <span className="tnum text-[11px] text-forest-300">{time} ago</span>
              </span>
              {unread && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />}
            </button>
          </li>
        ))}
      </ul>
      <Divider />
      <button type="button" className="w-full px-4 py-2.5 text-center text-[13px] font-medium text-forest-500 transition-colors hover:bg-panel">
        View all notifications
      </button>
    </Popover>
  )
}

function HelpPopover() {
  return (
    <Popover
      trigger={
        <span className="flex h-9 items-center gap-1.5 rounded-2xl border border-hair bg-white px-3 text-[13px] font-medium text-forest-500 transition-colors hover:bg-panel">
          <CircleHelp size={15} className="text-forest-300" />
          What is STAT?
        </span>
      }
      panelClassName="w-72 p-4"
    >
      <p className="text-sm font-medium text-forest">STAT priority</p>
      <p className="mt-1 text-[13px] leading-relaxed text-forest-400">
        From the Latin <em>statim</em> — immediately. STAT orders jump every queue and page the
        ordering clinician the moment results post.
      </p>
      <Badge tone="danger" dot className="mt-3">
        Use sparingly
      </Badge>
    </Popover>
  )
}

function CommandMenuExample() {
  const navigate = useNavigate()
  const { success } = useToast()
  const [open, setOpen] = useCommandMenu()

  const commands: Command[] = [
    { id: 'go-overview', group: 'Go to', label: 'Overview', icon: Home, onSelect: () => navigate('/demo/overview') },
    { id: 'go-analytics', group: 'Go to', label: 'Analytics', icon: ChartLine, onSelect: () => navigate('/demo/analytics') },
    { id: 'go-patients', group: 'Go to', label: 'Patients', icon: Users, onSelect: () => navigate('/demo/patients') },
    ...PATIENTS.slice(0, 5).map((p) => ({
      id: p.id,
      group: 'Patients',
      label: p.name,
      icon: Stethoscope,
      hint: `MRN ${p.mrn}`,
      keywords: p.mrn,
      onSelect: () => navigate(`/demo/patients/${p.id}`),
    })),
    { id: 'new-patient', group: 'Actions', label: 'New patient…', icon: UserPlus, onSelect: () => success('New patient', 'Opened the enrolment form.') },
    { id: 'new-rx', group: 'Actions', label: 'New prescription…', icon: Pill, onSelect: () => success('New prescription', 'Opened in the consultation workspace.') },
  ]

  return (
    <>
      <Button variant="secondary" leftIcon={<Search size={15} />} onClick={() => setOpen(true)}>
        Quick search
        <span className="ml-2 flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>
      <CommandMenu open={open} onClose={() => setOpen(false)} commands={commands} />
    </>
  )
}

export const OVERLAY_DOCS: ComponentDoc[] = [
  {
    slug: 'dropdown',
    name: 'Dropdown',
    group: 'Overlays',
    summary: 'Action menu behind a trigger — row actions, account menus, “more”.',
    props: [
      { name: 'trigger', type: 'ReactNode | (open) => ReactNode', required: true, description: 'The always-visible control; wrapped in the toggling button.' },
      { name: 'items', type: 'DropdownItem[]', required: true, description: '{ label, icon?, hint?, danger?, disabled?, separator?, onSelect? } per row.' },
      { name: 'align', type: "'left' | 'right'", default: "'left'", description: 'Panel edge relative to the trigger.' },
    ],
    description:
      'A menu of verbs, not a value picker: choosing runs an action and closes. Destructive items sit last, behind a separator, in the danger tone. For selecting a value, use Select or Combobox.',
    code: `<Dropdown
  trigger={<MoreButton />}
  items={[
    { label: 'View chart', icon: Stethoscope, onSelect: open },
    { label: 'Archive patient', icon: Trash2, danger: true, separator: true, onSelect: archive },
  ]}
/>`,
    examples: [
      {
        title: 'Row actions',
        note: 'Arrow keys move, Enter runs, Escape closes.',
        body: <DropdownExample />,
      },
    ],
    a11y: [
      'role="menu" with menuitem children; the trigger carries aria-haspopup and aria-expanded.',
      'Full keyboard support — arrows cycle enabled items, Enter selects, Escape dismisses.',
      'Danger items pair the red tone with an unmistakable verb.',
    ],
  },
  {
    slug: 'popover',
    name: 'Popover',
    group: 'Overlays',
    summary: 'Anchored panel for rich content — notification trays, previews, mini-forms.',
    props: [
      { name: 'trigger', type: 'ReactNode | (open) => ReactNode', required: true, description: 'The always-visible control; the wrapper button toggles the panel.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Panel content — any UI.' },
      { name: 'align', type: "'left' | 'right'", default: "'left'", description: 'Panel edge relative to the trigger.' },
      { name: 'panelClassName', type: 'string', description: 'Width/padding overrides for the panel (default w-80).' },
    ],
    description:
      'Between Tooltip (text hint) and Drawer (workspace): a click-anchored panel that can hold real UI. The notification tray is the canonical use — items, unread dots, actions.',
    code: `<Popover trigger={<BellButton />}>
  <NotificationList />
</Popover>`,
    examples: [
      {
        title: 'Notification tray',
        note: 'Unread items are bold with a violet dot; “mark all read” lives in the header.',
        body: <NotificationPopover />,
      },
      {
        title: 'Inline explainer',
        body: <HelpPopover />,
      },
    ],
    a11y: [
      'The trigger is a real button with aria-expanded; Escape and outside clicks close.',
      'Unread state pairs the dot with bold text — never the dot alone.',
      'Panels hold focusable content; keep one clear primary action per panel.',
    ],
  },
  {
    slug: 'command-menu',
    name: 'Command menu',
    group: 'Overlays',
    summary: 'The ⌘K palette — jump to pages, records and actions from anywhere.',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled visibility — pair with useCommandMenu for the ⌘K binding.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Escape, overlay click and command selection all close through this.' },
      { name: 'commands', type: 'Command[]', required: true, description: '{ id, label, group, icon?, hint?, keywords?, onSelect } — hint and keywords are searchable.' },
      { name: 'placeholder', type: 'string', default: "'Search or jump to…'", description: 'Search input placeholder.' },
      { name: 'useCommandMenu()', type: '[open, setOpen]', description: 'Hook that binds ⌘K / Ctrl+K while mounted.' },
    ],
    description:
      'One input over everything: navigation, patients by name or MRN, and quick actions, grouped and keyboard-first. The useCommandMenu hook binds ⌘K / Ctrl+K while mounted.',
    code: `const [open, setOpen] = useCommandMenu()

<CommandMenu
  open={open}
  onClose={() => setOpen(false)}
  commands={[{ id: 'p1', group: 'Patients', label: 'Ngozi Eze', hint: 'MRN 004-2213', onSelect: goTo }, …]}
/>`,
    examples: [
      {
        title: 'Live — try ⌘K or the button',
        note: 'Search “ngozi” or an MRN like 2744; Enter jumps into the demo.',
        body: <CommandMenuExample />,
      },
    ],
    a11y: [
      'A dialog with a labelled search input that takes focus on open.',
      'Arrows move the active row (scrolled into view); Enter runs; Escape closes via the shared layer stack.',
      'Groups are visible headings, and every command is plain text with an optional hint.',
    ],
  },
]
