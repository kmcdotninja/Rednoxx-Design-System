/**
 * Demo session for the design-system port.
 *
 * The product repo authenticates against `/api/v1/auth/*` (see its
 * `lib/apiClient.ts` + `app/auth/api.ts`); this repo has no backend, so the
 * shell runs permanently signed in as the HIM demo user. The exported API is
 * kept identical to the product module so ProductChrome, permissions and the
 * route guards port unchanged.
 */

export interface UiSession {
  email: string
  name: string
}

const DEMO_USER: UiSession = {
  name: 'Umair Ibrahim',
  email: 'umair.ibrahim@rednoxx.example',
}

/** Every permission the ported him-intake stream (and the path-fallback
 *  guards) can ask for. Other streams were not ported. */
const DEMO_PERMISSIONS = ['him.intake.view', 'him.records.view']

let currentSession: UiSession | null = DEMO_USER

function notify() {
  window.dispatchEvent(new Event('rednoxx:session'))
}

export async function loadSession(): Promise<UiSession | null> {
  return currentSession
}

export async function ensureSessionLoaded(): Promise<UiSession | null> {
  return currentSession
}

export function peekSession(): UiSession | null {
  return currentSession
}

export function getSession(): UiSession | null {
  return currentSession
}

export function isAuthenticated(): boolean {
  return currentSession !== null
}

export async function login(email: string, _password: string): Promise<UiSession> {
  currentSession = { ...DEMO_USER, email }
  notify()
  return currentSession
}

export function getSessionPermissions(): string[] {
  return currentSession ? DEMO_PERMISSIONS : []
}

export async function signOut(): Promise<void> {
  // Demo stub: "signing out" returns to the entry hall (via /login → /start)
  // but keeps the demo identity so guarded screens stay explorable.
  notify()
}

export async function refreshSession(): Promise<UiSession | null> {
  return loadSession()
}

export function subscribeSession(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('rednoxx:session', onChange)
  return () => window.removeEventListener('rednoxx:session', onChange)
}
