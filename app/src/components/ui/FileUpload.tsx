import { useRef, useState, type DragEvent } from 'react'
import { CircleCheck, FileText, RotateCw, Upload, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface UploadItem {
  id: number
  name: string
  size: number
  status: 'uploading' | 'complete' | 'error'
  progress: number
  error?: string
  /** Transport errors can be retried; validation errors (size) cannot. */
  retryable?: boolean
  /** Simulated transport failure point for this attempt, if any. */
  failAt?: number
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

let nextId = 1

/**
 * Interactive file upload with the full state machine: idle drop target,
 * drag-over highlight, per-file upload progress, and complete/error rows.
 * Uploads are simulated client-side; files over `maxSizeMB` fail so the
 * error state is reachable.
 */
export function FileUpload({
  label = 'Upload file',
  caption,
  accept,
  maxSizeMB = 10,
  multiple = true,
  onChange,
  className,
}: {
  label?: string
  caption?: string
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
  /** Called with the names of successfully uploaded files. */
  onChange?: (names: string[]) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<UploadItem[]>([])
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)

  const emit = (list: UploadItem[]) =>
    onChange?.(list.filter((f) => f.status === 'complete').map((f) => f.name))

  const startUpload = (id: number) => {
    const tick = () => {
      setItems((list) => {
        const next = list.map((f) => {
          if (f.id !== id || f.status !== 'uploading') return f
          const progress = Math.min(100, f.progress + 8 + Math.random() * 18)
          if (f.failAt !== undefined && progress >= f.failAt) {
            return {
              ...f,
              status: 'error' as const,
              error: 'Upload failed — check your connection',
              retryable: true,
            }
          }
          return progress >= 100 ? { ...f, progress: 100, status: 'complete' as const } : { ...f, progress }
        })
        const item = next.find((f) => f.id === id)
        if (item?.status === 'uploading') setTimeout(tick, 120 + Math.random() * 160)
        else emit(next)
        return next
      })
    }
    setTimeout(tick, 150)
  }

  /** ~1 in 5 attempts hits a simulated network failure so retry is reachable. */
  const transportFailure = () => (Math.random() < 0.2 ? 40 + Math.random() * 45 : undefined)

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files).slice(0, multiple ? undefined : 1)
    const added: UploadItem[] = incoming.map((file) => {
      const tooBig = file.size > maxSizeMB * 1024 * 1024
      return {
        id: nextId++,
        name: file.name,
        size: file.size,
        status: tooBig ? ('error' as const) : ('uploading' as const),
        progress: 0,
        error: tooBig ? `Larger than ${maxSizeMB} MB` : undefined,
        retryable: false,
        failAt: tooBig ? undefined : transportFailure(),
      }
    })
    setItems((list) => (multiple ? [...list, ...added] : added))
    added.filter((f) => f.status === 'uploading').forEach((f) => startUpload(f.id))
  }

  const remove = (id: number) =>
    setItems((list) => {
      const next = list.filter((f) => f.id !== id)
      emit(next)
      return next
    })

  const retry = (id: number) => {
    setItems((list) =>
      list.map((f) =>
        f.id === id
          ? { ...f, status: 'uploading', progress: 0, error: undefined, failAt: transportFailure() }
          : f,
      ),
    )
    startUpload(id)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          dragDepth.current++
          setDragging(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          dragDepth.current--
          if (dragDepth.current <= 0) setDragging(false)
        }}
        onDrop={onDrop}
        className={cn(
          'group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 py-3.5 text-left',
          'transition-[border-color,background-color] duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50 focus-visible:ring-offset-1',
          dragging
            ? 'border-azure bg-azure-50'
            : 'border-hair bg-panel/50 hover:border-forest-300 hover:bg-azure-50/40',
        )}
      >
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-card transition-colors',
            dragging ? 'text-azure' : 'text-forest-400 group-hover:text-forest',
          )}
        >
          <Upload size={18} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-forest">
            {dragging ? 'Drop to upload' : label}
          </span>
          <span className="block truncate text-xs text-forest-400">
            {caption ?? `Drag & drop or click · up to ${maxSizeMB} MB${multiple ? ' · multiple files' : ''}`}
          </span>
        </span>
      </button>

      {items.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {items.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-2xl border border-hair bg-white px-3.5 py-2.5"
            >
              <FileText size={16} className="shrink-0 text-forest-300" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-[13px] font-medium text-forest">{f.name}</p>
                  <p className="tnum shrink-0 text-[11px] text-forest-300">{formatSize(f.size)}</p>
                </div>
                {f.status === 'uploading' && (
                  <div
                    role="progressbar"
                    aria-valuenow={Math.round(f.progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Uploading ${f.name}`}
                    className="mt-1.5 h-1 overflow-hidden rounded-full bg-panel"
                  >
                    <div
                      className="h-full rounded-full bg-azure transition-[width] duration-150"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
                {f.status === 'error' && (
                  <p className="mt-0.5 text-[12px] font-medium text-rose-ink">{f.error}</p>
                )}
              </div>
              {f.status === 'uploading' && (
                <span className="tnum shrink-0 text-[11px] text-forest-400">{Math.round(f.progress)}%</span>
              )}
              {f.status === 'complete' && <CircleCheck size={16} className="shrink-0 text-mint" aria-label="Uploaded" />}
              {f.status === 'error' && f.retryable && (
                <button
                  type="button"
                  onClick={() => retry(f.id)}
                  aria-label={`Retry ${f.name}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-forest-400 transition-colors hover:bg-panel hover:text-forest"
                >
                  <RotateCw size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(f.id)}
                aria-label={`Remove ${f.name}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-forest-400 transition-colors hover:bg-panel hover:text-forest"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
