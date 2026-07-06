import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, ShieldCheck, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain, useSubRole } from '@/components/shell/RoleContext'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, StatusPill, useToast } from '@/components/ui'
import { DocumentViewer } from '@/components/DocumentViewer'
import { useStore } from '@/store/AppStore'
import { can, DOMAIN_META } from '@/data/nav'
import type { FileRef } from '@/data/types'

/** Full financier onboarding review — a dedicated page (like the project view)
 *  showing everything the institution submitted, with admin verify/decline. */
export function FinancierDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const domain = useDomain()
  const subRole = useSubRole()
  const toast = useToast()
  const { financiers, projects, verifyFinancier, setOnboardingStatus } = useStore()
  const [viewingDoc, setViewingDoc] = useState<FileRef | null>(null)

  const base = DOMAIN_META[domain].base
  const back = `${base}/financiers`
  const profile = financiers.find((f) => f.company === decodeURIComponent(id ?? ''))

  if (!profile) {
    return (
      <Card>
        <EmptyState variant="search" title="Financier not found" action={<Button onClick={() => navigate(back)}>Back to financiers</Button>} />
      </Card>
    )
  }

  const isAdmin = domain === 'admin'
  const canDecide = isAdmin && can('approve', subRole) && profile.onboarding === 'submitted'
  const deals = projects.filter((p) => p.financier === profile.company)

  const verify = () => {
    verifyFinancier(profile.company)
    toast.success('Financier verified', `${profile.company} can now fund projects.`)
  }
  const decline = () => {
    setOnboardingStatus('financier', profile.company, 'rejected')
    toast.info('Onboarding declined', `${profile.company} has been asked to update and resubmit.`)
  }

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <button onClick={() => navigate(back)} aria-label="Back to financiers" className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-white text-navy-500 transition-colors hover:bg-panel">
              <ArrowLeft size={17} />
            </button>
            Financier review
          </span>
        }
        subtitle={profile.rcNumber}
      />

      <div className="space-y-5">
        {/* Header card */}
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={profile.company} size="lg" />
              <div className="min-w-0">
                <h2 className="text-[18px] font-medium leading-tight tracking-[-0.01em] text-navy">{profile.company}</h2>
                <p className="mt-0.5 text-sm text-navy-400">Onboarding submission · full details as collected</p>
              </div>
            </div>
            {canDecide && (
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="danger" leftIcon={<XCircle size={16} />} onClick={decline}>Decline</Button>
                <Button leftIcon={<ShieldCheck size={16} />} onClick={verify}>Verify institution</Button>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-x-12 gap-y-2.5 border-t border-hair pt-5 lg:grid-cols-2">
            <PropRow label="Status"><StatusPill status={profile.onboarding} /></PropRow>
            <PropRow label="RC number"><span className="tnum">{profile.rcNumber}</span></PropRow>
            <PropRow label="Primary contact">{profile.contactName}</PropRow>
            <PropRow label="Position">{profile.contactPosition}</PropRow>
            <PropRow label="Phone"><span className="tnum">{profile.contactPhone}</span></PropRow>
            <PropRow label="Email">{profile.contactEmail}</PropRow>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Sectors of interest */}
          <Card>
            <CardHeader title="Sectors of interest" subtitle="The sectors this financier funds" />
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.sectorsOfInterest.map((s) => <Badge key={s} tone="info">{s}</Badge>)}
            </div>
          </Card>

          {/* Deals */}
          <Card>
            <CardHeader title="Deals on SFMP" subtitle="Projects selected or accepted" action={<Badge tone="neutral">{deals.length}</Badge>} />
            <div className="mt-4 space-y-2">
              {deals.length === 0 ? (
                <p className="rounded-xl bg-panel/70 px-3.5 py-2.5 text-[13px] text-navy-400">No deals yet.</p>
              ) : (
                deals.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => navigate(`${base}/projects/${p.id}`)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-hair bg-white px-4 py-2.5 text-left transition-colors hover:bg-panel/40"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-navy">{p.name}</span>
                      <span className="block truncate text-xs text-navy-400">{p.ref}</span>
                    </span>
                    <StatusPill status={p.status} />
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Documents */}
        <Card>
          <CardHeader title="Documents" subtitle="Everything attached to the submission — click to view" action={<Badge tone="neutral">{profile.documents.length} file(s)</Badge>} />
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {profile.documents.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setViewingDoc(d)}
                className="flex items-center gap-3 rounded-2xl border border-hair bg-white px-4 py-3 text-left transition-colors hover:border-navy-200 hover:bg-panel/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-mint">
                  <FileText size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-navy">{d.name}</span>
                  <span className="block text-xs text-navy-400">{d.sizeKb} KB · click to view</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <DocumentViewer file={viewingDoc} owner={profile.company} onClose={() => setViewingDoc(null)} />
    </>
  )
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-[13px] text-navy-400">{label}</span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-navy">{children}</span>
    </div>
  )
}
