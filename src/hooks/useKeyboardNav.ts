import { useEffect } from 'react'
import { useNav } from '@/context/NavContext'

/** Returns true when keyboard focus sits in an editable field, so we don't
 *  hijack typing (e.g. a future search box). */
function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  )
}

/** The scroll container of the currently-mounted slide (marked with
 *  `data-slide-scroll`). With AnimatePresence mode="wait" only one slide is
 *  mounted; during a transition the last (entering) one wins. */
function activeScroller(): HTMLElement | null {
  const els = document.querySelectorAll<HTMLElement>('[data-slide-scroll]')
  return els.length ? els[els.length - 1] : null
}

/** Can the element still scroll in the given direction? */
function canScroll(el: HTMLElement | null, dir: 1 | -1): boolean {
  if (!el) return false
  if (dir === 1) return el.scrollTop + el.clientHeight < el.scrollHeight - 2
  return el.scrollTop > 2
}

/**
 * Global keyboard navigation for the deck. Mount once (in App).
 *  → next:    ArrowRight, Space, PageDown, 'l'
 *  → prev:    ArrowLeft,  PageUp,  'h'
 *  → first:   Home        last: End
 *  → 'n' notes · 'o'/'g' overview · Escape closes any open panel
 *  Ignores events with modifier keys or while typing in a field.
 */
export function useKeyboardNav(): void {
  const {
    next,
    prev,
    go,
    total,
    toggleNotes,
    toggleOverview,
    notesOpen,
    overviewOpen,
    sidebarOpen,
    toggleSidebar,
    isPresent,
    openPresent,
    lightbox,
    closeLightbox,
  } = useNav()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target)) return

      // While the figure lightbox is open it is modal: Escape closes it and
      // nav keys do not leak through to the deck.
      if (lightbox) {
        if (e.key === 'Escape') {
          e.preventDefault()
          closeLightbox()
        }
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
        case 'Spacebar': // legacy
        case 'l':
        case 'L':
          e.preventDefault()
          next()
          break

        case 'ArrowLeft':
        case 'PageUp':
        case 'h':
        case 'H':
          e.preventDefault()
          prev()
          break

        // Down/Up: scroll the slide if it has more to reveal, otherwise move
        // to the next / previous slide.
        case 'ArrowDown': {
          const el = activeScroller()
          if (canScroll(el, 1)) {
            e.preventDefault()
            el!.scrollBy({ top: Math.round(el!.clientHeight * 0.82), behavior: 'smooth' })
          } else {
            e.preventDefault()
            next()
          }
          break
        }

        case 'ArrowUp': {
          const el = activeScroller()
          if (canScroll(el, -1)) {
            e.preventDefault()
            el!.scrollBy({ top: -Math.round(el!.clientHeight * 0.82), behavior: 'smooth' })
          } else {
            e.preventDefault()
            prev()
          }
          break
        }

        case 'Home':
          e.preventDefault()
          go(0)
          break

        case 'End':
          e.preventDefault()
          go(total - 1)
          break

        // Presenter view: open the projector window (control) / close it (present).
        case 'f':
        case 'F':
          e.preventDefault()
          if (isPresent) window.close()
          else openPresent()
          break

        case 'n':
        case 'N':
          if (isPresent) break
          e.preventDefault()
          toggleNotes()
          break

        case 'o':
        case 'O':
        case 'g':
        case 'G':
          if (isPresent) break
          e.preventDefault()
          toggleOverview()
          break

        case 'Escape':
          if (isPresent) {
            window.close()
            break
          }
          // Close whatever panel is open (no harm if none are).
          if (overviewOpen) toggleOverview()
          if (notesOpen) toggleNotes()
          if (sidebarOpen) toggleSidebar()
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    next,
    prev,
    go,
    total,
    toggleNotes,
    toggleOverview,
    toggleSidebar,
    notesOpen,
    overviewOpen,
    sidebarOpen,
    isPresent,
    openPresent,
    lightbox,
    closeLightbox,
  ])
}
