import type { FigureSlide } from '@/types/slide'
import { Bullets, Figure, RichText } from '@/components/blocks'
import { SlideShell } from './SlideShell'

/** Figure + supporting text. `figurePosition`:
 *  'right'  → text left / figure right (stacks on mobile)
 *  'bottom' → text on top, figure full-width below. */
export function FigureLayout({ slide }: { slide: FigureSlide }) {
  const position = slide.figurePosition ?? 'right'

  const text = (
    <div className="w-full">
      {slide.lead && (
        <RichText
          text={slide.lead}
          className="block max-w-3xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg lg:text-xl"
        />
      )}
      {slide.bullets && slide.bullets.length > 0 && (
        <div className={slide.lead ? 'mt-4' : ''}>
          <Bullets items={slide.bullets} />
        </div>
      )}
    </div>
  )

  if (position === 'bottom') {
    return (
      <SlideShell slide={slide}>
        <div className="flex w-full flex-col gap-5">
          {text}
          <Figure figure={slide.figure} className="w-full" />
        </div>
      </SlideShell>
    )
  }

  return (
    <SlideShell slide={slide}>
      <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-8">
        {text}
        <Figure figure={slide.figure} className="w-full" />
      </div>
    </SlideShell>
  )
}
