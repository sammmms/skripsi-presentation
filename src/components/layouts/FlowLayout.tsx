import type { FlowSlide } from '@/types/slide'
import { Figure, FlowDiagram, RichText } from '@/components/blocks'
import { Icon } from '@/lib/icon'
import { SlideShell } from './SlideShell'

/** Optional lead, a flow diagram, an optional note callout, optional figure. */
export function FlowLayout({ slide }: { slide: FlowSlide }) {
  return (
    <SlideShell slide={slide}>
      <div className="flex w-full flex-col gap-5">
        {slide.lead && (
          <RichText
            text={slide.lead}
            className="block max-w-3xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg"
          />
        )}

        <FlowDiagram steps={slide.steps} />

        {slide.figure && <Figure figure={slide.figure} className="w-full" />}

        {slide.note && (
          <div className="flex items-start gap-3 rounded-card border border-border bg-surface/50 p-4">
            <Icon name="Info" className="mt-0.5 size-4 shrink-0 text-faint" />
            <RichText
              text={slide.note}
              className="block text-sm leading-relaxed text-muted"
            />
          </div>
        )}
      </div>
    </SlideShell>
  )
}
