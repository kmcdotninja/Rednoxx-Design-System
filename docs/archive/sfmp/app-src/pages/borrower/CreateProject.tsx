import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, FileText, Plus, Save, Trash2, Upload, X } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useAccount } from '@/components/shell/AccountContext'
import { Badge, Button, Card, Field, InfoTip, Input, KeyValue, Stepper, Textarea, Tooltip, useToast, type Step } from '@/components/ui'
import { useStore, newId } from '@/store/AppStore'
import { DocumentViewer } from '@/components/DocumentViewer'
import { facilityTypeById, sectorById } from '@/lib/sfmp'
import { money } from '@/lib/format'
import type { FileRef, Project, ProjectRisk } from '@/data/types'
import { cn } from '@/lib/cn'

const STEPS: Step[] = [
  { title: 'Step 1', label: 'Facility Type' },
  { title: 'Step 2', label: 'Details' },
  { title: 'Step 3', label: 'Supporting Documents' },
  { title: 'Step 4', label: 'Additional Details' },
  { title: 'Step 5', label: 'Review & submit' },
]

interface Details {
  name: string
  description: string
  amount: string
  purpose: string
  tenor: string
  moratorium: string
  domiciliation: string
  equity: string
  sourceOfRepayment: string
}

const EMPTY_DETAILS: Details = {
  name: '', description: '', amount: '', purpose: '', tenor: '',
  moratorium: '', domiciliation: '', equity: '', sourceOfRepayment: '',
}

const DETAIL_LABELS: Record<keyof Details, string> = {
  name: 'Name of Project',
  description: 'Project Description',
  amount: 'Facility Amount',
  purpose: 'Purpose',
  tenor: 'Tenor',
  moratorium: 'Moratorium Requirement',
  domiciliation: 'Domiciliation Arrangement',
  equity: 'Equity Contribution',
  sourceOfRepayment: 'Source of Repayment',
}

export function CreateProject() {
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const { company } = useAccount()
  const { sectors, projects, createProject, saveProject, submitProject } = useStore()

  const draft = projects.find((p) => p.id === params.get('draft') && p.borrower === company && p.status === 'in_progress')

  const activeSectors = sectors.filter((s) => s.status === 'active' && s.facilityTypes.length > 0)

  const [step, setStep] = useState(draft ? 1 : 0)
  const [sectorId, setSectorId] = useState(draft?.sectorId ?? '')
  const [facilityTypeId, setFacilityTypeId] = useState(draft?.facilityTypeId ?? '')
  const [details, setDetails] = useState<Details>(
    draft
      ? {
          name: draft.name, description: draft.description, amount: draft.amount ? String(draft.amount) : '',
          purpose: draft.purpose, tenor: draft.tenor ? String(draft.tenor) : '', moratorium: draft.moratorium,
          domiciliation: draft.domiciliation, equity: draft.equity ? String(draft.equity) : '', sourceOfRepayment: draft.sourceOfRepayment,
        }
      : EMPTY_DETAILS,
  )
  const [documents, setDocuments] = useState<Record<string, FileRef[]>>(draft?.documents ?? {})
  const [risks, setRisks] = useState<ProjectRisk[]>(draft?.risks ?? [])
  const [additional, setAdditional] = useState(draft?.additional ?? '')
  const [triedSubmit, setTriedSubmit] = useState<Record<number, boolean>>({})
  const [viewingDoc, setViewingDoc] = useState<FileRef | null>(null)
  const draftId = useRef<string | null>(draft?.id ?? null)

  const sector = sectorById(sectors, sectorId)
  const ft = facilityTypeById(sectors, facilityTypeId)

  /* ------------------------------ validation ------------------------------ */

  const equityNum = Number(details.equity)
  const equityError =
    details.equity !== '' && (Number.isNaN(equityNum) || equityNum < 20)
      ? 'Enter a value from 20'
      : details.equity !== '' && equityNum > 100
        ? 'Enter a value up to 100'
        : null

  const missingDetails = useMemo(() => {
    const missing = new Set<keyof Details>()
    for (const key of Object.keys(DETAIL_LABELS) as (keyof Details)[]) {
      if (!details[key].trim()) missing.add(key)
    }
    if (equityError) missing.add('equity')
    return missing
  }, [details, equityError])

  const missingDocs = useMemo(() => {
    if (!ft) return new Set<string>()
    return new Set(ft.documentSections.filter((s) => s.id !== 'others' && (documents[s.id]?.length ?? 0) === 0).map((s) => s.id))
  }, [ft, documents])

  /* ---------------------------- draft persistence -------------------------- */

  const snapshot = (): Partial<Project> => ({
    sectorId,
    facilityTypeId,
    name: details.name,
    description: details.description,
    amount: Number(details.amount) || 0,
    purpose: details.purpose,
    tenor: Number(details.tenor) || 0,
    moratorium: details.moratorium,
    domiciliation: details.domiciliation,
    equity: Number(details.equity) || 0,
    sourceOfRepayment: details.sourceOfRepayment,
    documents,
    risks,
    additional,
  })

  const persistDraft = (silent = false) => {
    if (!sectorId || !facilityTypeId) return null
    if (draftId.current) {
      saveProject(draftId.current, snapshot())
    } else {
      const created = createProject({ ...snapshot(), sectorId, facilityTypeId, status: 'in_progress' })
      draftId.current = created.id
    }
    if (!silent) toast.info('Progress saved', 'Your application is saved under Projects as “in progress”.')
    return draftId.current
  }

  // Auto-save: if the applicant idles mid-application (e.g. a session timeout),
  // progress is stored under Projects with an “in progress” state.
  const idleTimer = useRef<number | null>(null)
  useEffect(() => {
    if (!facilityTypeId || step === 0 || step === STEPS.length - 1) return
    if (idleTimer.current) window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => persistDraft(true), 30_000)
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details, documents, risks, additional, facilityTypeId, step])

  /* --------------------------------- files -------------------------------- */

  const addFile = (sectionId: string, multiple: boolean) => {
    const n = (documents[sectionId]?.length ?? 0) + 1
    const file: FileRef = {
      id: newId('f'),
      name: `${ft?.documentSections.find((s) => s.id === sectionId)?.name ?? 'Document'}${multiple && n > 1 ? ` (${n})` : ''}.pdf`,
      section: sectionId,
      sizeKb: 280 + Math.floor(Math.random() * 600),
      at: new Date().toISOString(),
    }
    setDocuments((d) => ({ ...d, [sectionId]: multiple ? [...(d[sectionId] ?? []), file] : [file] }))
  }
  const removeFile = (sectionId: string, fileId: string) => {
    setDocuments((d) => ({ ...d, [sectionId]: (d[sectionId] ?? []).filter((f) => f.id !== fileId) }))
  }

  /* ------------------------------- navigation ------------------------------ */

  const tryNext = () => {
    if (step === 1 && missingDetails.size > 0) {
      setTriedSubmit((t) => ({ ...t, 1: true }))
      toast.error('Missing fields', 'Complete the highlighted fields before proceeding.')
      return
    }
    if (step === 2 && missingDocs.size > 0) {
      setTriedSubmit((t) => ({ ...t, 2: true }))
      toast.error('Missing documents', 'Upload the highlighted supporting documents before proceeding.')
      return
    }
    persistDraft(true)
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  const submit = () => {
    const id = persistDraft(true)
    if (!id) return
    submitProject(id)
    toast.success('Project submitted', 'Your application is now live on the marketplace for review.')
    navigate('/borrower/projects')
  }

  /* --------------------------------- render -------------------------------- */

  return (
    <>
      <PageHeader
        title="Create new project"
        subtitle="Build a financing request with the document pack for your facility type."
        actions={
          step > 0 && (
            <Button variant="secondary" leftIcon={<Save size={16} />} onClick={() => { persistDraft(); navigate('/borrower/projects') }}>
              Save &amp; exit
            </Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit lg:sticky lg:top-24">
          <Stepper steps={STEPS} current={step} onSelect={(i) => i < step && setStep(i)} />
        </Card>

        <Card>
          {/* ---------------- Step 0 · sector + facility type ---------------- */}
          {step === 0 && (
            <div className="space-y-6">
              <SectionTitle title="Choose an industry category" hint="Categories are configured by the SFMP admin — only published sectors appear here." />
              <div className="grid gap-3 sm:grid-cols-2">
                {activeSectors.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setSectorId(s.id); setFacilityTypeId('') }}
                    className={cn(
                      'rounded-3xl border p-4 text-left transition-colors',
                      sectorId === s.id ? 'border-navy bg-navy-50' : 'border-hair bg-white hover:bg-panel',
                    )}
                  >
                    <p className="text-sm font-medium text-navy">{s.name}</p>
                    <p className="mt-0.5 text-xs text-navy-400">{s.facilityTypes.length} facility type(s)</p>
                  </button>
                ))}
              </div>

              {sector && (
                <div>
                  <SectionTitle title="Facility Type" hint="Hover each option to understand the nomenclature before you choose." />
                  <div className="mt-4 grid gap-3">
                    {sector.facilityTypes.map((f) => (
                      <Tooltip key={f.id} content={f.tooltip} className="block w-full">
                        <button
                          type="button"
                          onClick={() => setFacilityTypeId(f.id)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors',
                            facilityTypeId === f.id ? 'border-navy bg-navy-50' : 'border-hair bg-white hover:bg-panel',
                          )}
                        >
                          <span className="flex items-center gap-2 text-sm font-medium text-navy">
                            {f.name}
                            <InfoTip content={f.tooltip} />
                          </span>
                          <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border', facilityTypeId === f.id ? 'border-navy bg-navy text-white' : 'border-hair')}>
                            {facilityTypeId === f.id && <Check size={12} strokeWidth={3} />}
                          </span>
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------- Step 1 · details ---------------------- */}
          {step === 1 && ft && (
            <div className="space-y-5">
              <FacilityHeader name={ft.name} onBack={() => setStep(0)} />
              <SectionTitle title="Details" hint="A brief of the project and the facility you are applying for." />
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailInput k="name" details={details} setDetails={setDetails} missing={triedSubmit[1] ? missingDetails : undefined} className="sm:col-span-2" />
                <Field label={DETAIL_LABELS.description} required className="sm:col-span-2">
                  <Textarea
                    rows={3}
                    value={details.description}
                    onChange={(e) => setDetails((d) => ({ ...d, description: e.target.value }))}
                    className={cn(triedSubmit[1] && missingDetails.has('description') && 'border-rose-ink ring-4 ring-rose-soft')}
                  />
                </Field>
                <DetailInput k="amount" type="number" prefix="₦" details={details} setDetails={setDetails} missing={triedSubmit[1] ? missingDetails : undefined} />
                <DetailInput k="tenor" type="number" suffix="months" details={details} setDetails={setDetails} missing={triedSubmit[1] ? missingDetails : undefined} />
                <DetailInput k="purpose" details={details} setDetails={setDetails} missing={triedSubmit[1] ? missingDetails : undefined} />
                <DetailInput k="moratorium" details={details} setDetails={setDetails} missing={triedSubmit[1] ? missingDetails : undefined} />
                <DetailInput k="domiciliation" details={details} setDetails={setDetails} missing={triedSubmit[1] ? missingDetails : undefined} />
                <Field
                  label={
                    <span className="inline-flex items-center gap-1.5">
                      {DETAIL_LABELS.equity}
                      <InfoTip content="Minimum of 20% contribution" />
                    </span>
                  }
                  required
                >
                  <div className="relative">
                    <Input
                      type="number"
                      value={details.equity}
                      onChange={(e) => setDetails((d) => ({ ...d, equity: e.target.value }))}
                      className={cn('pr-9', (equityError || (triedSubmit[1] && missingDetails.has('equity'))) && 'border-rose-ink ring-4 ring-rose-soft')}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-300">%</span>
                  </div>
                  {equityError && <p className="mt-1.5 text-xs font-medium text-rose-ink">{equityError}</p>}
                </Field>
                <DetailInput k="sourceOfRepayment" details={details} setDetails={setDetails} missing={triedSubmit[1] ? missingDetails : undefined} />
              </div>
            </div>
          )}

          {/* ------------------- Step 2 · supporting documents ---------------- */}
          {step === 2 && ft && (
            <div className="space-y-5">
              <FacilityHeader name={ft.name} onBack={() => setStep(0)} />
              <SectionTitle title="Supporting Documents" hint="Upload each required document. Hover the info icon for what each section should contain." />
              <div className="grid gap-3">
                {ft.documentSections.map((section) => {
                  const files = documents[section.id] ?? []
                  const isMissing = triedSubmit[2] && missingDocs.has(section.id)
                  return (
                    <div
                      key={section.id}
                      className={cn(
                        'rounded-3xl border p-4 transition-colors',
                        isMissing ? 'border-rose-ink bg-rose-soft/20' : files.length > 0 ? 'border-mint/50 bg-mint-soft/30' : 'border-hair bg-white',
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-navy">
                          <span className="truncate">{section.name}</span>
                          <InfoTip content={section.description} />
                          {section.multiple && <Badge tone="neutral" className="ml-1">multiple</Badge>}
                        </p>
                        <button
                          type="button"
                          onClick={() => addFile(section.id, !!section.multiple)}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-navy px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-navy-600"
                        >
                          <Upload size={13} />
                          {files.length > 0 && section.multiple ? 'Add another' : files.length > 0 ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                      {files.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {files.map((f) => (
                            <div
                              key={f.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => setViewingDoc(f)}
                              onKeyDown={(e) => e.key === 'Enter' && setViewingDoc(f)}
                              className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-3 py-2 transition-colors hover:bg-panel/60"
                            >
                              <FileText size={14} className="shrink-0 text-mint" />
                              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-navy-600">{f.name}</span>
                              <span className="tnum text-xs text-navy-300">{f.sizeKb} KB</span>
                              <button type="button" aria-label="Remove file" onClick={(e) => { e.stopPropagation(); removeFile(section.id, f.id) }} className="text-navy-300 transition-colors hover:text-rose-ink">
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {isMissing && <p className="mt-2 text-xs font-medium text-rose-ink">This document is required.</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* --------------------- Step 3 · additional details ---------------- */}
          {step === 3 && ft && (
            <div className="space-y-6">
              <FacilityHeader name={ft.name} onBack={() => setStep(0)} />
              <div>
                <SectionTitle title="Business risks" hint="Perceived risks, their consequences and mitigating factors." />
                <div className="mt-4 space-y-4">
                  {risks.map((r, i) => (
                    <div key={r.id} className="rounded-3xl border border-hair bg-panel/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[13px] font-medium uppercase tracking-[0.06em] text-navy-400">Risk #{i + 1}</span>
                        <button type="button" onClick={() => setRisks((rs) => rs.filter((x) => x.id !== r.id))} className="inline-flex items-center gap-1 text-xs font-medium text-rose-ink hover:underline">
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                      <div className="grid gap-3">
                        <Field label="Perceived risk"><Input value={r.risk} onChange={(e) => setRisks((rs) => rs.map((x) => (x.id === r.id ? { ...x, risk: e.target.value } : x)))} /></Field>
                        <Field label="Consequences"><Input value={r.consequences} onChange={(e) => setRisks((rs) => rs.map((x) => (x.id === r.id ? { ...x, consequences: e.target.value } : x)))} /></Field>
                        <Field label="Mitigating factors"><Input value={r.mitigants} onChange={(e) => setRisks((rs) => rs.map((x) => (x.id === r.id ? { ...x, mitigants: e.target.value } : x)))} /></Field>
                      </div>
                    </div>
                  ))}
                  <Button variant="secondary" leftIcon={<Plus size={16} />} onClick={() => setRisks((rs) => [...rs, { id: newId('r'), risk: '', consequences: '', mitigants: '' }])}>
                    Add risk
                  </Button>
                </div>
              </div>
              <div>
                <SectionTitle title="Additional Details" hint="Anything else the reviewers should know." />
                <Textarea rows={4} className="mt-4" value={additional} onChange={(e) => setAdditional(e.target.value)} placeholder="Optional additional context…" />
              </div>
            </div>
          )}

          {/* ------------------------ Step 4 · review ------------------------ */}
          {step === 4 && ft && (
            <div className="space-y-5">
              <SectionTitle title="Review & submit" hint="Confirm your application before it goes to the marketplace." />
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <KeyValue label="Project" value={details.name || '—'} />
                <KeyValue label="Facility type" value={ft.name} />
                <KeyValue label="Amount" value={<span className="tnum">{details.amount ? money(Number(details.amount)) : '—'}</span>} />
                <KeyValue label="Tenor" value={details.tenor ? `${details.tenor} months` : '—'} />
                <KeyValue label="Equity" value={details.equity ? `${details.equity}%` : '—'} />
                <KeyValue label="Documents" value={`${Object.values(documents).flat().length} uploaded`} />
                <KeyValue label="Risks documented" value={risks.length} />
                <KeyValue label="Sector" value={sector?.name ?? '—'} />
              </div>
              <div className="rounded-2xl bg-navy-50 px-4 py-3 text-[13px] leading-relaxed text-navy-500">
                On submission your project is listed <span className="font-medium text-navy">On Marketplace</span> and sent to the SFMP team for review and recommendation to financiers.
              </div>
            </div>
          )}

          {/* ------------------------------ footer ---------------------------- */}
          <div className="mt-7 flex items-center justify-between border-t border-hair pt-5">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
            {step === 0 ? (
              <Button onClick={() => setStep(1)} disabled={!facilityTypeId} rightIcon={<ArrowRight size={16} />}>Continue</Button>
            ) : step < STEPS.length - 1 ? (
              <Button onClick={tryNext} rightIcon={<ArrowRight size={16} />}>Continue</Button>
            ) : (
              <Button onClick={submit} leftIcon={<Check size={16} />}>Submit to marketplace</Button>
            )}
          </div>
        </Card>
      </div>

      <DocumentViewer file={viewingDoc} owner={company} onClose={() => setViewingDoc(null)} />
    </>
  )
}

/* ------------------------------ sub-components ----------------------------- */

function SectionTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div>
      <h3 className="text-[15px] font-medium tracking-[-0.01em] text-navy">{title}</h3>
      <p className="mt-1 text-sm text-navy-400">{hint}</p>
    </div>
  )
}

/** The Facility Type header with a back arrow — lets the applicant change type
 *  if the wrong one was selected. */
function FacilityHeader({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-white">
      <button type="button" onClick={onBack} aria-label="Change facility type" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
        <ArrowLeft size={16} />
      </button>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">Facility Type</p>
        <p className="truncate text-sm font-medium">{name}</p>
      </div>
    </div>
  )
}

function DetailInput({
  k, details, setDetails, missing, type, prefix, suffix, className,
}: {
  k: keyof Details
  details: Details
  setDetails: React.Dispatch<React.SetStateAction<Details>>
  missing?: Set<keyof Details>
  type?: string
  prefix?: string
  suffix?: string
  className?: string
}) {
  const isMissing = missing?.has(k)
  return (
    <Field label={DETAIL_LABELS[k]} required className={className}>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-300">{prefix}</span>}
        <Input
          type={type}
          value={details[k]}
          onChange={(e) => setDetails((d) => ({ ...d, [k]: e.target.value }))}
          className={cn(prefix && 'pl-9', suffix && 'pr-20', isMissing && 'border-rose-ink ring-4 ring-rose-soft')}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-300">{suffix}</span>}
      </div>
      {isMissing && <p className="mt-1.5 text-xs font-medium text-rose-ink">This field is required.</p>}
    </Field>
  )
}
