import type { ReactNode } from 'react'
import { Toaster, toast as sonner } from 'sonner'

type Tone = 'success' | 'error' | 'info'

interface ToastApi {
  toast: (t: { tone?: Tone; title: string; description?: string }) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const api: ToastApi = {
  toast: ({ tone = 'info', title, description }) => api[tone](title, description),
  success: (title, description) => sonner.success(title, { description }),
  error: (title, description) => sonner.error(title, { description }),
  info: (title, description) => sonner.info(title, { description }),
}

/** All toasts/alerts are rendered by sonner (emilkowalski/sonner). This hook
 *  keeps the app's original `useToast().success(title, description)` API. */
export function useToast(): ToastApi {
  return api
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        gap={10}
        toastOptions={{
          style: {
            fontFamily: 'var(--font-sans)',
            borderRadius: 'var(--radius-3xl)',
            border: '1px solid var(--color-hair)',
            boxShadow: 'var(--shadow-pop)',
            color: 'var(--color-navy)',
          },
        }}
      />
    </>
  )
}
