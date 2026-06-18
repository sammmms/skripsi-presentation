import type { SectionId } from '@/types/slide'
import { SECTION_BY_ID } from '@/data/sections'
import { Icon } from '@/lib/icon'

export function SectionBadge({
  sectionId,
  className = '',
}: {
  sectionId: SectionId
  className?: string
}) {
  const section = SECTION_BY_ID[sectionId]
  const accent = section.accent // e.g. 'var(--color-sec-results)'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 py-1 pl-2 pr-3 text-xs font-medium text-ink-soft ${className}`}
    >
      <span
        className="flex size-5 items-center justify-center rounded-full"
        style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)`, color: accent }}
      >
        <Icon name={section.icon} className="size-3.5" />
      </span>
      <span style={{ color: accent }} className="font-mono">
        {section.no}
      </span>
      <span>{section.label}</span>
    </span>
  )
}
