import type { Section, SectionId } from '@/types/slide'

/** The 6 thesis-defense sections, in order, with per-section accent + icon. */
export const SECTIONS: Section[] = [
  {
    id: 'intro',
    no: '01',
    label: 'Pendahuluan',
    icon: 'Compass',
    accent: 'var(--color-sec-intro)',
  },
  {
    id: 'theory',
    no: '02',
    label: 'Landasan Teori',
    icon: 'BookOpen',
    accent: 'var(--color-sec-theory)',
  },
  {
    id: 'method',
    no: '03',
    label: 'Metodologi',
    icon: 'FlaskConical',
    accent: 'var(--color-sec-method)',
  },
  {
    id: 'results',
    no: '04',
    label: 'Hasil & Pembahasan',
    icon: 'BarChart3',
    accent: 'var(--color-sec-results)',
  },
  {
    id: 'conclusion',
    no: '05',
    label: 'Kesimpulan & Saran',
    icon: 'CheckCircle2',
    accent: 'var(--color-sec-conclusion)',
  },
  {
    id: 'closing',
    no: '06',
    label: 'Penutup',
    icon: 'Award',
    accent: 'var(--color-sec-closing)',
  },
]

export const SECTION_BY_ID: Record<SectionId, Section> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s]),
) as Record<SectionId, Section>
