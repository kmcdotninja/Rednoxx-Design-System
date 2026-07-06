import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Modal,
  Select,
  Toggle,
  useToast,
} from '@/components/ui'
import { DemoPageHeader } from '../DemoShell'
import { STAFF } from '../../health'

/* -------------------------------- Staff --------------------------------- */

export function StaffPage() {
  const { success } = useToast()
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Staff"
          subtitle={`${STAFF.filter((s) => s.status === 'active').length} active members across the network`}
          actions={
            <Button size="sm" leftIcon={<UserPlus size={14} />} onClick={() => setInviteOpen(true)}>
              Invite member
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 animate-rise sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '80ms' }}>
        {STAFF.map((s) => (
          <Card key={s.id} pad={false} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <Avatar name={s.name} size="lg" />
              <Badge tone={s.status === 'active' ? 'success' : 'neutral'} dot>
                {s.status}
              </Badge>
            </div>
            <p className="mt-3.5 truncate text-sm font-medium text-forest">{s.name}</p>
            <p className="truncate text-[13px] text-forest-400">{s.role}</p>
            <p className="mt-2 truncate text-xs text-forest-300">{s.facility}</p>
          </Card>
        ))}
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a team member"
        subtitle="They’ll get an email with a link to set up their account."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setInviteOpen(false)
                success('Invite sent', 'The invite expires in 7 days.')
              }}
            >
              Send invite
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Work email" required>
            <Input type="email" placeholder="name@rednoxx.health" />
          </Field>
          <Field label="Role" required hint="Controls what they can see and sign off.">
            <Select defaultValue="Clinician">
              {['Clinician', 'Nurse', 'Lab scientist', 'Front desk', 'Finance', 'Administrator'].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Facility">
            <Select defaultValue="Garki General Hospital">
              {['Head office', 'Garki General Hospital', 'Ikeja Medical Centre', 'Kano Specialist Clinic', 'Enugu Teaching Hospital'].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>
    </>
  )
}

/* ------------------------------- Settings ------------------------------- */

const NOTIFICATIONS = [
  { key: 'reminders', label: 'Appointment reminders', hint: 'SMS to patients 24 hours ahead' },
  { key: 'labs', label: 'Lab results ready', hint: 'Notify the ordering clinician' },
  { key: 'claims', label: 'Claim decisions', hint: 'Approvals and rejections from insurers' },
  { key: 'digest', label: 'Weekly digest', hint: 'Network summary every Monday morning' },
]

export function SettingsPage() {
  const { success } = useToast()
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    reminders: true,
    labs: true,
    claims: true,
    digest: false,
  })
  const [twoFa, setTwoFa] = useState(true)

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Settings"
          subtitle="Organisation profile, notifications and security"
          actions={
            <Button size="sm" onClick={() => success('Settings saved', 'Changes apply across all facilities.')}>
              Save changes
            </Button>
          }
        />
      </div>

      <Card className="animate-rise" style={{ animationDelay: '60ms' }}>
        <CardHeader title="Organisation" subtitle="Shown on invoices, SMS and patient-facing pages" />
        <div className="mt-5 grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field label="Organisation name" required>
            <Input defaultValue="Rednoxx Health Ltd" />
          </Field>
          <Field label="Support email" required>
            <Input type="email" defaultValue="care@rednoxx.health" />
          </Field>
          <Field label="Support phone">
            <Input type="tel" defaultValue="+234 700 733 6699" />
          </Field>
          <Field label="Default timezone">
            <Select defaultValue="Africa/Lagos (WAT)">
              {['Africa/Lagos (WAT)', 'Africa/Accra (GMT)', 'Europe/London (BST)'].map((tz) => (
                <option key={tz}>{tz}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="animate-rise" style={{ animationDelay: '120ms' }}>
        <CardHeader title="Notifications" subtitle="What Rednoxx sends, and to whom" />
        <ul className="mt-4 max-w-2xl divide-y divide-hair/70">
          {NOTIFICATIONS.map((n) => (
            <li key={n.key} className="flex items-center justify-between gap-4 py-3.5">
              <span>
                <span className="block text-sm font-medium text-forest">{n.label}</span>
                <span className="block text-[13px] text-forest-400">{n.hint}</span>
              </span>
              <Toggle
                checked={toggles[n.key]}
                onChange={(next) => setToggles((t) => ({ ...t, [n.key]: next }))}
              />
            </li>
          ))}
        </ul>
      </Card>

      <Card className="animate-rise" style={{ animationDelay: '180ms' }}>
        <CardHeader title="Security" subtitle="Applies to every staff account" />
        <div className="mt-4 max-w-2xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium text-forest">Two-factor authentication</span>
              <span className="block text-[13px] text-forest-400">Required at sign-in on new devices</span>
            </span>
            <Toggle checked={twoFa} onChange={setTwoFa} />
          </div>
          <Field label="Session timeout" hint="Staff are signed out after this period of inactivity.">
            <Select defaultValue="15 minutes" className="max-w-52">
              {['5 minutes', '15 minutes', '30 minutes', '1 hour'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>
    </>
  )
}
