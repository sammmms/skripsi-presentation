import { motion, useReducedMotion } from 'framer-motion'
import type { BulletItem } from '@/types/slide'
import { toneColor } from '@/lib/tone'
import { Icon } from '@/lib/icon'
import { RichText } from './RichText'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Bullets({
  items,
  ordered = false,
  columns = 1,
  className = '',
}: {
  items: BulletItem[]
  ordered?: boolean
  columns?: 1 | 2
  className?: string
}) {
  const reduce = useReducedMotion()
  const Tag = ordered ? 'ol' : 'ul'

  const container =
    columns === 2
      ? 'grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2'
      : 'flex flex-col gap-3.5 lg:gap-4'

  return (
    <Tag className={`${container} ${className}`}>
      {items.map((item, i) => {
        const color = toneColor(item.tone)
        return (
          <motion.li
            key={i}
            // Responsive content scale (markers are sized in `em`, so they
            // track the text size and stay vertically centred on line 1).
            className="flex items-start gap-3 text-base leading-relaxed text-ink-soft sm:text-lg lg:text-xl xl:text-2xl"
            initial={reduce ? false : { opacity: 0, x: -10 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : i * 0.07 }}
          >
            {/* Marker box height = text line-height (leading-relaxed ≈ 1.625em)
                so the icon/dot/ordinal centres on the first line at any size. */}
            <span
              className="flex h-[1.625em] w-[1.5em] shrink-0 items-center justify-center"
              aria-hidden={!ordered}
            >
              {item.icon ? (
                <Icon name={item.icon} className="size-[1.15em]" style={{ color }} />
              ) : ordered ? (
                <span
                  className="flex size-[1.5em] items-center justify-center rounded-full text-[0.6em] font-semibold tabular-nums"
                  style={{
                    color,
                    background: `color-mix(in srgb, ${color} 16%, transparent)`,
                  }}
                >
                  {i + 1}
                </span>
              ) : (
                <span
                  className="size-[0.5em] rounded-full"
                  style={{
                    background: color,
                    boxShadow: `0 0 10px -1px ${color}`,
                  }}
                />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <RichText text={item.text} className="text-pretty" />
              {item.sub && item.sub.length > 0 && (
                <ul className="mt-1.5 flex flex-col gap-1 border-l border-border pl-3 text-[0.82em] text-muted">
                  {item.sub.map((s, j) => (
                    <li key={j} className="text-pretty">
                      <RichText text={s} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.li>
        )
      })}
    </Tag>
  )
}
