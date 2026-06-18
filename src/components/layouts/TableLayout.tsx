import type { TableSlide } from '@/types/slide'
import { Bullets, DataTable, RichText } from '@/components/blocks'
import { SlideShell } from './SlideShell'

/** Optional lead, a data table, optional bullets beneath. */
export function TableLayout({ slide }: { slide: TableSlide }) {
  return (
    <SlideShell slide={slide}>
      <div className="flex w-full flex-col gap-5">
        {slide.lead && (
          <RichText
            text={slide.lead}
            className="block max-w-3xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg lg:text-xl"
          />
        )}

        <DataTable table={slide.table} />

        {slide.bullets && slide.bullets.length > 0 && (
          <Bullets items={slide.bullets} />
        )}
      </div>
    </SlideShell>
  )
}
