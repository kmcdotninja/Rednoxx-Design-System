import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardCheck, MessageSquareReply } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useAccount } from '@/components/shell/AccountContext'
import { ProjectDetail } from '@/components/project/ProjectDetail'
import { Button, Card, DatePicker, Drawer, EmptyState, Field, Input, Modal, Select, Textarea, useToast } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import type { ChecklistItem, RepaymentTerm } from '@/data/types'
import { cn } from '@/lib/cn'

export function BorrowerProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { company } = useAccount()
  const { projects, submitChecklist, provideProjectInfo } = useStore()

  const project = projects.find((p) => p.id === id && p.borrower === company)

  const [checklistOpen, setChecklistOpen] = useState(false)
  const [items, setItems] = useState<ChecklistItem[] | null>(null)
  const [frequency, setFrequency] = useState<RepaymentTerm['frequency']>('monthly')
  const [firstDate, setFirstDate] = useState('')
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')

  const [answering, setAnswering] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')

  if (!project) {
    return (
      <Card>
        <EmptyState variant="search" title="Project not found" description="This project may have been removed, or belongs to another institution." action={<Button onClick={() => navigate('/borrower/projects')}>Back to projects</Button>} />
      </Card>
    )
  }

  const checklist = items ?? project.checklist ?? []
  const openRequests = (project.infoRequests ?? []).filter((r) => !r.answer)

  const saveChecklist = () => {
    if (!account.trim() || account.trim().length !== 10) {
      toast.error('Invalid account', 'Enter a 10-digit Sterling Bank account number.')
      return
    }
    submitChecklist(project.id, checklist, {
      frequency,
      firstDate,
      amount: Number(amount) || 0,
      account: account.trim(),
    })
    toast.success('Checklist submitted', 'Your acceptance checklist and repayment terms were sent to the financier.')
    setChecklistOpen(false)
  }

  const sendAnswer = () => {
    if (!answering || !answer.trim()) return
    provideProjectInfo(project.id, answering, answer.trim())
    toast.success('Response sent', 'Your answer has been shared with the requester.')
    setAnswering(null)
    setAnswer('')
  }

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <button onClick={() => navigate('/borrower/projects')} aria-label="Back to projects" className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-white text-navy-500 transition-colors hover:bg-panel">
              <ArrowLeft size={17} />
            </button>
            Project
          </span>
        }
        subtitle={project.ref}
      />

      <ProjectDetail
        project={project}
        actions={
          <>
            {openRequests.length > 0 && (
              <Button variant="secondary" leftIcon={<MessageSquareReply size={16} />} onClick={() => { setAnswering(openRequests[0].id); setAnswer('') }}>
                Respond to request
              </Button>
            )}
            {project.status === 'accepted' && (
              <Button leftIcon={<ClipboardCheck size={16} />} onClick={() => { setItems(project.checklist ?? []); setChecklistOpen(true) }}>
                {project.repayment ? 'Update checklist' : 'Complete checklist'}
              </Button>
            )}
          </>
        }
      />

      {/* Acceptance checklist + repayment drawer */}
      <Drawer
        open={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        title="Acceptance checklist"
        subtitle={`${project.ref} · agree completion items and repayment terms`}
        size="xl"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setChecklistOpen(false)}>Cancel</Button>
            <Button onClick={saveChecklist}>Submit checklist</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.06em] text-navy-400">Checklist</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setItems((cur) => (cur ?? project.checklist ?? []).map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)))}
                  className={cn('flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors', item.checked ? 'border-mint/60 bg-mint-soft/40' : 'border-hair bg-white hover:bg-panel')}
                >
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-white', item.checked ? 'border-mint bg-mint' : 'border-hair bg-white')}>
                    {item.checked && <ClipboardCheck size={12} />}
                  </span>
                  <span className="text-sm font-medium text-navy-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.06em] text-navy-400">Repayment terms</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Frequency">
                <Select value={frequency} onChange={(e) => setFrequency(e.target.value as RepaymentTerm['frequency'])}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semi_annual">Semi-annual</option>
                  <option value="annual">Annual</option>
                </Select>
              </Field>
              <Field label="First repayment date">
                <DatePicker value={firstDate} onChange={setFirstDate} />
              </Field>
              <Field label="Instalment amount (₦)">
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </Field>
              <Field label="Sterling account" hint="10 digits">
                <Input value={account} maxLength={10} onChange={(e) => setAccount(e.target.value.replace(/\D/g, ''))} placeholder="0123456789" />
              </Field>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Provide info modal */}
      <Modal
        open={answering !== null}
        onClose={() => setAnswering(null)}
        title="Respond to information request"
        subtitle={openRequests.find((r) => r.id === answering)?.question}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAnswering(null)}>Cancel</Button>
            <Button onClick={sendAnswer} disabled={!answer.trim()}>Send response</Button>
          </div>
        }
      >
        <Field label="Your response">
          <Textarea rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Provide the requested information…" />
        </Field>
      </Modal>
    </>
  )
}
