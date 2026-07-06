import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { endSession } from '@/lib/session'

const TIMEOUT_MS = 5 * 60 * 1000 // 5-minute inactivity timeout (per SFMP standards)
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'] as const

/**
 * Activity-aware session watchdog: after 5 minutes of inactivity inside an
 * authenticated shell, the session ends and the user is returned to sign-in.
 * Activity tracking is throttled to at most once per second.
 */
export function useSessionTimeout() {
  const navigate = useNavigate()
  const lastActivity = useRef(Date.now())
  const throttled = useRef(0)

  useEffect(() => {
    const touch = () => {
      const now = Date.now()
      if (now - throttled.current < 1000) return
      throttled.current = now
      lastActivity.current = now
    }
    for (const ev of ACTIVITY_EVENTS) window.addEventListener(ev, touch, { passive: true })

    const interval = window.setInterval(() => {
      if (Date.now() - lastActivity.current >= TIMEOUT_MS) {
        endSession()
        navigate('/login', { replace: true })
      }
    }, 30_000)

    return () => {
      for (const ev of ACTIVITY_EVENTS) window.removeEventListener(ev, touch)
      window.clearInterval(interval)
    }
  }, [navigate])
}
