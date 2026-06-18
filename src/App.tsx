import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavProvider, useNav } from '@/context/NavContext'
import { useKeyboardNav } from '@/hooks/useKeyboardNav'
import { useSwipe } from '@/hooks/useSwipe'
import { useWheelNav } from '@/hooks/useWheelNav'
import { renderSlide } from '@/data/slidesConfig'
import { SlideTransition } from '@/components/layouts'
import { Lightbox } from '@/components/blocks'
import { Icon } from '@/lib/icon'
import { Sidebar } from '@/components/chrome/Sidebar'
import { MobileSidebar } from '@/components/chrome/MobileSidebar'
import { TopBar } from '@/components/chrome/TopBar'
import { ProgressBar } from '@/components/chrome/ProgressBar'
import { OverviewGrid } from '@/components/chrome/OverviewGrid'
import { PresenterDrawer } from '@/components/chrome/PresenterDrawer'
import { NavButtons } from '@/components/chrome/NavButtons'

/** The animated slide stage: swipe + wheel gestures, directional transitions.
 *  Wheel nav is disabled while a scrollable panel owns the wheel. With
 *  `chrome={false}` (present view) the on-stage nav chevrons are hidden. */
function SlideStage({ chrome = true }: { chrome?: boolean }) {
  const { slide, direction, overviewOpen } = useNav()
  const swipe = useSwipe()
  const wheelRef = useWheelNav(!overviewOpen)

  return (
    <div
      ref={wheelRef}
      {...swipe}
      className="relative min-h-0 flex-1 overflow-x-hidden"
    >
      {chrome && <NavButtons />}
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <SlideTransition key={slide.id} direction={direction}>
          {renderSlide(slide)}
        </SlideTransition>
      </AnimatePresence>
    </div>
  )
}

/** Control view — the full deck with sidebar, notes, overview, progress. */
function DeckShell() {
  useKeyboardNav()

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <Sidebar />

      {/* Main column */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopBar />
        <SlideStage />
      </div>

      {/* Overlays / chrome */}
      <ProgressBar />
      <MobileSidebar />
      <OverviewGrid />
      <PresenterDrawer />
    </div>
  )
}

/** Floating controls for the present window: fullscreen + close. Auto-dims. */
function PresentControls() {
  const [fs, setFs] = useState(false)

  useEffect(() => {
    const onChange = () => setFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen().catch(() => {})
    }
  }, [])

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-1.5 opacity-30 transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100">
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fs ? 'Keluar layar penuh' : 'Layar penuh'}
        className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface/70 text-ink-soft backdrop-blur transition-colors hover:text-ink"
      >
        <Icon name={fs ? 'Minimize' : 'Maximize'} className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => window.close()}
        aria-label="Tutup jendela present (Esc)"
        className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface/70 text-ink-soft backdrop-blur transition-colors hover:text-bad"
      >
        <Icon name="X" className="size-5" />
      </button>
    </div>
  )
}

/** Present view — projector-facing window. Only the slide; no sidebar, no
 *  notes, no overview. Stays in sync with the control window. */
function PresentShell() {
  useKeyboardNav()

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-bg">
      <PresentControls />
      <SlideStage chrome={false} />
      <motion.p
        initial={{ opacity: 0.55 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="pointer-events-none fixed bottom-3 left-1/2 z-50 -translate-x-1/2 text-xs text-faint"
      >
        Mode present · panah untuk navigasi · Esc keluar
      </motion.p>
    </div>
  )
}

/** Single shared figure lightbox, mirrored across control + present windows. */
function GlobalLightbox() {
  const { lightbox, closeLightbox } = useNav()
  return (
    <Lightbox
      open={lightbox !== null}
      src={lightbox?.src ?? ''}
      alt={lightbox?.alt ?? ''}
      caption={lightbox?.caption}
      onClose={closeLightbox}
    />
  )
}

function Root() {
  const { isPresent } = useNav()
  return (
    <>
      {isPresent ? <PresentShell /> : <DeckShell />}
      <GlobalLightbox />
    </>
  )
}

export default function App() {
  return (
    <NavProvider>
      <Root />
    </NavProvider>
  )
}
