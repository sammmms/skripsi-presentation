import type { DemoSlide } from '@/types/slide'
import { Bullets, Figure, RichText } from '@/components/blocks'
import { Icon } from '@/lib/icon'
import { SlideShell } from './SlideShell'

/** Embeds a Hugging Face Space in a lazy iframe with a graceful fallback link.
 *  Optional bullets / figure sit beside the embed on desktop. */
export function DemoLayout({ slide }: { slide: DemoSlide }) {
  const galleryFigures = slide.figures ?? (slide.figure ? [slide.figure] : [])
  const hasSide = Boolean(
    slide.lead || (slide.bullets && slide.bullets.length > 0) || galleryFigures.length > 0,
  )

  const embed = (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="surface-card overflow-hidden p-1.5">
        <iframe
          src={slide.embedUrl}
          title={slide.title}
          loading="lazy"
          allow="fullscreen; clipboard-write"
          referrerPolicy="no-referrer"
          className="h-[clamp(20rem,52vh,40rem)] w-full rounded-[calc(var(--radius-card)-0.4rem)] border-0 bg-surface"
        />
      </div>
      <a
        href={slide.embedUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 self-start rounded-lg px-1 text-sm font-medium text-spatial-soft transition-colors hover:text-spatial"
      >
        <Icon name="ExternalLink" className="size-4" />
        Buka demo di Hugging Face
        <span aria-hidden>↗</span>
      </a>
    </div>
  )

  return (
    <SlideShell slide={slide}>
      <div
        className={
          hasSide
            ? 'grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[1.5fr_1fr]'
            : 'w-full'
        }
      >
        {embed}

        {hasSide && (
          <div className="flex flex-col gap-4">
            {slide.lead && (
              <RichText
                text={slide.lead}
                className="block text-pretty text-base leading-relaxed text-ink-soft sm:text-lg"
              />
            )}
            {slide.bullets && slide.bullets.length > 0 && (
              <Bullets items={slide.bullets} />
            )}
            {galleryFigures.map((fig) => (
              <Figure key={fig.src} figure={fig} className="w-full" />
            ))}
          </div>
        )}
      </div>
    </SlideShell>
  )
}
