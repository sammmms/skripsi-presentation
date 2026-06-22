import { useNav } from '@/context/NavContext'
import { SECTION_BY_ID } from '@/data/sections'
import { Icon } from '@/lib/icon'
import { ControlBar } from '@/components/chrome/ControlBar'

function num(n: number): string {
  return String(n).padStart(2, '0')
}

/** Mobile / tablet header (hidden on `lg`, where the Sidebar takes over).
 *  Hamburger → MobileSidebar; current section label + counter; buttons to
 *  toggle Overview and Notes. */
export function TopBar() {
  const {
    index,
    total,
    slide,
    toggleSidebar,
    toggleOverview,
    toggleNotes,
    overviewOpen,
    notesOpen,
    openPresent,
  } = useNav()

  const section = SECTION_BY_ID[slide.sectionId]

  return (
    <header
      className="relative z-30 flex shrink-0 items-center gap-2 border-b border-border bg-surface/70 px-2 backdrop-blur-md lg:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Buka daftar slide"
        className="flex size-11 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-surface-2"
      >
        <Icon name="Menu" className="size-5" />
      </button>

      {/* Section + counter */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-md"
          style={{
            background: `color-mix(in srgb, ${section.accent} 16%, transparent)`,
            color: section.accent,
          }}
        >
          <Icon name={section.icon} className="size-3.5" />
        </span>
        <span className="truncate text-sm font-medium text-ink-soft">
          {section.label}
        </span>
        <span className="ml-auto shrink-0 font-mono text-xs tabular-nums text-faint">
          {num(index + 1)} / {num(total)}
        </span>
      </div>

      <div className="flex shrink-0 items-center">
        <ControlBar variant="topbar" />
        <button
          type="button"
          onClick={openPresent}
          aria-label="Mode present (F)"
          className="flex size-11 items-center justify-center rounded-lg text-muted hover:bg-surface-2"
        >
          <Icon name="Presentation" className="size-5" />
        </button>
        <button
          type="button"
          onClick={toggleOverview}
          aria-label="Ikhtisar slide"
          aria-pressed={overviewOpen}
          className="flex size-11 items-center justify-center rounded-lg hover:bg-surface-2"
          style={{ color: overviewOpen ? section.accent : 'var(--color-muted)' }}
        >
          <Icon name="LayoutGrid" className="size-5" />
        </button>
        <button
          type="button"
          onClick={toggleNotes}
          aria-label="Catatan presenter"
          aria-pressed={notesOpen}
          className="flex size-11 items-center justify-center rounded-lg hover:bg-surface-2"
          style={{ color: notesOpen ? section.accent : 'var(--color-muted)' }}
        >
          <Icon name="NotebookPen" className="size-5" />
        </button>
      </div>
    </header>
  )
}

export default TopBar
