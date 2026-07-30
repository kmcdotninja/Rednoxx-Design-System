import { useEffect, useState, type ReactNode } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Field,
  Input,
  SelectMenu,
  Textarea,
  useToast,
} from '@/components/ui'
import {
  DIRECTOR_ROLES,
  type DepartmentType,
  type DirectorRole,
  type FacilityType,
  type HimDepartment,
  type HimDirector,
  type HimFacility,
  type HimWard,
  type WardSex,
  type WardType,
} from './data'

/* Facility administration create/edit flows (Facility Administrator actor;
   changes governed by W-HIM-044). Each entity has ONE drawer that does both
   create and edit — pass `editing` to edit, omit it to create. A drawer, not a
   modal: these are multi-field forms, and the list stays visible behind them.
   Validation runs on submit (design guide §4). */

type Errors = Record<string, string | undefined>

/** Footer: cancel is the safe/left action; the primary label switches on mode. */
function DrawerFooter({ onCancel, onSubmit, label }: { onCancel: () => void; onSubmit: () => void; label: string }) {
  return (
    <>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSubmit}>{label}</Button>
    </>
  )
}

/** Two fields side by side on wide drawers, stacked on narrow ones. */
function Row({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

function required(value: string, message: string): string | undefined {
  return value.trim() === '' ? message : undefined
}

/** New id for a created record (UI-only demo — no backend). */
function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`
}

/** Rough shape check — enough to catch typos without rejecting valid addresses. */
function invalidEmail(value: string): boolean {
  return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

const DATE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** DatePicker emits ISO yyyy-mm-dd; the module displays dates as "d MMM yyyy". */
function isoToDisplay(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')} ${DATE_MONTHS[m - 1]} ${y}`
}

/** Reverse of isoToDisplay, so an existing date seeds the picker on edit. */
function displayToIso(display: string): string {
  const m = display.trim().match(/^(\d{1,2}) (\w{3}) (\d{4})$/)
  if (!m) return ''
  const month = DATE_MONTHS.indexOf(m[2])
  if (month < 0) return ''
  return `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

/* ---------------------------------------------------------------- facility */

const FACILITY_TYPES: FacilityType[] = [
  'Teaching hospital',
  'General hospital',
  'Cottage hospital',
  'Primary health centre',
  'Clinic',
]

export function FacilityDrawer({
  open,
  onClose,
  editing,
  facilities,
  onSave,
}: {
  open: boolean
  onClose: () => void
  /** The record to edit, or null to create. */
  editing: HimFacility | null
  facilities: HimFacility[]
  onSave: (facility: HimFacility) => void
}) {
  const { success } = useToast()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<FacilityType>('General hospital')
  const [tier, setTier] = useState<'1' | '2' | '3'>('2')
  const [state, setState] = useState('FCT')
  const [lga, setLga] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  // Seed on open: from the record when editing, blank when creating.
  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setCode(editing?.code ?? '')
    setType(editing?.type ?? 'General hospital')
    setTier((String(editing?.tier ?? 2) as '1' | '2' | '3'))
    setState(editing?.state ?? 'FCT')
    setLga(editing?.lga ?? '')
    setAddress(editing?.address ?? '')
    setPhone(editing?.phone ?? '')
    setErrors({})
  }, [open, editing])

  const submit = () => {
    const duplicate = facilities.some(
      (f) => f.id !== editing?.id && f.code.toLowerCase() === code.trim().toLowerCase(),
    )
    const next: Errors = {
      name: required(name, 'Enter the facility name.'),
      code: required(code, 'Enter a facility code.') ?? (duplicate ? `${code.trim()} is already in use — codes are unique across the network.` : undefined),
      lga: required(lga, 'Enter the LGA.'),
      state: required(state, 'Enter the state.'),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    onSave({
      id: editing?.id ?? nextId('f'),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      type,
      tier: Number(tier) as 1 | 2 | 3,
      lga: lga.trim(),
      state: state.trim(),
      address: address.trim(),
      phone: phone.trim(),
      status: editing?.status ?? 'active',
    })
    success(editing ? 'Facility updated' : 'Facility created', `${name.trim()} saved.`)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? 'Edit facility' : 'New facility'}
      subtitle="Facilities are the top of the org hierarchy — departments and wards belong to one."
      footer={<DrawerFooter onCancel={onClose} onSubmit={submit} label={editing ? 'Save changes' : 'Create facility'} />}
    >
      <div className="grid gap-4">
        <Field label="Facility name" required error={errors.name}>
          <Input value={name} invalid={!!errors.name} onChange={(e) => setName(e.target.value)} placeholder="Garki General Hospital" />
        </Field>

        <Row>
          <Field label="Facility code" required error={errors.code} hint="Unique across the network.">
            <Input value={code} invalid={!!errors.code} onChange={(e) => setCode(e.target.value)} placeholder="GGH-001" className="font-mono" />
          </Field>
          <Field label="Facility type" required>
            <SelectMenu value={type} onChange={setType} options={FACILITY_TYPES.map((t) => ({ value: t, label: t }))} />
          </Field>
        </Row>

        <Row>
          <Field label="Service tier" required hint="1 = primary, 3 = tertiary.">
            <SelectMenu
              value={tier}
              onChange={setTier}
              options={[
                { value: '1' as const, label: 'Tier 1 — primary' },
                { value: '2' as const, label: 'Tier 2 — secondary' },
                { value: '3' as const, label: 'Tier 3 — tertiary' },
              ]}
            />
          </Field>
          <Field label="Main phone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 9 234 5100" />
          </Field>
        </Row>

        <Row>
          <Field label="State" required error={errors.state}>
            <Input value={state} invalid={!!errors.state} onChange={(e) => setState(e.target.value)} />
          </Field>
          <Field label="LGA" required error={errors.lga}>
            <Input value={lga} invalid={!!errors.lga} onChange={(e) => setLga(e.target.value)} placeholder="AMAC" />
          </Field>
        </Row>

        <Field label="Street address" optional>
          <Textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Area 3, Garki, Abuja" />
        </Field>
      </div>
    </Drawer>
  )
}

/* -------------------------------------------------------------- department */

const DEPARTMENT_TYPES: DepartmentType[] = ['clinical', 'diagnostic', 'support', 'administrative']

export function DepartmentDrawer({
  open,
  onClose,
  editing,
  facilities,
  departments,
  onSave,
}: {
  open: boolean
  onClose: () => void
  editing: HimDepartment | null
  facilities: HimFacility[]
  departments: HimDepartment[]
  onSave: (department: HimDepartment) => void
}) {
  const { success } = useToast()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [facilityId, setFacilityId] = useState('')
  const [type, setType] = useState<DepartmentType>('clinical')
  const [head, setHead] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setCode(editing?.code ?? '')
    setFacilityId(editing?.facilityId ?? facilities[0]?.id ?? '')
    setType(editing?.type ?? 'clinical')
    setHead(editing && editing.head !== '—' ? editing.head : '')
    setErrors({})
  }, [open, editing, facilities])

  const submit = () => {
    const duplicate = departments.some(
      (d) => d.id !== editing?.id && d.facilityId === facilityId && d.code.toLowerCase() === code.trim().toLowerCase(),
    )
    const next: Errors = {
      name: required(name, 'Enter the department name.'),
      code: required(code, 'Enter a department code.') ?? (duplicate ? `${code.trim()} already exists in this facility.` : undefined),
      facilityId: required(facilityId, 'Choose the facility this department belongs to.'),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    onSave({
      id: editing?.id ?? nextId('d'),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      facilityId,
      type,
      head: head.trim() || '—',
      status: editing?.status ?? 'active',
    })
    success(editing ? 'Department updated' : 'Department created', `${name.trim()} saved.`)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? 'Edit department' : 'New department'}
      subtitle="Departments sit inside a facility and are where patients are routed after check-in."
      footer={<DrawerFooter onCancel={onClose} onSubmit={submit} label={editing ? 'Save changes' : 'Create department'} />}
    >
      <div className="grid gap-4">
        <Field label="Facility" required error={errors.facilityId} hint="Where this department operates.">
          <SelectMenu
            value={facilityId}
            onChange={setFacilityId}
            invalid={!!errors.facilityId}
            options={facilities.map((f) => ({ value: f.id, label: `${f.name} · ${f.code}` }))}
          />
        </Field>

        <Field label="Department name" required error={errors.name}>
          <Input value={name} invalid={!!errors.name} onChange={(e) => setName(e.target.value)} placeholder="Accident & Emergency" />
        </Field>

        <Row>
          <Field label="Department code" required error={errors.code} hint="Unique within the facility.">
            <Input value={code} invalid={!!errors.code} onChange={(e) => setCode(e.target.value)} placeholder="A&E" className="font-mono" />
          </Field>
          <Field label="Department type" required>
            <SelectMenu value={type} onChange={setType} options={DEPARTMENT_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
          </Field>
        </Row>

        <Field label="Head of department" optional>
          <Input value={head} onChange={(e) => setHead(e.target.value)} placeholder="Dr. Bola Adeyemi" />
        </Field>
      </div>
    </Drawer>
  )
}

/* -------------------------------------------------------------------- ward */

const WARD_TYPES: WardType[] = ['general', 'maternity', 'paediatric', 'intensive care', 'isolation', 'surgical']
const WARD_SEXES: WardSex[] = ['male', 'female', 'mixed']

export function WardDrawer({
  open,
  onClose,
  editing,
  facilities,
  departments,
  wards,
  onSave,
}: {
  open: boolean
  onClose: () => void
  editing: HimWard | null
  facilities: HimFacility[]
  departments: HimDepartment[]
  wards: HimWard[]
  onSave: (ward: HimWard) => void
}) {
  const { success } = useToast()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [facilityId, setFacilityId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [type, setType] = useState<WardType>('general')
  const [beds, setBeds] = useState('')
  const [sex, setSex] = useState<WardSex>('mixed')
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setCode(editing?.code ?? '')
    setFacilityId(editing?.facilityId ?? facilities[0]?.id ?? '')
    setDepartmentId(editing?.departmentId ?? '')
    setType(editing?.type ?? 'general')
    setBeds(editing ? String(editing.beds) : '')
    setSex(editing?.sex ?? 'mixed')
    setErrors({})
  }, [open, editing, facilities])

  // A ward belongs to a department *of its facility* — changing facility clears
  // the department rather than leaving a mismatched pair.
  const facilityDepartments = departments.filter((d) => d.facilityId === facilityId)
  const changeFacility = (id: string) => {
    setFacilityId(id)
    setDepartmentId('')
  }

  const submit = () => {
    const bedCount = Number(beds)
    const duplicate = wards.some(
      (w) => w.id !== editing?.id && w.facilityId === facilityId && w.code.toLowerCase() === code.trim().toLowerCase(),
    )
    const next: Errors = {
      name: required(name, 'Enter the ward name.'),
      code: required(code, 'Enter a ward code.') ?? (duplicate ? `${code.trim()} already exists in this facility.` : undefined),
      facilityId: required(facilityId, 'Choose a facility.'),
      departmentId: required(departmentId, 'Choose the department this ward reports to.'),
      beds:
        beds.trim() === ''
          ? 'Enter the bed count.'
          : !Number.isInteger(bedCount) || bedCount < 1
            ? `Must be a whole number of 1 or more — this is "${beds}".`
            : undefined,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    onSave({
      id: editing?.id ?? nextId('w'),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      facilityId,
      departmentId,
      type,
      beds: bedCount,
      sex,
      status: editing?.status ?? 'active',
    })
    success(editing ? 'Ward updated' : 'Ward created', `${name.trim()} saved.`)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? 'Edit ward' : 'New ward'}
      subtitle="Wards belong to a department and carry the bed capacity used for admissions."
      footer={<DrawerFooter onCancel={onClose} onSubmit={submit} label={editing ? 'Save changes' : 'Create ward'} />}
    >
      <div className="grid gap-4">
        <Row>
          <Field label="Facility" required error={errors.facilityId}>
            <SelectMenu value={facilityId} onChange={changeFacility} invalid={!!errors.facilityId} options={facilities.map((f) => ({ value: f.id, label: f.name }))} />
          </Field>
          <Field
            label="Department"
            required
            error={errors.departmentId}
            hint={facilityDepartments.length === 0 ? 'This facility has no departments yet — create one first.' : undefined}
          >
            <SelectMenu
              value={departmentId}
              onChange={setDepartmentId}
              invalid={!!errors.departmentId}
              disabled={facilityDepartments.length === 0}
              placeholder={facilityDepartments.length === 0 ? 'No departments' : 'Select department…'}
              options={facilityDepartments.map((d) => ({ value: d.id, label: `${d.name} · ${d.code}` }))}
            />
          </Field>
        </Row>

        <Field label="Ward name" required error={errors.name}>
          <Input value={name} invalid={!!errors.name} onChange={(e) => setName(e.target.value)} placeholder="Male Medical Ward" />
        </Field>

        <Row>
          <Field label="Ward code" required error={errors.code} hint="Unique within the facility.">
            <Input value={code} invalid={!!errors.code} onChange={(e) => setCode(e.target.value)} placeholder="MMW" className="font-mono" />
          </Field>
          <Field label="Ward type" required>
            <SelectMenu value={type} onChange={setType} options={WARD_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
          </Field>
        </Row>

        <Row>
          <Field label="Beds" required error={errors.beds} hint="Physical bed capacity.">
            <Input value={beds} invalid={!!errors.beds} onChange={(e) => setBeds(e.target.value)} inputMode="numeric" placeholder="24" className="tnum" />
          </Field>
          <Field label="Admits" required hint="Which patients this ward accepts.">
            <SelectMenu value={sex} onChange={setSex} options={WARD_SEXES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
          </Field>
        </Row>
      </div>
    </Drawer>
  )
}

/* ---------------------------------------------------------------- director */

export function DirectorDrawer({
  open,
  onClose,
  editing,
  facilities,
  departments,
  directors,
  onSave,
}: {
  open: boolean
  onClose: () => void
  editing: HimDirector | null
  facilities: HimFacility[]
  departments: HimDepartment[]
  directors: HimDirector[]
  onSave: (director: HimDirector) => void
}) {
  const { success } = useToast()
  const [name, setName] = useState('')
  const [role, setRole] = useState<DirectorRole>('Medical Director')
  const [facilityId, setFacilityId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [appointed, setAppointed] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setRole(editing?.role ?? 'Medical Director')
    setFacilityId(editing?.facilityId ?? facilities[0]?.id ?? '')
    setDepartmentId(editing?.departmentId ?? '')
    setEmail(editing?.email ?? '')
    setPhone(editing?.phone ?? '')
    setAppointed(editing ? displayToIso(editing.appointed) : '')
    setErrors({})
  }, [open, editing, facilities])

  const facilityDepartments = departments.filter((d) => d.facilityId === facilityId)
  const changeFacility = (id: string) => {
    setFacilityId(id)
    setDepartmentId('')
  }

  // An office has one sitting holder per facility — surface the incumbent
  // (excluding the director being edited) rather than quietly creating a second.
  const incumbent = directors.find(
    (d) => d.id !== editing?.id && d.facilityId === facilityId && d.role === role && d.status === 'active',
  )

  const submit = () => {
    const next: Errors = {
      name: required(name, 'Enter the director’s full name.'),
      facilityId: required(facilityId, 'Choose the facility.'),
      email: required(email, 'Enter a work email.') ?? (invalidEmail(email) ? 'Enter a valid email address, e.g. name@facility.gov.ng' : undefined),
      appointed: appointed === '' ? 'Pick the appointment date.' : undefined,
      role:
        incumbent && (editing?.status ?? 'active') === 'active'
          ? `${facilities.find((f) => f.id === facilityId)?.name ?? 'This facility'} already has an active ${role} (${incumbent.name}). Deactivate that appointment first.`
          : undefined,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    onSave({
      id: editing?.id ?? nextId('dir'),
      name: name.trim(),
      role,
      facilityId,
      departmentId: departmentId || undefined,
      email: email.trim(),
      phone: phone.trim(),
      appointed: isoToDisplay(appointed),
      status: editing?.status ?? 'active',
    })
    success(editing ? 'Director updated' : 'Director appointed', `${name.trim()} — ${role}.`)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? 'Edit director' : 'New director'}
      subtitle="Appointed offices for a facility — one active holder per office at a time."
      footer={<DrawerFooter onCancel={onClose} onSubmit={submit} label={editing ? 'Save changes' : 'Appoint director'} />}
    >
      <div className="grid gap-4">
        <Field label="Facility" required error={errors.facilityId}>
          <SelectMenu value={facilityId} onChange={changeFacility} invalid={!!errors.facilityId} options={facilities.map((f) => ({ value: f.id, label: `${f.name} · ${f.code}` }))} />
        </Field>

        <Field label="Office" required error={errors.role} hint={incumbent ? undefined : 'The post this person is appointed to.'}>
          <SelectMenu value={role} onChange={setRole} invalid={!!errors.role} options={DIRECTOR_ROLES.map((r) => ({ value: r, label: r }))} />
        </Field>

        <Field label="Full name" required error={errors.name}>
          <Input value={name} invalid={!!errors.name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Emeka Obi" />
        </Field>

        <Row>
          <Field label="Work email" required error={errors.email}>
            <Input type="email" value={email} invalid={!!errors.email} onChange={(e) => setEmail(e.target.value)} placeholder="emeka.obi@garki.health.gov.ng" />
          </Field>
          <Field label="Phone" optional>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 803 555 0111" />
          </Field>
        </Row>

        <Row>
          <Field label="Appointed on" required error={errors.appointed}>
            <DatePicker value={appointed} onChange={setAppointed} placeholder="Pick a date" />
          </Field>
          <Field
            label="Department"
            optional
            hint={facilityDepartments.length === 0 ? 'This facility has no departments yet.' : 'Only if they also head a department.'}
          >
            <SelectMenu
              value={departmentId}
              onChange={setDepartmentId}
              disabled={facilityDepartments.length === 0}
              placeholder={facilityDepartments.length === 0 ? 'No departments' : 'None'}
              options={facilityDepartments.map((d) => ({ value: d.id, label: `${d.name} · ${d.code}` }))}
            />
          </Field>
        </Row>
      </div>
    </Drawer>
  )
}
