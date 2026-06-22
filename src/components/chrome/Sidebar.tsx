import { useNav } from '@/context/NavContext'
import { SECTIONS, SECTION_BY_ID } from '@/data/sections'
import { Icon } from '@/lib/icon'
import { ControlBar } from '@/components/chrome/ControlBar'
import type { Slide } from '@/types/slide'

/** Two-digit slide number from a 1-based index. */
function num(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * Desktop left navigation (hidden below `lg`). Brand at top, slides grouped by
 * section with each section's accent + icon, a thin overall progress bar, and a
 * scrollable list. Active slide highlighted with its section accent.
 */
export function Sidebar() {
  const { slides, index, go, slide: current, total, openPresent } = useNav()
  const pct = total > 1 ? ((index + 1) / total) * 100 : 100

  // Group slides by section, preserving deck order and section order.
  const groups = SECTIONS.map((section) => ({
    section,
    items: slides.filter((s) => s.sectionId === section.id),
  })).filter((g) => g.items.length > 0)

  return (
    <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-sm lg:flex">
      {/* Brand ------------------------------------------------------------ */}
      <div className="shrink-0 border-b border-border px-5 pb-4 pt-6">
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-faint">
          Sidang Skripsi
        </p>
        <h1 className="mt-1.5 font-display text-base font-semibold leading-snug text-ink">
          Deteksi Deepfake Hybrid
          <span className="text-muted"> · XceptionNet–FFT</span>
        </h1>

        {/* Overall progress */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-[width] duration-400 ease-out"
              style={{
                width: `${pct}%`,
                background: SECTION_BY_ID[current.sectionId].accent,
              }}
            />
          </div>
          <span className="font-mono text-[0.65rem] tabular-nums text-faint">
            {num(index + 1)}/{num(total)}
          </span>
        </div>
      </div>

      {/* Slide list ------------------------------------------------------- */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {groups.map(({ section, items }) => (
          <div key={section.id} className="mb-5 last:mb-0">
            <div className="mb-1.5 flex items-center gap-2 px-2">
              <span
                className="flex size-5 items-center justify-center rounded-md"
                style={{
                  background: `color-mix(in srgb, ${section.accent} 16%, transparent)`,
                  color: section.accent,
                }}
              >
                <Icon name={section.icon} className="size-3.5" />
              </span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                {section.label}
              </span>
            </div>

            <ul className="space-y-0.5">
              {items.map((s) => (
                <SidebarRow
                  key={s.id}
                  slide={s}
                  active={s.index === current.index}
                  accent={section.accent}
                  onSelect={() => go(s.index - 1)}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Session + present launcher --------------------------------------- */}
      <div className="shrink-0 space-y-2 border-t border-border p-3">
        <ControlBar variant="sidebar" />
        <button
          type="button"
          onClick={openPresent}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-border-strong hover:text-ink"
        >
          <Icon name="Presentation" className="size-4" />
          Mode Present
          <kbd className="ml-1 rounded border border-border px-1.5 py-0.5 font-mono text-[0.65rem] text-faint">
            F
          </kbd>
        </button>
      </div>
    </aside>
  )
}

function SidebarRow({
  slide,
  active,
  accent,
  onSelect,
}: {
  slide: Slide
  active: boolean
  accent: string
  onSelect: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? 'true' : undefined}
        className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-2/70"
        style={
          active
            ? { background: `color-mix(in srgb, ${accent} 14%, transparent)` }
            : undefined
        }
      >
        <span
          className="font-mono text-[0.7rem] tabular-nums"
          style={{ color: active ? accent : 'var(--color-faint)' }}
        >
          {num(slide.index)}
        </span>
        <span
          className="line-clamp-2 flex-1 text-[0.8rem] leading-snug"
          style={{ color: active ? 'var(--color-ink)' : 'var(--color-ink-soft)' }}
        >
          {slide.title}
        </span>
        {active && (
          <span
            className="h-5 w-0.5 shrink-0 rounded-full"
            style={{ background: accent }}
            aria-hidden
          />
        )}
      </button>
    </li>
  )
}

export default Sidebar
