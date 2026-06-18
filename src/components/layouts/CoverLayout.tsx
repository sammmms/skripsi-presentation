import { motion, useReducedMotion } from 'framer-motion'
import type { CoverSlide } from '@/types/slide'

/** Full-bleed conference-keynote hero. Two glowing orbs (cyan spatial ↔
 *  violet frequency) drift behind a gradient title. NOT wrapped in SlideShell. */
export function CoverLayout({ slide }: { slide: CoverSlide }) {
  const reduce = useReducedMotion()

  const float = (sign: number) =>
    reduce
      ? {}
      : {
          x: [0, sign * 26, 0],
          y: [0, sign * -20, 0],
          transition: {
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-5 py-10 sm:px-10">
      {/* Decorative orbs ------------------------------------------------ */}
      <motion.div
        aria-hidden
        animate={float(1)}
        className="pointer-events-none absolute -left-10 top-6 size-56 rounded-full blur-3xl sm:size-72"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.55), transparent 70%)' }}
      />
      <motion.div
        aria-hidden
        animate={float(-1)}
        className="pointer-events-none absolute -right-12 bottom-2 size-64 rounded-full blur-3xl sm:size-80"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border-strong) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-strong) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* Content -------------------------------------------------------- */}
      <div
        data-slide-scroll
        className="no-scrollbar relative z-10 flex max-h-full w-full max-w-4xl flex-col items-center overflow-y-auto text-center"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-xl bg-white/95 px-5 py-3 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/15"
        >
          <img
            src="/mikroskil-logo.png"
            alt="Universitas Mikroskil"
            className="h-10 w-auto sm:h-12"
          />
        </motion.div>

        <motion.span
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted backdrop-blur sm:text-xs"
        >
          <span className="size-2 rounded-full" style={{ background: 'var(--color-spatial)' }} />
          Sidang Skripsi
          <span className="size-2 rounded-full" style={{ background: 'var(--color-frequency)' }} />
        </motion.span>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-clip-text font-display text-3xl font-bold leading-[1.1] text-balance text-transparent sm:text-5xl md:text-6xl"
          style={{
            backgroundImage:
              'linear-gradient(120deg, var(--color-spatial-soft), var(--color-ink) 45%, var(--color-frequency-soft))',
          }}
        >
          {slide.title}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-ink-soft sm:text-base md:text-lg"
        >
          {slide.subtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.34 }}
          className="mt-8 w-full max-w-xl"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {slide.authors.map((a) => (
              <div key={a.name} className="text-center">
                <p className="font-display text-base font-semibold text-ink sm:text-lg">{a.name}</p>
                {a.nim && <p className="font-mono text-xs text-muted">{a.nim}</p>}
              </div>
            ))}
          </div>

          {slide.advisor && (
            <p className="mt-4 text-xs text-muted sm:text-sm">
              <span className="text-faint">Dosen Pembimbing</span>
              <br className="sm:hidden" /> {slide.advisor}
            </p>
          )}

          <div className="mx-auto mt-6 h-px w-24 bg-border" />
          <p className="mt-4 text-xs text-muted sm:text-sm">{slide.affiliation}</p>
          <p className="font-mono text-xs text-faint">{slide.year}</p>
        </motion.div>
      </div>
    </div>
  )
}
