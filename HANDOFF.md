# HANDOFF — Presentasi Sidang (deck) Deteksi Deepfake Hybrid XceptionNet–FFT

**Tanggal:** 2026-06-18
**Repo:** `skripsi-presentation` (deck React/Vite untuk sidang)
**Status:** lengkap & build hijau (`npm run build`). Konten terverifikasi terhadap thesis. Sisa pekerjaan = beberapa item setup (lihat §6).
**Judul (komparatif):** "Studi Komparatif Kinerja Deteksi Deepfake Berbasis Arsitektur Hybrid XceptionNet–FFT terhadap Model Domain Tunggal".

> **Handoff thesis terkait (WAJIB disinkronkan):**
> `../skripsi/documents/HANDOFF_Finalisasi_BAB_II-IV_2026-06-17.md`
> Repo ini dan repo thesis **berbagi data** (angka hasil, gambar, komposisi dataset, screenshot demo). Bila salah satu berubah, **update keduanya** — lihat §7 (Protokol sinkronisasi).

---

## 1. Apa ini

Website presentasi (deck 24 slide animasi, mobile/tablet/projector-first) untuk sidang skripsi. Data-driven: satu model data mendorong layout & blok yang dipakai ulang — "ubah sekali, berubah di semua tempat". Tanpa backend; deploy statis (Vercel).

## 2. Menjalankan & deploy

```bash
npm install
npm run dev        # dev lokal
npm run build      # build statis → dist/
npm run preview    # preview hasil build
```

Deploy: **Vercel** (preset Vite, build `npm run build`, output `dist`). Hash-based routing (`#slide-<id>`) → tanpa rewrite. Set env (lihat `.env.example`):

- `VITE_DEPLOY_URL` → URL live deck (untuk QR di slide penutup). **Masih placeholder — set sebelum sidang.**
- `VITE_DEMO_URL` → Space Hugging Face demo (Gradio). Harus host `*.hf.space` (bukan `huggingface.co/spaces/...` yang memblokir iframe).

## 3. Arsitektur & berkas kunci

```
src/
├─ types/slide.ts        # KONTRAK tipe: union Slide (cover|bullets|figure|chart|table|...), blok, NavState
├─ data/
│  ├─ slides.ts          # SUMBER TUNGGAL — 24 slide + speaker notes
│  ├─ results.ts         # angka hasil (dari BAB IV) + ChartSpec untuk grafik
│  ├─ figures.ts         # peta gambar → /public/figures + figureNo + caption (+ placeholder)
│  ├─ sections.ts        # 6 seksi + warna/ikon
│  └─ slidesConfig.tsx   # registry layout → komponen (renderSlide)
├─ components/{layouts,blocks,chrome}/   # layout per varian · blok pakai-ulang · navigasi
├─ context/NavContext.tsx # state navigasi + sinkronisasi antar-jendela (present)
├─ hooks/                # keyboard, swipe, wheel, reduced-motion
└─ index.css             # Tailwind v4 @theme tokens (satu-satunya berkas restyle)
```

## 4. Sumber kebenaran & referensi (di `../skripsi`)

| Kebutuhan | Berkas di `Documents/GitHub/skripsi` |
|---|---|
| Skrip slide & speaker notes | `documents/PRESENTASI_Sidang_2026-06-17.md` |
| Naskah hasil (RM1–RM3, pembahasan) | `documents/BAB_IV_Hasil_dan_Pembahasan_2026-06-17.md` |
| Angka hasil persis (AUC/recall/F1/Δ) | `documents/table/tabel_4_2…4_6_*.html` |
| Komposisi dataset | `documents/table/tabel_1_1_*`, `tabel_3_1_*` (FFPP 500/500; CDF 375/375, n=750) |
| Hyperparameter & arsitektur | `documents/table/tabel_3_5/3_6/3_9_*`, BAB III v4 |
| Q&A sidang | `documents/PANDUAN_SIDANG_QnA_Teknis_2026-06-17.md` |
| Gambar sumber (PNG) | `documents/media_v2/gambar_*.png` |
| **Handoff thesis** | `documents/HANDOFF_Finalisasi_BAB_II-IV_2026-06-17.md` |
| Demo live | HF Space `thesissufferer/deepfake-detection-demo` |

## 5. Provenans data & status audit (2026-06-18)

Audit menyeluruh deck vs `/skripsi` (angka, konten, gambar+metodologi). **Hasil: akurat.**

- **Angka** (`results.ts`, stat cards, teks): cocok 100% dengan Tabel 4.1–4.6. Nol selisih.
- **Konten/skrip**: setia pada `PRESENTASI_Sidang_*.md`; framing komparatif & "H0 tidak dapat ditolak" utuh.
- **Metodologi**: cocok spec v4 (label smoothing 0,05; AdamW 2e-4; FreqCNN ~4 jt/5 blok; SE gate 512-d; 3 seed).

**Perbaikan yang diterapkan sesi ini:**
- **Komposisi Celeb-DF** slide Dataset: `590/5.639` (dataset publik penuh) → **`375/375` (n=750)** agar cocok Tabel 1.1/3.1; + FFPP `500/500`; + catatan presenter menjelaskan beda dataset-penuh vs subset.
- Slide 17 (inti): kembalikan klausa "tetapi tidak konsisten pada arah sebaliknya".
- Slide 21: "side-by-side" → "verdict berdampingan".
- **Screenshot demo ditambahkan** (Gambar 4.1 UI + 4.2 "what the models see") di slide 21 — `public/figures/fig-demo-ui.png` & `fig-what-models-see.png` (sumber: Picture1/Picture2).

## 6. Fitur deck

- Navigasi: keyboard (←/→/Space, **↑/↓ = scroll-or-next**, Home/End), swipe, wheel, deep-link `#slide-<id>`, sidebar per-seksi, overview grid.
- **Mode Present (tombol `F`)**: buka jendela "present" bersih (tanpa sidebar/notes) untuk projector, **tersinkron** dengan jendela kontrol via BroadcastChannel — slide, **posisi scroll**, dan **lightbox gambar** dicerminkan ke projector.
- Presenter notes (`n`), count-up hasil, tabel→kartu di mobile, lightbox zoom, grafik SVG interaktif, PWA (installable/offline).

## 7. ⚠️ Item OUTSTANDING & sinkronisasi dengan thesis

1. **Penomoran gambar BELUM final di thesis** (lihat thesis handoff §0b.A). Deck sekarang memakai nomor dari nama file `media_v2`: in-dataset **4.3**, cross **4.5**, generalization drop **4.7**, scaling **4.8**, confusion matrix **4.9** (placeholder), kurva pelatihan **4.10** (placeholder), demo UI **4.1**, what-models-see **4.2**. Bila thesis mengadopsi skema padat tanpa ROC (mis. 4.1–4.8: cross **4.4**, drop **4.5**, scaling **4.6**, CM **4.7**, pelatihan **4.8**), **update `figureNo` di `src/data/figures.ts`** agar cocok naskah final. → satu titik edit.
2. **Gambar belum final** (placeholder berlabel, belum ada PNG): `confusionMatrix` & `trainingCurve` di `figures.ts` (`placeholder: true`). Saat thesis men-generate (handoff §2A/§2C), taruh PNG di `public/figures/`, set `placeholder: false`, sesuaikan `figureNo`.
3. **Screenshot demo 4.1/4.2** — sudah ada di repo ini (`public/figures/fig-demo-ui.png`, `fig-what-models-see.png`). Ini juga **memenuhi thesis handoff §2B** — thesis bisa pakai gambar yang sama (rename ke `gambar_4_1_antarmuka_demo.png` / `gambar_4_2_what_models_see.png` di `media_v2`).
4. **`VITE_DEPLOY_URL`** masih placeholder → set URL Vercel asli sebelum sidang (QR penutup).
5. **Nama pembimbing/prodi** (cover): Prodi S-1 Teknik Informatika; Pembimbing Gunawan, S.Kom., M.T.I. & Heru Kurniawan, S.Kom., M.Kom. — konfirmasi ejaan/gelar.
6. **Tabel HTML thesis pra-v4** (`tabel_3_9`, `tabel_3_6`): nilai lama (label smoothing 0 / FreqCNN ~700K). Deck pakai nilai v4 benar — regenerate tabel di sisi thesis agar tidak terlihat beda.

## 8. Protokol sinkronisasi dua-repo

Bila salah satu berubah, perbarui **kedua handoff** (ini & thesis):

| Berubah | Update di deck | Update di thesis |
|---|---|---|
| Angka hasil | `src/data/results.ts` | Tabel 4.2–4.6 + naskah BAB IV |
| Penomoran gambar | `src/data/figures.ts` (`figureNo`) | caption BAB IV + Daftar Gambar |
| Komposisi dataset | slide `dataset` di `slides.ts` | Tabel 1.1/3.1 |
| Gambar baru (CM, ROC, kurva) | drop ke `public/figures/` + un-placeholder | `media_v2/` + sisip docx |
| Screenshot demo | `public/figures/fig-demo-ui*.png` | `media_v2/gambar_4_1/4_2_*.png` |

---

## 9. Changelog (ringkas)

- Scaffold penuh React 19 + Vite 7 + TS + Tailwind v4; 24 slide data-driven; layouts/blocks/chrome; PWA. README diberi referensi sumber `/skripsi`.
- Perbaikan: embed demo `huggingface.co/spaces` (X-Frame-Options) → host `*.hf.space`.
- Cover: logo Universitas Mikroskil + prodi/pembimbing dari docx; perbaikan alignment bullet.
- Fitur: Mode Present (`F`, dual-window sync), ↑/↓ scroll-or-next, lightbox & scroll dicerminkan ke jendela present.
- Audit vs `/skripsi`: fix komposisi Celeb-DF (375/375), restorasi kalimat slide 17/21.
- Screenshot demo 4.1/4.2 ditambahkan ke slide Purwarupa.
