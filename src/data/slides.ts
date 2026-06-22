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
      `Selamat [pagi/siang], Bapak/Ibu penguji yang kami hormati. Perkenalkan, kami bertiga — **Naomi, Giovanny, dan Samuel**.

Pada kesempatan ini kami akan mempresentasikan tugas akhir kami yang berjudul **"Deteksi Deepfake: Hybrid XceptionNet–FFT vs Model Domain Tunggal"** — sebuah studi komparatif kinerja deteksi deepfake antara arsitektur **hybrid** yang menggabungkan domain spasial dan frekuensi, dengan **model domain tunggal**. Izinkan kami memulai.`,
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
    notes: `Sebelum masuk ke isi, ini **alur** presentasi kami. *[tunjuk outline]* Kami mulai dari **latar belakang dan rumusan masalah**, lalu **tujuan dan hipotesis**, dilanjutkan **landasan teori** singkat.

Setelah itu kami masuk ke **metodologi**, kemudian **hasil dan pembahasan** sebagai bagian inti, dan ditutup dengan **kesimpulan dan saran**. *[langsung lanjut]*`,
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
      `Mari kita mulai dari **latar belakang**. *[tunjuk poin]*

**Deepfake** kini makin realistis dan sudah menjadi ancaman nyata bagi forensik digital — dari misinformasi sampai penipuan. Maka kebutuhan akan **detektor yang andal** semakin penting.

Masalahnya: detektor **domain spasial** seperti **XceptionNet** sangat kuat ketika diuji pada dataset yang sama dengan data latihnya, tetapi performanya **jatuh saat diuji lintas dataset** — saat bertemu deepfake dari sumber yang berbeda.

Untuk mengatasi itu, banyak literatur mengklaim bahwa **domain frekuensi** — yang menangkap artefak GAN — lebih tahan dan lebih *generalizable*. Jadi masalah utamanya bukan akurasi pada satu dataset, melainkan **generalisasi**. Klaim inilah yang ingin kami uji.`,
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
      `Lalu di mana **celah penelitiannya**? *[tunjuk poin]*

Klaim bahwa "frekuensi lebih baik" sering diuji pada **kondisi ideal** — kompresi rendah, dan hanya *cross-manipulation* di dalam satu dataset yang sama.

Yang masih jarang dilakukan adalah pengujian **terkontrol** atas kontribusi frekuensi pada **generalisasi cross-dataset** yang jauh lebih berat.

Maka **posisi kami jelas**: ini studi **komparatif** untuk **mengukur** kontribusi frekuensi secara adil — bukan untuk menjanjikan peningkatan. Kami tidak berasumsi frekuensi pasti membantu; kami mengujinya.`,
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
      `Dari celah itu kami menurunkan **tiga rumusan masalah**. *[tunjuk daftar]*

**Pertama**, sejauh mana detektor spasial murni — XceptionNet — **menurun performanya** saat diuji lintas dataset?

**Kedua**, sejauh mana penambahan analisis frekuensi melalui FFT dapat **memperkecil penurunan** itu?

**Ketiga**, seberapa besar **kontribusi masing-masing komponen** — spasial dibanding frekuensi — terhadap performa?

Perhatikan, ketiganya bersifat **mengukur dan membandingkan**, bukan mengasumsikan satu domain pasti menang.`,
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
      `Dari rumusan masalah, ini **tujuan dan hipotesis** kami. *[tunjuk dua kolom]*

Di sisi **tujuan**: kami **mengimplementasikan** model hybrid XceptionNet–FFT; melakukan **ablation** — membandingkan spasial, frekuensi, dan hybrid; lalu **mengevaluasi generalisasi** baik in-dataset maupun cross-dataset.

Di sisi **hipotesis**: **H1** menyatakan hybrid memiliki generalisasi cross-dataset yang lebih baik daripada model spasial. Sedangkan **H0** menyatakan tidak ada peningkatan generalisasi yang berarti dari penambahan frekuensi.

Yang ingin saya tekankan: hipotesis ini kami uji **secara empiris** dan kami laporkan **apa adanya** — termasuk bila ternyata **H0 tidak dapat ditolak**.`,
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
      `Sebelum lanjut, ini **batasan penelitian** kami — sengaja kami tegaskan supaya ruang lingkupnya jelas. *[tunjuk poin]*

Pertama, analisis kami pada **level frame**, tanpa pemodelan temporal antar-frame. Kedua, kami memakai **dua dataset benchmark**: FaceForensics++ dan Celeb-DF versi dua. Ketiga, domain frekuensi kami wakili dengan **magnitudo FFT** saja — **tanpa fase**. Keempat, ukuran sampel **seratus sampai tujuh ratus lima puluh** video, dengan **tiga seed**.

*[Batasan ketiga — tanpa fase — akan kembali muncul di pembahasan kegagalan frekuensi.]*`,
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
      `Masuk ke **landasan teori**. Ada dua cara memandang sebuah citra. *[tunjuk gambar spektrum]*

**Domain spasial** melihat **nilai piksel secara langsung** — tekstur, blending, warna. Inilah yang ditangkap XceptionNet.

**Domain frekuensi**, lewat FFT, melihat **pola periodik** — halus dan kasar. Komponen frekuensi **tinggi** memuat detail dan, yang penting, **artefak**.

Analoginya: spasial melihat **apa yang tampak**, sedangkan frekuensi melihat **pola yang tak kasat mata**.

Mengapa relevan? Karena **artefak GAN**: proses *up-sampling* gagal mereplikasi statistik frekuensi alami, sehingga meninggalkan semacam **"sidik jari GAN"** di frekuensi menengah-tinggi — ditunjukkan oleh **Odena, Durall, dan Zhang**. Inilah dasar harapan bahwa frekuensi bisa membantu.`,
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
    notes: `Dari teori itu, ini **empat komponen** yang kami pakai untuk merakit model. *[tunjuk dua kolom]*

**XceptionNet** — backbone spasial, memakai *depthwise separable convolution*, dan sudah *pretrained* pada ImageNet.

**FFT** — mengubah tiap frame menjadi **peta magnitudo frekuensi**.

**SE gating** — membobot tingkat kepentingan tiap kanal fitur saat fusi, sehingga model bisa menekankan informasi yang paling berguna.

**Hybrid** dengan **late fusion** — menggabungkan fitur spasial dan frekuensi di tahap akhir.

Empat komponen inilah yang kami rakit menjadi **model hybrid** yang akan kita lihat arsitekturnya berikutnya.`,
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
      `Sekarang kita masuk ke **metodologi**. Slide ini menunjukkan alur penelitian secara utuh — perjalanan satu video dari awal hingga menjadi sebuah keputusan. *[tunjuk diagram alur]*

Kita mulai dari **video**. Dari tiap video kita **cuplik frame pada lima FPS**. Setiap frame lalu dideteksi wajahnya dan **di-crop dengan MTCNN** ke ukuran **224 kali 224** piksel.

Dari frame wajah ini kita bentuk **dua representasi**: citra **RGB** untuk cabang spasial, dan **peta FFT** untuk cabang frekuensi.

Lalu data dibagi train, validation, dan test dengan rasio **70 / 15 / 15**. Dan ini penting — pembagiannya **per-video, bukan per-frame**. Artinya frame dari satu video tidak boleh tersebar di train dan test sekaligus. Ini **mencegah kebocoran data** yang bisa membuat hasil terlihat lebih bagus dari yang sebenarnya.

Dari sini kita latih **tiga model** — spasial, frekuensi, dan hybrid — dan kita evaluasi pada **dua skenario**, in-dataset dan cross-dataset, masing-masing dengan **tiga seed**.`,
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
          catatan: '750 video (375 real / 375 fake), kompresi c23',
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
      `Kami memakai **dua dataset benchmark**. *[tunjuk tabel]*

Yang pertama, **FaceForensics++** — kami singkat FFPP. Kami pakai **subset seimbang 750 video**, 375 asli dan 375 palsu, dengan **empat metode manipulasi**, pada tingkat kompresi c23.

Yang kedua, **Celeb-DF versi dua** — CDF. Berisi **750 video**, 375 asli dan 375 palsu, dengan satu metode manipulasi tetapi **kualitas yang tinggi**.

Dua catatan penting. Pertama, kedua dataset kami pakai sebagai **subset seimbang 375 / 375 (750 video)**, dibagi **per video** 70/15/15 tanpa kebocoran. *[Bila ditanya: benchmark FFPP penuh jauh lebih besar (1.000 video asli + empat metode manipulasi) dan Celeb-DF v2 publik tidak seimbang (590 real / 5.639 fake) — tetapi kami sengaja mengambil subset seimbang 375 / 375 untuk tiap dataset, sesuai Tabel 3.1, supaya perbandingannya adil dan tidak berat sebelah.]*

Kedua, kami melakukan **evaluasi cross-dataset**: model dilatih di satu dataset lalu diuji di dataset lain — **kedua arah**, FFPP ke CDF dan CDF ke FFPP. Inilah inti pengujian generalisasi kami.`,
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
      `Slide ini merinci tahap **preprocessing**. *[tunjuk gambar spektrum FFT real vs fake]*

Pertama, **ekstraksi frame** pada lima FPS, maksimal lima puluh frame per video.

Kedua, **deteksi dan crop wajah** dengan MTCNN, margin nol koma tiga, lalu di-resize ke 224 kali 224.

Ketiga, pembentukan **peta FFT**. Urutannya: frame diubah ke grayscale, dilakukan FFT dua dimensi, lalu *fftshift* untuk memusatkan frekuensi rendah, diambil **magnitudo**-nya, diberi *high-pass*, di-*log*, dan terakhir dinormalisasi dengan *z-score*.

Dan satu hal yang ingin saya tekankan — ini akan relevan nanti di pembahasan: kami **hanya memakai magnitudo**. Informasi **fase tidak kami pakai**. Keputusan desain ini kelak menjadi salah satu penjelasan mengapa cabang frekuensi gagal.`,
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
        params: '~22,8 jt',
        points: ['RGB → XceptionNet → logit'],
        metric: { value: '0,971', label: 'AUC in-dataset (CDF)' },
      },
      {
        name: 'Freq',
        tagline: 'Hanya cabang frekuensi',
        tone: 'frequency',
        params: '~4,2 jt',
        points: ['Peta FFT → FreqCNN (5 blok residual) → logit'],
        metric: { value: '≈0,56', label: 'AUC ≈ acak' },
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
      `Ini **arsitektur** dari ketiga model yang kami bandingkan. *[tunjuk diagram dua cabang]*

Model pertama, **Spatial**. Murni cabang spasial: citra RGB masuk ke **XceptionNet**, langsung menghasilkan logit. Sekitar **22,8 juta** parameter.

Model kedua, **Freq**. Murni cabang frekuensi: peta FFT masuk ke **FreqCNN** — sebuah CNN dengan lima blok residual — menghasilkan logit. Jauh lebih ringan, sekitar **4,2 juta** parameter.

Model ketiga, **Hybrid**. Ini menggabungkan keduanya dengan **late fusion**. Fitur dari XceptionNet diproyeksikan ke 256 dimensi, fitur dari FreqCNN juga 256 dimensi; keduanya **digabung menjadi 512 dimensi**, melewati **SE gate** untuk pembobotan, lalu masuk ke klasifikasi.

Kuncinya: **ketiga model berbagi komponen yang sama**. Dengan begitu perbandingannya adil, dan kami bisa **mengisolasi kontribusi tiap domain** secara bersih.

*[Opsional, sebagai jembatan ke hasil: angka kecil di tiap kartu adalah pratinjau hasil — sudah terlihat di sini bahwa cabang frekuensi mendekati acak.]*`,
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
        text: 'Backbone dibekukan 3 epoch awal lalu di-unfreeze; warmup 3 epoch + cosine decay.',
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
    notes: `Strategi pelatihan saya **lewati cepat** — ini lebih ke bukti rigor, dan saya siap merinci bila Bapak/Ibu penguji ingin. *[tunjuk kurva learning rate]*

Singkatnya: loss **BCEWithLogitsLoss** dengan *label smoothing* nol koma nol lima. Optimizer **AdamW** dengan *learning rate* dua kali sepuluh pangkat minus empat, memakai *differential learning rate*. Backbone kami **bekukan tiga epoch pertama** lalu di-unfreeze, dengan *warmup* tiga epoch dilanjutkan *cosine decay*.

Kami juga pakai *mixed precision*, *gradient accumulation*, dan *gradient clipping* untuk stabilitas.

Dan yang penting untuk reproduktibilitas: **model terbaik dipilih berdasarkan AUC validasi**, dengan *early stopping*, dan semuanya diulang pada **tiga seed**.`,
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
      `Terakhir di metodologi, **desain eksperimen** — bagaimana semua faktor ini dikombinasikan. *[tunjuk tabel]*

Ada lima dimensi: **tiga model** — spasial, frekuensi, hybrid; **dua dataset** — FFPP dan CDF; **empat ukuran sampel** — seratus, dua ratus lima puluh, lima ratus, dan tujuh ratus lima puluh; **tiga seed**; dan **dua skenario evaluasi** — in-dataset dan cross-dataset.

Untuk metrik, kami laporkan *accuracy*, *precision*, *recall*, dan F1, dengan **AUC sebagai metrik utama** — karena AUC tidak bergantung pada pemilihan ambang.

Soal ambang, kami evaluasi pada dua titik: ambang standar **nol koma lima**, dan ambang optimal lewat **Youden J**.

Total kombinasi inilah yang membuat perbandingan kami **terkontrol penuh dan dapat direproduksi**. Dengan fondasi metodologi ini, mari kita lihat hasilnya.`,
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
        value: 0.971,
        decimals: 3,
        label: 'AUC spatial (CDF)',
        tone: 'spatial',
      },
      {
        value: 0.562,
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
        text: '**Freq nyaris setara tebakan acak**, AUC **≈ 0,56**.',
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
      `Kita masuk ke hasil. Mulai dari skenario **in-dataset** — model dilatih dan diuji pada dataset yang sama. *[tunjuk grafik batang in-dataset]* Ada tiga temuan di sini.

Pertama, model **spasial konsisten paling unggul**. AUC-nya mencapai sekitar **nol koma sembilan tujuh** — pada Celeb-DF tepatnya nol koma sembilan tujuh satu, sementara pada FaceForensics lebih rendah, sekitar nol koma tujuh delapan. Artinya, dari piksel saja, XceptionNet sudah sangat baik membedakan asli dan palsu.

Kedua, dan ini penting — cabang **frekuensi nyaris setara tebakan acak**. AUC-nya hanya sekitar nol koma lima enam di kedua dataset; pada Celeb-DF tepatnya nol koma lima enam dua. Nol koma lima itu praktis seperti melempar koin.

Ketiga, karena frekuensi tidak membawa informasi diskriminatif, model **hybrid pun tidak mengungguli spasial** — di semua tier sampel yang andal, dan di kedua dataset.

Jadi temuan pertama sudah jelas: pada kondisi in-dataset, menambahkan frekuensi tidak menaikkan performa.`,
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
        value: 0.074,
        decimals: 3,
        label: 'recall spatial CDF→FFPP',
        tone: 'bad',
      },
      {
        value: 0.012,
        decimals: 3,
        prefix: '+',
        label: 'Δ F1 hybrid (FFPP→CDF)',
        tone: 'hybrid',
      },
    ],
    bullets: [
      {
        text: 'Semua model **menurun** saat lintas dataset, AUC ke **~0,56–0,68**.',
        icon: 'TrendingDown',
        tone: 'warn',
      },
      {
        text: '**Recall collapse** terparah arah **CDF→FFPP (recall ≈ 0,07)**.',
        icon: 'AlertTriangle',
        tone: 'bad',
      },
      {
        text: 'Manfaat frekuensi **parsial & bergantung arah**: drop F1 hybrid **+0,012** vs spatial **+0,091**, tetapi **tidak konsisten** pada arah sebaliknya.',
        icon: 'ArrowLeftRight',
        tone: 'hybrid',
      },
    ],
    notes:
      `Sekarang skenario yang lebih menantang dan lebih realistis: **cross-dataset**. Model dilatih di satu dataset, lalu diuji di dataset yang berbeda — meniru kondisi nyata saat detektor bertemu deepfake dari sumber yang belum pernah dilihat. *[tunjuk grafik cross-dataset]*

Temuan pertama: **semua model menurun**. AUC jatuh ke kisaran **nol koma lima enam sampai nol koma enam delapan**. Ini tepat menjawab kekhawatiran utama kami soal generalisasi.

Yang paling mencolok adalah **recall collapse** — terutama pada arah **Celeb-DF ke FaceForensics**. Recall-nya hanya sekitar **nol koma nol tujuh**. Artinya model hampir gagal total menangkap sampel palsu di domain baru.

Soal frekuensi: di sini manfaatnya **mulai terlihat, tapi parsial dan bergantung arah**. Pada arah FaceForensics ke Celeb-DF, penurunan F1 model hybrid hanya **plus nol koma nol satu dua**, jauh lebih kecil dibanding spasial yang turun **plus nol koma nol sembilan satu** — jadi hybrid lebih tahan. Tetapi keunggulan ini **tidak konsisten** pada arah sebaliknya.

Kesimpulannya: frekuensi hanya menahan penurunan pada satu arah, dan itu pun dengan mengorbankan performa in-dataset tadi.`,
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
      `Temuan ketiga menjawab satu kemungkinan keberatan: apakah cabang frekuensi mungkin hanya **kekurangan data**? *[tunjuk kurva AUC vs ukuran sampel]*

Kami memvariasikan ukuran sampel. Tren AUC model **spasial naik stabil** seiring bertambahnya data — perilaku belajar yang sehat. Sebaliknya, cabang **frekuensi tetap datar** di sekitar level acak di **seluruh tier** — dari sampel kecil sampai besar.

Lebih dari itu, **kurva pelatihannya stagnan sejak awal**. Ini bukan kasus overfitting atau kurang epoch — modelnya memang tidak pernah menemukan pola diskriminatif untuk dipelajari.

Dan **confusion matrix** pada skenario cross-dataset **menegaskan keruntuhan recall** yang tadi kita lihat.

Jadi intinya: cabang frekuensi bukan kurang optimal di tahap akhir — **ia memang tidak pernah belajar**. Ini yang mengantar kita ke pembahasan berikutnya: mengapa?`,
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
    notes: `Ini bagian terpenting dari pembahasan kami. Kami **tidak berhenti pada "frekuensi gagal"** — kami menjelaskan **mengapa**, dan kami menemukan empat penyebab yang saling menguatkan.

**Pertama, artefak frekuensinya rusak oleh praproses.** Crop wajah dengan MTCNN dan kompresi video c23 sama-sama menekan komponen frekuensi tinggi — padahal justru di situlah artefak deepfake biasanya berada. Ini sejalan dengan temuan **Mejri**.

**Kedua, kami membuang informasi fase.** Kami hanya memakai magnitudo FFT, padahal **fase** justru membawa informasi struktur citra. **Oppenheim dan Lim** menunjukkan ini, dan metode seperti **SPSL** dari Liu memanfaatkan fase secara eksplisit.

**Ketiga, ada bias arsitektur.** CNN cenderung belajar tekstur dan frekuensi rendah lebih dulu — ini didokumentasikan oleh **Geirhos, Rahaman, dan Wang**. Jadi sinyal frekuensi tinggi yang lemah memang sulit ditangkap.

**Keempat, representasi kami terlalu sederhana** — satu peta FFT mentah dimasukkan ke CNN yang dangkal. Tidak cukup ekspresif untuk mengekstraksi pola yang halus.

Empat hal inilah yang menjelaskan kegagalan tersebut secara menyeluruh — dan masing-masing nanti menjadi dasar saran perbaikan kami.`,
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
      `Lalu, bagaimana posisi temuan kami terhadap literatur yang justru memuji domain frekuensi?

Kami menegaskan: ini **bukan kontradiksi, melainkan kondisi batas** — *boundary condition*. Artefak frekuensi memang **tetap ada**, sebagaimana ditunjukkan **Durall dan Zhang**. Yang kami tunjukkan adalah bahwa **mengeksploitasinya bersifat kondisional** — tergantung representasi, skema fusi, dan tingkat kesulitan pengujian.

Penelitian-penelitian yang berhasil umumnya memakai **representasi dan fusi frekuensi yang jauh lebih canggih**, dan menguji pada *cross-manipulation* yang lebih ringan — bukan *cross-dataset* yang seketat pengujian kami.

Soal hipotesis: berdasarkan bukti kami, **H0 tidak dapat ditolak**. Selisih antar-model kami bahas secara **deskriptif** menggunakan tiga seed, tanpa mengklaim signifikansi statistik yang tidak kami uji.

Jadi kami tidak menyangkal literatur — kami **melengkapinya**, dengan menandai secara tepat kapan frekuensi gagal membantu.`,
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
      `Untuk membuat temuan ini konkret, kami membangun sebuah **purwarupa**. *[tunjuk Gambar 4.1 — antarmuka demo]*

Ini aplikasi **Gradio** yang kami hosting di **Hugging Face Spaces**. Pengguna mengunggah gambar, dan ketiga model — spasial, frekuensi, dan hybrid — memberikan **verdict berdampingan**, sehingga perbedaannya langsung terlihat.

Yang menarik adalah panel **"what the models see"**. *[tunjuk Gambar 4.2]* Di sebelah kiri, **wajah** yang dilihat cabang spasial. Di sebelah kanan, **spektrum FFT** yang dilihat cabang frekuensi.

Dan di sinilah bukti kualitatifnya: **spektrum FFT untuk wajah asli dan palsu nyaris tidak terbedakan** oleh mata. Ini secara visual menjelaskan mengapa cabang frekuensi kesulitan — sinyalnya memang nyaris tidak ada pada kondisi pengujian kami.

*[Opsional, jika diizinkan penguji: "Bila berkenan, saya bisa menjalankan demo-nya secara langsung sebentar."]*`,
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
      `Mari kita rangkum, menjawab langsung ketiga rumusan masalah.

**Rumusan Masalah 1** — sejauh mana detektor spasial menurun lintas dataset? Jawabannya: **menurun secara substansial**. Terjadi *recall collapse*, paling parah pada arah Celeb-DF ke FaceForensics.

**Rumusan Masalah 2** — apakah penambahan FFT membantu? Penambahan FFT **hanya menekan penurunan secara parsial dan bergantung arah** — dan itu pun dengan mengorbankan performa in-dataset. Jadi bukan solusi yang konsisten.

**Rumusan Masalah 3** — domain mana yang berkontribusi? **Domain spasial adalah penyumbang utama.** Cabang frekuensi mendekati acak, sehingga **model hybrid tidak mengungguli model spasial murni**.

Secara keseluruhan, pada konfigurasi yang kami uji, kontribusi domain frekuensi **terbatas**, dan generalisasi lintas dataset **tetap menjadi tantangan terbuka**.`,
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
        text: '**Perkuat validitas & cakupan:** adaptasi domain eksplisit, uji signifikansi statistik, pemodelan temporal, serta perbanyak data & variasi kompresi.',
        icon: 'Layers',
        tone: 'neutral',
      },
    ],
    notes: `Dari empat akar penyebab di slide pembahasan tadi, kami menurunkan saran yang **konkret** — bukan sekadar daftar umum.

**Pertama, perkuat cabang frekuensi:** sertakan informasi **fase** — misalnya pendekatan SPSL; hitung **FFT pada frame penuh**, bukan hanya crop wajah; dan lakukan **analisis multi-skala**. Ini langsung menjawab penyebab pertama dan kedua.

**Kedua, fusi yang lebih baik:** gunakan **regularisasi atau atensi dua-domain**, dan lakukan **pretraining** pada cabang frekuensi. Ini menjawab bias arsitektur.

**Ketiga, eksplorasi domain transformasi alternatif** seperti **DCT atau wavelet**, yang representasinya bisa lebih kaya daripada FFT mentah.

**Keempat, untuk memperkuat validitas dan cakupan:** adaptasi domain secara eksplisit untuk masalah generalisasi, **uji signifikansi statistik** untuk klaim yang lebih kuat, **pemodelan temporal** antar-frame, serta **memperbanyak data pelatihan dan variasi tingkat kompresi** — yang berada di luar batasan penelitian ini.

Dan satu catatan praktis: untuk kebutuhan penerapan saat ini, **baseline spasial XceptionNet tetap menjadi pilihan paling andal** — peningkatan generalisasi lintas dataset masih memerlukan penelitian lanjutan.

Jadi setiap saran tersambung langsung ke akar penyebab yang sudah kami identifikasi.`,
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
    notes: `Sebagai **penutup**, izinkan kami merangkum **kontribusi ilmiah** penelitian ini. *[tunjuk poin]*

Pertama, sebuah **studi komparatif yang terkontrol** — tiga model, dua dataset, tiga seed — lengkap dengan **evaluasi cross-dataset**. Kedua, **bukti kuantitatif** bahwa kontribusi domain frekuensi **terbatas dan kondisional**. Ketiga, **analisis akar penyebab** beserta posisinya terhadap literatur.

Dan kami ingin menegaskan **nilai dari hasil negatif** ini: temuan kami **menantang asumsi** bahwa "menambah FFT pasti lebih baik" — dengan bukti — sehingga dapat **mencegah peneliti lain menempuh jalan buntu yang sama**.

Demikian presentasi kami. **Terima kasih** atas perhatian Bapak/Ibu penguji. Kami sangat terbuka dan siap menerima **pertanyaan serta masukan**.`,
  },
]
