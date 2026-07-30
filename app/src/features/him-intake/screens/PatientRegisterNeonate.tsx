import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Baby, X, Plus, Minus } from 'lucide-react'
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Field,
  Input,
  Select,
  useToast,
  Skeleton,
  Badge,
} from '@/components/ui'
import { PageHeader } from '../shared'
import { registerNeonate, searchPatients } from '../api'
import type { PatientSearchResult, PatientSex, Neonate } from '../types'

const createBaby = (birthOrder: number): Neonate => ({
  id: crypto.randomUUID(),
  sex: 'unknown',
  givenName: '',
  birthOrder,
  birthCertificateNo: '',
})

export function PatientRegisterNeonatePage() {
  const navigate = useNavigate()
  const { success } = useToast()

  const [motherQuery, setMotherQuery] = useState('')
  const [selectedMother, setSelectedMother] = useState<PatientSearchResult | null>(null)
  const [motherSearchResults, setMotherSearchResults] = useState<PatientSearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const [birthDateTime, setBirthDateTime] = useState('')
  const [multipleBirth, setMultipleBirth] = useState(false)
  const [babies, setBabies] = useState<Neonate[]>(() => [createBaby(1)])
  const [submitting, setSubmitting] = useState(false)

  const handleMotherSearch = async (q: string) => {
    setMotherQuery(q)
    if (q.trim().length < 2) {
      setMotherSearchResults([])
      return
    }
    setSearching(true)
    try {
      const res = await searchPatients({ q, facility: '' })
      setMotherSearchResults(res.results.filter((r) => r.sex === 'F'))
    } finally {
      setSearching(false)
    }
  }

  const selectMother = (mother: PatientSearchResult) => {
    setSelectedMother(mother)
    setMotherQuery(mother.displayName)
    setMotherSearchResults([])
  }

  const clearMother = () => {
    setSelectedMother(null)
    setMotherQuery('')
  }

  const addBaby = () => {
    setBabies((prev) => [...prev, createBaby(prev.length + 1)])
  }
  const removeBaby = (id: string) => {
    setBabies((prev) => {
      if (prev.length <= 1) return prev

      return prev
        .filter((b) => b.id !== id)
        .map((b, index) => ({
          ...b,
          birthOrder: index + 1,
        }))
    })
  }

  const updateBaby = (id: string, updates: Partial<Neonate>) => {
    setBabies((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const handleSubmit = async () => {
    if (!selectedMother) return
    setSubmitting(true)
    try {
      const results = []
      for (const baby of babies) {
        const result = await registerNeonate({
          motherId: selectedMother.id,
          motherName: selectedMother.displayName,
          birthDateTime,
          birthOrder: baby.birthOrder,
          multipleBirth: babies.length > 1,
          numberOfBabies: babies.length,
          sex: baby.sex,
          givenName: baby.givenName,
          birthCertificateNo: baby.birthCertificateNo,
        })
        results.push(result)
      }

      success(
        'Neonate(s) registered',
        `${results.length} baby${results.length > 1 ? 'ies' : ''} registered successfully`,
      )
      navigate({ to: '/him/patients/$id', params: { id: results[0].id } })
    } finally {
      setSubmitting(false)
    }
  }

  const ready =
    selectedMother &&
    birthDateTime.trim().length > 0 &&
    babies.every((b) => b.sex !== 'unknown') &&
    babies.length > 0

  const getBabyLabel = (baby: Neonate) => {
    const label = `Baby ${baby.birthOrder}`
    if (baby.givenName) {
      return `${label} - ${baby.givenName}`
    }
    return label
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 transition-colors hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <PageHeader
        title="Neonate registration"
        subtitle="Register a newborn linked to the mother and birth event."
      />

      <Card className="space-y-5">
        {/* Mother search */}
        <div>
          <Field label="Mother / guardian" required>
            <div className="relative">
              <Input
                value={motherQuery}
                onChange={(e) => handleMotherSearch(e.target.value)}
                placeholder="Search by name or MRN…"
                disabled={!!selectedMother}
              />
              {selectedMother && (
                <button
                  type="button"
                  onClick={clearMother}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-300 hover:text-forest"
                  aria-label="Clear mother"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </Field>
          {searching && <Skeleton className="h-10 mt-1" />}
          {motherSearchResults.length > 0 && !selectedMother && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-2xl border border-hair bg-white p-1 shadow-pop">
              {motherSearchResults.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMother(m)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-panel/60"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-forest">{m.displayName}</p>
                    <p className="text-[12px] text-forest-400">MRN {m.mrn}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {selectedMother && (
            <div className="mt-2 rounded-2xl bg-panel px-3.5 py-2 text-[13px] text-forest-600">
              Mother: <span className="font-medium">{selectedMother.displayName}</span> · MRN{' '}
              {selectedMother.mrn}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date / time of birth" required>
            <DatePicker
              value={birthDateTime}
              onChange={(v) => setBirthDateTime(v)}
              placeholder="Select date and time"
            />
          </Field>
          <Field label="Multiple birth">
            <Checkbox
              checked={multipleBirth}
              onChange={(checked) => {
                setMultipleBirth(checked)
                // If enabling multiple birth, add an extra baby
                if (checked && babies.length === 1) {
                  addBaby()
                }
                // If disabling, reset to one baby
                if (!checked && babies.length > 1) {
                  setBabies([
                    {
                      ...babies[0],
                      birthOrder: 1,
                    },
                  ])
                }
              }}
              label="This is a multiple birth (twins, triplets, etc.)"
            />
          </Field>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-medium text-forest">Baby details</h3>
            {multipleBirth && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={addBaby}
                className="text-forest-400 hover:text-forest"
              >
                Add sibling
              </Button>
            )}
          </div>

          {babies.map((baby) => (
            <Card key={baby.id} pad={false} className="p-4 border border-hair/80 bg-panel/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral" className="text-[11px] font-medium">
                      {getBabyLabel(baby)}
                    </Badge>
                    {baby.givenName && (
                      <span className="text-[13px] font-medium text-forest">{baby.givenName}</span>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Sex" required>
                      <Select
                        value={baby.sex}
                        onChange={(e) => updateBaby(baby.id, { sex: e.target.value as PatientSex })}
                      >
                        <option value="unknown">Select…</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </Select>
                    </Field>
                    <Field label="Given name (optional)" hint="Leave blank for baby-of naming">
                      <Input
                        value={baby.givenName}
                        onChange={(e) => updateBaby(baby.id, { givenName: e.target.value })}
                        placeholder="e.g. Oluwaseun"
                      />
                    </Field>
                    <Field label="Birth order">
                      <Input value={baby.birthOrder} readOnly />
                    </Field>
                    <Field label="Birth certificate number (optional)">
                      <Input
                        value={baby.birthCertificateNo || ''}
                        onChange={(e) =>
                          updateBaby(baby.id, { birthCertificateNo: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                </div>

                {multipleBirth && babies.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Minus size={14} />}
                    onClick={() => removeBaby(baby.id)}
                    className="shrink-0 text-rose-400 hover:text-rose-600 hover:bg-rose-soft/20"
                    aria-label={`Remove Baby ${baby.birthOrder}`}
                  />
                )}
              </div>
            </Card>
          ))}

          {multipleBirth && (
            <div className="rounded-2xl bg-panel px-3.5 py-2 text-[13px] text-forest-400">
              <span className="font-medium">{babies.length}</span> baby
              {babies.length > 1 ? 'ies' : ''} in this birth event
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            leftIcon={<Baby size={14} />}
            onClick={handleSubmit}
            disabled={!ready || submitting}
          >
            {submitting ? 'Registering…' : `Register ${babies.length > 1 ? 'babies' : 'neonate'}`}
          </Button>
        </div>
      </Card>
    </div>
  )
}
