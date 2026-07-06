import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, HandCoins, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { GatedButton, useAccount } from '@/components/shell/AccountContext'
import { useSubRole } from '@/components/shell/RoleContext'
import { ProjectDetail } from '@/components/project/ProjectDetail'
import { Button, Card, EmptyState, Field, Modal, Textarea, useToast } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { can } from '@/data/nav'

/** Financier view of a project — reachable from the marketplace or portfolio. */
export function FinancierProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const subRole = useSubRole()
  const { company } = useAccount()
  const { projects, selectProject, acceptProject, rejectProject } = useStore()

  const project = projects.find((p) => p.id === id)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')

  if (!project) {
    return (
      <Card>
        <EmptyState variant="search" title="Project not found" action={<Button onClick={() => navigate('/financier/marketplace')}>Back to marketplace</Button>} />
      </Card>
    )
  }

  const maker = can('create', subRole)
  const isMine = project.financier === company
  const canSelect = maker && project.status === 'recommended'
  const canDecide = maker && project.status === 'selected' && isMine

  const doSelect = () => {
    selectProject(project.id)
    toast.success('Project selected', `${project.ref} is now in your appraisal pipeline.`)
  }
  const doAccept = () => {
    acceptProject(project.id)
    toast.success('Project accepted', 'The borrower has been asked to complete the acceptance checklist.')
  }
  const doReject = () => {
    if (!reason.trim()) return
    rejectProject(project.id, reason.trim())
    toast.success('Project rejected', 'The borrower has been notified with your comments.')
    setRejecting(false)
    setReason('')
  }

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-white text-navy-500 transition-colors hover:bg-panel">
              <ArrowLeft size={17} />
            </button>
            Project appraisal
          </span>
        }
        subtitle={project.ref}
      />

      <ProjectDetail
        project={project}
        actions={
          <>
            {canSelect && (
              <GatedButton action="select a project" leftIcon={<HandCoins size={16} />} onClick={doSelect}>
                Select for funding
              </GatedButton>
            )}
            {canDecide && (
              <>
                <Button variant="danger" leftIcon={<XCircle size={16} />} onClick={() => setRejecting(true)}>Reject</Button>
                <Button leftIcon={<CheckCircle2 size={16} />} onClick={doAccept}>Accept project</Button>
              </>
            )}
          </>
        }
      />

      <Modal
        open={rejecting}
        onClose={() => setRejecting(false)}
        title="Reject project"
        subtitle="Your comments are shared with the borrower and recorded in the rejection history."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejecting(false)}>Cancel</Button>
            <Button variant="danger" onClick={doReject} disabled={!reason.trim()}>Reject project</Button>
          </div>
        }
      >
        <Field label="Reason for rejection">
          <Textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain your appraisal decision…" />
        </Field>
      </Modal>
    </>
  )
}
