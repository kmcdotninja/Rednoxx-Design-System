import { useMemo, useState } from 'react'
import { ScrollText } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Badge, Card, DataTable, Drawer, EmptyState, SearchInput, Tabs, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { DOMAIN_META } from '@/data/nav'
import { formatDateTime } from '@/lib/format'
import type { AuditEntry } from '@/data/types'

export function AdminAudit() {
  const { auditTrail } = useStore()
  const [query, setQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [open, setOpen] = useState<AuditEntry | null>(null)

  const modules = useMemo(() => [...new Set(auditTrail.map((a) => a.module))].sort(), [auditTrail])

  const tabs: TabItem<string>[] = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...modules.map((m) => ({ value: m, label: m, count: auditTrail.filter((a) => a.module === m).length })),
    ],
    [modules, auditTrail],
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return auditTrail
      .filter((a) => moduleFilter === 'all' || a.module === moduleFilter)
      .filter((a) => !q || `${a.user} ${a.module} ${a.activity} ${a.ip} ${a.domain}`.toLowerCase().includes(q))
  }, [auditTrail, query, moduleFilter])

  const columns: Column<AuditEntry>[] = [
    {
      key: 'activity',
      header: 'Activity',
      cell: (a) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{a.activity}</p>
          <p className="truncate text-xs text-navy-400">{a.user} · {DOMAIN_META[a.domain].label}</p>
        </div>
      ),
    },
    { key: 'module', header: 'Module', cell: (a) => <Badge tone="neutral">{a.module}</Badge> },
    { key: 'ip', header: 'Client IP', cell: (a) => <span className="tnum text-navy-500">{a.ip}</span> },
    { key: 'at', header: 'Date created', align: 'right', cell: (a) => <span className="text-navy-400">{formatDateTime(a.at)}</span> },
    {
      key: 'changes',
      header: 'Changes',
      align: 'right',
      cell: (a) => (a.changes?.length ? <Badge tone="info">{a.changes.length} field(s)</Badge> : <span className="text-navy-300">—</span>),
    },
  ]

  return (
    <>
      <PageHeader
        title="Audit Trail"
        subtitle="Every user action on the marketplace, recorded for forensic audit."
      />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={moduleFilter} onChange={setModuleFilter} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search by user, activity, IP…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(a) => a.id}
            onRowClick={setOpen}
            empty={<EmptyState compact variant="search" title="No audit entries" description="User actions will be recorded here." />}
          />
        </div>
      </Card>

      <Drawer
        open={open !== null}
        onClose={() => setOpen(null)}
        title="Audit entry"
        subtitle={open ? `${open.module} · ${formatDateTime(open.at)}` : undefined}
      >
        {open && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl bg-panel/70 p-4">
              <ScrollText size={18} className="mt-0.5 shrink-0 text-navy-400" />
              <p className="text-sm leading-relaxed text-navy-600">{open.activity}</p>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <Item label="Username" value={open.user} />
              <Item label="Institution type" value={DOMAIN_META[open.domain].label} />
              <Item label="Client machine IP" value={open.ip} />
              <Item label="Module" value={open.module} />
              <Item label="Date created" value={formatDateTime(open.at)} />
            </dl>
            {open.changes && open.changes.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.06em] text-navy-400">Object changes</p>
                <div className="overflow-hidden rounded-2xl border border-hair">
                  <table className="w-full text-sm">
                    <thead className="bg-panel/70 text-left text-xs text-navy-400">
                      <tr>
                        <th className="px-3.5 py-2 font-medium">Field</th>
                        <th className="px-3.5 py-2 font-medium">From</th>
                        <th className="px-3.5 py-2 font-medium">To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {open.changes.map((c, i) => (
                        <tr key={i} className="border-t border-hair">
                          <td className="px-3.5 py-2.5 font-medium text-navy">{c.field}</td>
                          <td className="px-3.5 py-2.5 text-navy-400">{c.from.replace(/_/g, ' ')}</td>
                          <td className="px-3.5 py-2.5 font-medium text-navy-600">{c.to.replace(/_/g, ' ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-navy-400">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-navy">{value}</dd>
    </div>
  )
}
