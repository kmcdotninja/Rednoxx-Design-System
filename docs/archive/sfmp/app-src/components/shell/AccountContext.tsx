import { createContext, useContext, type ComponentProps, type MouseEventHandler } from 'react'
import { Button } from '@/components/ui'
import { useOnboardingDrawer } from './OnboardingDrawerContext'
import type { Domain, OnboardStatus } from '@/data/types'

export interface AccountInfo {
  domain: Domain
  company: string
  contactName?: string
  onboarding: OnboardStatus
  verified: boolean
  /** A built-in demo interface (never gated) vs a user-created account. */
  isDemo: boolean
}

export const AccountContext = createContext<AccountInfo | null>(null)

export function useAccount(): AccountInfo {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within AppShell')
  return ctx
}

/**
 * Whether the active institution is blocked from restricted actions (creating
 * projects, selecting deals…). Blocked until the company is onboarded/verified.
 */
export function useVerifyGuard() {
  const { verified } = useAccount()
  const { openVerifyPrompt } = useOnboardingDrawer()
  const locked = !verified
  const requireVerified = (fn: () => void, action?: string) => () => {
    if (locked) {
      openVerifyPrompt(action)
      return
    }
    fn()
  }
  return { locked, requireVerified }
}

/**
 * A drop-in <Button> that behaves normally, but for an un-onboarded account
 * intercepts the click and opens the "onboarding required" modal instead.
 */
export function GatedButton({
  onClick,
  action,
  ...rest
}: ComponentProps<typeof Button> & { action?: string }) {
  const { locked } = useVerifyGuard()
  const { openVerifyPrompt } = useOnboardingDrawer()

  const handle: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (locked) {
      openVerifyPrompt(action)
      return
    }
    onClick?.(e)
  }

  return <Button {...rest} onClick={handle} />
}
