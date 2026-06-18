import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Icon } from '@/lib/icon'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Lightbox({
  open,
  src,
  alt,
  caption,
  onClose,
}: {
  open: boolean
  src: string
  alt: string
  caption?: string
  onClose: () => void
}) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
          onClick={onClose}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-border-strong bg-surface/80 text-ink-soft transition hover:bg-surface-2 hover:text-ink sm:right-6 sm:top-6"
          >
            <Icon name="X" className="size-6" />
          </button>

          <motion.img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-card object-contain shadow-2xl"
            initial={reduce ? false : { scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
          />

          {caption && (
            <p
              onClick={(e) => e.stopPropagation()}
              className="mt-4 max-w-3xl text-center text-sm text-ink-soft"
            >
              {caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
