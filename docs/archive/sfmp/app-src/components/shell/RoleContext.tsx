import { createContext, useContext } from 'react'
import type { Domain, SubRole } from '@/data/types'

/** The active session identity within an AppShell: which domain interface is
 *  open and which maker-checker persona (sub-role) is acting. */
export interface Session {
  domain: Domain
  subRole: SubRole
  setSubRole: (subRole: SubRole) => void
}

export const RoleContext = createContext<Session | null>(null)

export function useSession(): Session {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useSession must be used within AppShell')
  return ctx
}

export function useDomain(): Domain {
  return useSession().domain
}

export function useSubRole(): SubRole {
  return useSession().subRole
}
