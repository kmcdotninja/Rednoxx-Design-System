import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Banknote, HandCoins, Plus, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain, useSubRole } from '@/components/shell/RoleContext'
import { Avatar, Badge, Button, Card, DataTable, DatePicker, Drawer, EmptyState, Field, Input, Select, StatusPill, Tabs, useToast, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { can, DOMAIN_META } from '@/data/nav'
import { NIGERIAN_STATES, SECTOR_CATEGORIES } from '@/data/mock'
import { formatDate, money } from '@/lib/format'
import type { CommunityMember, LoanApplication, Offer } from '@/data/types'

type Tab = 'members' | 'leaders' | 'offers' | 'loans'

export function Community() {
  const { id } = useParams()
  const navigate = useNavigate()
  const domain = useDomain()
  const subRole = useSubRole()
  const toast = useToast()
  const { communities, loanApplications, addCommunityMember, createOffer, applyLoan, setLoanStatus } = useStore()
  const maker = can('create', subRole)
  const base = DOMAIN_META[domain].base

  const community = communities.find((c) => c.id === id)
  const loans = useMemo(() => loanApplications.filter((l) => l.communityId === id), [loanApplications, id])

  const [tab, setTab] = useState<Tab>('members')
  const [addingMember, setAddingMember] = useState<null | 'member' | 'leader'>(null)
  const [mName, setMName] = useState('')
  const [mPhone, setMPhone] = useState('')

  const [publishing, setPublishing] = useState(false)
  const [oName, setOName] = useState('')
  const [oTenor, setOTenor] = useState('12')
  const [oRate, setORate] = useState('5')

  const [applying, setApplying] = useState(false)
  const [app, setApp] = useState({
    memberName: '', phone: '', address: '', gender: 'Female', dob: '', nationality: 'Nigerian',
    state: NIGERIAN_STATES[24], landmark: '', amount: '', bvn: '', tin: '',
    sector: SECTOR_CATEGORIES[3] as string, monthlySalary: '', account: '',
  })

  if (!community) {
    return (
      <Card>
        <EmptyState variant="search" title="Community not found" action={<Button onClick={() => navigate(`${base}/communities`)}>Back to communities</Button>} />
      </Card>
    )
  }

  const tabs: TabItem<Tab>[] = [
    { value: 'members', label: 'Members', count: community.members.length },
    { value: 'leaders', label: 'Leaders', count: community.leaders.length },
    { value: 'offers', label: 'Offers', count: community.offers.length },
    { value: 'loans', label: 'Loan applications', count: loans.length },
  ]

  const memberCols: Column<CommunityMember>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (m) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={m.name} size="sm" />
          <p className="truncate font-medium text-navy">{m.name}</p>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', cell: (m) => <span className="tnum text-navy-500">{m.phone}</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (m) => <StatusPill status={m.status} /> },
  ]

  const offerCols: Column<Offer>[] = [
    { key: 'name', header: 'Offer', cell: (o) => <span className="font-medium text-navy">{o.name}</span> },
    { key: 'tenor', header: 'Tenor', align: 'right', cell: (o) => <span className="tnum text-navy-500">{o.tenor} mo</span> },
    { key: 'rate', header: 'Interest', align: 'right', cell: (o) => <span className="tnum font-medium text-navy">{o.rate}%</span> },
    { key: 'subs', header: 'Subscribers', align: 'right', cell: (o) => <Badge tone="neutral">{o.subscribers}</Badge> },
  ]

  const loanCols: Column<LoanApplication>[] = [
    {
      key: 'member',
      header: 'Applicant',
      cell: (l) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{l.memberName}</p>
          <p className="truncate text-xs text-navy-400">{l.ref} · {l.sector}</p>
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', cell: (l) => <span className="tnum font-medium text-navy">{money(l.amount)}</span> },
    { key: 'salary', header: 'Monthly salary', align: 'right', cell: (l) => <span className="tnum text-navy-500">{money(l.monthlySalary)}</span> },
    { key: 'at', header: 'Applied', align: 'right', cell: (l) => <span className="text-navy-400">{formatDate(l.at)}</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (l) => <StatusPill status={l.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (l) =>
        maker && l.status === 'pending' ? (
          <Button size="sm" onClick={() => { setLoanStatus(l.id, 'approved'); toast.success('Loan approved', `${l.ref} is ready for disbursement.`) }}>Approve</Button>
        ) : maker && l.status === 'approved' ? (
          <Button size="sm" variant="lime" leftIcon={<Banknote size={14} />} onClick={() => { setLoanStatus(l.id, 'disbursed'); toast.success('Loan disbursed', `${money(l.amount)} disbursed to the member's Sterling account ${l.account}.`) }}>
            Disburse
          </Button>
        ) : null,
    },
  ]

  const saveMember = () => {
    if (!mName.trim() || mPhone.replace(/\D/g, '').length !== 11) {
      toast.error('Invalid details', 'A name and an 11-digit phone number are required.')
      return
    }
    addCommunityMember(community.id, { name: mName.trim(), phone: mPhone, role: addingMember === 'leader' ? 'leader' : 'member', status: 'active' })
    toast.success(addingMember === 'leader' ? 'Leader added' : 'Member added', mName.trim())
    setAddingMember(null)
    setMName(''); setMPhone('')
  }

  const publishOffer = () => {
    if (!oName.trim()) return
    createOffer(community.id, { name: oName.trim(), tenor: Number(oTenor) || 12, rate: Number(oRate) || 5 })
    toast.success('Offer published', `${oName.trim()} is now available to members.`)
    setPublishing(false)
    setOName('')
  }

  const submitLoan = () => {
    if (!app.memberName.trim() || !app.amount || app.bvn.replace(/\D/g, '').length !== 11 || app.account.replace(/\D/g, '').length !== 10) {
      toast.error('Check the form', 'Name, amount, an 11-digit BVN and a 10-digit account number are required.')
      return
    }
    applyLoan({
      communityId: community.id,
      memberName: app.memberName.trim(), phone: app.phone, address: app.address, gender: app.gender, dob: app.dob,
      nationality: app.nationality, state: app.state, landmark: app.landmark, amount: Number(app.amount),
      bvn: app.bvn, tin: app.tin, sector: app.sector, monthlySalary: Number(app.monthlySalary) || 0,
      account: app.account, documents: [],
    })
    toast.success('Application submitted', 'The loan application is pending review.')
    setApplying(false)
    setTab('loans')
  }

  const set = (k: keyof typeof app) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setApp((a) => ({ ...a, [k]: e.target.value }))

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <button onClick={() => navigate(`${base}/communities`)} aria-label="Back to communities" className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-white text-navy-500 transition-colors hover:bg-panel">
              <ArrowLeft size={17} />
            </button>
            {community.name}
            <StatusPill status={community.status} />
          </span>
        }
        subtitle={community.description}
        actions={
          <>
            {maker && tab === 'offers' && <Button leftIcon={<Plus size={16} />} onClick={() => setPublishing(true)}>Publish offer</Button>}
            {maker && (tab === 'members' || tab === 'leaders') && (
              <Button leftIcon={<UserPlus size={16} />} onClick={() => setAddingMember(tab === 'leaders' ? 'leader' : 'member')}>
                Add {tab === 'leaders' ? 'leader' : 'member'}
              </Button>
            )}
            {tab === 'loans' && <Button leftIcon={<HandCoins size={16} />} onClick={() => setApplying(true)}>New application</Button>}
          </>
        }
      />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-3 pb-4 pt-2 sm:px-4">
          {tab === 'members' && <DataTable columns={memberCols} rows={community.members} rowKey={(m) => m.id} empty={<EmptyState compact variant="users" title="No members yet" />} />}
          {tab === 'leaders' && <DataTable columns={memberCols} rows={community.leaders} rowKey={(m) => m.id} empty={<EmptyState compact variant="users" title="No leaders yet" />} />}
          {tab === 'offers' && <DataTable columns={offerCols} rows={community.offers} rowKey={(o) => o.id} empty={<EmptyState compact variant="inbox" title="No offers published" description="Publish a loan offer with a tenor and interest rate." />} />}
          {tab === 'loans' && <DataTable columns={loanCols} rows={loans} rowKey={(l) => l.id} empty={<EmptyState compact variant="inbox" title="No loan applications" description="Member applications appear here for approval and disbursement." />} />}
        </div>
      </Card>

      {/* add member / leader */}
      <Drawer
        open={addingMember !== null}
        onClose={() => setAddingMember(null)}
        title={addingMember === 'leader' ? 'Add leader' : 'Add member'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAddingMember(null)}>Cancel</Button>
            <Button onClick={saveMember}>Add</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Full name" required><Input autoFocus value={mName} onChange={(e) => setMName(e.target.value)} /></Field>
          <Field label="Phone" required hint="11 digits"><Input value={mPhone} maxLength={11} onChange={(e) => setMPhone(e.target.value.replace(/\D/g, ''))} /></Field>
        </div>
      </Drawer>

      {/* publish offer */}
      <Drawer
        open={publishing}
        onClose={() => setPublishing(false)}
        title="Publish loan offer"
        subtitle="Members can subscribe to published offers."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPublishing(false)}>Cancel</Button>
            <Button onClick={publishOffer} disabled={!oName.trim()}>Publish offer</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Offer name" required><Input autoFocus value={oName} onChange={(e) => setOName(e.target.value)} placeholder="e.g. Solar Stock Advance" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tenor (months)"><Input type="number" value={oTenor} onChange={(e) => setOTenor(e.target.value)} /></Field>
            <Field label="Interest rate (%)"><Input type="number" value={oRate} onChange={(e) => setORate(e.target.value)} /></Field>
          </div>
        </div>
      </Drawer>

      {/* loan application */}
      <Drawer
        open={applying}
        onClose={() => setApplying(false)}
        title="Member loan application"
        subtitle="Basic information, business information and disbursement account."
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setApplying(false)}>Cancel</Button>
            <Button onClick={submitLoan}>Submit application</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.06em] text-navy-400">Basic information</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required><Input value={app.memberName} onChange={set('memberName')} /></Field>
              <Field label="Phone" hint="11 digits"><Input value={app.phone} maxLength={11} onChange={set('phone')} /></Field>
              <Field label="Address" className="sm:col-span-2"><Input value={app.address} onChange={set('address')} /></Field>
              <Field label="Gender">
                <Select value={app.gender} onChange={set('gender')}>
                  <option>Female</option>
                  <option>Male</option>
                </Select>
              </Field>
              <Field label="Date of birth"><DatePicker value={app.dob} onChange={(v) => setApp((a) => ({ ...a, dob: v }))} placeholder="Select date of birth" /></Field>
              <Field label="Nationality"><Input value={app.nationality} onChange={set('nationality')} /></Field>
              <Field label="State of residence">
                <Select value={app.state} onChange={set('state')}>
                  {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Nearest landmark"><Input value={app.landmark} onChange={set('landmark')} /></Field>
              <Field label="Requested amount (₦)" required><Input type="number" value={app.amount} onChange={set('amount')} /></Field>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.06em] text-navy-400">Business information</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="BVN" required hint="11 digits"><Input value={app.bvn} maxLength={11} onChange={set('bvn')} /></Field>
              <Field label="TIN"><Input value={app.tin} onChange={set('tin')} /></Field>
              <Field label="Sector">
                <Select value={app.sector} onChange={set('sector')}>
                  {SECTOR_CATEGORIES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Monthly salary (₦)"><Input type="number" value={app.monthlySalary} onChange={set('monthlySalary')} /></Field>
              <Field label="Sterling account" required hint="10 digits — disbursement account"><Input value={app.account} maxLength={10} onChange={set('account')} /></Field>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
