import type { BulletsSlide } from '@/types/slide'
import { Bullets, Figure, RichText } from '@/components/blocks'
import { SlideShell } from './SlideShell'

/** Optional lead + bullets; if a figure is present, it sits beside the bullets
 *  on desktop and below them on mobile. */
export function BulletsLayout({ slide }: { slide: BulletsSlide }) {
  const hasFigure = Boolean(slide.figure)

  return (
    <SlideShell slide={slide}>
      <div className="w-full">
        {slide.lead && (
          <RichText
            text={slide.lead}
            className="mb-5 block max-w-3xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg lg:text-xl"
          />
        )}

        <div
          className={
            hasFigure
              ? 'grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.1fr_1fr]'
              : ''
          }
        >
          <Bullets
            items={slide.bullets}
            ordered={slide.ordered}
            columns={slide.columns}
          />
          {slide.figure && <Figure figure={slide.figure} className="w-full" />}
        </div>
      </div>
    </SlideShell>
  )
}
