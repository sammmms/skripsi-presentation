import type { FigureSpec } from '@/types/slide'
import { Icon } from '@/lib/icon'
import { useNav } from '@/context/NavContext'

export function Figure({ figure, className = '' }: { figure: FigureSpec; className?: string }) {
  const { openLightbox } = useNav()
  const fit = figure.fit ?? 'contain'
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain'

  // Opens the shared lightbox so the zoom is mirrored onto the present window.
  const zoom = () =>
    openLightbox({
      src: figure.src,
      alt: figure.alt,
      caption: figure.figureNo
        ? `${figure.figureNo}${figure.caption ? ` — ${figure.caption}` : ''}`
        : figure.caption,
    })

  return (
    <figure className={`flex min-h-0 flex-col ${className}`}>
      {figure.placeholder ? (
        <div className="surface-card flex flex-1 flex-col items-center justify-center gap-3 border-dashed border-border-strong p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-surface-3 text-faint">
            <Icon name="Image" className="size-6" />
          </span>
          {figure.figureNo && (
            <span className="font-mono text-xs uppercase tracking-wide text-spatial-soft">
              {figure.figureNo}
            </span>
          )}
          {figure.caption && <p className="max-w-sm text-sm text-muted">{figure.caption}</p>}
          <span className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-faint">
            Gambar belum difinalisasi
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={zoom}
          aria-label={`Perbesar: ${figure.alt}`}
          className="group relative flex min-h-0 flex-1 cursor-zoom-in items-center justify-center overflow-hidden rounded-card border border-border bg-surface-2/40 p-2"
        >
          <img
            src={figure.src}
            alt={figure.alt}
            className={`max-h-full max-w-full rounded-md ${fitClass} transition group-hover:scale-[1.01]`}
          />
          <span className="pointer-events-none absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/55 text-ink-soft opacity-0 backdrop-blur transition group-hover:opacity-100">
            <Icon name="Maximize2" className="size-4" />
          </span>
        </button>
      )}

      {(figure.figureNo || figure.caption) && !figure.placeholder && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {figure.figureNo && (
            <span className="mr-1.5 font-mono text-xs font-medium text-ink-soft">
              {figure.figureNo}
            </span>
          )}
          {figure.caption}
        </figcaption>
      )}
    </figure>
  )
}
