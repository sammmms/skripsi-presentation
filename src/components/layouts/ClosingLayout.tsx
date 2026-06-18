import { motion, useReducedMotion } from 'framer-motion'
import type { ClosingSlide } from '@/types/slide'
import { Bullets, QRCode, RichText } from '@/components/blocks'

/** Resolve the live deck URL for the QR code. Prefers the build-time deploy
 *  URL, falls back to the current location at runtime. */
function deckUrl(): string {
  return (
    import.meta.env.VITE_DEPLOY_URL ??
    (typeof window !== 'undefined' ? window.location.href : '')
  )
}

/** Full-bleed closing: big highlight statement, optional kontribusi bullets,
 *  "Terima kasih", and an optional QR to the live deck. */
export function ClosingLayout({ slide }: { slide: ClosingSlide }) {
  const reduce = useReducedMotion()

  const float = reduce
    ? {}
    : {
        scale: [1, 1.12, 1],
        opacity: [0.5, 0.75, 0.5],
        transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' as const },
      }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-5 py-10 sm:px-10">
      {/* Decorative glow ----------------------------------------------- */}
      <motion.div
        aria-hidden
        animate={float}
        className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(251,191,36,0.18), rgba(167,139,250,0.12) 45%, transparent 70%)',
        }}
      />

      <div
        data-slide-scroll
        className="no-scrollbar relative z-10 flex max-h-full w-full max-w-3xl flex-col items-center overflow-y-auto text-center"
      >
        {slide.thanks && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-faint sm:text-sm"
          >
            {slide.thanks}
          </motion.p>
        )}

        {slide.highlight && (
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-clip-text font-display text-3xl font-bold leading-tight text-balance text-transparent sm:text-5xl md:text-6xl"
            style={{
              backgroundImage:
                'linear-gradient(120deg, var(--color-spatial-soft), var(--color-ink) 50%, var(--color-frequency-soft))',
            }}
          >
            {slide.highlight}
          </motion.h2>
        )}

        {!slide.highlight && (
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl font-bold leading-tight text-balance text-ink sm:text-5xl"
          >
            {slide.title}
          </motion.h2>
        )}

        {slide.lead && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            <RichText
              text={slide.lead}
              className="mt-5 block max-w-2xl text-pretty text-sm leading-relaxed text-ink-soft sm:text-base md:text-lg"
            />
          </motion.div>
        )}

        {slide.bullets && slide.bullets.length > 0 && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="mt-7 w-full max-w-lg text-left"
          >
            <Bullets items={slide.bullets} />
          </motion.div>
        )}

        {slide.qr && (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <QRCode url={deckUrl()} label="Pindai untuk membuka deck" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
