import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { EmptyState } from './misc'
import { Pagination } from './Pagination'

export interface Column<Row> {
  key: string
  header: ReactNode
  align?: 'left' | 'right' | 'center'
  cell: (row: Row) => ReactNode
  headClassName?: string
  cellClassName?: string
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

export function DataTable<Row>({
  columns,
  rows,
  rowKey,
  rowId,
  rowClassName,
  onRowClick,
  empty,
  pageSize = 8,
}: {
  columns: Column<Row>[]
  rows: Row[]
  rowKey: (row: Row, index: number) => string
  rowId?: (row: Row, index: number) => string
  rowClassName?: (row: Row, index: number) => string
  onRowClick?: (row: Row) => void
  empty?: ReactNode
  /** Rows per page; the pager only appears when rows overflow one page. */
  pageSize?: number
}) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pages - 1)
  const pageRows = rows.slice(current * pageSize, (current + 1) * pageSize)

  return (
    <div>
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-hair">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-3 py-3 text-[13px] font-normal text-forest-400',
                    alignClass[col.align ?? 'left'],
                    col.headClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6">
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
            {pageRows.map((row, i) => {
              const index = current * pageSize + i
              return (
                <tr
                  key={rowKey(row, index)}
                  id={rowId?.(row, index)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-hair/60 transition-colors hover:bg-panel/40',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row, index),
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-4.5 text-sm text-forest-500 align-middle',
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

      {pages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 pt-3.5">
          <p className="text-[13px] text-navy-400">
            Showing{' '}
            <span className="tnum font-medium text-navy-600">
              {current * pageSize + 1}–{Math.min(rows.length, (current + 1) * pageSize)}
            </span>{' '}
            of <span className="tnum font-medium text-navy-600">{rows.length}</span>
          </p>
          <Pagination page={current} pages={pages} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
