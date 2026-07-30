import { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  Bell,
  Building2,
  Clock,
  Copy,
  FileClock,
  Search,
  Send,
  ShieldAlert,
  Siren,
  UserCheck,
  UserRoundPlus,
  Users,
  Baby,
  UserPlus,
  WifiOff,
  Wifi,
  Database,
  type LucideIcon,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Pagination,
  SearchInput,
  Skeleton,
  Tabs,
} from '@/components/ui'
import { getHimSummary, getHimWorklists, getHimRecentActivity } from '../api'
import { ErrorState, PageHeader, can } from '../shared'
import type { HimSummary, HimWorklistItem, HimWorklistType, HimActivityEvent } from '../types'

function KpiTile({
  label,
  value,
  icon: Icon,
  onClick,
}: {
  label: string
  value: string
  icon: LucideIcon
  onClick?: () => void
}) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Card pad={false} className="p-0">
      <Wrapper
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`block w-full p-4 text-left ${
          onClick ? 'cursor-pointer transition-opacity hover:opacity-75' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-forest-300">
            {label}
          </p>
          <Icon size={14} className="shrink-0 text-forest-300" />
        </div>
        <p className="tnum mt-1.5 text-[19px] font-medium leading-none tracking-[-0.01em] text-forest">
          {value}
        </p>
      </Wrapper>
    </Card>
  )
}

const KPI_ITEMS: { key: keyof HimSummary; label: string; icon: LucideIcon }[] = [
  { key: 'registrationsToday', label: 'Registrations today', icon: UserRoundPlus },
  { key: 'incompleteRecords', label: 'Incomplete records', icon: FileClock },
  { key: 'duplicateCandidates', label: 'Duplicate candidates', icon: Copy },
  { key: 'pendingReleaseRequests', label: 'Pending release requests', icon: FileClock },
  { key: 'openDsars', label: 'Open DSARs', icon: ShieldAlert },
  { key: 'breakGlassToReview', label: 'Break-glass to review', icon: Bell },
]

const KPI_TO_TAB: Partial<Record<keyof HimSummary, HimWorklistType>> = {
  incompleteRecords: 'incomplete',
  duplicateCandidates: 'duplicates',
  pendingReleaseRequests: 'release',
  openDsars: 'dsar',
}

export function HimHomePage() {
  const navigate = useNavigate()
  const [heroQuery, setHeroQuery] = useState('')
  const [localFilter, setLocalFilter] = useState('')
  const [tab, setTab] = useState<HimWorklistType | 'all'>('all')
  const [scope, setScope] = useState<'me' | 'facility'>('me')

  const worklistSectionRef = useRef<HTMLDivElement>(null)

  const summary = useQuery({ queryKey: ['him-summary'], queryFn: getHimSummary })
  const worklists = useQuery({ queryKey: ['him-worklists'], queryFn: () => getHimWorklists() })
  const activity = useQuery({ queryKey: ['him-recent-activity'], queryFn: getHimRecentActivity })

  const goToSearch = (q: string) => {
    navigate({ to: '/him/patients/search', search: q.trim() ? { q: q.trim() } : undefined })
  }

  const handleKpiClick = (key: keyof HimSummary) => {
    const mapped = KPI_TO_TAB[key]
    if (!mapped) return
    setTab(mapped)
    setScope('facility')
    requestAnimationFrame(() =>
      worklistSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="HIM Home"
        subtitle="Today's registration activity, worklists and data-quality signals."
      />

      <Card className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            className="flex-1"
            onSubmit={(e) => {
              e.preventDefault()
              goToSearch(heroQuery)
            }}
          >
            <SearchInput
              aria-label="Search all patients by name, MRN, or phone"
              placeholder="Search all patients by name, MRN, or phone…"
              wrapClassName="w-full"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
            />
          </form>
          <Button
            variant="primary"
            leftIcon={<Search size={15} />}
            onClick={() => goToSearch(heroQuery)}
          >
            Search all patients
          </Button>
          <Button
            variant="ghost"
            leftIcon={<Siren size={15} />}
            onClick={() => navigate({ to: '/him/patients/register/emergency' })}
            className="border border-rose-ink/30 bg-rose-soft text-rose-ink hover:bg-rose-soft/70"
            title="Emergency registration — for care that can't wait"
          >
            Emergency reg.
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {can('patient.mci.manage') && (
            <Button
              variant="ghost"
              leftIcon={<Users size={15} />}
              onClick={() => navigate({ to: '/him/patients/register/mass-casualty' })}
              className="border border-amber-ink/30 bg-amber-soft text-amber-ink hover:bg-amber-soft/70"
              title="Mass‑casualty registration — rapid sequential temp IDs"
            >
              Mass‑casualty
            </Button>
          )}
          {can('patient.register.neonate') && (
            <Button
              variant="ghost"
              leftIcon={<Baby size={15} />}
              onClick={() => navigate({ to: '/him/patients/register/neonate' })}
              className="border border-sky-ink/30 bg-sky-soft text-sky-ink hover:bg-sky-soft/70"
              title="Neonate registration — mother–baby linkage"
            >
              Neonate
            </Button>
          )}
          {can('patient.register') && (
            <Button
              variant="ghost"
              leftIcon={<UserPlus size={15} />}
              onClick={() => navigate({ to: '/him/patients/register/minor' })}
              className="border border-violet-ink/30 bg-violet-soft text-violet-ink hover:bg-violet-soft/70"
              title="Minor registration — guardian & consent required"
            >
              Minor
            </Button>
          )}
          {can('patient.register.offline') && (
            <Button
              variant="ghost"
              leftIcon={<WifiOff size={15} />}
              onClick={() => navigate({ to: '/him/offline/register' })}
              className="border border-amber-ink/30 bg-amber-soft text-amber-ink hover:bg-amber-soft/70"
              title="Offline registration – capture patients during downtime"
            >
              Offline
            </Button>
          )}
          {can('him.offline.reconcile') && (
            <Button
              variant="ghost"
              leftIcon={<Wifi size={15} />}
              onClick={() => navigate({ to: '/him/offline/reconcile' })}
              className="border border-purple-ink/30 bg-purple-soft text-purple-ink hover:bg-purple-soft/70"
              title="Reconcile offline records"
            >
              Reconcile
            </Button>
          )}
          {can('him.migration.manage') && (
            <Button
              variant="ghost"
              leftIcon={<Database size={15} />}
              onClick={() => navigate({ to: '/him/migration' })}
              className="border border-teal-ink/30 bg-teal-soft text-teal-ink hover:bg-teal-soft/70"
              title="Legacy data migration"
            >
              Migration
            </Button>
          )}
        </div>
      </Card>

      {summary.isError ? (
        <ErrorState
          message="We couldn't load today's HIM summary."
          onRetry={() => summary.refetch()}
        />
      ) : summary.isPending ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {KPI_ITEMS.map((item) => (
            <KpiTile
              key={item.key}
              label={item.label}
              value={String(summary.data[item.key])}
              icon={item.icon}
              onClick={KPI_TO_TAB[item.key] ? () => handleKpiClick(item.key) : undefined}
            />
          ))}
        </div>
      )}

      <div ref={worklistSectionRef}>
        {worklists.isError ? (
          <Card>
            <ErrorState
              message="We couldn't load your worklists."
              onRetry={() => worklists.refetch()}
            />
          </Card>
        ) : worklists.isPending ? (
          <Card pad={false} className="p-4">
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          </Card>
        ) : (
          <WorklistDashboard
            items={worklists.data}
            tab={tab}
            onTabChange={setTab}
            scope={scope}
            onScopeChange={setScope}
            localFilter={localFilter}
            onLocalFilterChange={setLocalFilter}
            onOpen={(item) =>
              item.patientId
                ? navigate({ to: '/him/patients/$id', params: { id: item.patientId } })
                : navigate({ to: item.detailTo })
            }
          />
        )}
      </div>

      <RecentActivityWidget
        isError={activity.isError}
        isPending={activity.isPending}
        items={activity.data}
        onRetry={() => activity.refetch()}
        onOpen={(patientId) => navigate({ to: '/him/patients/$id', params: { id: patientId } })}
      />
    </div>
  )
}

const TYPE_META: Record<HimWorklistType, { label: string; icon: LucideIcon }> = {
  incomplete: { label: 'Incomplete records', icon: FileClock },
  duplicates: { label: 'Duplicate candidates', icon: Copy },
  release: { label: 'Release requests', icon: Send },
  dsar: { label: 'DSARs', icon: ShieldAlert },
}

const URGENT_AFTER_HOURS = 24
const PAGE_SIZE = 5

function WorklistDashboard({
  items,
  tab,
  onTabChange,
  scope,
  onScopeChange,
  localFilter,
  onLocalFilterChange,
  onOpen,
}: {
  items: HimWorklistItem[]
  tab: HimWorklistType | 'all'
  onTabChange: (tab: HimWorklistType | 'all') => void
  scope: 'me' | 'facility'
  onScopeChange: (scope: 'me' | 'facility') => void
  localFilter: string
  onLocalFilterChange: (value: string) => void
  onOpen: (item: HimWorklistItem) => void
}) {
  const [page, setPage] = useState(0)

  const scoped = useMemo(
    () => (scope === 'me' ? items.filter((i) => i.assignedToMe) : items),
    [items, scope],
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: scoped.length }
    for (const item of scoped) map[item.type] = (map[item.type] ?? 0) + 1
    return map
  }, [scoped])

  const q = localFilter.trim().toLowerCase()

  const filtered = useMemo(() => {
    const byTab = tab === 'all' ? scoped : scoped.filter((i) => i.type === tab)
    const byQuery = q
      ? byTab.filter(
          (i) => i.patientName.toLowerCase().includes(q) || i.mrn?.toLowerCase().includes(q),
        )
      : byTab
    return [...byQuery].sort((a, b) => b.ageHours - a.ageHours)
  }, [scoped, tab, q])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const pageRows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)

  return (
    <Card pad={false} className="p-2 sm:p-3">
      <div className="flex flex-wrap items-start justify-between gap-3 px-3 pt-2">
        <div>
          <h2 className="text-[15px] font-medium tracking-[-0.01em] text-forest">
            {scope === 'me' ? 'My worklists' : 'Facility queue'}
          </h2>
          <p className="mt-0.5 text-[13px] text-forest-400">
            {scope === 'me'
              ? 'Assigned to you across every queue — oldest first.'
              : 'Everything open at your facilities — oldest first.'}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-2xl bg-panel p-1">
          <Button
            variant={scope === 'me' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon={<UserCheck size={13} />}
            onClick={() => {
              onScopeChange('me')
              setPage(0)
            }}
            className={scope === 'me' ? ' text-forest shadow-sm' : 'text-forest-400'}
          >
            My items
          </Button>
          <Button
            variant={scope === 'facility' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon={<Building2 size={13} />}
            onClick={() => {
              onScopeChange('facility')
              setPage(0)
            }}
            className={scope === 'facility' ? ' text-forest shadow-sm' : 'text-forest-400'}
          >
            Facility queue
          </Button>
        </div>
      </div>

      <div className="px-3 pt-3">
        <SearchInput
          aria-label="Filter this list by patient name or MRN"
          placeholder="Filter this list by patient or MRN…"
          wrapClassName="w-full sm:max-w-xs"
          value={localFilter}
          onChange={(e) => {
            onLocalFilterChange(e.target.value)
            setPage(0)
          }}
        />
      </div>

      <div className="mt-3 px-2">
        <Tabs
          items={[
            { value: 'all', label: 'All', count: counts.all ?? 0 },
            ...(Object.keys(TYPE_META) as HimWorklistType[]).map((type) => ({
              value: type,
              label: TYPE_META[type].label,
              count: counts[type] ?? 0,
            })),
          ]}
          value={tab}
          onChange={(v) => {
            onTabChange(v)
            setPage(0)
          }}
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        {filtered.length === 0 ? (
          <EmptyState
            compact
            variant="folder"
            title={q ? 'No matching worklist items' : 'No items here'}
            description={
              q
                ? 'Try a different patient name or MRN.'
                : scope === 'me'
                  ? "You're caught up — nothing assigned to you right now."
                  : 'No open items in the facility queue for this filter.'
            }
          />
        ) : (
          <>
            <div className="divide-y divide-hair/60">
              {pageRows.map((item) => {
                const meta = TYPE_META[item.type]
                const Icon = meta.icon
                const urgent = item.ageHours >= URGENT_AFTER_HOURS
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpen(item)}
                    className="group flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-panel/50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-panel text-forest-400">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest">{item.patientName}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-forest-400">
                        <span>{meta.label}</span>
                        {item.mrn && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="tnum font-mono">{item.mrn}</span>
                          </>
                        )}
                        {scope === 'facility' && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{item.facility}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <Badge tone={urgent ? 'warning' : 'neutral'} dot={urgent} className="shrink-0">
                      <span className="tnum">{item.ageHours}h</span>
                    </Badge>
                  </button>
                )
              })}
            </div>

            {pages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 px-3 pt-3.5">
                <p className="text-[13px] text-forest-400">
                  Showing{' '}
                  <span className="tnum font-medium text-forest-600">
                    {current * PAGE_SIZE + 1}–{Math.min(filtered.length, (current + 1) * PAGE_SIZE)}
                  </span>{' '}
                  of <span className="tnum font-medium text-forest-600">{filtered.length}</span>
                </p>
                <Pagination page={current} pages={pages} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function RecentActivityWidget({
  isError,
  isPending,
  items,
  onRetry,
  onOpen,
}: {
  isError: boolean
  isPending: boolean
  items: HimActivityEvent[] | undefined
  onRetry: () => void
  onOpen: (patientId: string) => void
}) {
  return (
    <Card pad={false} className="p-3 sm:p-4">
      <div className="flex items-center gap-2 px-1">
        <Clock size={15} className="text-forest-300" />
        <h2 className="text-[15px] font-medium tracking-[-0.01em] text-forest">
          Recent HIM activity
        </h2>
      </div>

      {isError ? (
        <ErrorState message="We couldn't load recent activity." onRetry={onRetry} />
      ) : isPending || !items ? (
        <div className="mt-3 space-y-2.5 px-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          compact
          variant="folder"
          title="No recent activity"
          description="Nothing to show yet."
        />
      ) : (
        <div className="mt-2 divide-y divide-hair/60">
          {items.slice(0, 6).map((event) => (
            <button
              key={event.id}
              type="button"
              disabled={!event.targetPatientId}
              onClick={() => event.targetPatientId && onOpen(event.targetPatientId)}
              className="flex w-full items-center justify-between gap-3 px-1 py-2.5 text-left transition-colors enabled:hover:bg-panel/50 disabled:cursor-default"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] text-forest">
                  <span className="font-medium">{event.actor}</span> — {event.action}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-forest-400">{event.targetLabel}</p>
              </div>
              <span className="tnum shrink-0 text-[12px] text-forest-300">
                {formatRelativeTime(event.occurredAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}
