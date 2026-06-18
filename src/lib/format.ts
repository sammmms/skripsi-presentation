/** Indonesian-style number formatting: comma as decimal separator.
 *  e.g. fmt(0.969, 3) -> "0,969", fmt(0.116, 3, true) -> "+0,116". */
export function fmt(value: number, decimals = 0, signed = false): string {
  const fixed = Math.abs(value).toFixed(decimals).replace('.', ',')
  const sign = value < 0 ? '−' : signed ? '+' : ''
  return `${sign}${fixed}`
}

/** Formats a cell value for the data table (numbers get comma separators,
 *  strings pass through verbatim — they may already be pre-formatted). */
export function formatCell(value: string | number): string {
  if (typeof value === 'number') return fmt(value, 3)
  return value
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}
