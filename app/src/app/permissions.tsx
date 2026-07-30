/**
 * Unified permission catalogue + gate for App Shell RBAC composition.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui'
import { getSessionPermissions, subscribeSession } from './auth/session'
import type { PermissionContribution } from './stream-contract'

const CatalogueContext = createContext<PermissionContribution[]>([])

export function PermissionCatalogueProvider({
  contributions,
  children,
}: {
  contributions: PermissionContribution[]
  children: ReactNode
}) {
  const keys = useMemo(() => {
    const seen = new Map<string, string>()
    for (const mod of contributions) {
      for (const p of mod.permissions) {
        const prev = seen.get(p.key)
        if (prev && prev !== mod.stream) {
          console.warn(`[app-shell] duplicate permission key "${p.key}" from ${prev} and ${mod.stream}`)
        }
        seen.set(p.key, mod.stream)
      }
    }
    return seen
  }, [contributions])

  // Touch keys so the check runs; avoid unused-var lint.
  void keys.size

  return <CatalogueContext.Provider value={contributions}>{children}</CatalogueContext.Provider>
}

export function usePermissionCatalogue() {
  return useContext(CatalogueContext)
}

export function usePermission(permission?: string): boolean {
  const [perms, setPerms] = useState(getSessionPermissions)
  useEffect(() => subscribeSession(() => setPerms(getSessionPermissions())), [])
  if (!permission) return true
  return perms.includes(permission)
}

export function usePermissions(): string[] {
  const [perms, setPerms] = useState(getSessionPermissions)
  useEffect(() => subscribeSession(() => setPerms(getSessionPermissions())), [])
  return perms
}

/** Hide children when the signed-in session lacks the permission. */
export function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission?: string
  children: ReactNode
  fallback?: ReactNode
}) {
  const allowed = usePermission(permission)
  if (!allowed) return <>{fallback}</>
  return <>{children}</>
}

export function ForbiddenPage({ missing }: { missing?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-panel text-forest-300">
        <Lock size={20} />
      </span>
      <h1 className="text-[20px] font-medium text-forest">You don’t have access</h1>
      <p className="max-w-md text-[13px] text-forest-400">
        {missing
          ? `This screen requires “${missing}”. Ask an administrator if you need it.`
          : 'Your role does not include this area of the product.'}
      </p>
      <div className="mt-2 flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Link to="/login">
          <Button size="sm">Sign in as another user</Button>
        </Link>
      </div>
    </div>
  )
}

/** Route-bound Forbidden page reads `?missing=` from the guard redirect. */
export function ForbiddenRoutePage() {
  const { missing } = useSearch({ strict: false }) as { missing?: string }
  return <ForbiddenPage missing={missing} />
}
