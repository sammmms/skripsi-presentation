import { motion } from 'framer-motion'
import { useNav } from '@/context/NavContext'
import { SECTION_BY_ID } from '@/data/sections'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Slim deck-progress bar, tinted by the current section accent. Sits at the
 *  very top of the viewport. Reflects (index + 1) / total. */
export function ProgressBar() {
  const { index, total, slide } = useNav()
  const reduce = useReducedMotion()
  const accent = SECTION_BY_ID[slide.sectionId].accent
  const pct = total > 1 ? ((index + 1) / total) * 100 : 100

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-surface-2/60"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-label="Progres presentasi"
    >
      <motion.div
        className="h-full origin-left"
        style={{ background: accent }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
      />
    </div>
  )
}

export default ProgressBar
