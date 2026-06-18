import type { Tone } from '@/types/slide'

/** Maps a semantic Tone to its CSS-var colour from index.css @theme.
 *  Use this everywhere (charts, cards, badges, bullets) so colour semantics
 *  stay consistent: cyan = spatial, violet = frequency, indigo = hybrid. */
export const TONE_COLOR: Record<Tone, string> = {
  spatial: 'var(--color-spatial)',
  frequency: 'var(--color-frequency)',
  hybrid: 'var(--color-hybrid)',
  neutral: 'var(--color-ink-soft)',
  good: 'var(--color-good)',
  warn: 'var(--color-warn)',
  bad: 'var(--color-bad)',
}

/** Soft / lighter variant where available (falls back to the base colour). */
export const TONE_COLOR_SOFT: Record<Tone, string> = {
  spatial: 'var(--color-spatial-soft)',
  frequency: 'var(--color-frequency-soft)',
  hybrid: 'var(--color-hybrid-soft)',
  neutral: 'var(--color-ink-soft)',
  good: 'var(--color-good)',
  warn: 'var(--color-warn)',
  bad: 'var(--color-bad)',
}

export function toneColor(tone: Tone | undefined): string {
  return TONE_COLOR[tone ?? 'neutral']
}

/** A translucent fill derived from a tone, for chart areas / card glows.
 *  Returns a `color-mix` string so it works against any CSS var. */
export function toneFill(tone: Tone | undefined, percent = 16): string {
  return `color-mix(in srgb, ${toneColor(tone)} ${percent}%, transparent)`
}
