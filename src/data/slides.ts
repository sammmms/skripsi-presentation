/* ============================================================================
   SLIDES — the 24-slide thesis-defense deck, in order. Single source of truth
   for on-slide content and speaker notes. Content is faithful to
   `PRESENTASI_Sidang_2026-06-17.md` (Poin → on-slide, 🎤 Skrip → notes) and
   `BAB_IV_Hasil_dan_Pembahasan_2026-06-17.md`; results numbers come from
   `./results`. On-slide text is concise; the spoken script lives in `notes`.
   ========================================================================== */
import type { Slide } from '@/types/slide'
import { FIGURES } from './figures'
import {
  inDatasetAucChart,
  crossDatasetAucChart,
  scalingAucChart,
} from './results'

export const SLIDES: Slide[] = [
  /* ---- 1 · Sampul -------------------------------------------------------- */
  {
    id: 'cover',
    sectionId: 'intro',
    index: 1,
    layout: 'cover',
    title: 'Deteksi Deepfake: Hybrid XceptionNet–FFT vs Model Domain Tunggal',
    subtitle:
      'Studi Komparatif Kinerja Deteksi Deepfake Berbasis Arsitektur Hybrid XceptionNet–FFT terhadap Model Domain Tunggal',
    authors: [
      { name: 'Naomi Prisella', nim: '221111798' },
      { name: 'Giovanny Halimko', nim: '221110058' },
      { name: 'Samuel Onasis', nim: '221110680' },
    ],
    advisor:
      'Gunawan, S.Kom., M.T.I.  ·  Heru Kurniawan, S.Kom., M.Kom.',
    affiliation:
      'Program Studi S-1 Teknik Informatika · Fakultas Informatika · Universitas Mikroskil, Medan',
    year: '2026',
    notes:
      'Selamat [pagi/siang], kami akan mempresentasikan studi komparatif kinerja deteksi deepfake antara arsitektur hybrid XceptionNet–FFT dan model domain tunggal.',
  },

  /* ---- 2 · Outline ------------------------------------------------------- */
  {
    id: 'outline',
    sectionId: 'intro',
    index: 2,
    layout: 'outline',
    title: 'Outline',
    items: [
      { label: 'Latar Belakang & Masalah', sectionId: 'intro' },
      { label: 'Tujuan & Hipotesis', sectionId: 'intro' },
      { label: 'Landasan Teori', sectionId: 'theory' },
      { label: 'Metodologi', sectionId: 'method' },
      { label: 'Hasil & Pembahasan', sectionId: 'results' },
      { label: 'Kesimpulan & Saran', sectionId: 'conclusion' },
    ],
    notes: 'Sebutkan alurnya dalam satu kalimat, lalu lanjut.',
  },

  /* ---- 3 · Latar Belakang ------------------------------------------------ */
  {
    id: 'latar-belakang',
    sectionId: 'intro',
    index: 3,
    layout: 'bullets',
    kicker: 'Pendahuluan',
    title: 'Latar Belakang',
    bullets: [
      {
        text: 'Deepfake makin realistis dan menjadi ancaman forensik digital (misinformasi, penipuan).',
        icon: 'AlertTriangle',
        tone: 'warn',
      },
      {
        text: 'Detektor **domain spasial** (mis. XceptionNet) kuat di dataset yang sama, tetapi **lemah saat diuji lintas dataset**.',
        icon: 'Eye',
        tone: 'spatial',
      },
      {
        text: 'Literatur mengklaim **domain frekuensi** (artefak GAN) lebih tahan dan lebih *generalizable*.',
        icon: 'Waves',
        tone: 'frequency',
      },
    ],
    notes:
      'Masalah utama bukan akurasi di satu dataset, melainkan generalisasi: model sering jatuh saat menghadapi deepfake dari sumber berbeda. Banyak penelitian mengusulkan domain frekuensi sebagai solusi.',
  },

  /* ---- 4 · Celah Penelitian & Motivasi ----------------------------------- */
  {
    id: 'celah-penelitian',
    sectionId: 'intro',
    index: 4,
    layout: 'bullets',
    kicker: 'Pendahuluan',
    title: 'Celah Penelitian & Motivasi',
    bullets: [
      {
        text: 'Klaim "frekuensi lebih baik" sering diuji pada **kondisi ideal** (kompresi rendah, *cross-manipulation* dalam satu dataset).',
        icon: 'CircleSlash',
        tone: 'frequency',
      },
      {
        text: 'Belum banyak yang **menguji secara terkontrol** kontribusi frekuensi pada **generalisasi cross-dataset** yang lebih berat.',
        icon: 'Scale',
        tone: 'neutral',
      },
      {
        text: '**Posisi kami:** studi **komparatif** untuk mengukur kontribusi frekuensi, bukan menjanjikan peningkatan.',
        icon: 'Target',
        tone: 'hybrid',
      },
    ],
    notes:
      'Di sinilah celahnya. Kami tidak berasumsi frekuensi pasti membantu. Kami mengujinya secara adil dan komparatif.',
  },

  /* ---- 5 · Rumusan Masalah ----------------------------------------------- */
  {
    id: 'rumusan-masalah',
    sectionId: 'intro',
    index: 5,
    layout: 'bullets',
    kicker: 'Pendahuluan',
    title: 'Rumusan Masalah',
    ordered: true,
    bullets: [
      {
        text: 'Sejauh mana detektor spasial murni (XceptionNet) **menurun performanya** saat diuji lintas dataset?',
      },
      {
        text: 'Sejauh mana penambahan analisis frekuensi (FFT) dapat **memperkecil penurunan** tersebut?',
      },
      {
        text: 'Seberapa besar **kontribusi masing-masing komponen** (spasial vs frekuensi) terhadap performa?',
      },
    ],
    notes:
      'Bacakan ketiganya singkat. Tekankan ketiganya bersifat mengukur/membandingkan.',
  },

  /* ---- 6 · Tujuan & Hipotesis -------------------------------------------- */
  {
    id: 'tujuan-hipotesis',
    sectionId: 'intro',
    index: 6,
    layout: 'split',
    kicker: 'Pendahuluan',
    title: 'Tujuan & Hipotesis',
    left: {
      heading: 'Tujuan',
      tone: 'neutral',
      bullets: [
        { text: 'Mengimplementasikan model **hybrid** XceptionNet–FFT.', icon: 'Wrench' },
        {
          text: 'Melakukan *ablation*: spasial vs frekuensi vs hybrid.',
          icon: 'GitCompare',
        },
        {
          text: 'Mengevaluasi generalisasi **in-dataset & cross-dataset**.',
          icon: 'TestTube',
        },
      ],
    },
    right: {
      heading: 'Hipotesis',
      tone: 'hybrid',
      bullets: [
        {
          text: '**H1:** Hybrid memiliki generalisasi cross-dataset lebih baik daripada model spasial.',
          icon: 'CheckCircle2',
          tone: 'good',
        },
        {
          text: '**H0:** Tidak terdapat peningkatan generalisasi yang berarti dari penambahan frekuensi.',
          icon: 'Equal',
          tone: 'neutral',
        },
      ],
    },
    notes:
      'Hipotesis ini kami uji secara empiris dan kami laporkan apa adanya, termasuk bila H0 tidak dapat ditolak.',
  },

  /* ---- 7 · Batasan Penelitian -------------------------------------------- */
  {
    id: 'batasan-penelitian',
    sectionId: 'intro',
    index: 7,
    layout: 'bullets',
    kicker: 'Pendahuluan',
    title: 'Batasan Penelitian',
    columns: 2,
    bullets: [
      {
        text: 'Analisis **level frame** (tanpa pemodelan temporal antar-frame).',
        icon: 'Film',
      },
      {
        text: 'Dua dataset benchmark: **FaceForensics++** dan **Celeb-DF v2**.',
        icon: 'Database',
      },
      {
        text: 'Domain frekuensi memakai **magnitudo FFT** (tanpa fase).',
        icon: 'Waves',
        tone: 'frequency',
      },
      { text: 'Ukuran sampel 100–750 video, **3 seed**.', icon: 'Dices' },
    ],
    notes:
      'Sebutkan singkat, ini sekaligus menyiapkan jawaban untuk pertanyaan keterbatasan.',
  },

  /* ---- 8 · Landasan Teori (1): Spasial vs Frekuensi ---------------------- */
  {
    id: 'teori-spasial-frekuensi',
    sectionId: 'theory',
    index: 8,
    layout: 'figure',
    kicker: 'Landasan Teori 1 / 2',
    title: 'Spasial vs Frekuensi',
    figure: FIGURES.spectralBandMasking,
    figurePosition: 'right',
    bullets: [
      {
        text: '**Domain spasial:** nilai piksel langsung (tekstur, blending, warna).',
        icon: 'Eye',
        tone: 'spatial',
      },
      {
        text: '**Domain frekuensi (FFT):** pola periodik halus/kasar; frekuensi tinggi memuat detail & artefak.',
        icon: 'Waves',
        tone: 'frequency',
      },
      {
        text: '**Artefak GAN:** *up-sampling* gagal mereplikasi statistik frekuensi alami → "sidik jari GAN" di frekuensi menengah-tinggi (Odena, Durall, Zhang).',
        icon: 'Fingerprint',
        tone: 'frequency',
      },
    ],
    notes:
      'Pakai analogi: spasial melihat apa yang tampak, frekuensi melihat pola yang tak kasat mata.',
  },

  /* ---- 9 · Landasan Teori (2): Komponen Model ---------------------------- */
  {
    id: 'teori-komponen-model',
    sectionId: 'theory',
    index: 9,
    layout: 'bullets',
    kicker: 'Landasan Teori 2 / 2',
    title: 'Komponen Model',
    columns: 2,
    bullets: [
      {
        text: '**XceptionNet:** backbone spasial, *depthwise separable convolution*, pretrained ImageNet.',
        icon: 'Eye',
        tone: 'spatial',
      },
      {
        text: '**FFT:** mengubah frame menjadi peta magnitudo frekuensi.',
        icon: 'Waves',
        tone: 'frequency',
      },
      {
        text: '**SE gating:** membobot kepentingan tiap kanal fitur saat fusi.',
        icon: 'SlidersHorizontal',
        tone: 'hybrid',
      },
      {
        text: '**Hybrid (late fusion):** gabungkan fitur spasial + frekuensi di tahap akhir.',
        icon: 'Combine',
        tone: 'hybrid',
      },
    ],
    notes: 'Empat komponen inilah yang kami rakit menjadi model hybrid.',
  },

  /* ---- 10 · Metodologi: Alur Penelitian ---------------------------------- */
  {
    id: 'alur-penelitian',
    sectionId: 'method',
    index: 10,
    layout: 'flow',
    kicker: 'Metodologi',
    title: 'Alur Penelitian',
    figure: FIGURES.preprocessingFlow,
    steps: [
      { label: 'Video', icon: 'Video', tone: 'neutral' },
      { label: 'Frame @5 FPS', detail: 'cuplik frame', icon: 'Film', tone: 'neutral' },
      {
        label: 'MTCNN crop',
        detail: '224×224',
        icon: 'ScanFace',
        tone: 'spatial',
      },
      {
        label: '2 representasi',
        detail: 'RGB + peta FFT',
        icon: 'Layers',
        tone: 'hybrid',
      },
      {
        label: 'Split per-VIDEO',
        detail: '70 / 15 / 15',
        icon: 'Split',
        tone: 'neutral',
      },
      {
        label: 'Latih 3 model',
        detail: 'spatial / freq / hybrid',
        icon: 'Cpu',
        tone: 'hybrid',
      },
      {
        label: 'Evaluasi',
        detail: 'in & cross (3 seed)',
        icon: 'BarChart3',
        tone: 'good',
      },
    ],
    note: 'Split per-video mencegah kebocoran data antara latih dan uji.',
    notes:
      'Jelaskan perjalanan satu video dari awal sampai jadi keputusan. Tekankan split per-video untuk mencegah kebocoran.',
  },

  /* ---- 11 · Dataset ------------------------------------------------------ */
  {
    id: 'dataset',
    sectionId: 'method',
    index: 11,
    layout: 'table',
    kicker: 'Metodologi',
    title: 'Dataset',
    table: {
      columns: [
        { key: 'dataset', label: 'Dataset', align: 'left' },
        { key: 'metode', label: 'Metode manipulasi', align: 'center' },
        { key: 'catatan', label: 'Catatan', align: 'left' },
      ],
      rows: [
        {
          dataset: 'FaceForensics++ (FFPP)',
          metode: '4 metode',
          catatan: '1.000 video (500 real / 500 fake), kompresi c23',
        },
        {
          dataset: 'Celeb-DF v2 (CDF)',
          metode: '1 metode',
          catatan: '750 video (375 real / 375 fake), kualitas tinggi',
        },
      ],
    },
    bullets: [
      {
        text: 'Subset **seimbang** per dataset, dibagi **per video** 70/15/15 (tanpa kebocoran).',
        icon: 'Scale',
        tone: 'neutral',
      },
      {
        text: 'Evaluasi **cross-dataset**: latih di satu, uji di yang lain (**FFPP→CDF** dan **CDF→FFPP**).',
        icon: 'ArrowLeftRight',
        tone: 'neutral',
      },
    ],
    notes:
      'Dua dataset ini memungkinkan kami menguji generalisasi pada generator dan kondisi rekaman yang berbeda. Catatan: Celeb-DF v2 publik berisi 590 video real dan 5.639 fake, tetapi kami memakai subset seimbang 375 real / 375 fake (total 750 video, sesuai Tabel 3.1) agar perbandingan adil dan tidak berat sebelah.',
  },

  /* ---- 12 · Preprocessing ------------------------------------------------ */
  {
    id: 'preprocessing',
    sectionId: 'method',
    index: 12,
    layout: 'figure',
    kicker: 'Metodologi',
    title: 'Preprocessing',
    figure: FIGURES.fftRealFake,
    figurePosition: 'right',
    bullets: [
      {
        text: '**Ekstraksi frame** 5 FPS, maks 50 frame/video.',
        icon: 'Film',
      },
      {
        text: '**Deteksi & crop wajah** dengan MTCNN (margin 0,3) → 224×224.',
        icon: 'ScanFace',
        tone: 'spatial',
      },
      {
        text: '**Peta FFT:** grayscale → FFT 2D → fftshift → magnitudo → high-pass → log → z-score.',
        icon: 'Waves',
        tone: 'frequency',
      },
      {
        text: '**Penting:** hanya **magnitudo**, fase tidak dipakai.',
        icon: 'AlertTriangle',
        tone: 'warn',
      },
    ],
    notes:
      'Tekankan baris terakhir, ini relevan ke pembahasan kegagalan frekuensi.',
  },

  /* ---- 13 · Arsitektur Tiga Model ---------------------------------------- */
  {
    id: 'arsitektur-tiga-model',
    sectionId: 'method',
    index: 13,
    layout: 'models',
    kicker: 'Metodologi',
    title: 'Arsitektur Tiga Model',
    figure: FIGURES.hybridTwoBranch,
    models: [
      {
        name: 'Spatial',
        tagline: 'Hanya cabang spasial',
        tone: 'spatial',
        params: '~22 jt',
        points: ['RGB → XceptionNet → logit'],
        metric: { value: '0,969', label: 'AUC in-dataset (CDF)' },
      },
      {
        name: 'Freq',
        tagline: 'Hanya cabang frekuensi',
        tone: 'frequency',
        params: '~4 jt',
        points: ['Peta FFT → FreqCNN (5 blok residual) → logit'],
        metric: { value: '≈0,55', label: 'AUC ≈ acak' },
      },
      {
        name: 'Hybrid',
        tagline: 'Late fusion spasial + frekuensi',
        tone: 'hybrid',
        points: [
          '(Xception 256-d) + (FreqCNN 256-d)',
          '→ concat 512-d → SE gate → klasifikasi',
        ],
      },
    ],
    notes:
      'Ketiga model berbagi komponen yang sama supaya perbandingannya adil dan kami bisa mengisolasi kontribusi tiap domain.',
  },

  /* ---- 14 · Strategi Pelatihan ------------------------------------------- */
  {
    id: 'strategi-pelatihan',
    sectionId: 'method',
    index: 14,
    layout: 'bullets',
    kicker: 'Metodologi',
    title: 'Strategi Pelatihan',
    figure: FIGURES.lrSchedule,
    bullets: [
      {
        text: 'Loss: **BCEWithLogitsLoss** + label smoothing 0,05.',
        icon: 'Activity',
      },
      {
        text: 'Optimizer: **AdamW** (lr 2e-4) dengan *differential learning rate*.',
        icon: 'Settings2',
      },
      {
        text: 'Backbone dibekukan 3 epoch awal lalu di-unfreeze; warmup 2 epoch + cosine decay.',
        icon: 'Snowflake',
      },
      {
        text: 'Mixed precision, gradient accumulation, gradient clipping.',
        icon: 'Gauge',
      },
      {
        text: '**Seleksi model terbaik berdasarkan val AUC**, early stopping, 3 seed.',
        icon: 'Trophy',
        tone: 'good',
      },
    ],
    notes: 'Lewati cepat, ini bukti rigor. Siapkan detail jika ditanya.',
  },

  /* ---- 15 · Desain Eksperimen -------------------------------------------- */
  {
    id: 'desain-eksperimen',
    sectionId: 'method',
    index: 15,
    layout: 'table',
    kicker: 'Metodologi',
    title: 'Desain Eksperimen',
    table: {
      columns: [
        { key: 'dimensi', label: 'Dimensi', align: 'left' },
        { key: 'nilai', label: 'Nilai', align: 'left' },
        { key: 'jumlah', label: 'Jumlah', align: 'center' },
      ],
      rows: [
        { dimensi: 'Model', nilai: 'spatial, freq, hybrid', jumlah: 3 },
        { dimensi: 'Dataset', nilai: 'FFPP, CDF', jumlah: 2 },
        { dimensi: 'Ukuran sampel', nilai: '100, 250, 500, 750', jumlah: 4 },
        { dimensi: 'Seed', nilai: '0, 1, 2', jumlah: 3 },
        { dimensi: 'Evaluasi', nilai: 'in-dataset, cross-dataset', jumlah: 2 },
      ],
    },
    bullets: [
      {
        text: 'Metrik: accuracy, precision, recall, F1, **AUC (utama)**.',
        icon: 'Ruler',
      },
      {
        text: 'Ambang **θ = 0,5** dan ambang optimal **Youden J**.',
        icon: 'SlidersHorizontal',
      },
    ],
    notes:
      'Total kombinasi ini membuat perbandingan kami terkontrol dan dapat direproduksi.',
  },

  /* ---- 16 · Hasil (1): In-Dataset ---------------------------------------- */
  {
    id: 'hasil-in-dataset',
    sectionId: 'results',
    index: 16,
    layout: 'chart',
    kicker: 'Hasil 1 / 3',
    title: 'In-Dataset',
    chart: inDatasetAucChart,
    figure: FIGURES.inDatasetBar,
    stats: [
      {
        value: 0.969,
        decimals: 3,
        label: 'AUC spatial (CDF)',
        tone: 'spatial',
      },
      {
        value: 0.586,
        decimals: 3,
        label: 'AUC freq (CDF) — ≈ acak',
        tone: 'frequency',
      },
    ],
    bullets: [
      {
        text: '**Spatial konsisten terbaik**, AUC in-dataset hingga **~0,97**.',
        icon: 'Eye',
        tone: 'spatial',
      },
      {
        text: '**Freq nyaris setara tebakan acak**, AUC **0,55–0,59**.',
        icon: 'Waves',
        tone: 'frequency',
      },
      {
        text: '**Hybrid tidak mengungguli spatial** pada semua tier andal dan kedua dataset.',
        icon: 'Combine',
        tone: 'hybrid',
      },
    ],
    notes:
      'Temuan pertama sudah jelas: menambahkan frekuensi tidak menaikkan performa in-dataset.',
  },

  /* ---- 17 · Hasil (2): Cross-Dataset & Generalization Drop --------------- */
  {
    id: 'hasil-cross-dataset',
    sectionId: 'results',
    index: 17,
    layout: 'chart',
    kicker: 'Hasil 2 / 3',
    title: 'Cross-Dataset & Generalization Drop',
    chart: crossDatasetAucChart,
    figure: FIGURES.crossDatasetBar,
    stats: [
      {
        value: 0.083,
        decimals: 3,
        label: 'recall spatial CDF→FFPP',
        tone: 'bad',
      },
      {
        value: 0.027,
        decimals: 3,
        prefix: '+',
        label: 'Δ F1 hybrid (FFPP→CDF)',
        tone: 'hybrid',
      },
    ],
    bullets: [
      {
        text: 'Semua model **menurun** saat lintas dataset, AUC ke **~0,63–0,65**.',
        icon: 'TrendingDown',
        tone: 'warn',
      },
      {
        text: '**Recall collapse** terparah arah **CDF→FFPP (recall ≈ 0,08)**.',
        icon: 'AlertTriangle',
        tone: 'bad',
      },
      {
        text: 'Manfaat frekuensi **parsial & bergantung arah**: drop F1 hybrid **+0,027** vs spatial **+0,116**, tetapi **tidak konsisten** pada arah sebaliknya.',
        icon: 'ArrowLeftRight',
        tone: 'hybrid',
      },
    ],
    notes:
      'Frekuensi hanya menahan penurunan pada satu arah, dan itu pun dengan mengorbankan performa in-dataset.',
  },

  /* ---- 18 · Hasil (3): Ukuran Sampel & Dinamika -------------------------- */
  {
    id: 'hasil-ukuran-sampel',
    sectionId: 'results',
    index: 18,
    layout: 'chart',
    kicker: 'Hasil 3 / 3',
    title: 'Ukuran Sampel & Dinamika Pelatihan',
    chart: scalingAucChart,
    figure: FIGURES.scalingAuc,
    bullets: [
      {
        text: 'Tren AUC vs ukuran sampel: **spatial naik stabil**.',
        icon: 'TrendingUp',
        tone: 'spatial',
      },
      {
        text: '**Freq tetap datar** di sekitar acak di seluruh tier.',
        icon: 'Minus',
        tone: 'frequency',
      },
      {
        text: 'Kurva pelatihan freq **stagnan sejak awal** (gagal belajar pola diskriminatif).',
        icon: 'Activity',
        tone: 'bad',
      },
      {
        text: 'Confusion matrix cross-dataset **menegaskan keruntuhan recall**.',
        icon: 'Grid3x3',
        tone: 'warn',
      },
    ],
    notes:
      'Cabang frekuensi bukan kurang optimal di akhir, ia memang tidak pernah belajar.',
  },

  /* ---- 19 · Pembahasan (1): Mengapa Cabang Frekuensi Gagal --------------- */
  {
    id: 'pembahasan-frekuensi-gagal',
    sectionId: 'results',
    index: 19,
    layout: 'bullets',
    kicker: 'Pembahasan 1 / 2',
    title: 'Mengapa Cabang Frekuensi Gagal',
    ordered: true,
    bullets: [
      {
        text: '**Artefak rusak praproses:** crop MTCNN + kompresi c23 menekan frekuensi tinggi (Mejri).',
        tone: 'frequency',
      },
      {
        text: '**Fase dibuang:** hanya magnitudo, padahal fase membawa struktur (Oppenheim & Lim, Liu/SPSL).',
        tone: 'frequency',
      },
      {
        text: '**Bias CNN:** cenderung tekstur & frekuensi rendah dulu (Geirhos, Rahaman, Wang).',
        tone: 'neutral',
      },
      {
        text: '**Representasi terlalu sederhana:** satu peta FFT mentah ke CNN dangkal.',
        tone: 'neutral',
      },
    ],
    notes: 'Ini slide inti pertahanan. Kuasai keempatnya.',
  },

  /* ---- 20 · Pembahasan (2): Posisi terhadap Literatur & Hipotesis -------- */
  {
    id: 'pembahasan-literatur-hipotesis',
    sectionId: 'results',
    index: 20,
    layout: 'bullets',
    kicker: 'Pembahasan 2 / 2',
    title: 'Posisi terhadap Literatur & Hipotesis',
    bullets: [
      {
        text: 'Bukan kontradiksi, melainkan **kondisi batas**: artefak frekuensi tetap ada (Durall, Zhang), tetapi mengeksploitasinya bersifat kondisional.',
        icon: 'GitBranch',
        tone: 'neutral',
      },
      {
        text: 'Penelitian sukses umumnya memakai **representasi & fusi frekuensi lebih canggih** serta menguji *cross-manipulation* yang lebih ringan.',
        icon: 'BookOpen',
        tone: 'neutral',
      },
      {
        text: '**Hipotesis: H0 tidak dapat ditolak.** Selisih dibahas deskriptif (3 seed).',
        icon: 'Equal',
        tone: 'warn',
      },
    ],
    notes:
      'Kami melengkapi literatur dengan menandai kapan frekuensi gagal membantu.',
  },

  /* ---- 21 · Purwarupa (Demo) --------------------------------------------- */
  {
    id: 'purwarupa-demo',
    sectionId: 'results',
    index: 21,
    layout: 'demo',
    kicker: 'Hasil & Pembahasan',
    title: 'Purwarupa',
    // Use the *.hf.space app subdomain — the huggingface.co/spaces/... page sends
    // X-Frame-Options/CSP that block iframing ("refused to connect"). The
    // direct Space host is embeddable.
    embedUrl:
      import.meta.env.VITE_DEMO_URL ??
      'https://thesissufferer-deepfake-detection-demo.hf.space',
    // Real prototype screenshots (Gambar 4.1 UI, 4.2 "what the models see").
    // Zoomable thumbnails beside the live embed; tap to project full-screen.
    figures: [FIGURES.demoUi, FIGURES.whatModelsSee],
    bullets: [
      {
        text: 'Tiga model dengan **verdict berdampingan** dalam purwarupa **Gradio** di **Hugging Face Spaces**.',
        icon: 'LayoutGrid',
        tone: 'hybrid',
      },
      {
        text: 'Panel **"what the models see"**: wajah (spasial) vs spektrum FFT (frekuensi).',
        icon: 'Eye',
        tone: 'spatial',
      },
      {
        text: 'Bukti kualitatif: spektrum FFT real vs fake **nyaris tak terbedakan**.',
        icon: 'Waves',
        tone: 'frequency',
      },
    ],
    notes:
      'Tunjukkan Gambar 4.1 & 4.2 (atau demo live bila diizinkan).',
  },

  /* ---- 22 · Kesimpulan --------------------------------------------------- */
  {
    id: 'kesimpulan',
    sectionId: 'conclusion',
    index: 22,
    layout: 'bullets',
    kicker: 'Kesimpulan & Saran',
    title: 'Kesimpulan',
    ordered: true,
    bullets: [
      {
        text: '**RM1:** detektor spasial murni **menurun substansial** lintas dataset (recall collapse, terparah CDF→FFPP).',
        tone: 'spatial',
      },
      {
        text: '**RM2:** penambahan FFT **hanya menekan penurunan secara parsial dan bergantung arah**, dengan mengorbankan performa in-dataset.',
        tone: 'hybrid',
      },
      {
        text: '**RM3:** **spasial penyumbang utama**, frekuensi ≈ acak sehingga **hybrid tidak mengungguli spasial**.',
        tone: 'frequency',
      },
    ],
    notes:
      'Secara keseluruhan, pada konfigurasi yang diuji, kontribusi domain frekuensi terbatas dan generalisasi lintas dataset tetap menjadi tantangan terbuka.',
  },

  /* ---- 23 · Saran -------------------------------------------------------- */
  {
    id: 'saran',
    sectionId: 'conclusion',
    index: 23,
    layout: 'bullets',
    kicker: 'Kesimpulan & Saran',
    title: 'Saran',
    columns: 2,
    bullets: [
      {
        text: '**Perkuat cabang frekuensi:** sertakan **fase** (mis. SPSL), FFT pada frame penuh, analisis multi-skala.',
        icon: 'Waves',
        tone: 'frequency',
      },
      {
        text: '**Fusi lebih baik:** regularisasi/atensi dua-domain, pretraining cabang frekuensi.',
        icon: 'Combine',
        tone: 'hybrid',
      },
      {
        text: '**Domain transformasi alternatif:** DCT, wavelet.',
        icon: 'Shapes',
        tone: 'neutral',
      },
      {
        text: '**Adaptasi domain eksplisit** + **uji signifikansi statistik** + **pemodelan temporal**.',
        icon: 'Layers',
        tone: 'neutral',
      },
    ],
    notes: 'Sambungkan tiap saran ke akar penyebab di Slide 19.',
  },

  /* ---- 24 · Kontribusi Ilmiah & Penutup ---------------------------------- */
  {
    id: 'penutup',
    sectionId: 'closing',
    index: 24,
    layout: 'closing',
    kicker: 'Penutup',
    title: 'Kontribusi Ilmiah & Penutup',
    highlight:
      'Nilai hasil negatif: menantang asumsi "tambah FFT pasti lebih baik" dengan bukti, mencegah jalan buntu yang sama.',
    bullets: [
      {
        text: 'Studi komparatif terkontrol (**3 model × 2 dataset × 3 seed**) dengan **evaluasi cross-dataset**.',
        icon: 'GitCompare',
      },
      {
        text: 'Bukti kuantitatif bahwa kontribusi frekuensi **terbatas & kondisional**.',
        icon: 'BarChart3',
      },
      {
        text: 'Analisis akar penyebab + posisi terhadap literatur.',
        icon: 'Search',
      },
    ],
    thanks: 'Terima kasih',
    qr: true,
    notes: 'Terima kasih. Kami siap menerima pertanyaan dan masukan.',
  },
]
