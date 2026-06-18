import type { TableColumn, TableSpec } from '@/types/slide'
import { toneColor, toneFill } from '@/lib/tone'
import { formatCell } from '@/lib/format'

function alignClass(align: TableColumn['align']): string {
  if (align === 'right') return 'text-right'
  if (align === 'center') return 'text-center'
  return 'text-left'
}

export function DataTable({ table, className = '' }: { table: TableSpec; className?: string }) {
  const { columns, rows, caption, highlightRows = [] } = table
  const highlighted = new Set(highlightRows)
  const [firstCol, ...restCols] = columns

  return (
    <div className={className}>
      {/* Desktop / tablet: real table -------------------------------------- */}
      <div className="hidden overflow-hidden rounded-card border border-border md:block">
        <div className="max-h-full overflow-auto no-scrollbar">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface-3/95 backdrop-blur">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`whitespace-nowrap border-b border-border-strong px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-ink-soft ${alignClass(
                      col.align,
                    )}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const isHi = highlighted.has(ri)
                return (
                  <tr
                    key={ri}
                    className={
                      isHi
                        ? 'bg-spatial/10'
                        : ri % 2 === 1
                          ? 'bg-surface-2/30'
                          : 'bg-transparent'
                    }
                  >
                    {columns.map((col, ci) => {
                      const isNumeric = col.align === 'right'
                      return (
                        <td
                          key={col.key}
                          className={`border-b border-border/60 px-4 py-2.5 ${alignClass(
                            col.align,
                          )} ${isNumeric ? 'font-mono tabular-nums' : ''} ${
                            isHi ? 'font-medium text-ink' : 'text-ink-soft'
                          }`}
                          style={
                            isHi && ci === 0
                              ? { boxShadow: `inset 3px 0 0 0 ${toneColor('spatial')}` }
                              : undefined
                          }
                        >
                          {formatCell(row[col.key] ?? '')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: stacked cards --------------------------------------------- */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row, ri) => {
          const isHi = highlighted.has(ri)
          return (
            <div
              key={ri}
              className="surface-card overflow-hidden p-4"
              style={
                isHi
                  ? {
                      boxShadow: `inset 3px 0 0 0 ${toneColor('spatial')}`,
                      background: toneFill('spatial', 8),
                    }
                  : undefined
              }
            >
              {firstCol && (
                <div className="mb-2 font-display text-base font-semibold text-ink">
                  {formatCell(row[firstCol.key] ?? '')}
                </div>
              )}
              <dl className="flex flex-col gap-1">
                {restCols.map((col) => (
                  <div
                    key={col.key}
                    className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1 last:border-0"
                  >
                    <dt className="text-xs uppercase tracking-wide text-muted">{col.label}</dt>
                    <dd className="font-mono text-sm tabular-nums text-ink-soft">
                      {formatCell(row[col.key] ?? '')}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}
      </div>

      {caption && <p className="mt-3 text-center text-sm text-muted">{caption}</p>}
    </div>
  )
}
