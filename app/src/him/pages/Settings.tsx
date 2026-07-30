import { ProfileSettings, type ProfileUser } from '@/components/blocks'
import { HimPageHeader } from '../HimShell'
import { useRole } from '../rbac'

/** Derive a plausible work email from the persona's name (mock data). */
function emailFor(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/^dr\.?\s*/, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .replace(/\s+/g, '.')
  return `${slug}@rednoxx.health`
}

/**
 * HIM "My profile" screen — the UserMenu → Profile destination. Built from the
 * active RBAC persona and the shared ProfileSettings block, so editing your
 * profile is the same experience as in the Care workspace.
 */
export function HimSettingsPage() {
  const { persona } = useRole()
  const user: ProfileUser = {
    name: persona.name,
    email: emailFor(persona.name),
    jobTitle: persona.title,
    department: persona.department,
    facility: persona.facility,
    language: 'en',
  }
  return (
    <>
      <div className="animate-rise">
        <HimPageHeader title="My profile" subtitle="Your account details across the HIM workspace" />
      </div>
      <ProfileSettings user={user} className="animate-rise" />
    </>
  )
}
