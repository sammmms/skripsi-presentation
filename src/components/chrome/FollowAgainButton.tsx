import { AnimatePresence, motion } from 'framer-motion'
import { useSync } from '@/context/SyncContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Icon } from '@/lib/icon'

/** Floating "re-sync" button for a follower who has browsed away from the
 *  controller. Tapping it jumps back to the controller's slide and resumes
 *  auto-follow. */
export function FollowAgainButton() {
  const { enabled, role, following, controller, followAgain } = useSync()
  const reduce = useReducedMotion()

  const show = enabled && role === 'follower' && !following && controller != null

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={followAgain}
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-strong bg-surface-2/90 px-4 py-2.5 text-sm font-medium text-ink shadow-card backdrop-blur transition-colors hover:border-spatial"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Icon name="CornerUpLeft" className="size-4 text-spatial" />
          Ikuti {controller?.name ?? 'presenter'} lagi
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default FollowAgainButton
