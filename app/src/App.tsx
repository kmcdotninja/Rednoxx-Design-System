import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { ToastProvider } from '@/components/ui'
import { AppErrorBoundary } from './app/ErrorBoundary'
import { ALL_PERMISSION_CONTRIBUTIONS } from './app/contributions'
import { PermissionCatalogueProvider } from './app/permissions'
import { queryClient } from './app/queryClient'
import { router } from './app/router'

export function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PermissionCatalogueProvider contributions={ALL_PERMISSION_CONTRIBUTIONS}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </PermissionCatalogueProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}
