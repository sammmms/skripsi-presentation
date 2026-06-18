/* ============================================================================
   SLIDE CONFIG — maps `slide.layout` to its layout component and supplies short
   Indonesian labels for the overview/sidebar. `renderSlide` switches on the
   discriminant so each case is narrowed to its precise slide variant; the
   layout component then receives a correctly-typed `slide` prop with no casts.
   ========================================================================== */
import type { ReactNode } from 'react'
import type { Slide, SlideLayout } from '@/types/slide'
import {
  CoverLayout,
  OutlineLayout,
  BulletsLayout,
  SplitLayout,
  FigureLayout,
  FlowLayout,
  TableLayout,
  ModelsLayout,
  ChartLayout,
  DemoLayout,
  ClosingLayout,
} from '@/components/layouts'

/** Render a slide with the layout component matching its `layout` discriminant.
 *  The switch narrows `slide` per case, so every prop is exactly-typed. */
export function renderSlide(slide: Slide): ReactNode {
  switch (slide.layout) {
    case 'cover':
      return <CoverLayout slide={slide} />
    case 'outline':
      return <OutlineLayout slide={slide} />
    case 'bullets':
      return <BulletsLayout slide={slide} />
    case 'split':
      return <SplitLayout slide={slide} />
    case 'figure':
      return <FigureLayout slide={slide} />
    case 'flow':
      return <FlowLayout slide={slide} />
    case 'table':
      return <TableLayout slide={slide} />
    case 'models':
      return <ModelsLayout slide={slide} />
    case 'chart':
      return <ChartLayout slide={slide} />
    case 'demo':
      return <DemoLayout slide={slide} />
    case 'closing':
      return <ClosingLayout slide={slide} />
  }
}

/** Short Indonesian label per layout, for the overview grid and badges. */
export const LAYOUT_LABELS: Record<SlideLayout, string> = {
  cover: 'Sampul',
  outline: 'Ikhtisar',
  bullets: 'Poin',
  split: 'Dua Kolom',
  figure: 'Gambar',
  flow: 'Alur',
  table: 'Tabel',
  models: 'Arsitektur',
  chart: 'Grafik',
  demo: 'Demo',
  closing: 'Penutup',
}
