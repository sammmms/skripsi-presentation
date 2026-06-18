import type { ChartSlide } from '@/types/slide'
import {
  BarChart,
  Bullets,
  Figure,
  LineChart,
  RichText,
  StatCard,
} from '@/components/blocks'
import { SlideShell } from './SlideShell'

/** Prominent chart + a rail of stat cards + bullets. On desktop the chart and
 *  stats sit side-by-side; on mobile they stack. */
export function ChartLayout({ slide }: { slide: ChartSlide }) {
  const hasStats = Boolean(slide.stats && slide.stats.length > 0)

  return (
    <SlideShell slide={slide}>
      <div className="flex w-full flex-col gap-5">
        {slide.lead && (
          <RichText
            text={slide.lead}
            className="block max-w-3xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg lg:text-xl"
          />
        )}

        <div
          className={
            hasStats
              ? 'grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.6fr_1fr]'
              : ''
          }
        >
          <div className="surface-card min-w-0 p-4 sm:p-5">
            {slide.chart.kind === 'bar' ? (
              <BarChart chart={slide.chart} />
            ) : (
              <LineChart chart={slide.chart} />
            )}
          </div>

          {hasStats && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {slide.stats!.map((stat, i) => (
                <StatCard key={`${stat.label}-${i}`} stat={stat} className="h-full" />
              ))}
            </div>
          )}
        </div>

        {slide.bullets && slide.bullets.length > 0 && (
          <Bullets items={slide.bullets} />
        )}

        {slide.figure && (
          <Figure figure={slide.figure} className="mx-auto w-full max-w-sm" />
        )}
      </div>
    </SlideShell>
  )
}
