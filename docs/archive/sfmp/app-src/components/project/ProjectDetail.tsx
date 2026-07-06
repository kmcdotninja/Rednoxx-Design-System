import { useState, type ReactNode } from 'react'
import { AlertTriangle, Check, Eye, FileText, MessageSquareWarning } from 'lucide-react'
import { Avatar, Badge, Card, CardHeader, InfoTip, StatusPill } from '@/components/ui'
import { DocumentViewer } from '@/components/DocumentViewer'
import { useStore } from '@/store/AppStore'
import { facilityTypeById, sectorById } from '@/lib/sfmp'
import { formatDate, maskId, money } from '@/lib/format'
import type { FileRef, Project } from '@/data/types'
import { cn } from '@/lib/cn'

const REPAY_FREQUENCY: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  semi_annual: 'Semi-annual',
  annual: 'Annual',
}

/** Full project appraisal view, shared across borrower / financier / admin.
 *  Role-specific actions are passed via the `actions` slot. */
export function ProjectDetail({ project, actions }: { project: Project; actions?: ReactNode }) {
  const { sectors } = useStore()
  const sector = sectorById(sectors, project.sectorId)
  const ft = facilityTypeById(sectors, project.facilityTypeId)
  const [viewing, setViewing] = useState<{ file: FileRef; sectionName: string } | null>(null)

  return (
    <div className="space-y-5">
      {/* Header card */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-[18px] font-medium leading-tight tracking-[-0.01em] text-navy">{project.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-400">{project.description}</p>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>

        {/* Property rows */}
        <div className="mt-6 grid gap-x-12 gap-y-2.5 border-t border-hair pt-5 lg:grid-cols-2">
          <PropRow label="Status"><StatusPill status={project.status} /></PropRow>
          <PropRow label="Reference"><span className="tnum">{project.ref}</span></PropRow>
          <PropRow label="Sector">{sector?.name ?? '—'}</PropRow>
          <PropRow label="Facility type">{ft?.name ?? '—'}</PropRow>
          <PropRow label="Amount">
            <span className="tnum">{money(project.amount)}</span>
            <span className="text-navy-300"> · {project.tenor} mo · {project.equity}% equity</span>
          </PropRow>
          <PropRow label="Moratorium">{project.moratorium || '—'}</PropRow>
          <PropRow label="Borrower">
            <span className="inline-flex items-center gap-1.5">
              <Avatar name={project.borrower} size="xs" ring={false} />
              {project.borrower}
            </span>
          </PropRow>
          {project.financier ? (
            <PropRow label="Financier">
              <span className="inline-flex items-center gap-1.5">
                <Avatar name={project.financier} size="xs" ring={false} />
                {project.financier}
              </span>
            </PropRow>
          ) : (
            <PropRow label="Updated">{formatDate(project.updatedAt)}</PropRow>
          )}
        </div>
      </Card>

      {/* Acceptance checklist — appears once a financier accepts the deal */}
      {project.status === 'accepted' && project.checklist && (
        <Card>
          <CardHeader
            title="Acceptance checklist"
            subtitle="Completion items and repayment terms agreed between both parties"
            action={
              (() => {
                const done = project.checklist!.filter((c) => c.checked).length
                const total = project.checklist!.length
                return (
                  <Badge tone={done === total ? 'success' : 'warning'} dot>
                    {done}/{total} complete
                  </Badge>
                )
              })()
            }
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {project.checklist.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-4 py-3',
                  item.checked ? 'border-mint/50 bg-mint-soft/30' : 'border-hair bg-white',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                    item.checked ? 'border-mint bg-mint text-white' : 'border-hair bg-white',
                  )}
                >
                  {item.checked && <Check size={12} strokeWidth={3} />}
                </span>
                <span className={cn('text-sm', item.checked ? 'font-medium text-navy' : 'text-navy-500')}>{item.label}</span>
              </div>
            ))}
          </div>

          {project.repayment ? (
            <div className="mt-5 grid gap-x-12 gap-y-2.5 border-t border-hair pt-4 lg:grid-cols-2">
              <PropRow label="Frequency">{REPAY_FREQUENCY[project.repayment.frequency] ?? project.repayment.frequency}</PropRow>
              <PropRow label="First repayment">{project.repayment.firstDate ? formatDate(project.repayment.firstDate) : '—'}</PropRow>
              <PropRow label="Instalment"><span className="tnum">{money(project.repayment.amount)}</span></PropRow>
              <PropRow label="Sterling account"><span className="tnum">{maskId(project.repayment.account)}</span></PropRow>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-gold-soft/50 px-4 py-2.5 text-[13px] text-gold-600">
              Awaiting the borrower — completion items and repayment terms have not been submitted yet.
            </p>
          )}
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Structure */}
        <Card>
          <CardHeader title="Facility structure" subtitle="Purpose, repayment and domiciliation" />
          <div className="mt-4 space-y-4">
            <Line label="Purpose" value={project.purpose} />
            <Line label="Source of repayment" value={project.sourceOfRepayment} />
            <Line label="Domiciliation arrangement" value={project.domiciliation} />
            {project.additional && <Line label="Additional details" value={project.additional} />}
          </div>
        </Card>

        {/* Risks */}
        <Card>
          <CardHeader title="Business risks" subtitle="Perceived risks and mitigating factors" />
          <div className="mt-4 space-y-3">
            {project.risks.length === 0 ? (
              <p className="py-4 text-sm text-navy-400">No risks documented.</p>
            ) : (
              project.risks.map((r) => (
                <div key={r.id} className="rounded-2xl border border-hair bg-panel/40 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-navy">
                    <AlertTriangle size={15} className="shrink-0 text-gold-600" />
                    {r.risk}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-navy-400"><span className="font-medium text-navy-500">Consequences:</span> {r.consequences}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-navy-400"><span className="font-medium text-navy-500">Mitigants:</span> {r.mitigants}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Supporting documents */}
      <Card>
        <CardHeader
          title="Supporting documents"
          subtitle={ft ? `Document pack for ${ft.name}` : 'Document pack'}
          action={ft && (
            <Badge tone="info" dot>
              {ft.documentSections.filter((s) => (project.documents[s.id]?.length ?? 0) > 0).length}/{ft.documentSections.length} provided
            </Badge>
          )}
        />
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {(ft?.documentSections ?? []).flatMap((section) => {
            const files = project.documents[section.id] ?? []
            if (files.length === 0) {
              return (
                <div key={section.id} className="flex items-start gap-3 rounded-2xl border border-dashed border-hair bg-white px-4 py-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-panel text-navy-300">
                    <FileText size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[13px] font-medium text-navy">
                      <span className="truncate">{section.name}</span>
                      <InfoTip content={section.description} />
                    </p>
                    <p className="text-xs text-navy-300">Not provided</p>
                  </div>
                </div>
              )
            }
            // Whole card is the click target — one card per uploaded file.
            return files.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setViewing({ file: f, sectionName: section.name })}
                className="group flex items-start gap-3 rounded-2xl border border-hair bg-white px-4 py-3 text-left transition-colors hover:border-navy-200 hover:bg-panel/40"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-mint">
                  <FileText size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-navy">
                    <span className="truncate">{section.name}</span>
                    <InfoTip content={section.description} />
                  </span>
                  <span className="block truncate text-xs text-navy-400">{f.name} · {f.sizeKb} KB</span>
                </span>
                <Eye size={15} className="mt-1 shrink-0 text-navy-300 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))
          })}
        </div>
      </Card>

      {/* Info requests */}
      {(project.infoRequests?.length ?? 0) > 0 && (
        <Card>
          <CardHeader title="Information requests" subtitle="Questions raised during appraisal" />
          <div className="mt-4 space-y-3">
            {project.infoRequests!.map((r) => (
              <div key={r.id} className="rounded-2xl border border-hair bg-panel/40 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-navy">
                  <MessageSquareWarning size={15} className="shrink-0 text-azure-600" />
                  {r.question}
                </p>
                <p className="mt-1 text-xs text-navy-400">Asked by {r.by} · {formatDate(r.at)}</p>
                {r.answer ? (
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-[13px] leading-relaxed text-navy-500">{r.answer}</p>
                ) : (
                  <p className="mt-2 text-[13px] font-medium text-gold-600">Awaiting a response from the borrower.</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Document preview */}
      <DocumentViewer
        file={viewing?.file ?? null}
        sectionName={viewing?.sectionName}
        owner={project.borrower}
        onClose={() => setViewing(null)}
      />

      {/* Rejection history */}
      {(project.rejections?.length ?? 0) > 0 && (
        <Card>
          <CardHeader title="Rejection history" subtitle="Previous rejections and comments" />
          <div className="mt-4 space-y-3">
            {project.rejections!.map((r, i) => (
              <div key={i} className="rounded-2xl border border-rose-soft bg-rose-soft/30 p-4">
                <p className="text-sm font-medium text-rose-ink">Rejected by {r.by}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-navy-500">{r.reason}</p>
                <p className="mt-1.5 text-xs text-navy-400">{formatDate(r.at)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-navy-400">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-navy-600">{value || '—'}</p>
    </div>
  )
}

/** Notion-style property row — gray label column, medium value. */
function PropRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[13px] text-navy-400">{label}</span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-navy">{children}</span>
    </div>
  )
}
