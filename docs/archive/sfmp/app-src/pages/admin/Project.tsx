import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquarePlus, Sparkles, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useSubRole } from '@/components/shell/RoleContext'
import { ProjectDetail } from '@/components/project/ProjectDetail'
import { Button, Card, EmptyState, Field, Modal, Textarea, useToast } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { can } from '@/data/nav'

export function AdminProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const subRole = useSubRole()
  const { projects, recommendProject, rejectProject, requestProjectInfo, submitApproval, approvals } = useStore()

  const project = projects.find((p) => p.id === id)
  const [asking, setAsking] = useState(false)
  const [question, setQuestion] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')

  if (!project) {
    return (
      <Card>
        <EmptyState variant="search" title="Project not found" action={<Button onClick={() => navigate('/admin/projects')}>Back to projects</Button>} />
      </Card>
    )
  }

  const maker = can('create', subRole)
  const pendingRecommend = approvals.some(
    (a) => a.status === 'pending' && a.type === 'project_recommend' && a.payload.projectId === project.id,
  )

  const recommend = () => {
    if (subRole === 'initiator') {
      // Maker-checker: the initiator routes the recommendation to the authorizer queue.
      submitApproval({
        domain: 'admin',
        type: 'project_recommend',
        title: `Recommend ${project.ref} to marketplace`,
        description: `Recommend “${project.name}” (${project.borrower}) to financiers.`,
        payload: { projectId: project.id },
      })
      toast.info('Sent for approval', 'Your recommendation is now in the authorizer’s approval queue.')
    } else {
      recommendProject(project.id)
      toast.success('Project recommended', 'Financiers can now see this project on the marketplace.')
    }
  }

  const ask = () => {
    if (!question.trim()) return
    requestProjectInfo(project.id, question.trim())
    toast.success('Request sent', 'The borrower has been asked for more information.')
    setAsking(false)
    setQuestion('')
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
            <button onClick={() => navigate('/admin/projects')} aria-label="Back to projects" className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-white text-navy-500 transition-colors hover:bg-panel">
              <ArrowLeft size={17} />
            </button>
            Project review
          </span>
        }
        subtitle={project.ref}
      />

      <ProjectDetail
        project={project}
        actions={
          <>
            {maker && (
              <Button variant="secondary" leftIcon={<MessageSquarePlus size={16} />} onClick={() => setAsking(true)}>
                Request info
              </Button>
            )}
            {maker && project.status === 'on_marketplace' && (
              <Button variant="danger" leftIcon={<XCircle size={16} />} onClick={() => setRejecting(true)}>
                Reject
              </Button>
            )}
            {maker && project.status === 'on_marketplace' && (
              pendingRecommend ? (
                <Button disabled leftIcon={<Sparkles size={16} />}>Awaiting authorizer</Button>
              ) : (
                <Button leftIcon={<Sparkles size={16} />} onClick={recommend}>
                  {subRole === 'initiator' ? 'Submit recommendation' : 'Recommend to financiers'}
                </Button>
              )
            )}
          </>
        }
      />

      <Modal
        open={asking}
        onClose={() => setAsking(false)}
        title="Request more information"
        subtitle={`${project.ref} · ${project.borrower}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAsking(false)}>Cancel</Button>
            <Button onClick={ask} disabled={!question.trim()}>Send request</Button>
          </div>
        }
      >
        <Field label="What do you need from the borrower?">
          <Textarea rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Provide the updated cash-flow projection for the tenor…" />
        </Field>
      </Modal>

      <Modal
        open={rejecting}
        onClose={() => setRejecting(false)}
        title="Reject project"
        subtitle="The borrower will see your comments in the rejection history."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRejecting(false)}>Cancel</Button>
            <Button variant="danger" onClick={doReject} disabled={!reason.trim()}>Reject project</Button>
          </div>
        }
      >
        <Field label="Reason for rejection">
          <Textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why this project cannot proceed…" />
        </Field>
      </Modal>
    </>
  )
}
