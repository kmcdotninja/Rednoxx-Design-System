import { redirect } from '@tanstack/react-router'
import { ALL_NAV_CONTRIBUTIONS } from '../contributions'
import { ensureSessionLoaded, getSessionPermissions } from './session'

export async function requireAuth(pathname: string) {
  const session = await ensureSessionLoaded()
  if (session) return
  throw redirect({ to: '/login', search: { redirect: pathname }, replace: true })
}

export function matchPermissionForPath(pathname: string): string | undefined {
  const matches = ALL_NAV_CONTRIBUTIONS.filter(
    (n) => n.permission && (pathname === n.to || pathname.startsWith(`${n.to}/`)),
  ).sort((a, b) => b.to.length - a.to.length)

  if (matches[0]?.permission) return matches[0].permission

  if (pathname.startsWith('/admin')) return 'dashboard.view'
  if (pathname.startsWith('/care')) return 'care.view'
  if (pathname.startsWith('/him')) return 'him.records.view'
  return undefined
}

export function requirePermission(permission: string) {
  if (getSessionPermissions().includes(permission)) return
  throw redirect({ to: '/forbidden', search: { missing: permission }, replace: true })
}

export async function authBeforeLoad({ location }: { location: { pathname: string } }) {
  await requireAuth(location.pathname)
}

export async function authAndPermissionBeforeLoad({
  location,
}: {
  location: { pathname: string }
}) {
  await requireAuth(location.pathname)
  const required = matchPermissionForPath(location.pathname)
  if (required) requirePermission(required)
}
