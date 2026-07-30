import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from './Card'
import { Checkbox } from './Checkbox'
import { EmptyState } from './misc'
import { Pagination } from './Pagination'
import { SelectMenu } from './SelectMenu'
import { Skeleton } from './Skeleton'

export interface Column<Row> {
  key: string
  header: ReactNode
  align?: 'left' | 'right' | 'center'
  cell: (row: Row) => ReactNode
  headClassName?: string
  cellClassName?: string
  /** Column width for the <col> group, e.g. '160px' or '20%'. */
  width?: string
  /** Makes the header a sort control. Numbers sort numerically, text with localeCompare. */
  sortable?: boolean
  /** The value to sort on; defaults to `row[key]` when that is a string or number. */
  sortValue?: (row: Row) => string | number
}

export type Density = 'compact' | 'default' | 'relaxed'

/** Row padding and type size per density — the header follows the body. */
const DENSITY: Record<Density, { head: string; cell: string; text: string }> = {
  compact: { head: 'py-2', cell: 'py-2', text: 'text-[13px]' },
  default: { head: 'py-3', cell: 'py-4.5', text: 'text-sm' },
  relaxed: { head: 'py-4', cell: 'py-6', text: 'text-sm' },
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

/** `justify-*` mirror of `alignClass`, for the flex sort-header button. */
const justifyClass = {
  left: 'justify-start',
  right: 'justify-end',
  center: 'justify-center',
}

export interface SortState {
  key: string
  dir: 'asc' | 'desc'
}

/** Fallback sort key — the raw field at `column.key` when it is a primitive. */
function fieldValue<Row>(row: Row, key: string): string | number {
  const raw = (row as Record<string, unknown>)[key]
  if (typeof raw === 'number') return raw
  return typeof raw === 'string' ? raw : ''
}

export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  rowId,
  rowClassName,
  onRowClick,
  empty,
  caption,
  container,
  density = 'default',
  zebra,
  hoverable = true,
  headTone = 'plain',
  stickyHeader,
  maxHeight,
  minWidth = 640,
  loading,
  loadingRows,
  pagination = 'auto',
  pageSize: pageSizeProp = 8,
  pageSizeOptions,
  showRange = true,
  defaultSort,
  onSortChange,
  selectable,
  selectedKeys,
  onSelectionChange,
}: {
  columns: Column<Row>[]
  rows: Row[]
  rowKey: (row: Row, index: number) => string
  rowId?: (row: Row, index: number) => string
  rowClassName?: (row: Row, index: number) => string
  onRowClick?: (row: Row) => void
  empty?: ReactNode
  /** Screen-reader name for the table — announced before the first cell. */
  caption?: string
  /** Wraps the table and its footer in a bordered surface, so it reads as one object. */
  container?: boolean
  /** Row height: `compact` for dense worklists, `relaxed` for short summary tables. */
  density?: Density
  /** Alternating row fill — helps the eye track across wide tables. */
  zebra?: boolean
  /** Row hover tint; turn it off for read-only tables with no row action. */
  hoverable?: boolean
  /** `panel` fills the header row, separating it from the body on long scrolls. */
  headTone?: 'plain' | 'panel'
  /** Pins the header while the body scrolls — needs `maxHeight`. */
  stickyHeader?: boolean
  /** Caps the scroll area, e.g. 360 or '50vh'. */
  maxHeight?: number | string
  /** Width below which the table scrolls horizontally instead of squashing. */
  minWidth?: number
  /** Skeleton rows in place of data — the header and chrome stay put. */
  loading?: boolean
  /** How many skeleton rows to draw; defaults to the page size. */
  loadingRows?: number
  /** `auto` pages only on overflow, `always` keeps the footer, `none` renders every row. */
  pagination?: 'auto' | 'always' | 'none'
  /** Rows per page; the pager only appears when rows overflow one page. */
  pageSize?: number
  /** Offers a rows-per-page picker in the footer, e.g. [10, 25, 50]. */
  pageSizeOptions?: number[]
  /** The “Showing 1–10 of 42” summary beside the pager. */
  showRange?: boolean
  /** Initial sort for columns marked `sortable`. */
  defaultSort?: SortState
  /** Notified whenever the sort changes — for server-side sorting or analytics. */
  onSortChange?: (sort: SortState | null) => void
  /** Adds a leading checkbox column for row selection (keys come from rowKey). */
  selectable?: boolean
  /** Controlled selection — the rowKey of each selected row. Omit to let the table own it. */
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
}) {
  const [page, setPage] = useState(0)
  const [chosenPageSize, setChosenPageSize] = useState(pageSizeProp)
  // Only the rows-per-page picker owns page size; without it the prop stays authoritative.
  const pageSize = pageSizeOptions?.length ? chosenPageSize : pageSizeProp
  const [sort, setSort] = useState<SortState | null>(defaultSort ?? null)
  const [innerSelection, setInnerSelection] = useState<string[]>([])

  const d = DENSITY[density]
  const sortedColumn = sort ? columns.find((c) => c.key === sort.key && c.sortable) : undefined

  const sorted = useMemo(() => {
    if (!sort || !sortedColumn) return rows
    const read = sortedColumn.sortValue ?? ((row: Row) => fieldValue(row, sortedColumn.key))
    const factor = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const av = read(a)
      const bv = read(b)
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * factor
    })
  }, [rows, sort, sortedColumn])

  const paged = pagination !== 'none'
  const pages = paged ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const current = Math.min(page, pages - 1)
  const pageRows = paged ? sorted.slice(current * pageSize, (current + 1) * pageSize) : sorted

  const toggleSort = (column: Column<Row>) => {
    const next: SortState | null =
      sort?.key !== column.key
        ? { key: column.key, dir: 'asc' }
        : sort.dir === 'asc'
          ? { key: column.key, dir: 'desc' }
          : null
    setSort(next)
    setPage(0)
    onSortChange?.(next)
  }

  const selectedList = selectedKeys ?? innerSelection
  const selected = new Set(selectedList)
  const commitSelection = (keys: string[]) => {
    if (selectedKeys === undefined) setInnerSelection(keys)
    onSelectionChange?.(keys)
  }
  const allKeys = sorted.map((r, i) => rowKey(r, i))
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k))
  const someSelected = allKeys.some((k) => selected.has(k))
  const toggleAll = () => commitSelection(allSelected ? [] : allKeys)
  const toggleOne = (key: string) => {
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    commitSelection([...next])
  }
  // The selection column narrows the min-width slightly; keep the same feel.
  const colCount = columns.length + (selectable ? 1 : 0)

  const skeletonCount = Math.max(1, loadingRows ?? (paged ? Math.min(pageSize, 5) : 5))
  const showFooter =
    paged && !loading && (pages > 1 || pagination === 'always' || (pageSizeOptions?.length ?? 0) > 0)

  const body = (
    <div className={cn(container && 'min-w-0')}>
      <div
        className={cn('overflow-x-auto', maxHeight != null && 'overflow-y-auto')}
        style={maxHeight != null ? { maxHeight } : undefined}
      >
        <table
          aria-busy={loading || undefined}
          className="w-full border-collapse"
          style={{ minWidth }}
        >
          {caption && <caption className="sr-only">{caption}</caption>}
          {columns.some((c) => c.width) && (
            <colgroup>
              {selectable && <col style={{ width: '2.75rem' }} />}
              {columns.map((col) => (
                <col key={col.key} style={col.width ? { width: col.width } : undefined} />
              ))}
            </colgroup>
          )}
          <thead>
            <tr
              className={cn('border-b border-hair', headTone === 'panel' && 'bg-panel')}
            >
              {selectable && (
                <th
                  scope="col"
                  className={cn(
                    'w-0 pl-5 pr-1 align-middle',
                    d.head,
                    stickyHeader && 'sticky top-0 z-10',
                    stickyHeader && (headTone === 'panel' ? 'bg-panel' : 'bg-white'),
                  )}
                >
                  <Checkbox
                    ariaLabel="Select all rows"
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col, ci) => {
                const active = sort?.key === col.key
                const align = col.align ?? 'left'
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      col.sortable
                        ? active
                          ? sort?.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                    className={cn(
                      'whitespace-nowrap text-[13px] font-normal text-forest-400',
                      d.head,
                      ci === 0 && !selectable ? 'pl-5 pr-4' : 'px-4',
                      ci === columns.length - 1 && 'pr-5',
                      alignClass[align],
                      stickyHeader && 'sticky top-0 z-10',
                      stickyHeader && (headTone === 'panel' ? 'bg-panel' : 'bg-white'),
                      col.headClassName,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className={cn(
                          'group -mx-1 flex w-full items-center gap-1.5 px-1 py-1 transition-colors',
                          'hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
                          justifyClass[align],
                          active && 'font-medium text-forest',
                        )}
                      >
                        {col.header}
                        {active ? (
                          sort?.dir === 'asc' ? (
                            <ArrowUp size={13} aria-hidden />
                          ) : (
                            <ArrowDown size={13} aria-hidden />
                          )
                        ) : (
                          <ChevronsUpDown
                            size={13}
                            aria-hidden
                            className="text-navy-200 transition-colors group-hover:text-forest-400"
                          />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: skeletonCount }).map((_, i) => (
                <tr key={`skeleton_${i}`} className="border-b border-hair/60">
                  {selectable && (
                    <td className={cn('w-0 pl-5 pr-1 align-middle', d.cell)}>
                      <Skeleton className="h-4 w-4" />
                    </td>
                  )}
                  {columns.map((col, ci) => (
                    <td
                      key={col.key}
                      className={cn(
                        d.cell,
                        ci === 0 && !selectable ? 'pl-5 pr-4' : 'px-4',
                        ci === columns.length - 1 && 'pr-5',
                      )}
                    >
                      <Skeleton className={cn('h-3.5', ci === 0 ? 'w-32' : 'w-20')} />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-5 py-6">
                  {empty ?? (
                    <EmptyState
                      compact
                      variant="search"
                      title="Nothing here yet"
                      description="Items will show up here once they're added."
                    />
                  )}
                </td>
              </tr>
            )}
            {!loading &&
              pageRows.map((row, i) => {
                const index = current * pageSize + i
                const key = rowKey(row, index)
                const isSelected = selected.has(key)
                return (
                  <tr
                    key={key}
                    id={rowId?.(row, index)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      'border-b border-hair/60 transition-colors',
                      zebra && index % 2 === 1 && 'bg-panel/40',
                      isSelected ? 'bg-azure-50/60' : hoverable && 'hover:bg-panel/40',
                      onRowClick && 'cursor-pointer',
                      rowClassName?.(row, index),
                    )}
                  >
                    {selectable && (
                      <td
                        className={cn('w-0 pl-5 pr-1 align-middle', d.cell)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          ariaLabel="Select row"
                          checked={isSelected}
                          onChange={() => toggleOne(key)}
                        />
                      </td>
                    )}
                    {columns.map((col, ci) => (
                      <td
                        key={col.key}
                        className={cn(
                          'whitespace-nowrap align-middle text-forest-500',
                          d.cell,
                          d.text,
                          ci === 0 && !selectable ? 'pl-5 pr-4' : 'px-4',
                          ci === columns.length - 1 && 'pr-5',
                          alignClass[col.align ?? 'left'],
                          col.cellClassName,
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {showFooter && (
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-3 px-5',
            container ? 'border-t border-hair py-3' : 'pt-3.5',
          )}
        >
          <div className="flex flex-wrap items-center gap-4">
            {showRange && (
              <p className="text-[13px] text-navy-400">
                Showing{' '}
                <span className="tnum font-medium text-navy-600">
                  {sorted.length === 0
                    ? 0
                    : `${current * pageSize + 1}–${Math.min(sorted.length, (current + 1) * pageSize)}`}
                </span>{' '}
                of <span className="tnum font-medium text-navy-600">{sorted.length}</span>
              </p>
            )}
            {pageSizeOptions && pageSizeOptions.length > 0 && (
              <label className="flex items-center gap-2 text-[13px] text-navy-400">
                Rows
                <SelectMenu
                  size="sm"
                  value={String(pageSize)}
                  onChange={(v) => {
                    setChosenPageSize(Number(v))
                    setPage(0)
                  }}
                  options={pageSizeOptions.map((o) => ({ value: String(o), label: String(o) }))}
                  className="w-20"
                />
              </label>
            )}
          </div>
          <Pagination page={current} pages={pages} onChange={setPage} />
        </div>
      )}
    </div>
  )

  if (!container) return body
  return (
    <Card pad={false} className="overflow-hidden">
      {body}
    </Card>
  )
}
