import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/** Directional slide transition. The parent (App) supplies the React `key`
 *  and wraps this in <AnimatePresence>; we only render the motion.div.
 *  Reduced-motion → plain opacity fade (no horizontal travel). */
export function SlideTransition({
  direction,
  children,
}: {
  direction: number
  children: ReactNode
}) {
  const reduce = useReducedMotion()

  const variants: Variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
      }

  return (
    <motion.div
      className="h-full w-full"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
