import { useNav } from '@/context/NavContext'
import { Icon } from '@/lib/icon'

/** Subtle side chevrons for prev/next, shown on pointer-capable / larger
 *  screens (touch users swipe). Disabled at the deck ends. */
export function NavButtons() {
  const { index, total, next, prev } = useNav()
  const atStart = index <= 0
  const atEnd = index >= total - 1

  const base =
    'pointer-events-auto absolute top-1/2 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/70 text-ink-soft backdrop-blur-sm transition-all hover:border-border-strong hover:bg-surface-2 hover:text-ink disabled:pointer-events-none disabled:opacity-0 md:flex size-11'

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <button
        type="button"
        onClick={prev}
        disabled={atStart}
        aria-label="Slide sebelumnya"
        className={`${base} left-2 lg:left-3`}
      >
        <Icon name="ChevronLeft" className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        disabled={atEnd}
        aria-label="Slide berikutnya"
        className={`${base} right-2 lg:right-3`}
      >
        <Icon name="ChevronRight" className="size-5" />
      </button>
    </div>
  )
}

export default NavButtons
