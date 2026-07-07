import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  Alert,
  Badge,
  Button,
  Drawer,
  Field,
  Input,
  InfoTip,
  KeyValue,
  Modal,
  Textarea,
  Tooltip,
  useToast,
} from '@/components/ui'
import type { ComponentDoc } from '../types'

function DismissibleAlert() {
  const [visible, setVisible] = useState(true)
  if (!visible) {
    return (
      <Button size="sm" variant="secondary" onClick={() => setVisible(true)}>
        Bring the alert back
      </Button>
    )
  }
  return (
    <Alert
      tone="warning"
      title="Lab interface degraded"
      onDismiss={() => setVisible(false)}
      className="w-full max-w-xl"
    >
      Results from the Kano Specialist Clinic analyser are delayed by roughly 20 minutes.
    </Alert>
  )
}

function ToastExample() {
  const { success, error, info } = useToast()
  return (
    <>
      <Button
        size="sm"
        onClick={() => success('Prescription issued', 'Sent to the patient’s preferred pharmacy.')}
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => error('Claim rejected', 'Missing pre-authorisation code — see claim #8241.')}
      >
        Error
      </Button>
      <Button size="sm" variant="secondary" onClick={() => info('Sync complete', '412 records updated.')}>
        Info
      </Button>
    </>
  )
}

function DialogExample() {
  const [open, setOpen] = useState(false)
  const { success } = useToast()
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Void prescription…
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Void this prescription?"
        subtitle="RX-20841 · Amoxicillin 500mg · Ngozi Eze"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false)
                success('Prescription voided', 'The pharmacy has been notified.')
              }}
            >
              Void prescription
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-forest-500">
          The pharmacy will be notified immediately and the patient’s medication record will show
          this as voided. This cannot be undone.
        </p>
        <Field label="Reason" required className="mt-4">
          <Textarea rows={2} placeholder="e.g. issued against the wrong patient" />
        </Field>
      </Modal>
    </>
  )
}

function DialogLargeExample() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open large dialog
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="Referral summary"
        subtitle="Ngozi Eze → Cardiology, Ikeja Medical Centre"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>Send referral</Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-forest-500">
          34-year-old with intermittent palpitations over six weeks, normal ECG at rest, family
          history of arrhythmia. Referring for Holter monitoring and cardiology review. Current
          medication: amoxicillin (completing course), salbutamol inhaler PRN. No known drug
          allergies besides penicillin.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <KeyValue label="Urgency" value="Routine · within 2 weeks" />
          <KeyValue label="Insurance" value="Hygeia HMO · pre-auth attached" />
        </dl>
      </Modal>
    </>
  )
}

type DrawerSize = 'md' | 'lg' | 'xl' | '2xl'

function DrawerSizesExample() {
  const [size, setSize] = useState<DrawerSize | null>(null)
  return (
    <>
      {(['md', 'lg', 'xl', '2xl'] as const).map((s) => (
        <Button key={s} variant="secondary" size="sm" onClick={() => setSize(s)}>
          {s}
        </Button>
      ))}
      <Drawer
        open={size !== null}
        onClose={() => setSize(null)}
        title={`Drawer · size ${size ?? ''}`}
        subtitle="440px · 540px · 640px · near-full workspace"
        size={size ?? 'md'}
      >
        <p className="text-sm leading-relaxed text-forest-500">
          md fits detail panels; lg fits forms; xl fits side-by-side content; 2xl is a
          near-full workspace for record review.
        </p>
      </Drawer>
    </>
  )
}

function DrawerExample() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open patient panel
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Ngozi Eze"
        subtitle="MRN 004-2213 · 34 · O+"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>Start consultation</Button>
          </div>
        }
      >
        <dl className="grid grid-cols-2 gap-4">
          <KeyValue label="Plan" value="Family Gold · HMO" />
          <KeyValue label="Last visit" value="12 Jun 2026" />
          <KeyValue label="Allergies" value="Penicillin" />
          <KeyValue label="Assigned GP" value="Dr. Sani Ahmed" />
        </dl>
        <Field label="Reason for visit" className="mt-5">
          <Input placeholder="e.g. follow-up, chest pain…" />
        </Field>
      </Drawer>
    </>
  )
}

export const FEEDBACK_DOCS: ComponentDoc[] = [
  {
    slug: 'alert',
    whenToUse: [
      'Persistent contextual state the user must know while working — validation failures, allergy warnings, degraded service.',
      'Transient success → Toast. Blocking decision → Modal. System-wide state (offline, sync failed) → page-level banner with a next step.',
      'Errors requiring action are never toasts — they must persist until resolved (NHS error pattern).',
    ],
    name: 'Alert',
    group: 'Feedback',
    summary: 'Inline contextual messages for a page or section.',
    props: [
      { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Semantic tone; warning/danger announce as role="alert".' },
      { name: 'title', type: 'ReactNode', required: true, description: 'One-line statement of the situation.' },
      { name: 'children', type: 'ReactNode', description: 'Supporting copy under the title.' },
      { name: 'action', type: 'ReactNode', description: 'Optional action (small button or link) under the copy.' },
      { name: 'onDismiss', type: '() => void', description: 'Renders the labelled dismiss button.' },
    ],
    description:
      'Alerts live in the layout and stay until resolved or dismissed — use them for conditions the user needs to act on or keep in mind. For transient confirmations, use Toast instead.',
    code: `<Alert tone="warning" title="Lab interface degraded" onDismiss={hide}>
  Results are delayed by roughly 20 minutes.
</Alert>`,
    examples: [
      {
        title: 'Tones — all four',
        wide: true,
        body: (
          <div className="max-w-xl space-y-3">
            <Alert tone="info" title="Scheduled maintenance">
              Claims submission pauses Sunday 02:00–03:00 WAT.
            </Alert>
            <Alert tone="success" title="Enrolment batch processed">
              1,204 new members are now active on the Family Gold plan.
            </Alert>
            <Alert tone="warning" title="Lab interface degraded">
              Results from the Kano analyser are delayed by roughly 20 minutes.
            </Alert>
            <Alert tone="danger" title="Payment gateway unreachable">
              Card payments are failing at all facilities. Cash and transfer still work.
            </Alert>
          </div>
        ),
      },
      {
        title: 'Dismissible',
        wide: true,
        body: <DismissibleAlert />,
      },
      {
        title: 'With action',
        wide: true,
        body: (
          <Alert
            tone="info"
            title="3 surgical orders await sign-off"
            className="max-w-xl"
            action={
              <Button size="sm" variant="secondary">
                Review queue
              </Button>
            }
          >
            Orders older than 48 hours are escalated to the medical director.
          </Alert>
        ),
      },
    ],
    a11y: [
      'Warning and danger tones render role="alert" (announced immediately); info and success use role="status".',
      'The icon is decorative — the tone is stated by the words, and text meets AA on every soft background.',
      'The dismiss control is a 36px+ labelled button, not a bare ×.',
    ],
  },
  {
    slug: 'toast',
    whenToUse: [
      'Non-blocking confirmation that an action succeeded — \'Vitals saved\'. Auto-dismisses; aria-live polite.',
      'Never for errors or anything requiring a response — those are inline Alerts that stay until resolved.',
    ],
    name: 'Toast',
    group: 'Feedback',
    summary: 'Transient confirmations layered over the UI, bottom-right.',
    props: [
      { name: 'success', type: '(title: string, description?: string) => void', description: 'useToast() — green check toast.' },
      { name: 'error', type: '(title: string, description?: string) => void', description: 'useToast() — red failure toast.' },
      { name: 'info', type: '(title: string, description?: string) => void', description: 'useToast() — neutral notice.' },
      { name: 'toast', type: '({ tone?, title, description? }) => void', description: 'useToast() — tone-parameterised form of the same API.' },
    ],
    description:
      'One hook, three tones. Toasts confirm outcomes (“saved”, “sent”) and disappear on their own — anything the user must not miss belongs in an Alert or Dialog instead.',
    code: `const { success } = useToast()
success('Prescription issued', 'Sent to the patient’s preferred pharmacy.')`,
    examples: [
      {
        title: 'Tones',
        note: 'Fire a few in a row — they stack with a 10px gap.',
        body: <ToastExample />,
      },
    ],
    a11y: [
      'Toasts are announced politely without stealing focus.',
      'They auto-dismiss, so they never carry the only path to an action.',
      'Motion respects prefers-reduced-motion via the shared animation layer.',
    ],
  },
  {
    slug: 'dialog',
    whenToUse: [
      'Blocking decisions and high-risk confirmations — sign-off, void, merge — where nothing else may proceed.',
      'Reviewing or editing detail while keeping the page visible → Drawer. Content people should browse or link to → its own page.',
      'In destructive confirms, Escape and Enter map to the safe option; the confirm names the verb (\'Void order\').',
    ],
    name: 'Dialog',
    group: 'Feedback',
    summary: 'Modal surface for confirmation and short focused tasks.',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled visibility.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Called by Escape, overlay click and the close button.' },
      { name: 'title / subtitle', type: 'ReactNode', description: 'Header content; the title labels the dialog.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Scrollable body.' },
      { name: 'footer', type: 'ReactNode', description: 'Pinned action row under a divider.' },
      { name: 'size', type: "'md' | 'lg'", default: "'md'", description: 'max-w-lg or max-w-2xl.' },
    ],
    description:
      'Dialogs interrupt — reserve them for decisions that must happen now, like destructive confirmation. Longer detail and multi-field editing belong in a Drawer.',
    code: `<Modal open={open} onClose={close} title="Void this prescription?" footer={<Actions />}>
  …
</Modal>`,
    examples: [
      {
        title: 'Destructive confirmation',
        note: 'The danger action restates the verb — never just “OK”.',
        body: <DialogExample />,
      },
      {
        title: 'Large size',
        note: 'size="lg" (max-w-2xl) for content-heavy confirmations.',
        body: <DialogLargeExample />,
      },
    ],
    a11y: [
      'Escape closes, the overlay click closes, and body scroll locks while open.',
      'A shared layer stack means Escape only closes the top-most surface when dialogs and drawers nest.',
      'The title labels the dialog; the close button carries an explicit aria-label.',
      'On small screens the dialog docks to the bottom edge for reachable actions.',
    ],
  },
  {
    slug: 'drawer',
    whenToUse: [
      'Supplementary detail or a short edit beside the page — order detail, filters, patient summary expand.',
      'If the user must decide before continuing, that\'s a Modal; if the content deserves a URL, it\'s a page.',
    ],
    name: 'Drawer',
    group: 'Feedback',
    summary: 'Detached side panel for detail views and multi-field editing.',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controlled visibility; content persists through the exit slide.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Called by Escape, overlay click and the close button.' },
      { name: 'title / subtitle', type: 'ReactNode', description: 'Header row content.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Scrollable body.' },
      { name: 'footer', type: 'ReactNode', description: 'Pinned action row.' },
      { name: 'size', type: "'md' | 'lg' | 'xl' | '2xl'", default: "'md'", description: '440px up to a near-full workspace.' },
    ],
    description:
      'The drawer floats off the right edge with a margin on all sides, in four widths up to a near-full workspace. It shares the Modal API, so promoting a dialog to a drawer is a one-word change.',
    code: `<Drawer open={open} onClose={close} title="Ngozi Eze" size="lg" footer={<Actions />}>
  …
</Drawer>`,
    examples: [
      {
        title: 'Patient panel',
        note: 'Header, scrollable body, pinned footer.',
        body: <DrawerExample />,
      },
      {
        title: 'All four sizes',
        note: 'Open each — md 440px, lg 540px, xl 640px, 2xl near-full.',
        body: <DrawerSizesExample />,
      },
    ],
    a11y: [
      'role="dialog" with aria-modal — background content is inert while open.',
      'Escape and overlay click close it; the close button is labelled.',
      'Enter/exit slides are disabled under prefers-reduced-motion.',
      'The pinned footer keeps primary actions on-screen however long the body scrolls.',
    ],
  },
  {
    slug: 'tooltip',
    whenToUse: [
      'Small supplementary hints on hover/focus — icon names, shortcut hints.',
      'Never the only carrier of required information — clinical data, errors and labels are always visible text (WCAG 1.4.13).',
    ],
    name: 'Tooltip',
    group: 'Feedback',
    summary: 'Hover/focus hint bubble — clarification, never essential content.',
    props: [
      { name: 'content', type: 'ReactNode', required: true, description: 'The hint text.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'The trigger — must be focusable for keyboard users.' },
      { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Placement, with the anchor arrow pointing at the trigger.' },
      { name: 'size', type: "'xs' | 'sm' | 'md'", default: "'md'", description: 'xs is a one-line label; sm a short sentence; md definition-length copy.' },
      { name: 'content (InfoTip)', type: 'ReactNode', required: true, description: 'InfoTip — the ⓘ shorthand for form labels.' },
    ],
    description:
      'Tooltips explain icons and abbreviations; anything a user must read belongs in visible text. InfoTip is the ⓘ shorthand that keeps form labels tidy.',
    code: `<Tooltip content="Estimated glomerular filtration rate">
  <span>eGFR</span>
</Tooltip>

<Field label={<>Facility code <InfoTip content="Assigned by the regulator." /></>}>…</Field>`,
    examples: [
      {
        title: 'Positions — all four',
        note: 'The arrow anchors the bubble to its trigger; hover each.',
        wide: true,
        body: (
          <div className="flex flex-wrap items-center gap-3 px-10 py-8">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip key={side} side={side} size="xs" content={`Anchored ${side}`}>
                <Button variant="secondary" size="sm" className="capitalize">
                  {side}
                </Button>
              </Tooltip>
            ))}
          </div>
        ),
      },
      {
        title: 'Sizes — xs, sm, md',
        note: 'xs is a one-line label for icon buttons; md carries definition-length copy.',
        wide: true,
        body: (
          <div className="flex flex-wrap items-center gap-4 px-4 py-8">
            <Tooltip content="Void prescription" size="xs" side="bottom">
              <Button variant="danger" size="sm" aria-label="Void prescription">
                <Trash2 size={14} />
              </Button>
            </Tooltip>
            <Tooltip content="Delayed ~20 minutes at the Kano analyser." size="sm">
              <Badge tone="warning" dot>
                Lab delayed
              </Badge>
            </Tooltip>
            <Tooltip content="Estimated glomerular filtration rate — a measure of kidney function used to stage chronic kidney disease." size="md">
              <span className="cursor-help border-b border-dashed border-navy-300 text-sm font-medium text-forest">
                eGFR
              </span>
            </Tooltip>
          </div>
        ),
      },
      {
        title: 'InfoTip in a form label',
        body: (
          <span className="flex items-center gap-1.5 text-sm text-forest-500">
            Facility code
            <InfoTip content="Assigned by the national regulator; used on all claims." />
          </span>
        ),
      },
    ],
    a11y: [
      'Opens on focus as well as hover, so keyboard users get the same hint.',
      'role="tooltip" content; triggers are focusable elements.',
      'Never the only label for a control — icon buttons keep their aria-label.',
    ],
  },
]
