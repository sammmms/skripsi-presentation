/* ============================================================================
   SINGLE TYPE CONTRACT for the whole deck.
   `data/slides.ts` produces values of type `Slide`; `data/slidesConfig.tsx`
   maps each `slide.layout` to a layout component; layout components consume the
   matching slide variant and render block primitives. Edit shapes here and the
   whole app follows.
   ========================================================================== */

/* ---- Sections -------------------------------------------------------------*/
export type SectionId =
  | 'intro'
  | 'theory'
  | 'method'
  | 'results'
  | 'conclusion'
  | 'closing'

export interface Section {
  id: SectionId
  /** Display number, e.g. "01" */
  no: string
  label: string
  /** lucide-react icon name, resolved in the Sidebar */
  icon: string
  /** CSS var token name from index.css @theme, e.g. 'var(--color-sec-intro)' */
  accent: string
}

/* ---- Visual tone (drives colour across charts, cards, badges) -------------*/
export type Tone =
  | 'spatial'
  | 'frequency'
  | 'hybrid'
  | 'neutral'
  | 'good'
  | 'warn'
  | 'bad'

/* ---- Reusable content primitives -----------------------------------------*/
export interface BulletItem {
  /** May contain inline markdown-ish emphasis handled by the renderer:
   *  **bold**, *italic*, `code`. Keep it short. */
  text: string
  /** lucide-react icon name shown as the marker (optional). */
  icon?: string
  tone?: Tone
  /** Nested sub-points (rendered indented, lighter). */
  sub?: string[]
}

export interface FigureSpec {
  /** Path under /public, e.g. '/figures/fig-fft-real-fake.png'. */
  src: string
  alt: string
  caption?: string
  /** e.g. "Gambar 3.6". Rendered as a small label. */
  figureNo?: string
  /** When true, render a labelled placeholder instead of the image
   *  (used for not-yet-finalised confusion-matrix / training-curve figures). */
  placeholder?: boolean
  /** object-fit; default 'contain'. */
  fit?: 'contain' | 'cover'
}

export interface StatSpec {
  /** Numeric target for the count-up animation. */
  value: number
  prefix?: string
  suffix?: string
  /** Decimal places for display (e.g. 3 → 0,969). Uses comma as separator. */
  decimals?: number
  label: string
  sublabel?: string
  tone?: Tone
}

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export interface TableSpec {
  columns: TableColumn[]
  /** Each row maps column.key -> cell value. */
  rows: Array<Record<string, string | number>>
  caption?: string
  /** Optional row indices to visually emphasise. */
  highlightRows?: number[]
  /** Which column key carries the tone for mobile card colouring. */
  toneByValue?: Record<string, Tone>
}

export interface FlowStep {
  label: string
  detail?: string
  icon?: string
  tone?: Tone
}

export interface ModelCardSpec {
  name: string
  tagline: string
  tone: Tone
  /** e.g. "~22 jt param" */
  params?: string
  points: string[]
  /** Optional headline metric to feature on the card. */
  metric?: { value: string; label: string }
}

/* ---- Charts (rendered by custom SVG block, no external chart dep) ---------*/
export interface ChartSeries {
  key: string
  label: string
  tone: Tone
}

export interface BarGroup {
  label: string
  /** value per series.key */
  values: Record<string, number>
}

export interface LineSeries {
  key: string
  label: string
  tone: Tone
  /** one y-value per xLabels entry; null = gap */
  points: Array<number | null>
  dashed?: boolean
}

export type ChartSpec =
  | {
      kind: 'bar'
      series: ChartSeries[]
      groups: BarGroup[]
      yMax?: number
      yMin?: number
      yLabel?: string
      /** dashed reference line, e.g. random baseline 0.5 */
      baseline?: { value: number; label: string }
      /** value formatting */
      decimals?: number
    }
  | {
      kind: 'line'
      xLabels: string[]
      lines: LineSeries[]
      yMax?: number
      yMin?: number
      yLabel?: string
      xLabel?: string
      baseline?: { value: number; label: string }
      decimals?: number
    }

export interface QuoteSpec {
  text: string
  cite?: string
}

/* ---- Slide variants (discriminated union on `layout`) ---------------------*/
interface SlideBase {
  /** Stable slug used for deep-linking: #slide-<id> */
  id: string
  sectionId: SectionId
  /** 1-based position in the deck. */
  index: number
  /** Small eyebrow above the title (e.g. "Hasil 1 / 3"). */
  kicker?: string
  title: string
  /** Speaker script — shown only in the presenter drawer, never to audience. */
  notes?: string
}

export interface CoverSlide extends SlideBase {
  layout: 'cover'
  subtitle: string
  authors: Array<{ name: string; nim?: string }>
  advisor?: string
  affiliation: string
  year: string
}

export interface OutlineSlide extends SlideBase {
  layout: 'outline'
  items: Array<{ label: string; sectionId: SectionId; hint?: string }>
}

export interface BulletsSlide extends SlideBase {
  layout: 'bullets'
  lead?: string
  ordered?: boolean
  columns?: 1 | 2
  bullets: BulletItem[]
  /** Optional supporting figure beside/under the bullets. */
  figure?: FigureSpec
}

export interface SplitSlide extends SlideBase {
  layout: 'split'
  left: { heading?: string; lead?: string; bullets: BulletItem[]; tone?: Tone }
  right: { heading?: string; lead?: string; bullets: BulletItem[]; tone?: Tone }
}

export interface FigureSlide extends SlideBase {
  layout: 'figure'
  lead?: string
  bullets?: BulletItem[]
  figure: FigureSpec
  /** Figure placement relative to the text. Default 'right'. */
  figurePosition?: 'right' | 'bottom'
}

export interface FlowSlide extends SlideBase {
  layout: 'flow'
  lead?: string
  steps: FlowStep[]
  note?: string
  figure?: FigureSpec
}

export interface TableSlide extends SlideBase {
  layout: 'table'
  lead?: string
  table: TableSpec
  bullets?: BulletItem[]
}

export interface ModelsSlide extends SlideBase {
  layout: 'models'
  lead?: string
  models: ModelCardSpec[]
  figure?: FigureSpec
}

export interface ChartSlide extends SlideBase {
  layout: 'chart'
  lead?: string
  chart: ChartSpec
  stats?: StatSpec[]
  bullets?: BulletItem[]
  /** Optional source figure/table opened via lightbox. */
  figure?: FigureSpec
}

export interface DemoSlide extends SlideBase {
  layout: 'demo'
  lead?: string
  embedUrl: string
  bullets?: BulletItem[]
  figure?: FigureSpec
  /** Supporting screenshots (e.g. Gambar 4.1 UI, 4.2 "what the models see"),
   *  shown as zoomable thumbnails beside the live embed. */
  figures?: FigureSpec[]
}

export interface ClosingSlide extends SlideBase {
  layout: 'closing'
  lead?: string
  bullets?: BulletItem[]
  highlight?: string
  thanks?: string
  /** Render a QR code to the live deck URL. */
  qr?: boolean
}

export type Slide =
  | CoverSlide
  | OutlineSlide
  | BulletsSlide
  | SplitSlide
  | FigureSlide
  | FlowSlide
  | TableSlide
  | ModelsSlide
  | ChartSlide
  | DemoSlide
  | ClosingSlide

export type SlideLayout = Slide['layout']

/** Helper so layout components receive a precisely-typed slide. */
export type SlideOf<L extends SlideLayout> = Extract<Slide, { layout: L }>

/* ---- Navigation context contract (implemented in context/NavContext) -----*/
/** A figure shown in the shared (cross-window) lightbox. */
export interface LightboxSpec {
  src: string
  alt: string
  caption?: string
}

export interface NavState {
  slides: Slide[]
  index: number
  slide: Slide
  total: number
  /** +1 forward, -1 backward — drives directional transitions. */
  direction: number
  go: (i: number) => void
  /** Programmatic navigation (sync/remote-driven). Unlike `go`, it does NOT
   *  count as a manual move, so it never detaches a following follower. */
  goRemote: (i: number) => void
  /** Whether the most recent navigation was programmatic (`goRemote`) rather
   *  than a user gesture (`go`/`next`/`prev`). Read by the realtime layer. */
  isLastNavRemote: () => boolean
  goToId: (id: string) => void
  next: () => void
  prev: () => void
  notesOpen: boolean
  toggleNotes: () => void
  overviewOpen: boolean
  toggleOverview: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  /** True when this window is the clean "present" view (?view=present).
   *  Index is kept in sync with the control window via BroadcastChannel. */
  isPresent: boolean
  /** Open (or focus) the dedicated present window — the projector view. */
  openPresent: () => void
  /** Shared figure lightbox — mirrored across control + present windows. */
  lightbox: LightboxSpec | null
  openLightbox: (spec: LightboxSpec) => void
  closeLightbox: () => void
}
