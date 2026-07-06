import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Shell } from '@/showcase/Shell'
import { Overview } from '@/showcase/pages/Overview'
import { Foundations } from '@/showcase/pages/Foundations'
import { Templates } from '@/showcase/pages/Templates'
import { ComponentPage } from '@/showcase/pages/ComponentPage'

/** The demo carries the charting bundle — load it only when visited. */
const DemoApp = lazy(async () => ({
  default: (await import('@/showcase/demo/DemoApp')).DemoApp,
}))

/** Block docs render live chart/demo compositions — also lazy. */
const BlockPage = lazy(async () => ({
  default: (await import('@/showcase/pages/BlockPage')).BlockPage,
}))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-hair border-t-navy" />
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Overview />} />
            <Route path="/foundations" element={<Foundations />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/components" element={<Navigate to="/components/button" replace />} />
            <Route path="/components/:slug" element={<ComponentPage />} />
            <Route path="/blocks" element={<Navigate to="/blocks/patient-banner" replace />} />
            <Route path="/blocks/:slug" element={<BlockPage />} />
          </Route>
          <Route path="/demo/*" element={<DemoApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
