import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/** App-wide offline / connectivity banner (AC7). */
export function OfflineBanner() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div
      role="alert"
      className="flex items-center gap-2 border-b border-gold/30 bg-gold-soft px-4 py-2 text-[12px] font-medium text-gold-600 sm:px-6"
    >
      <WifiOff size={14} className="shrink-0" aria-hidden />
      You’re offline — the UI will keep working against local fixtures; reconnect to sync when a backend is available.
    </div>
  )
}
