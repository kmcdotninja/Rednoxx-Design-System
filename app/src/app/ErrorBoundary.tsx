import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui'

interface State {
  error: Error | null
}

/** Top-level error boundary for the composition root. */
export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[app-shell] render error', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas px-6 text-center">
        <h1 className="text-[20px] font-medium text-forest">Something went wrong</h1>
        <p className="max-w-md text-[13px] text-forest-400">
          The app shell caught an unexpected error. Reload to continue, or return to sign-in.
        </p>
        <pre className="max-w-lg overflow-auto rounded-xl bg-panel px-3 py-2 text-left text-[11px] text-rose-ink">
          {this.state.error.message}
        </pre>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
          <Button size="sm" onClick={() => { window.location.href = '/login' }}>
            Sign in
          </Button>
        </div>
      </div>
    )
  }
}
