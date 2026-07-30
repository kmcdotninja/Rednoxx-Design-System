import { useMemo, useState } from 'react'
import { QrCode, UserPlus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  ProgressMeter,
  Tabs,
  type Column,
  type TabItem,
} from '@/components/ui'
import { FilterBar } from '@/components/blocks'
import { HimPageHeader } from '../HimShell'
import { HIM_PATIENTS, patientDisplayName, type HimPatient } from '../data'
import { RegisterPatientDrawer } from '../RegisterDrawer'
import { RegistrationSlipModal, type SlipData } from '../RegistrationSlip'
import { useRole } from '../rbac'
import { RecordStatusPill } from '../shared'

/** Map a register record to its printable slip (MRN / temporary emergency ID). */
function patientToSlip(p: HimPatient): SlipData {
  const temporary = p.recordStatus === 'temporary' || p.mrn.startsWith('TEMP')
  return {
    name: patientDisplayName(p),
    id: p.mrn,
    idLabel: temporary ? 'Temporary emergency ID' : 'Medical record number',
    detail: p.dob ? `${p.sex} · DOB ${p.dob}` : `${p.sex} · est. ${p.estimatedAge ?? '—'}y`,
    category: p.category,
    scenario: temporary ? 'emergency' : 'standard',
  }
}

type IndexBucket = 'all' | 'attention' | 'restricted' | 'merged'

const ATTENTION: HimPatient['recordStatus'][] = ['temporary', 'provisional', 'duplicate-suspected']

function inBucket(p: HimPatient, bucket: IndexBucket): boolean {
  switch (bucket) {
    case 'all':
      return true
    case 'attention':
      return ATTENTION.includes(p.recordStatus)
    case 'restricted':
      return p.recordStatus === 'restricted'
    case 'merged':
      return p.recordStatus === 'merged' || p.recordStatus === 'inactive'
  }
}

const columns: Column<HimPatient>[] = [
  {
    key: 'patient',
    header: 'Patient',
    cell: (p) => (
      <span>
        <span className="block font-medium text-forest">{patientDisplayName(p)}</span>
        <span className="block text-xs text-forest-400">
          {p.sex} · {p.dob ?? `est. ${p.estimatedAge}y`}
        </span>
      </span>
    ),
  },
  { key: 'mrn', header: 'MRN', cell: (p) => <span className="tnum font-mono text-[13px]">{p.mrn}</span> },
  { key: 'phone', header: 'Phone', cell: (p) => <span className="tnum">{p.phone ?? '—'}</span> },
  { key: 'lga', header: 'State · LGA', cell: (p) => (p.state ? `${p.state} · ${p.lga}` : '—') },
  { key: 'category', header: 'Category', cell: (p) => <span className="capitalize">{p.category}</span> },
  {
    key: 'completeness',
    header: 'Complete',
    align: 'right',
    cell: (p) => <ProgressMeter value={p.completeness} />,
  },
  { key: 'status', header: 'Record status', cell: (p) => <RecordStatusPill status={p.recordStatus} /> },
]

/**
 * Master patient index (W-HIM-023) — the full register, searchable across
 * name, MRN, phone and identifiers. "Create new patient" appears only after
 * a search has run: search-before-create is the duplicate-prevention control.
 */
export function PatientIndexPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [bucket, setBucket] = useState<IndexBucket>('all')
  const [registerOpen, setRegisterOpen] = useState(false)
  const [slipPatient, setSlipPatient] = useState<HimPatient | null>(null)
  const { can } = useRole()

  // Trailing action: view the record's MRN slip (barcode/QR) and reprint it.
  const slipColumn: Column<HimPatient> = {
    key: 'slip',
    header: '',
    align: 'right',
    cell: (p) => (
      <Button
        size="sm"
        variant="ghost"
        leftIcon={<QrCode size={14} />}
        onClick={(e) => {
          e.stopPropagation()
          setSlipPatient(p)
        }}
        aria-label={`View and print the MRN slip for ${patientDisplayName(p)}`}
      >
        Slip
      </Button>
    ),
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return HIM_PATIENTS.filter(
      (p) =>
        inBucket(p, bucket) &&
        (!q ||
          [patientDisplayName(p), p.mrn, p.phone ?? '', ...p.identifiers.map((i) => i.value)]
            .join(' ')
            .toLowerCase()
            .includes(q)),
    )
  }, [query, bucket])

  const tabs: TabItem<IndexBucket>[] = [
    { value: 'all', label: 'All records', count: HIM_PATIENTS.length },
    {
      value: 'attention',
      label: 'Needs attention',
      count: HIM_PATIENTS.filter((p) => inBucket(p, 'attention')).length,
    },
    {
      value: 'restricted',
      label: 'Restricted',
      count: HIM_PATIENTS.filter((p) => inBucket(p, 'restricted')).length,
    },
    {
      value: 'merged',
      label: 'Merged & inactive',
      count: HIM_PATIENTS.filter((p) => inBucket(p, 'merged')).length,
    },
  ]

  const searched = query.trim() !== ''

  return (
    <>
      <HimPageHeader
        title="Patient index"
        subtitle={`${HIM_PATIENTS.length} records in the master patient index · Garki General Hospital`}
      />

      <FilterBar
        search={{
          value: query,
          onChange: setQuery,
          placeholder: 'Search name, MRN, phone or any identifier…',
          label: 'Search the master patient index',
        }}
      >
        {/* Create-new unlocks only after a search has executed (safety §1) — and only for registration roles. */}
        {can.register && !searched && (
          <span className="text-xs text-forest-300">Search first — duplicate prevention</span>
        )}
        {can.register && (
          <Button
            size="sm"
            leftIcon={<UserPlus size={14} />}
            disabled={!searched}
            onClick={() => setRegisterOpen(true)}
          >
            Create new patient
          </Button>
        )}
      </FilterBar>

      <div className="border-b border-hair">
        <Tabs items={tabs} value={bucket} onChange={setBucket} />
      </div>

      {results.length === 0 ? (
        <Card pad={false}>
          <EmptyState
            variant="search"
            title={searched ? `No match for “${query.trim()}”` : 'No records in this bucket'}
            description={
              searched
                ? 'Try a broader spelling, another identifier, or the phone number. If the patient is genuinely new, create the record.'
                : 'Switch buckets to see the rest of the register.'
            }
            action={
              searched && can.register ? (
                <Button leftIcon={<UserPlus size={14} />} onClick={() => setRegisterOpen(true)}>
                  Create new patient
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <Card pad={false}>
          <p className="px-5 pt-4 text-[13px] text-forest-400">
            <span className="tnum font-medium text-forest">{results.length}</span> of{' '}
            <span className="tnum">{HIM_PATIENTS.length}</span> records — verify at least two
            identifiers before acting on a record.
          </p>
          <div className="px-2 pb-2 pt-2">
            <DataTable
              columns={[...columns, slipColumn]}
              rows={results}
              rowKey={(p) => p.id}
              onRowClick={(p) => navigate({ to: '/him-demo/patients/$id', params: { id: p.id } })}
            />
          </div>
        </Card>
      )}

      <RegisterPatientDrawer open={registerOpen} onClose={() => setRegisterOpen(false)} />

      {slipPatient && (
        <RegistrationSlipModal
          open
          onClose={() => setSlipPatient(null)}
          slip={patientToSlip(slipPatient)}
        />
      )}
    </>
  )
}
