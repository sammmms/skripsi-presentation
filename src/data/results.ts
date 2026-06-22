/* ============================================================================
   RESULTS — single source of truth for BAB IV numbers (n = 750, rata-rata atas
   3 seed: 0, 1, 2). Transcribed verbatim from the final thesis PDF (Tabel
   4.2–4.5, naskah tertanggal 2026-06-18). All chart slides import their
   `ChartSpec` from this module so that on-slide visuals and the prose stay in
   lockstep with the thesis tables.

   Tone mapping: spatial → 'spatial', hybrid → 'hybrid', freq → 'frequency'.
   Display formatting uses comma decimals; raw constants below are plain numbers.
   ========================================================================== */
import type { ChartSpec, ChartSeries } from '@/types/slide'

/* ---- Raw constants (Tabel 4.2 – 4.5) -------------------------------------- */

/** AUC in-dataset, n = 750 (Tabel 4.2). */
export const IN_DATASET_AUC = {
  FFPP: { spatial: 0.778, hybrid: 0.644, freq: 0.562 },
  CDF: { spatial: 0.971, hybrid: 0.919, freq: 0.562 },
} as const

/** F1-score in-dataset, n = 750 (Tabel 4.2). */
export const IN_DATASET_F1 = {
  FFPP: { spatial: 0.705, hybrid: 0.606, freq: 0.55 },
  CDF: { spatial: 0.906, hybrid: 0.834, freq: 0.51 },
} as const

/** Cross-dataset metrics (AUC / F1 / recall), n = 750 (Tabel 4.3). */
export const CROSS_DATASET = {
  'FFPP→CDF': {
    spatial: { auc: 0.678, f1: 0.614, recall: 0.637 },
    hybrid: { auc: 0.665, f1: 0.594, recall: 0.599 },
    freq: { auc: 0.606, f1: 0.115, recall: 0.064 },
  },
  'CDF→FFPP': {
    spatial: { auc: 0.607, f1: 0.137, recall: 0.074 },
    hybrid: { auc: 0.555, f1: 0.238, recall: 0.142 },
    freq: { auc: 0.575, f1: 0.526, recall: 0.531 },
  },
} as const

/** Generalization drop Δ = F1_in − F1_cross, n = 750 (Tabel 4.4). */
export const GENERALIZATION_DROP = {
  spatial: { FFPP: 0.091, CDF: 0.769 },
  hybrid: { FFPP: 0.012, CDF: 0.597 },
  freq: { FFPP: 0.435, CDF: -0.015 },
} as const

/** AUC in-dataset across sample tiers n = 250 / 500 / 750 (Tabel 4.5). */
export const SCALING_AUC = {
  FFPP: {
    spatial: [0.743, 0.693, 0.778],
    hybrid: [0.54, 0.616, 0.644],
    freq: [0.469, 0.545, 0.562],
  },
  CDF: {
    spatial: [0.914, 0.945, 0.971],
    hybrid: [0.787, 0.839, 0.919],
    freq: [0.5, 0.549, 0.562],
  },
} as const

/** Sample-size tiers used as x-axis on the scaling chart. */
export const SAMPLE_TIERS = ['250', '500', '750'] as const

/* ---- Shared chart pieces -------------------------------------------------- */

/** Bar/line series shared across charts: spatial / hybrid / freq. */
const MODEL_SERIES: ChartSeries[] = [
  { key: 'spatial', label: 'Spatial', tone: 'spatial' },
  { key: 'hybrid', label: 'Hybrid', tone: 'hybrid' },
  { key: 'freq', label: 'Freq', tone: 'frequency' },
]

/** Dashed reference line for a chance-level classifier (AUC 0,5). */
const RANDOM_BASELINE = { value: 0.5, label: 'tebakan acak' } as const

/* ---- Ready-made ChartSpec objects ---------------------------------------- */

/** In-dataset AUC, grouped by dataset (FFPP & CDF). Bar (Gambar 4.3). */
export const inDatasetAucChart: ChartSpec = {
  kind: 'bar',
  series: MODEL_SERIES,
  groups: [
    {
      label: 'FFPP',
      values: {
        spatial: IN_DATASET_AUC.FFPP.spatial,
        hybrid: IN_DATASET_AUC.FFPP.hybrid,
        freq: IN_DATASET_AUC.FFPP.freq,
      },
    },
    {
      label: 'CDF',
      values: {
        spatial: IN_DATASET_AUC.CDF.spatial,
        hybrid: IN_DATASET_AUC.CDF.hybrid,
        freq: IN_DATASET_AUC.CDF.freq,
      },
    },
  ],
  yMax: 1,
  yMin: 0.4,
  yLabel: 'AUC',
  baseline: RANDOM_BASELINE,
  decimals: 2,
}

/** Cross-dataset AUC, grouped by direction. Bar (Gambar 4.5). */
export const crossDatasetAucChart: ChartSpec = {
  kind: 'bar',
  series: MODEL_SERIES,
  groups: [
    {
      label: 'FFPP→CDF',
      values: {
        spatial: CROSS_DATASET['FFPP→CDF'].spatial.auc,
        hybrid: CROSS_DATASET['FFPP→CDF'].hybrid.auc,
        freq: CROSS_DATASET['FFPP→CDF'].freq.auc,
      },
    },
    {
      label: 'CDF→FFPP',
      values: {
        spatial: CROSS_DATASET['CDF→FFPP'].spatial.auc,
        hybrid: CROSS_DATASET['CDF→FFPP'].hybrid.auc,
        freq: CROSS_DATASET['CDF→FFPP'].freq.auc,
      },
    },
  ],
  yMax: 1,
  yMin: 0.4,
  yLabel: 'AUC',
  baseline: RANDOM_BASELINE,
  decimals: 2,
}

/** AUC in-dataset vs sample size for the FFPP set: spatial rising, freq flat.
 *  Line (Gambar 4.8). */
export const scalingAucChart: ChartSpec = {
  kind: 'line',
  xLabels: [...SAMPLE_TIERS],
  lines: [
    {
      key: 'spatial',
      label: 'Spatial',
      tone: 'spatial',
      points: [...SCALING_AUC.FFPP.spatial],
    },
    {
      key: 'hybrid',
      label: 'Hybrid',
      tone: 'hybrid',
      points: [...SCALING_AUC.FFPP.hybrid],
    },
    {
      key: 'freq',
      label: 'Freq',
      tone: 'frequency',
      points: [...SCALING_AUC.FFPP.freq],
    },
  ],
  yMax: 1,
  yMin: 0.4,
  yLabel: 'AUC',
  xLabel: 'jumlah video pelatihan',
  baseline: RANDOM_BASELINE,
  decimals: 2,
}
