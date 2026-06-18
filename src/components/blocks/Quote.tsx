import type { QuoteSpec } from '@/types/slide'

export function Quote({ quote, className = '' }: { quote: QuoteSpec; className?: string }) {
  return (
    <figure className={`surface-card relative overflow-hidden p-5 sm:p-7 ${className}`}>
      {/* Large decorative quote glyph */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 -top-4 select-none font-display text-7xl leading-none text-spatial/25 sm:text-8xl"
      >
        &ldquo;
      </span>
      <blockquote className="relative pl-8 sm:pl-10">
        <p className="text-pretty text-lg font-medium text-ink sm:text-xl">{quote.text}</p>
        {quote.cite && (
          <figcaption className="mt-3 text-sm text-muted">
            <span className="mr-2 text-faint">&mdash;</span>
            {quote.cite}
          </figcaption>
        )}
      </blockquote>
    </figure>
  )
}
