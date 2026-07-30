import { useState } from 'react'
import { Avatar, Button, Card, CardHeader, Field, Input, SelectMenu, useToast } from '@/components/ui'

export interface ProfileUser {
  name: string
  email: string
  phone?: string
  /** Role / job title. */
  jobTitle?: string
  department?: string
  /** Home facility — shown read-only (changed via admin, not self-service). */
  facility?: string
  /** Preferred UI language code. */
  language?: string
  avatarSrc?: string
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ha', label: 'Hausa' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'ig', label: 'Igbo' },
  { value: 'fr', label: 'French' },
]

/**
 * Self-service profile editor — the screen the user's account menu (UserMenu →
 * Profile) lands on. Prefilled from the passed-in user; Save confirms with a
 * toast and hands the updated values back via onSave. Reusable across every
 * shell so "edit my profile" is the same screen everywhere.
 */
export function ProfileSettings({
  user,
  onSave,
  className,
}: {
  user: ProfileUser
  /** Receives the edited profile; the block already toasts on save. */
  onSave?: (next: ProfileUser) => void
  className?: string
}) {
  const { success } = useToast()
  const [form, setForm] = useState<ProfileUser>(user)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const set = <K extends keyof ProfileUser>(key: K, value: ProfileUser[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const save = () => {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'Enter a valid email address, e.g. name@facility.health.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onSave?.(form)
    success('Profile saved', 'Your changes are visible across the workspace.')
  }

  return (
    <Card className={className}>
      <CardHeader
        title="Your profile"
        subtitle="How you appear to colleagues across the workspace"
        action={<Button size="sm" onClick={save}>Save changes</Button>}
      />

      <div className="mt-5 flex items-center gap-4">
        <Avatar name={form.name || user.name} src={form.avatarSrc} size="lg" />
        <div>
          <Button size="sm" variant="secondary" onClick={() => success('Photo updated', 'Your new photo is being processed.')}>
            Change photo
          </Button>
          <p className="mt-1.5 text-[12px] text-forest-400">JPG or PNG, up to 2 MB.</p>
        </div>
      </div>

      <div className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name}>
          <Input
            value={form.name}
            invalid={Boolean(errors.name)}
            onChange={(e) => set('name', e.target.value)}
          />
        </Field>
        <Field label="Work email" required error={errors.email}>
          <Input
            type="email"
            value={form.email}
            invalid={Boolean(errors.email)}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>
        <Field label="Phone" optional>
          <Input
            type="tel"
            value={form.phone ?? ''}
            placeholder="+234 800 000 0000"
            onChange={(e) => set('phone', e.target.value)}
          />
        </Field>
        <Field label="Job title">
          <Input value={form.jobTitle ?? ''} onChange={(e) => set('jobTitle', e.target.value)} />
        </Field>
        <Field label="Department">
          <Input value={form.department ?? ''} onChange={(e) => set('department', e.target.value)} />
        </Field>
        <Field label="Preferred language">
          <SelectMenu
            options={LANGUAGES}
            value={form.language ?? 'en'}
            onChange={(v) => set('language', v)}
          />
        </Field>
      </div>

      {user.facility && (
        <div className="mt-4 max-w-2xl border-t border-hair pt-4">
          <Field label="Home facility" hint="Set by your administrator — contact them to change it.">
            <Input value={user.facility} disabled readOnly />
          </Field>
        </div>
      )}
    </Card>
  )
}
