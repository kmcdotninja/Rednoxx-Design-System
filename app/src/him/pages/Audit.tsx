import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Card, EmptyState, Segmented, useToast, type SegOption } from '@/components/ui'
import { Timeline, type TimelineEvent } from '@/components/blocks'
import { FilterBar } from '@/components/blocks'
import { HimPageHeader } from '../HimShell'
import { AUDIT_EVENTS } from '../data'
import { useRole } from '../rbac'

type AuditFilter = 'all' | 'break-glass' | 'merges' | 'releases'

const FILTERS: SegOption<AuditFilter>[] = [
  { value: 'all', label: 'All events' },
  { value: 'break-glass', label: 'Break-glass' },
  { value: 'merges', label: 'Merges' },
  { value: 'releases', label: 'Releases' },
]

/** Audit review (W-HIM-040) — immutable trail, filterable, exportable. */
export function AuditPage() {
  const { info } = useToast()
  const { can } = useRole()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<AuditFilter>('all')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return AUDIT_EVENTS.filter((e) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'break-glass' && e.breakGlass) ||
        (filter === 'merges' && e.action.toLowerCase().includes('merge')) ||
        (filter === 'releases' && e.action.toLowerCase().includes('release'))
      return (
        matchesFilter &&
        (!q || `${e.actor} ${e.role} ${e.action} ${e.patientLabel} ${e.detail}`.toLowerCase().includes(q))
      )
    })
  }, [query, filter])

  const events: TimelineEvent[] = rows.map((e) => ({
    meta: `${e.time} · ${e.actor} (${e.role})`,
    title: e.breakGlass ? `${e.action} — review required` : e.action,
    description: (
      <>
        <span className="font-medium text-forest-500">{e.patientLabel}.</span> {e.detail}
      </>
    ),
    tone: e.tone,
  }))

  return (
    <>
      <HimPageHeader
        title="Audit log"
        subtitle="Append-only — registration, updates, merges, releases and restricted access"
        actions={
          can.exportAudit === false ? undefined : (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Download size={14} />}
            onClick={() =>
              info('Export is scoped and logged', 'Exports state facility, period and generated-by — and are themselves audit events.')
            }
          >
            Export
          </Button>
          )
        }
      />

      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: 'Search actor, patient, action…', label: 'Search audit events' }}
      >
        <Segmented options={FILTERS} value={filter} onChange={setFilter} />
      </FilterBar>

      {events.length === 0 ? (
        <Card pad={false}>
          <EmptyState
            variant="search"
            title="No audit events match"
            description="Widen the filter — high-risk actions (merge, release, break-glass) are always recorded."
          />
        </Card>
      ) : (
        <Card>
          <Timeline events={events} />
        </Card>
      )}
    </>
  )
}
