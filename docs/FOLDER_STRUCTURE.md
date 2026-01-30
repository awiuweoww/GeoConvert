# Arsitektur & Struktur Folder Aplikasi

Dokumen ini menjelaskan struktur direktori proyek **GeoConvert**. Struktur ini dirancang mengikuti prinsip **Clean Architecture** dan **Feature-First Organization** untuk memastikan kode mudah dibaca, dipelihara, dan dapat digunakan kembali (*reusable*).

## 1. Ikhtisar Struktur (Tree View)

```
/src
  ├── assets/                 # Aset statis (Gambar, Icon, Font)
  │
  ├── components/             # Komponen React (UI & Fitur)
  │   ├── Convert/            # Fitur Utama: Peta & Konversi
  │   │   └── Convert.tsx
  │   ├── Home/               # Halaman Utama / Landing Page
  │   │   └── Home.tsx
  │   ├── Tutorial/           # Fitur Panduan
  │   │   └── Tutorial.tsx
  │   │
  │   └── UI/                 # Komponen Atomic / Reusable (Generic)
  │       └── SplashScreen.tsx
  │
  ├── services/               # Logika Bisnis & Integrasi External
  │   ├── CoordinateService.ts      # Logika murni matematika konversi
  │   ├── CoordinateService.test.ts # Unit Test
  │   └── MapService.ts             # Wrapper untuk OpenLayers Engine
  │
  ├── types/                  # Definisi Tipe TypeScript Global
  │
  ├── styles/                 # (Opsional) Style Global tambahan
  │
  ├── App.tsx                 # Root Component & Routing Logic
  ├── main.tsx                # Entry Point
  └── index.css               # Global Tailwind & CSS Variables
```

## 2. Detail Direktori

### `/src/components`
Direktori ini dibagi menjadi dua kategori utama untuk memisahkan **Fitur Spesifik** dan **Komponen UI Umum**.

*   **Fitur (`/Convert`, `/Home`, `/Tutorial`)**:
    *   Berisi komponen "Cerdas" (*Smart Components*) yang memiliki logika bisnis spesifik.
    *   Setiap folder mewakili satu fitur utuh.
    *   Contoh: `Convert.tsx` menangani logika peta, input koordinat, dan interaksi penyimpanan.

*   **UI (`/src/components/UI`)**:
    *   Berisi komponen "Bodoh" (*Dumb/Presentational Components*) yang murni untuk tampilan.
    *   **Sangat Reusable**: Bisa dipakai di mana saja (Home, Tutorial, dll).
    *   Tidak boleh mengandung logika bisnis yang kompleks.
    *   Contoh: Tombol-tombol standar, Modal, Card, SplashScreen.

### `/src/services`
Layer ini memisahkan **Logic** dari **UI**. Komponen React hanya bertugas menampilkan data, sementara perhitungan berat dilakukan di sini.

*   **`MapService.ts`**: Mengisolasi library pihak ketiga (OpenLayers). Jika kita ingin ganti library peta (misal ke Leaflet), kita hanya perlu mengubah file ini, tidak perlu membongkar seluruh UI.
*   **`CoordinateService.ts`**: Kumpulan fungsi matematika murni (`pure functions`). Sangat mudah untuk ditest (seperti yang dilakukan dengan Jest).

### `/src/assets`
Tempat penyimpanan file statis.
*   Gambar, Logo.
*   Font kustom (jika tidak via Google Fonts).

## 3. Prinsip Desain (Design Principles)

1.  **Single Responsibility**: Setiap file memiliki satu tugas yang jelas. `CoordinateService` hanya menghitung angka, tidak peduli cara menampilkannya. `Convert.tsx` hanya mengurus UI konversi.
2.  **Colocation**: File yang berkaitan erat disimpan berdekatan. Jika sebuah komponen butuh CSS khusus atau sub-komponen yang tidak dipakai tempat lain, simpan di folder yang sama.
3.  **Flat Hierarchy**: Menghindari nesting yang terlalu dalam (`components/A/B/C/D/...`) agar mudah di-import dan ditelusuri.
