import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { fmt } from '@/lib/format'

/** easeOutCubic — matches the deck's cubic-bezier(0.22,1,0.36,1) feel. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  durationMs = 1400,
  className,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  durationMs?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [current, setCurrent] = useState(reduce ? value : 0)

  useEffect(() => {
    if (reduce) {
      setCurrent(value)
      return
    }
    if (!inView) return

    let raf = 0
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start
      const t = durationMs <= 0 ? 1 : Math.min(elapsed / durationMs, 1)
      setCurrent(value * easeOut(t))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setCurrent(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, value, durationMs])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {fmt(current, decimals)}
      {suffix}
    </span>
  )
}
