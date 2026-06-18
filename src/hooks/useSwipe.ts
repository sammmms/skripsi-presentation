import { useRef, type TouchEvent } from 'react'
import { useNav } from '@/context/NavContext'

export interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: (e: TouchEvent) => void
}

const SWIPE_THRESHOLD = 50 // px of horizontal travel to count as a swipe
const VERTICAL_GUARD = 1.2 // |dx| must exceed |dy| * this to be "horizontal"

/**
 * Touch-swipe navigation. Spread the returned handlers on the slide stage.
 *  Horizontal swipe left → next, right → prev. Mostly-vertical drags (the user
 *  is scrolling a tall slide) are ignored.
 */
export function useSwipe(): SwipeHandlers {
  const { next, prev } = useNav()
  const start = useRef<{ x: number; y: number } | null>(null)

  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0]
    if (!t) return
    start.current = { x: t.clientX, y: t.clientY }
  }

  // We don't preventDefault on move so vertical scrolling inside slides stays
  // native; the decision happens on touch-end.
  function onTouchMove() {
    /* no-op: gesture is resolved in onTouchEnd */
  }

  function onTouchEnd(e: TouchEvent) {
    const s = start.current
    start.current = null
    if (!s) return

    const t = e.changedTouches[0]
    if (!t) return

    const dx = t.clientX - s.x
    const dy = t.clientY - s.y

    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    if (Math.abs(dx) < Math.abs(dy) * VERTICAL_GUARD) return // mostly vertical

    if (dx < 0) next()
    else prev()
  }

  return { onTouchStart, onTouchMove, onTouchEnd }
}
