/* ============================================================================
   RESULTS — single source of truth for BAB IV numbers (n = 750, rata-rata atas
   3 seed: 0, 1, 2). Transcribed verbatim from
   `BAB_IV_Hasil_dan_Pembahasan_2026-06-17.md`. All chart slides import their
   `ChartSpec` from this module so that on-slide visuals and the prose stay in
   lockstep with the thesis tables.

   Tone mapping: spatial → 'spatial', hybrid → 'hybrid', freq → 'frequency'.
   Display formatting uses comma decimals; raw constants below are plain numbers.
   ========================================================================== */
import type { ChartSpec, ChartSeries } from '@/types/slide'

/* ---- Raw constants (Tabel 4.2 – 4.5) -------------------------------------- */

/** AUC in-dataset, n = 750 (Tabel 4.2). */
export const IN_DATASET_AUC = {
  FFPP: { spatial: 0.78, hybrid: 0.65, freq: 0.546 },
  CDF: { spatial: 0.969, hybrid: 0.924, freq: 0.586 },
} as const

/** F1-score in-dataset, n = 750 (Tabel 4.2). */
export const IN_DATASET_F1 = {
  FFPP: { spatial: 0.71, hybrid: 0.603, freq: 0.529 },
  CDF: { spatial: 0.909, hybrid: 0.847, freq: 0.511 },
} as const

/** Cross-dataset metrics (AUC / F1 / recall), n = 750 (Tabel 4.3). */
export const CROSS_DATASET = {
  'FFPP→CDF': {
    spatial: { auc: 0.648, f1: 0.594, recall: 0.618 },
    hybrid: { auc: 0.648, f1: 0.576, recall: 0.57 },
    freq: { auc: 0.655, f1: 0.124, recall: 0.069 },
  },
  'CDF→FFPP': {
    spatial: { auc: 0.629, f1: 0.153, recall: 0.083 },
    hybrid: { auc: 0.563, f1: 0.237, recall: 0.143 },
    freq: { auc: 0.591, f1: 0.57, recall: 0.596 },
  },
} as const

/** Generalization drop Δ = F1_in − F1_cross, n = 750 (Tabel 4.4). */
export const GENERALIZATION_DROP = {
  spatial: { FFPP: 0.116, CDF: 0.756 },
  hybrid: { FFPP: 0.027, CDF: 0.609 },
  freq: { FFPP: 0.406, CDF: -0.058 },
} as const

/** AUC in-dataset across sample tiers n = 250 / 500 / 750 (Tabel 4.5). */
export const SCALING_AUC = {
  FFPP: {
    spatial: [0.746, 0.693, 0.78],
    hybrid: [0.542, 0.582, 0.65],
    freq: [0.48, 0.57, 0.546],
  },
  CDF: {
    spatial: [0.942, 0.967, 0.969],
    hybrid: [0.812, 0.892, 0.924],
    freq: [0.569, 0.615, 0.586],
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
