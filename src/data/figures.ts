import type { FigureSpec } from '@/types/slide'

/* Curated thesis figures copied into /public/figures with stable names.
   NOTE: thesis figure numbers do not map 1:1 to the source PNG filenames;
   `figureNo` below reflects the number used in the defense script/slide, while
   the `src` points at the curated asset. Confusion-matrix and training-curve
   figures (Gambar 4.9 / 4.10) are not finalised yet → use placeholder specs. */
export const FIGURES = {
  frameRealFake: {
    src: '/figures/fig-frame-real-fake.png',
    alt: 'Perbandingan frame wajah real dan fake hasil ekstraksi',
    caption: 'Contoh frame wajah real vs fake setelah crop MTCNN.',
    figureNo: 'Gambar 3.2',
  },
  spectralBandMasking: {
    src: '/figures/fig-spectral-band-masking.png',
    alt: 'Ilustrasi spectral band masking pada domain frekuensi',
    caption: 'Pita frekuensi rendah, menengah, dan tinggi pada spektrum.',
    figureNo: 'Gambar 3.3',
  },
  preprocessingFlow: {
    src: '/figures/fig-preprocessing-flow.png',
    alt: 'Flowchart tahapan preprocessing dari video hingga representasi model',
    caption: 'Alur praproses: video → frame → crop wajah → RGB & peta FFT.',
    figureNo: 'Gambar 3.1',
  },
  fftRealFake: {
    src: '/figures/fig-fft-real-fake.png',
    alt: 'Spektrum magnitudo FFT untuk wajah real dan fake',
    caption: 'Peta FFT log-magnitude wajah real vs fake — nyaris tak terbedakan.',
    figureNo: 'Gambar 3.6',
  },
  freqblockResidual: {
    src: '/figures/fig-freqblock-residual.png',
    alt: 'Diagram blok residual FreqBlock',
    caption: 'Struktur FreqBlock residual penyusun FreqCNN.',
    figureNo: 'Gambar 3.8',
  },
  freqcnnArch: {
    src: '/figures/fig-freqcnn-arch.png',
    alt: 'Arsitektur FreqCNN lima blok residual',
    caption: 'Arsitektur cabang frekuensi FreqCNN.',
    figureNo: 'Gambar 3.9',
  },
  hybridTwoBranch: {
    src: '/figures/fig-hybrid-twobranch.png',
    alt: 'Diagram arsitektur HybridTwoBranch dengan late fusion dan SE gating',
    caption: 'Arsitektur HybridTwoBranch: fusi akhir spasial + frekuensi via SE gate.',
    figureNo: 'Gambar 3.10',
  },
  lrSchedule: {
    src: '/figures/fig-lr-schedule.png',
    alt: 'Kurva jadwal learning rate warmup + cosine decay',
    caption: 'Jadwal learning rate: warmup lalu cosine decay.',
    figureNo: 'Gambar 3.11',
  },
  augmentationRgb: {
    src: '/figures/fig-augmentation-rgb.png',
    alt: 'Contoh augmentasi RGB pada data pelatihan',
    caption: 'Augmentasi RGB pada cabang spasial.',
    figureNo: 'Gambar 3.7',
  },
  inDatasetBar: {
    src: '/figures/fig-in-dataset-bar.png',
    alt: 'Diagram batang perbandingan performa in-dataset ketiga model',
    caption: 'Perbandingan in-dataset (FFPP & CDF, n = 750).',
    figureNo: 'Gambar 4.3',
  },
  crossDatasetBar: {
    src: '/figures/fig-cross-dataset-bar.png',
    alt: 'Diagram batang perbandingan performa cross-dataset ketiga model',
    caption: 'Perbandingan cross-dataset kedua arah (n = 750).',
    figureNo: 'Gambar 4.5',
  },
  generalizationDrop: {
    src: '/figures/fig-generalization-drop.png',
    alt: 'Diagram generalization drop F1 per model dan arah pelatihan',
    caption: 'Generalization drop F1 per model & arah (n = 750).',
    figureNo: 'Gambar 4.7',
  },
  scalingAuc: {
    src: '/figures/fig-scaling-auc.png',
    alt: 'Tren AUC terhadap ukuran sampel pelatihan',
    caption: 'Tren AUC in-dataset terhadap ukuran sampel.',
    figureNo: 'Gambar 4.8',
  },

  demoUi: {
    src: '/figures/fig-demo-ui.png',
    alt: 'Antarmuka purwarupa demo perbandingan tiga model di Hugging Face Spaces',
    caption: 'Antarmuka purwarupa: kartu verdict spatial/hybrid/freq berdampingan.',
    figureNo: 'Gambar 4.1',
  },
  whatModelsSee: {
    src: '/figures/fig-what-models-see.png',
    alt: 'Panel what the models see: potongan wajah (spasial) dan spektrum FFT (frekuensi)',
    caption: 'Panel "what the models see": potongan wajah vs spektrum FFT — nyaris tak terbedakan.',
    figureNo: 'Gambar 4.2',
  },

  /* Not finalised yet — render as labelled placeholders. */
  confusionMatrix: {
    src: '/figures/fig-confusion-matrix.png',
    alt: 'Confusion matrix in-dataset vs cross-dataset',
    caption: 'Confusion matrix in-dataset vs cross-dataset (n = 750).',
    figureNo: 'Gambar 4.9',
    placeholder: true,
  },
  trainingCurve: {
    src: '/figures/fig-training-curve.png',
    alt: 'Kurva dinamika pelatihan model frekuensi vs spasial',
    caption: 'Kurva AUC validasi: frekuensi stagnan, spasial konvergen.',
    figureNo: 'Gambar 4.10',
    placeholder: true,
  },
} satisfies Record<string, FigureSpec>

export type FigureKey = keyof typeof FIGURES
