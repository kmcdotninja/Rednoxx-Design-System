/**
 * Fifteen specimens for the case study — the compositions the product actually
 * leans on, rendered from the same primitives it ships.
 *
 * Deliberately STATIC. These are portfolio stills: every tile shows a state at
 * rest so it can be read, screenshotted and pasted into a deck. Nothing here
 * opens, animates or waits for a click — where the real UI is a dialog or an
 * overlay, the specimen renders that surface directly (see `ModuleCardList` and
 * `ModuleSwitchOverlay inline`, both extracted from the live block rather than
 * hand-drawn, so a still can never drift from the component it depicts).
 *
 * Every tile is the real thing, not a picture of it: the slip is
 * `RegistrationSlipCard` from the HIM module, the banner is the `RecordBanner`
 * block, the pills are HIM's own `shared.tsx` helpers, and the data comes from
 * `him/data.ts` and `demo/health.ts`.
 *
 * Order follows the product's own path — registration slip first, then identity,
 * worklist, the merge decision, and the audit record that outlives all of it.
 */
import { GitMerge, ShieldAlert, UploadCloud } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Field,
  KeyValue,
  Modal,
  ProgressBar,
  ProgressMeter,
  Segmented,
  Tag,
  Textarea,
  type Column,
  type SegOption,
} from '@/components/ui'
import {
  FilterBar,
  ModuleCardList,
  ModuleSwitchOverlay,
  PatientBanner,
  RecordBanner,
  Timeline,
  VitalsRow,
  type TimelineEvent,
} from '@/components/blocks'
import { PRODUCT_MODULES } from '@/app/modules'
import { PATIENTS, PATIENT_BIO } from '@/demo/health'
import { RegistrationSlipCard } from '@/him/RegistrationSlip'
import { DocumentPreviewCard } from '@/him/DocumentPreview'
import {
  AUDIT_EVENTS,
  HIM_DOCUMENTS,
  HIM_PATIENTS,
  patientDisplayName,
  type HimIdentifier,
  type HimPatient,
} from '@/him/data'
import {
  DocumentStatusPill,
  RecordStatusPill,
  ReleaseStatusPill,
  VerificationPill,
} from '@/him/shared'

/* Real records from the module's fixture set, named here so a tile reads as
   one patient's journey rather than four unrelated rows. */
const NGOZI = HIM_PATIENTS[0]
const byMrn = (mrn: string) => HIM_PATIENTS.find((p) => p.mrn === mrn)

/* ── 04 · Identifier table ────────────────────────────────────────────────── */

const IDENTIFIER_COLUMNS: Column<HimIdentifier>[] = [
  {
    key: 'type',
    header: 'Type',
    cell: (i) => <span className="font-medium text-forest">{i.type}</span>,
  },
  {
    key: 'value',
    header: 'Value',
    cell: (i) => <span className="tnum font-mono text-[13px]">{i.value}</span>,
  },
  {
    key: 'verification',
    header: 'Verification',
    cell: (i) => <VerificationPill status={i.verification} />,
  },
]

/* ── 05 · Worklist toolbar ────────────────────────────────────────────────── */

type Bucket = 'pending' | 'decided' | 'all'
const BUCKETS: SegOption<Bucket>[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'decided', label: 'Decided' },
  { value: 'all', label: 'All' },
]

/** Shown mid-search, which is the state worth reading — an empty field is not. */
function WorklistToolbar() {
  return (
    <div className="space-y-3">
      <FilterBar
        search={{
          value: 'Adeyemi',
          onChange: () => {},
          placeholder: 'Name, MRN or phone',
          label: 'Search the duplicate queue',
        }}
      >
        <Segmented options={BUCKETS} value="pending" onChange={() => {}} />
      </FilterBar>
      <p className="tnum text-caption text-forest-400">
        3 candidate pairs matching “Adeyemi”
      </p>
    </div>
  )
}

/* ── 06 · Duplicate comparison ────────────────────────────────────────────── */

/** Two candidate records side by side — the reviewer compares, never guesses. */
function DuplicateComparison() {
  const a = byMrn('GGH-002731')
  const b = byMrn('GGH-000913')
  if (!a || !b) return null
  const rows: [string, (p: HimPatient) => ReactNode][] = [
    ['Name', (p) => patientDisplayName(p)],
    ['MRN', (p) => <span className="font-mono">{p.mrn}</span>],
    ['Date of birth', (p) => p.dob ?? `Estimated ${p.estimatedAge}y`],
    ['Phone', (p) => p.phone ?? '—'],
  ]
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-caption text-forest-400">Match confidence</span>
        <div className="flex items-center gap-2">
          <ProgressMeter value={94} />
          <Badge tone="warning" dot>
            pending review
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[a, b].map((p, i) => (
          <div key={p.id} className="space-y-2.5 border border-hair bg-white p-4">
            <p className="text-overline uppercase text-forest-300">
              {i === 0 ? 'Survivor' : 'Non-survivor'}
            </p>
            <dl className="space-y-2.5">
              {rows.map(([label, get]) => (
                <KeyValue key={label} label={label} value={get(p)} />
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="text-caption leading-relaxed text-forest-400">
        Matching on family name, DOB, sex and phone. The differing field is what the
        reviewer is deciding about — it is never hidden to make the pair look cleaner.
      </p>
    </div>
  )
}

/* ── 07 · Merge confirmation ──────────────────────────────────────────────── */

/**
 * The high-risk confirmation at rest, shown in the empty-reason state — the one
 * that matters, because that is when the confirming action is still disabled.
 */
function MergeConfirmation() {
  return (
    <Modal
      inline
      open
      onClose={() => {}}
      title="Merge these two records?"
      subtitle="Ada Okafor (GGH-002731) ↔ Folake Adeyemi (GGH-000913)"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button disabled leftIcon={<GitMerge size={14} aria-hidden />}>
            Merge records
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Alert tone="warning" title="This redirects one record onto the other">
          The non-survivor is marked <strong>merged</strong> and its encounters, documents
          and identifiers redirect to the survivor. Reversible by a supervisor within
          governance rules — not by the person merging.
        </Alert>
        <Field label="Reason" required hint="Shown in the merge report and audit trail.">
          <Textarea rows={3} placeholder="Confirmed same patient after NIN verification." />
        </Field>
        <dl>
          <KeyValue
            label="Preserved on the survivor"
            value="Encounters, documents, coverage and audit history"
          />
        </dl>
      </div>
    </Modal>
  )
}

/* ── 08 · Break-glass audit trail ─────────────────────────────────────────── */

const AUDIT_TRAIL: TimelineEvent[] = AUDIT_EVENTS.slice(0, 3).map((e) => ({
  meta: `${e.time} · ${e.actor} (${e.role})`,
  title: e.breakGlass ? `${e.action} — review required` : e.action,
  description: (
    <>
      <span className="font-medium text-forest-500">{e.patientLabel}.</span> {e.detail}
    </>
  ),
  tone: e.tone,
}))

/* ── 09 · Completeness worklist ───────────────────────────────────────────── */

const INCOMPLETE = HIM_PATIENTS.filter((p) => p.completeness < 100).slice(0, 4)

/* ── 10/11 · Module switching ─────────────────────────────────────────────── */

/** The switch dialog at rest, with HIM as the current workspace. */
function ModuleSwitchDialog() {
  return (
    <Modal
      inline
      open
      onClose={() => {}}
      size="lg"
      title="Switch module"
      subtitle="You are moving between workspaces — the whole navigation and screen set changes."
      bodyClassName="pb-7 pt-6"
    >
      <ModuleCardList modules={PRODUCT_MODULES} activeId="him" />
    </Modal>
  )
}

/* ── 12 · Care patient details ────────────────────────────────────────────── */

/**
 * The Care chart's identity block. Unlike the HIM banner this one masks MRN and
 * date of birth until the clinician reveals them, and pairs the identity with
 * the vitals row and the contact rail the chart actually shows.
 */
function CarePatientDetails() {
  const patient = PATIENTS[0]
  const bio = PATIENT_BIO[patient.id]
  if (!bio) return null
  return (
    <div className="space-y-3">
      {/* A specimen, not the page — the case study owns its own h1. */}
      <PatientBanner patient={patient} bio={bio} nameAs="p" />
      <VitalsRow vitals={bio.vitals} />
      <Card>
        <dl className="grid gap-3 sm:grid-cols-2">
          <KeyValue label="Phone" value={<span className="tnum">{bio.phone}</span>} />
          <KeyValue label="Next of kin" value={bio.nextOfKin} />
          <KeyValue label="Insurer" value={`${bio.insurer} · ${bio.memberId}`} />
          <KeyValue label="Conditions" value={bio.conditions.join(', ') || '—'} />
        </dl>
      </Card>
    </div>
  )
}

/* ── 14 · Discharge summary ───────────────────────────────────────────────── */

/**
 * The real document preview, shown in the drawer chrome it ships inside. doc1 in
 * `him/data.ts` IS a discharge summary, so this is the product's own artifact
 * rather than a specimen written for the gallery.
 */
const DISCHARGE_SUMMARY = HIM_DOCUMENTS.find((d) => d.type === 'Discharge summary')

/* ── 13 · Document upload states ──────────────────────────────────────────── */

/**
 * The four states drawn at rest. `FileUpload` owns its transport state
 * internally and cannot be posed from outside, so each row here is the state's
 * own treatment — which is what a portfolio still needs anyway.
 */
const UPLOAD_STATES: { state: string; blurb: string; row: ReactNode }[] = [
  {
    state: 'Idle',
    blurb: 'Accepted types and the size ceiling are stated before anyone picks a file.',
    row: (
      <div className="flex items-center gap-3 border border-dashed border-hair bg-white px-4 py-3">
        <UploadCloud size={17} className="shrink-0 text-forest-300" aria-hidden />
        <span className="text-caption text-forest-400">
          Drop a file or browse · PDF, JPG or PNG · up to 2 MB
        </span>
      </div>
    ),
  },
  {
    state: 'Uploading',
    blurb: 'Determinate progress — a spinner alone would not say whether it is stuck.',
    row: <ProgressBar value={62} showValue label="referral-letter.pdf" />,
  },
  {
    state: 'Complete',
    blurb: 'Uploaded is not the same as filed: HIM still has to index it against a record.',
    row: (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-caption text-forest-500">referral-letter.pdf · 1.2 MB</span>
        <DocumentStatusPill status="pending index" />
      </div>
    ),
  },
  {
    state: 'Error',
    blurb: 'Says what failed and whether retrying can fix it — a size breach cannot.',
    row: (
      <Alert tone="danger" title="scan-004213.png is 4.1 MB — over the 2 MB limit">
        Re-scan at a lower resolution. Transport failures offer Retry; a size breach does not.
      </Alert>
    ),
  },
]

/* ── the ten ──────────────────────────────────────────────────────────────── */

interface Snippet {
  n: string
  title: string
  /** What the specimen is protecting — one line, no restating the title. */
  note: string
  /** The primitives it composes, for the reader who wants to go find them. */
  built: string
  body: ReactNode
}

const SNIPPETS: Snippet[] = [
  {
    n: '01',
    title: 'Registration slip',
    note: 'What the patient walks out with. The MRN is their key at every future desk, so it is set in mono at display size and repeated as a scannable code — a misread digit here creates a duplicate record later.',
    built: 'RegistrationSlipCard · Logo · Tag · QR',
    body: (
      <RegistrationSlipCard
        slip={{
          name: 'Ngozi Amara Eze',
          id: 'GGH-004213',
          idLabel: 'Medical record number',
          detail: '14 Mar 1992 · Female · +234 803 221 4410',
          category: 'HMO',
          scenario: 'standard',
        }}
      />
    ),
  },
  {
    n: '02',
    title: 'Record banner',
    note: 'The wrong-patient control. It sits above every record screen, and allergies are always-visible pills rather than something behind a tab — the danger cannot be scrolled past.',
    built: 'RecordBanner · Avatar · Badge · Tag',
    body: (
      <RecordBanner
        name={patientDisplayName(NGOZI)}
        /* A specimen, not the page — the case study owns its own h1. */
        nameAs="p"
        status={<RecordStatusPill status={NGOZI.recordStatus} />}
        identifiers={
          <>
            {NGOZI.dob} · {NGOZI.sex} · MRN <span className="font-mono">{NGOZI.mrn}</span>
          </>
        }
        allergies={['Penicillin']}
        tags={
          <>
            <Tag className="capitalize">{NGOZI.category}</Tag>
            <Tag>Hygeia HMO</Tag>
          </>
        }
      />
    ),
  },
  {
    n: '03',
    title: 'Worded status pills',
    note: 'Four status families — record, verification, document, release. Each is a soft fill, AA-contrast text and the word itself, so status survives greyscale, colour-vision deficiency and a screen reader.',
    built: 'Badge · him/shared.tsx',
    body: (
      <div className="space-y-3">
        {[
          ['Record', <RecordStatusPill key="a" status="permanent" />, <RecordStatusPill key="b" status="temporary" />, <RecordStatusPill key="c" status="restricted" />],
          ['Verification', <VerificationPill key="a" status="verified" />, <VerificationPill key="b" status="pending verification" />, <VerificationPill key="c" status="unverified" />],
          ['Document', <DocumentStatusPill key="a" status="indexed" />, <DocumentStatusPill key="b" status="pending index" />, <DocumentStatusPill key="c" status="created-in-error" />],
          ['Release', <ReleaseStatusPill key="a" status="released" />, <ReleaseStatusPill key="b" status="pending approval" />, <ReleaseStatusPill key="c" status="rejected" />],
        ].map(([label, ...pills]) => (
          <div key={String(label)} className="space-y-1.5">
            <p className="text-overline uppercase text-forest-300">{label}</p>
            <div className="flex flex-wrap gap-2">{pills}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '04',
    title: 'Identifier table',
    note: 'One patient, many identities — MRN, NIN, insurance number. Every row carries its assigning authority and verification state, because an unverified NIN is not evidence of identity.',
    built: 'DataTable · VerificationPill',
    body: (
      <DataTable
        columns={IDENTIFIER_COLUMNS}
        rows={NGOZI.identifiers}
        rowKey={(i) => i.value}
        density="compact"
        minWidth={320}
        pagination="none"
      />
    ),
  },
  {
    n: '05',
    title: 'Worklist toolbar',
    note: 'Search plus a bucket switch, and a live count under it. Every HIM queue wears this same head, so a clerk moving between duplicates, incomplete records and releases relearns nothing.',
    built: 'FilterBar · SearchInput · Segmented',
    body: <WorklistToolbar />,
  },
  {
    n: '06',
    title: 'Duplicate comparison',
    note: 'Two candidate records side by side with the match confidence stated as a number. The reviewer is deciding whether these are one person — the interface must not make that look easier than it is.',
    built: 'KeyValue · ProgressMeter · Badge',
    body: <DuplicateComparison />,
  },
  {
    n: '07',
    title: 'Merge confirmation',
    note: 'The most expensive action in the module. Named verb, both patients restated, a mandatory reason that lands in the audit trail, and no optimistic UI — the row does not change until the server agrees.',
    built: 'Modal · Alert · Field · Textarea',
    body: <MergeConfirmation />,
  },
  {
    n: '08',
    title: 'Break-glass audit trail',
    note: 'Emergency access to a restricted record is permitted and then loudly recorded. The break-glass entry reads “review required” in words, not just a red dot, and the justification is quoted verbatim.',
    built: 'Timeline · him/data.ts',
    body: <Timeline events={AUDIT_TRAIL} />,
  },
  {
    n: '09',
    title: 'Completeness worklist',
    note: 'Records missing required demographics stay visible until someone finishes them. The meter is paired with the actual missing field names, because a percentage alone is not an instruction.',
    built: 'DataTable · ProgressMeter',
    body: (
      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Patient',
            cell: (p: HimPatient) => (
              <span className="font-medium text-forest">{patientDisplayName(p)}</span>
            ),
          },
          {
            key: 'completeness',
            header: 'Complete',
            align: 'right',
            cell: (p: HimPatient) => <ProgressMeter value={p.completeness} />,
          },
          {
            key: 'missing',
            header: 'Missing',
            cell: (p: HimPatient) => (
              <span className="text-caption text-forest-400">
                {p.missingFields?.join(', ') ?? '—'}
              </span>
            ),
          },
        ]}
        rows={INCOMPLETE}
        rowKey={(p) => p.id}
        density="compact"
        minWidth={380}
        pagination="none"
      />
    ),
  },
  {
    n: '10',
    title: 'Switch module — the dialog',
    note: 'Changing workspace swaps the entire navigation and screen set, so it is a dialog of full module cards, not a dropdown. The current workspace is marked with a tick and the words “current module” for assistive tech, never colour alone.',
    built: 'Modal · ModuleCardList · app/modules.ts',
    body: <ModuleSwitchDialog />,
  },
  {
    n: '11',
    title: 'Switch module — the hand-off',
    note: 'Between the two workspaces a one-second card holds: a lit segment snakes along a faint grid while the target badge breathes, so a whole-app navigation reads as deliberate rather than as a hang. Skipped entirely under prefers-reduced-motion.',
    built: 'ModuleSwitchOverlay · gx-snake · gx-switch-mark',
    body: <ModuleSwitchOverlay inline module={PRODUCT_MODULES[0]} />,
  },
  {
    n: '12',
    title: 'Patient details — Care',
    note: 'The clinical chart’s banner is the stricter cousin of the HIM one: MRN and date of birth are masked until revealed, because a chart is read over a shoulder in a shared consulting room. Allergies stay unmasked — hiding those would be the unsafe choice.',
    built: 'PatientBanner · VitalsRow · KeyValue',
    body: <CarePatientDetails />,
  },
  {
    n: '13',
    title: 'Document upload — four states',
    note: 'Idle, uploading, complete and error, each drawn at rest. “Complete” deliberately does not say “filed” — indexing the document against a record is a separate HIM step, and conflating the two is how a scan ends up on the wrong patient.',
    built: 'ProgressBar · Alert · DocumentStatusPill',
    body: (
      <ul className="divide-y divide-hair">
        {UPLOAD_STATES.map(({ state, blurb, row }, i) => (
          <li key={state} className={i === 0 ? 'space-y-2 pb-3' : 'space-y-2 py-3 last:pb-0'}>
            <div className="flex items-baseline gap-2.5">
              <span className="text-overline uppercase text-azure">{state}</span>
              <span className="text-caption leading-relaxed text-forest-400">{blurb}</span>
            </div>
            {row}
          </li>
        ))}
      </ul>
    ),
  },
  {
    n: '14',
    title: 'Discharge summary',
    note: 'The handover document, read by people who never met the patient. It opens in a drawer rather than navigating away, carries the facility letterhead so a printed copy is self-identifying, and states that viewing is itself an audit event.',
    built: 'Modal · DocumentPreviewCard · Logo',
    body: DISCHARGE_SUMMARY ? (
      <Modal
        inline
        open
        onClose={() => {}}
        size="lg"
        title={DISCHARGE_SUMMARY.type}
        subtitle={`${DISCHARGE_SUMMARY.patientLabel} · v${DISCHARGE_SUMMARY.version}`}
      >
        <DocumentPreviewCard doc={DISCHARGE_SUMMARY} />
      </Modal>
    ) : null,
  },
  {
    n: '15',
    title: 'Cleared worklist',
    note: 'An empty queue is good news, so it says so and names what would appear here. The same illustration set covers every empty and error state in the product, which is why a 404 and a cleared queue feel related.',
    built: 'EmptyState · Button',
    body: (
      <EmptyState
        compact
        variant="search"
        title="No duplicate candidates"
        description="Every flagged pair has been decided. New candidates appear here as registration runs its duplicate check."
        action={
          <Button size="sm" variant="secondary" leftIcon={<ShieldAlert size={14} aria-hidden />}>
            Run a sweep
          </Button>
        }
      />
    ),
  },
]

/* ── the gallery ──────────────────────────────────────────────────────────── */

/**
 * Masonry rather than a grid: these specimens differ wildly in height — a slip
 * is tall, a toolbar is one row — and a row-aligned grid would pad every short
 * tile to match the tallest in its row. CSS columns let each tile end where it
 * ends. The trade-off is reading order (down each column, not across), which is
 * fine here because the tiles are independent and numbered.
 */
export function HimSnippetGallery() {
  return (
    <ul className="gap-gutter-dense sm:columns-2 [column-fill:balance]">
      {SNIPPETS.map(({ n, title, note, built, body }) => (
        <li key={n} className="mb-3 break-inside-avoid">
          <Card className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2.5">
                <span className="tnum text-overline text-forest-300">{n}</span>
                <h3 className="text-heading text-forest">{title}</h3>
              </div>
              <p className="text-caption leading-relaxed text-forest-400">{note}</p>
              <p className="font-mono text-[11px] leading-relaxed text-forest-300">{built}</p>
            </div>
            {/* No tinted well — each specimen carries its own hairline and white
                fill, which is how it appears in the product. A grey backing
                would recolour every one of them. */}
            <div className="overflow-x-auto border-t border-hair pt-4">{body}</div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
