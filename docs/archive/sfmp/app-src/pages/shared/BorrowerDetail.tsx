import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, ShieldCheck, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain, useSubRole } from '@/components/shell/RoleContext'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, StatusPill, useToast } from '@/components/ui'
import { DocumentViewer } from '@/components/DocumentViewer'
import { useStore } from '@/store/AppStore'
import { can, DOMAIN_META } from '@/data/nav'
import { formatDate, maskId } from '@/lib/format'
import type { FileRef } from '@/data/types'

/** Full borrower onboarding review — a dedicated page (like the project view)
 *  showing everything the institution submitted, with admin verify/decline. */
export function BorrowerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const domain = useDomain()
  const subRole = useSubRole()
  const toast = useToast()
  const { borrowers, projects, verifyBorrower, setOnboardingStatus } = useStore()
  const [viewingDoc, setViewingDoc] = useState<FileRef | null>(null)

  const base = DOMAIN_META[domain].base
  const back = `${base}/borrowers`
  const profile = borrowers.find((b) => b.company === decodeURIComponent(id ?? ''))

  if (!profile) {
    return (
      <Card>
        <EmptyState variant="search" title="Borrower not found" action={<Button onClick={() => navigate(back)}>Back to borrowers</Button>} />
      </Card>
    )
  }

  const isAdmin = domain === 'admin'
  const canDecide = isAdmin && can('approve', subRole) && profile.onboarding === 'submitted'
  const projectCount = projects.filter((p) => p.borrower === profile.company).length

  const verify = () => {
    verifyBorrower(profile.company)
    toast.success('Borrower verified', `${profile.company} can now use the marketplace.`)
  }
  const decline = () => {
    setOnboardingStatus('borrower', profile.company, 'rejected')
    toast.info('Onboarding declined', `${profile.company} has been asked to update and resubmit.`)
  }

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <button onClick={() => navigate(back)} aria-label="Back to borrowers" className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-white text-navy-500 transition-colors hover:bg-panel">
              <ArrowLeft size={17} />
            </button>
            Borrower review
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
            <PropRow label="TIN"><span className="tnum">{profile.tin}</span></PropRow>
            <PropRow label="State">{profile.state}</PropRow>
            <PropRow label="Registered address">{profile.address || '—'}</PropRow>
            <PropRow label="Projects on SFMP">{projectCount}</PropRow>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Ownership */}
          <Card>
            <CardHeader title="Ownership" subtitle="Shareholders, holdings and board representation" action={<Badge tone="neutral">{profile.owners.length}</Badge>} />
            <div className="mt-4 space-y-2.5">
              {profile.owners.map((o) => (
                <div key={o.id} className="rounded-2xl border border-hair bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={o.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy">{o.name}</p>
                      <p className="truncate text-xs text-navy-400">Shareholder</p>
                    </div>
                  </div>
                  <div className="mt-2.5 space-y-1.5 border-t border-hair/60 pt-2.5">
                    <PropRow label="Position">{o.position}</PropRow>
                    <PropRow label="Units held"><span className="tnum">{o.unitsHeld.toLocaleString()}</span></PropRow>
                    <PropRow label="Percentage held"><span className="tnum">{o.percentHeld}%</span></PropRow>
                    <PropRow label="BVN"><span className="tnum">{maskId(o.bvn)}</span></PropRow>
                    <PropRow label="Board rep">{o.boardRep ? 'Yes' : 'No'}</PropRow>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Management */}
          <Card>
            <CardHeader title="Management" subtitle="Key team members" action={<Badge tone="neutral">{profile.management.length}</Badge>} />
            <div className="mt-4 space-y-2.5">
              {profile.management.map((m) => (
                <div key={m.id} className="rounded-2xl border border-hair bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy">{m.name}</p>
                      <p className="truncate text-xs text-navy-400">Management</p>
                    </div>
                  </div>
                  <div className="mt-2.5 space-y-1.5 border-t border-hair/60 pt-2.5">
                    {m.work.map((w, i) => (
                      <PropRow key={`w${i}`} label="Work" wrap>{w.position}, {w.place}</PropRow>
                    ))}
                    {m.education.map((e, i) => (
                      <PropRow key={`e${i}`} label="Education" wrap>{e.qualification}, {e.school}{e.year ? ` (${e.year})` : ''}</PropRow>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Directors */}
        <Card>
          <CardHeader title="Directors" subtitle="Identity, education, work history and exposure" action={<Badge tone="neutral">{profile.directors.length}</Badge>} />
          <div className="mt-4 grid gap-2.5 lg:grid-cols-2">
            {profile.directors.map((d) => (
              <div key={d.id} className="rounded-2xl border border-hair bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={d.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{d.name}</p>
                    <p className="truncate text-xs text-navy-400">Director</p>
                  </div>
                </div>
                <div className="mt-2.5 space-y-1.5 border-t border-hair/60 pt-2.5">
                  <PropRow label="Date of birth">{formatDate(d.dob)}</PropRow>
                  <PropRow label="BVN"><span className="tnum">{maskId(d.bvn)}</span></PropRow>
                  {d.education.map((e, i) => (
                    <PropRow key={`e${i}`} label="Education" wrap>{e.qualification}, {e.school}{e.year ? ` (${e.year})` : ''}</PropRow>
                  ))}
                  {d.work.map((w, i) => (
                    <PropRow key={`w${i}`} label="Work" wrap>{w.position}, {w.place}</PropRow>
                  ))}
                  <PropRow label="Loan exposure" wrap>{d.loanExposure || '—'}</PropRow>
                  <PropRow label="Other investments" wrap>{d.otherInvestments || '—'}</PropRow>
                </div>
              </div>
            ))}
          </div>
        </Card>

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

function PropRow({ label, children, wrap }: { label: string; children: React.ReactNode; wrap?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-32 shrink-0 pt-px text-[13px] text-navy-400">{label}</span>
      <span className={`min-w-0 flex-1 text-sm font-medium text-navy ${wrap ? 'whitespace-normal leading-snug' : 'truncate'}`}>{children}</span>
    </div>
  )
}
