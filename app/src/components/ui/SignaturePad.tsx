import { useEffect, useRef, useState } from 'react'
import { Eraser, PenLine } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Draw-to-sign canvas for consents and sign-offs. Empty shows a “Sign here”
 * hint; once inked, Clear resets and `onChange` receives a PNG data URL
 * (or null when cleared).
 */
export function SignaturePad({
  onChange,
  height = 150,
  className,
}: {
  onChange?: (dataUrl: string | null) => void
  height?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [signed, setSigned] = useState(false)

  // Match the canvas bitmap to its CSS size × devicePixelRatio for crisp ink.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scale = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const ctx = canvas.getContext('2d')!
      ctx.scale(dpr, dpr)
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#171723'
    }
    scale()
  }, [])

  const point = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = point(e)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const next = point(e)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(next.x, next.y)
    ctx.stroke()
    last.current = next
    if (!signed) setSigned(true)
  }

  const onUp = () => {
    if (drawing.current && signed) onChange?.(canvasRef.current?.toDataURL('image/png') ?? null)
    drawing.current = false
    last.current = null
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSigned(false)
    onChange?.(null)
  }

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={signed ? 'Signature captured' : 'Signature pad — draw to sign'}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={cn(
          'block w-full touch-none rounded-2xl border border-dashed bg-white transition-colors duration-150',
          signed ? 'border-hair' : 'border-navy-200',
        )}
        style={{ height }}
      />
      {!signed && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-[13px] text-forest-300">
          <PenLine size={15} />
          Sign here
        </span>
      )}
      {/* Signature baseline */}
      <span aria-hidden className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-hair" />
      {signed && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-2 flex h-8 items-center gap-1.5 rounded-lg bg-panel px-2.5 text-[12px] font-medium text-forest-500 transition-colors hover:bg-hair"
        >
          <Eraser size={13} />
          Clear
        </button>
      )}
    </div>
  )
}
