import { useEffect, useRef } from 'react'
import { useNav } from '@/context/NavContext'

const WHEEL_THRESHOLD = 24 // minimum decisive delta to act on
const LOCK_MS = 600 // cooldown after a step to avoid skipping slides

/**
 * Desktop wheel / trackpad navigation, attached to the slide stage element.
 *  A decisive vertical (or horizontal) wheel delta advances one slide, then
 *  locks for ~600ms so a single flick doesn't skip several slides.
 *
 *  Pass `enabled = false` to disable (e.g. while a scrollable panel — overview,
 *  notes — is open and should own the wheel).
 *
 *  Returns a ref to attach to the stage: `<div ref={useWheelNav(enabled)}>`.
 */
export function useWheelNav(enabled: boolean) {
  const { next, prev } = useNav()
  const ref = useRef<HTMLDivElement | null>(null)
  const locked = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    function onWheel(e: WheelEvent) {
      // Use whichever axis carries the larger intent.
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(delta) < WHEEL_THRESHOLD) return
      if (locked.current) {
        e.preventDefault()
        return
      }

      e.preventDefault()
      locked.current = true
      if (delta > 0) next()
      else prev()

      window.setTimeout(() => {
        locked.current = false
      }, LOCK_MS)
    }

    // Non-passive so we can preventDefault the page from rubber-banding.
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [enabled, next, prev])

  return ref
}
