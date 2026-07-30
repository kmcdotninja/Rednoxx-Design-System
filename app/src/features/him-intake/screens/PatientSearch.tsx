import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ShieldCheck, UserPlus, ArrowLeft, X } from 'lucide-react'
import { Button, DataTable, EmptyState, Select, type Column } from '@/components/ui'
import { FilterBar } from '@/components/blocks'
import { searchPatients } from '../api'
import { ErrorState, PageHeader, PatientStatusBadges, TableSkeleton, can } from '../shared'
import type { PatientSearchResult } from '../types'
import { FACILITIES } from '../data'

const SEX_OPTIONS = [
  { value: '', label: 'Any sex' },
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' },
]

export function PatientSearchPage() {
  const navigate = useNavigate()
  const initialQ = (useSearch({ strict: false }) as { q?: string })?.q ?? ''

  const [q, setQ] = useState(initialQ)
  const [facility, setFacility] = useState('')
  const [sex, setSex] = useState('')

  const params = useMemo(
    () => ({ q, facility: facility || undefined, sex: (sex || undefined) as never }),
    [q, facility, sex],
  )

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['patient-search', params],
    queryFn: () => searchPatients(params),
  })

  const openPatient = (row: PatientSearchResult) => {
    const targetId =
      row.statusFlags.includes('merged') && row.mergedIntoId ? row.mergedIntoId : row.id
    navigate({ to: '/him/patients/$id', params: { id: targetId } })
  }

  const clearFilters = () => {
    setFacility('')
    setSex('')
  }

  const columns: Column<PatientSearchResult>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (r) => (
        <div className="min-w-0">
          <p className="font-medium text-forest">{r.displayName}</p>
          {r.restrictedStub && (
            <p className="text-[12px] text-forest-400">Restricted — request access to view</p>
          )}
        </div>
      ),
    },
    {
      key: 'mrn',
      header: 'MRN',
      cell: (r) => <span className="tnum font-mono text-forest-500">{r.mrn}</span>,
    },
    {
      key: 'age',
      header: 'Age / sex',
      cell: (r) => (
        <span className="tnum text-forest-500">
          {r.age != null ? `${r.age}y` : '—'} · {r.sex}
        </span>
      ),
    },
    { key: 'status', header: 'Status', cell: (r) => <PatientStatusBadges flags={r.statusFlags} /> },
    {
      key: 'facility',
      header: 'Facility',
      cell: (r) => <span className="text-forest-500">{r.facility}</span>,
    },
    {
      key: 'lastVisit',
      header: 'Last visit',
      cell: (r) => (
        <span className="tnum text-[13px] text-forest-400">{r.lastVisit ?? 'No visits yet'}</span>
      ),
    },
    {
      key: 'verify',
      header: 'Verify identity',
      align: 'right',
      cell: (r) => (
        <span onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Verify identity"
            aria-label={`Verify ${r.displayName}`}
            onClick={() => navigate({ to: '/him/patients/$id/verify', params: { id: r.id } })}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-forest-300 hover:bg-panel hover:text-forest"
          >
            <ShieldCheck size={15} />
          </button>
        </span>
      ),
    },
  ]

  const showNoMatchCta =
    !isPending && !isError && q.trim().length > 0 && (data?.results.length ?? 0) === 0

  const hasActiveFilters = facility !== '' || sex !== ''

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 transition-colors hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <PageHeader
        title="Patient search"
        subtitle="Find and confirm a patient before registering or opening a record."
      />

      <FilterBar
        search={{
          value: q,
          onChange: setQ,
          label: 'Search patients by name, MRN, phone or identifier',
          placeholder: 'Name, MRN, phone…',
        }}
      >
        <Select
          aria-label="Filter by facility"
          value={facility}
          onChange={(e) => setFacility(e.target.value)}
          className="h-9 w-auto min-w-[140px]"
        >
          <option value="">All facilities</option>
          {FACILITIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by sex"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="h-9 w-auto min-w-[120px]"
        >
          {SEX_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {hasActiveFilters && (
          <Button
            variant="danger"
            size="sm"
            leftIcon={<X size={14} />}
            onClick={clearFilters}
            className="text-forest-400 hover:text-forest"
          >
            Clear filters
          </Button>
        )}
      </FilterBar>

      {isError ? (
        <ErrorState message="We couldn't search patients right now." onRetry={() => refetch()} />
      ) : isPending ? (
        <TableSkeleton cols={7} />
      ) : (
        <>
          {data.tooMany && (
            <p className="rounded-2xl bg-panel px-3.5 py-2.5 text-[13px] text-forest-400">
              Showing the first {data.results.length} matches — refine your search to narrow
              further.
            </p>
          )}
          <DataTable
            columns={columns}
            rows={data.results}
            rowKey={(r) => r.id}
            onRowClick={openPatient}
            empty={
              <EmptyState
                compact
                variant="search"
                title="No matching patients"
                description="No record matches this search. You can register a new patient with these details."
              />
            }
          />
        </>
      )}

      {showNoMatchCta && can('patient.register') && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-hair bg-white p-4">
          <div>
            <p className="text-sm font-medium text-forest">No match found for "{q}"</p>
            <p className="mt-0.5 text-[13px] text-forest-400">
              Search-before-create is required — proceed to registration with these search terms
              carried forward.
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<UserPlus size={14} />}
            onClick={() => navigate({ to: '/him/patients/register', search: { q: q.trim() } })}
          >
            Register new patient
          </Button>
        </div>
      )}
    </div>
  )
}
