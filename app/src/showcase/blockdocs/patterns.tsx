import { useState } from 'react'
import { CircleCheck, FlaskConical, Pill, Scissors, Stethoscope } from 'lucide-react'
import {
  Button,
  Card,
  Combobox,
  DatePicker,
  Drawer,
  EmptyState,
  Field,
  FileUpload,
  InlineLoader,
  Input,
  Modal,
  Select,
  SignaturePad,
  Skeleton,
  SkeletonText,
  Textarea,
  TimePicker,
  useToast,
} from '@/components/ui'
import { Timeline, type TimelineEvent } from '@/components/blocks'
import { PATIENTS } from '../health'
import type { ComponentDoc } from '../types'

const MEDICAL_EVENTS: TimelineEvent[] = [
  {
    meta: '06 Jul 2026 · 09:42',
    title: 'Cardiology consultation',
    description: 'Dr. Bisi Adeyemi · BP above target, home diary started, lipid panel ordered.',
    icon: Stethoscope,
    tone: 'brand',
  },
  {
    meta: '06 Jul 2026 · 09:58',
    title: 'Lab order — lipid panel',
    description: 'Ikeja Medical Centre · awaiting sample.',
    icon: FlaskConical,
  },
  {
    meta: '06 Jul 2026 · 10:05',
    title: 'Prescription issued — Amlodipine 10mg',
    description: 'RX-20838 · 1/day · 30 days.',
    icon: Pill,
    tone: 'success',
  },
  {
    meta: '14 Mar 2026',
    title: 'Day surgery — colonoscopy (screening)',
    description: 'Enugu Teaching Hospital · no abnormal findings.',
    icon: Scissors,
  },
]

const AUDIT_EVENTS: TimelineEvent[] = [
  { meta: '13:02 · Amina Bello', title: 'Claim CLM-8241 submitted to AXA Mansard' },
  { meta: '12:47 · Dr. Bisi Adeyemi', title: 'Consultation note amended', description: 'Reason: added home BP diary instruction.' },
  { meta: '12:31 · System', title: 'Allergy check passed for RX-20838' },
  { meta: '11:58 · Front desk', title: 'Patient checked in · Ikeja Medical Centre', tone: 'brand' },
]

function ConfirmationExample() {
  const [open, setOpen] = useState(false)
  const { success } = useToast()
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Cancel appointment…
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cancel this appointment?"
        subtitle="Ngozi Eze · Follow-up · Today 09:00"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep appointment
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false)
                success('Appointment cancelled', 'The patient has been notified by SMS.')
              }}
            >
              Cancel appointment
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-forest-500">
          The slot is released immediately and the patient is notified. They keep their place on
          the rebooking list.
        </p>
      </Modal>
    </>
  )
}

function FilterDrawerExample() {
  const [open, setOpen] = useState(false)
  const { success } = useToast()
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open filter drawer
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter"
        subtitle="Narrow the list without leaving it"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Reset
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
                success('Filters applied')
              }}
            >
              Apply
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Status">
            <Select defaultValue="All">
              {['All', 'Active', 'Pending', 'Completed'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From">
              <DatePicker />
            </Field>
            <Field label="To">
              <DatePicker align="right" />
            </Field>
          </div>
        </div>
      </Drawer>
    </>
  )
}

function SignatureExample() {
  const { success } = useToast()
  const [signature, setSignature] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-hair bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-forest">
          <CircleCheck size={16} className="text-mint" />
          Consent signed
        </div>
        {signature && (
          <img src={signature} alt="Captured signature" className="mt-2 h-20 w-auto" />
        )}
        <p className="text-[12px] text-forest-400">Amina Bello · {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        <Button
          size="sm"
          variant="ghost"
          className="mt-2"
          onClick={() => {
            setConfirmed(false)
            setSignature(null)
          }}
        >
          Sign again
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-3">
      <SignaturePad onChange={setSignature} />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          disabled={!signature}
          onClick={() => {
            setConfirmed(true)
            success('Consent recorded', 'The signed form is attached to the patient record.')
          }}
        >
          Confirm signature
        </Button>
      </div>
    </div>
  )
}

export const PATTERN_BLOCK_DOCS: Omit<ComponentDoc, 'name' | 'group' | 'summary'>[] = [
  {
    slug: 'file-upload',
    description:
      'The upload state machine, live: an idle drop target, a drag-over highlight, per-file progress while uploading, and complete or error rows. Size violations are permanent (remove only); simulated network failures are retryable — the two error kinds behave differently on purpose.',
    code: `<FileUpload
  label="Upload referral letter"
  maxSizeMB={10}
  multiple
  onChange={(names) => setAttachments(names)}
/>`,
    examples: [
      {
        title: 'All four states',
        note: 'Drop or pick any files — anything over 2 MB fails validation, and roughly one in five uploads hits a simulated network error you can retry.',
        wide: true,
        body: (
          <div className="max-w-md">
            <FileUpload label="Upload medical documents" maxSizeMB={2} />
          </div>
        ),
      },
      {
        title: 'Single file',
        wide: true,
        body: (
          <div className="max-w-md">
            <FileUpload label="Upload referral letter" multiple={false} caption="PDF, JPG or PNG · one file · up to 10 MB" />
          </div>
        ),
      },
    ],
    a11y: [
      'The drop zone is a real button — keyboard users open the file picker with Enter.',
      'Progress is a labelled progressbar with aria-valuenow; the percentage is also visible text.',
      'Errors state the reason in text next to the file; retry appears only when retrying can help.',
      'Remove and retry controls carry per-file aria-labels.',
    ],
  },
  {
    slug: 'signature',
    description:
      'Consents, sign-offs and discharges end with a signature. The pad starts empty with a hint, captures ink from mouse, touch or stylus, and only then unlocks the confirming action. Clear resets everything.',
    code: `const [signature, setSignature] = useState<string | null>(null)

<SignaturePad onChange={setSignature} />
<Button disabled={!signature}>Confirm signature</Button>`,
    examples: [
      {
        title: 'Sign to confirm',
        note: 'Draw in the pad — Confirm stays disabled until there is ink.',
        wide: true,
        body: <SignatureExample />,
      },
    ],
    a11y: [
      'The canvas exposes its state via aria-label (“draw to sign” vs “signature captured”).',
      'Confirmation is gated on actual ink, and the signed record shows name and date in text.',
      'Clear is a visible, labelled button — no hidden gestures.',
      'touch-action is disabled on the pad so signing works on touch screens without scrolling.',
    ],
  },
  {
    slug: 'timeline',
    description:
      'One rail, newest first. Tones highlight the events that matter (brand for encounters, success for completions, danger for incidents); everything else stays neutral. The same block renders medical histories and audit trails.',
    code: `<Timeline events={[
  { meta: '06 Jul · 09:42', title: 'Cardiology consultation', icon: Stethoscope, tone: 'brand' },
  …
]} />`,
    examples: [
      {
        title: 'Medical timeline',
        wide: true,
        body: (
          <div className="max-w-xl py-1">
            <Timeline events={MEDICAL_EVENTS} />
          </div>
        ),
      },
      {
        title: 'Audit trail',
        note: 'No icons, denser meta — who did what, when.',
        wide: true,
        body: (
          <div className="max-w-xl py-1">
            <Timeline events={AUDIT_EVENTS} />
          </div>
        ),
      },
    ],
    a11y: [
      'Rendered as an ordered list — position and count are announced.',
      'Icons are decorative; the event type is stated in the title text.',
      'Timestamps are small caps with tabular figures, read before the title.',
    ],
  },
  {
    slug: 'empty-states',
    description:
      'An empty screen should say what would be here, why it’s empty, and what to do next. Scale follows scope: a screen with nothing gets the full-width empty with the large illustration; panels inside a dashboard use the compact form so the emptiness stays proportional.',
    code: `// Page level — fills the content area
<EmptyState variant="calendar" title="No appointments today" … />

// Panel level — inside a dashboard card
<EmptyState compact variant="chart" title="No data for this period" … />`,
    examples: [
      {
        title: 'Page level — full width',
        note: 'The whole screen is empty: large illustration, generous copy, the primary action right there.',
        wide: true,
        body: (
          <Card pad={false}>
            <EmptyState
              variant="calendar"
              title="No appointments today"
              description="Walk-ins will appear here as the front desk checks them in. Scheduled bookings sync automatically from the booking line."
              action={
                <>
                  <Button size="sm">Schedule appointment</Button>
                  <Button size="sm" variant="ghost">
                    View past appointments
                  </Button>
                </>
              }
            />
          </Card>
        ),
      },
      {
        title: 'No results — full width',
        note: 'Search and filter misses also own the full content area, with the remedy as the action.',
        wide: true,
        body: (
          <Card pad={false}>
            <EmptyState
              variant="search"
              title="No patients match “okonkwo”"
              description="Check the spelling, try an MRN instead, or clear the active filters."
              action={
                <Button size="sm" variant="secondary">
                  Clear filters
                </Button>
              }
            />
          </Card>
        ),
      },
      {
        title: 'Panel level — in a grid',
        note: 'compact keeps dashboard-card empties proportional to their slot.',
        wide: true,
        body: (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card pad={false}>
              <EmptyState
                compact
                variant="chart"
                title="No data for this period"
                description="Widen the date range to see network activity."
              />
            </Card>
            <Card pad={false}>
              <EmptyState
                compact
                variant="notifications"
                title="You're all caught up"
                description="New results and claim decisions will land here."
              />
            </Card>
            <Card pad={false}>
              <EmptyState
                compact
                variant="message"
                title="No messages yet"
                description="Conversations with the care team start from a patient chart."
              />
            </Card>
            <Card pad={false}>
              <EmptyState
                compact
                variant="no-access"
                title="You don't have access"
                description="Billing is limited to finance roles. Ask an administrator."
              />
            </Card>
          </div>
        ),
      },
    ],
    a11y: [
      'The title states the situation; the description states the remedy.',
      'Illustrations are decorative (empty alt); all meaning is in the text.',
      'When an action exists it is a real button, not a link disguised in prose.',
    ],
  },
  {
    slug: 'loading',
    description:
      'Skeletons mirror the layout they replace, so nothing jumps when data lands. Use the inline loader for in-place refreshes; never both at once.',
    code: `<Skeleton className="h-10 w-10 rounded-full" />
<SkeletonText lines={3} />
<InlineLoader label="Loading results…" />`,
    examples: [
      {
        title: 'Skeleton card',
        wide: true,
        body: (
          <Card pad={false} className="max-w-sm p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
            <SkeletonText lines={3} className="mt-4" />
          </Card>
        ),
      },
      {
        title: 'Skeleton table',
        wide: true,
        body: (
          <Card className="max-w-xl">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-3.5 w-1/4" />
                <Skeleton className="h-3.5 w-1/6" />
                <Skeleton className="ml-auto h-3.5 w-1/5" />
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 border-t border-hair/60 pt-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        ),
      },
      {
        title: 'Inline loader',
        body: <InlineLoader label="Refreshing results…" />,
      },
    ],
    a11y: [
      'Skeletons are aria-hidden; pair them with a single polite “loading” announcement.',
      'The inline loader carries role="status" and a visible label.',
      'Skeleton shapes match the loaded layout, so focus position survives the swap.',
    ],
  },
  {
    slug: 'form-blocks',
    description:
      'Forms are assembled from Field controls on a 2-column grid that collapses on small screens. Booking and registration are the two shapes almost every flow reduces to.',
    code: `<Field label="Patient" required>
  <Combobox options={patients} … />
</Field>
<div className="grid grid-cols-2 gap-3">
  <Field label="Date" required><DatePicker /></Field>
  <Field label="Time" required><TimePicker /></Field>
</div>`,
    examples: [
      {
        title: 'Appointment booking',
        wide: true,
        body: (
          <Card className="max-w-md">
            <div className="space-y-4">
              <Field label="Patient" required>
                <Combobox
                  options={PATIENTS.map((p) => ({ value: p.id, label: p.name, hint: p.mrn }))}
                  placeholder="Search patients…"
                />
              </Field>
              <Field label="Clinician" required>
                <Select defaultValue="Dr. Sani Ahmed">
                  {['Dr. Sani Ahmed', 'Dr. Bisi Adeyemi', 'Dr. Kemi Balogun'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date" required>
                  <DatePicker />
                </Field>
                <Field label="Time" required>
                  <TimePicker defaultValue="09:00" />
                </Field>
              </div>
              <div className="flex justify-end gap-2 border-t border-hair pt-4">
                <Button variant="ghost">Cancel</Button>
                <Button>Schedule</Button>
              </div>
            </div>
          </Card>
        ),
      },
      {
        title: 'Patient registration',
        wide: true,
        body: (
          <Card className="max-w-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input placeholder="As it appears on their ID" />
              </Field>
              <Field label="Date of birth" required>
                <DatePicker />
              </Field>
              <Field label="Plan" required>
                <Select defaultValue="Retail Basic">
                  {['Retail Basic', 'Family Gold · HMO', 'Corporate Silver'].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Phone" hint="Used for appointment reminders.">
                <Input type="tel" placeholder="+234 …" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Referral letter" optional>
                  <FileUpload label="Upload referral letter" maxSizeMB={10} multiple={false} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes" optional>
                  <Textarea rows={2} placeholder="Anything the care team should know" />
                </Field>
              </div>
            </div>
          </Card>
        ),
      },
    ],
    a11y: [
      'Every control sits in a Field, so labels are clickable and hints are adjacent.',
      'Required is marked on the label and enforced with text, never colour alone.',
      'The grid collapses to one column before fields shrink below comfortable widths.',
    ],
  },
  {
    slug: 'overlay-patterns',
    description:
      'Two overlay conventions cover the product: a confirmation dialog whose danger button restates the verb, and a filter drawer with Reset/Apply pinned in the footer. Both close on Escape and never blank mid-animation.',
    code: `<Modal title="Cancel this appointment?" footer={<><Button variant="secondary">Keep appointment</Button><Button variant="danger">Cancel appointment</Button></>}>…</Modal>`,
    examples: [
      {
        title: 'Confirmation dialog',
        note: 'The destructive button repeats the action — never just “OK”.',
        body: <ConfirmationExample />,
      },
      {
        title: 'Filter drawer',
        note: 'Reset is quiet, Apply is primary, both pinned to the footer.',
        body: <FilterDrawerExample />,
      },
    ],
    a11y: [
      'Escape and overlay-click close; a shared layer stack keeps nesting sane.',
      'Focus lands inside the overlay on open; the close button is labelled.',
      'Content is retained through the exit animation, so nothing blanks while closing.',
    ],
  },
]
