import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="tnum text-[13px] font-medium text-forest-300">404</p>
      <h1 className="text-[20px] font-medium text-forest">Page not found</h1>
      <p className="max-w-md text-[13px] text-forest-400">
        That URL isn’t mapped to any stream route. Check the path or use the navigation.
      </p>
      {/* Design-system port: Admin (/admin) and Care (/care) homes live in the
          product repo, so this 404 routes to the surfaces ported here. */}
      <div className="mt-2 flex gap-2">
        <Link to="/start"><Button size="sm">Entry hall</Button></Link>
        <Link to="/design"><Button size="sm" variant="secondary">Design system</Button></Link>
        <Link to="/him"><Button size="sm" variant="secondary">HIM home</Button></Link>
      </div>
    </div>
  )
}
