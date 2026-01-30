# GeoConvert - PT LEN Geospatial Intelligence System

![GeoConvert Logo](https://img.shields.io/badge/GeoConvert-v1.0.0-E11D48?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-Development-blue?style=for-the-badge) ![Tests](https://img.shields.io/badge/Tests-Passing-green?style=for-the-badge)

**GeoConvert** adalah aplikasi web modern yang dirancang untuk kebutuhan **PT LEN Industri** dalam melakukan transformasi koordinat geografis. Aplikasi ini memungkinkan pengguna untuk mengonversi **Decimal Degrees (DD)** ke **Degrees Minutes Seconds (DMS)** dan sebaliknya dengan presisi tinggi, serta memvisualisasikan hasilnya pada peta interaktif.

## 🚀 Fitur Utama

-   **Konversi Real-time**: Transformasi akurat antara format DD dan DMS.
-   **Peta Interaktif**: Visualisasi titik koordinat menggunakan engine **OpenLayers**.
-   **Local Persistence**: Menyimpan riwayat titik koordinat secara lokal di browser.
-   **Tutorial Interaktif**: Panduan penggunaan yang terintegrasi dengan animasi.
-   **Tema Gelap & Terang**: Dukungan penuh untuk mode tampilan yang nyaman di mata.
-   **Bilingual**: Mendukung Bahasa Indonesia dan Inggris.

## 🛠️ Teknologi yang Digunakan

-   **Frontend**: React (TypeScript), Vite
-   **Styling**: Tailwind CSS (Utility-first), Framer Motion (Animations)
-   **Mapping**: OpenLayers
-   **Testing**: Jest, React Testing Library
-   **Icons**: Lucide React

---

## 📋 Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terinstal:
*   [Node.js](https://nodejs.org/) (Versi 18 LTS atau lebih baru disarankan)
*   npm (Biasanya terinstal otomatis bersama Node.js)

## 📦 Panduan Instalasi & Pengujian

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal atau untuk keperluan review (perusahaan).

### 1. Clone & Instalasi Dependensi

Unduh source code proyek dan instal pustaka yang diperlukan.

```bash
# Masuk ke direktori proyek (jika belum)
cd PTlen

# Instal dependensi
npm install
```

### 2. Menjalankan Aplikasi (Mode Developer)

Untuk melihat aplikasi berjalan secara lokal dengan fitur *Hot Module Replacement (HMR)*:

```bash
npm run dev
```

> Aplikasi biasanya akan berjalan di `http://localhost:5173/`.

### 3. Menjalankan Unit Test (PENTING)

Proyek ini dilengkapi dengan **Unit Test** menggunakan **Jest** untuk memastikan akurasi perhitungan koordinat. Sangat disarankan untuk menjalankan tes ini sebelum melakukan deployment atau review kode.

```bash
# Menjalankan semua test suite
npm test
```

**Output yang diharapkan jika sukses:**
```
PASS  src/services/CoordinateService.test.ts
  CoordinateService
    dmsToDd
      √ should convert DMS to DD correctly for South
      ...
    ddToDms
      √ should convert DD to DMS correctly for Latitude (S)
      ...
```

### 4. Build untuk Produksi

Jika ingin membuat versi aplikasi yang siap deploy:

```bash
npm run build
# Untuk preview hasil build
npm run preview
```

---

## 📚 Dokumentasi Teknis

Untuk memahami arsitektur dan desain sistem lebih lanjut, silakan merujuk ke dokumen berikut yang tersedia di folder `/docs`:

1.  **[Arsitektur Folder & Aplikasi](docs/FOLDER_STRUCTURE.md)**: Penjelasan struktur direktori dan organisasi kode (Clean Architecture).
2.  **[Class Diagram](docs/CLASS_DIAGRAM.md)**: Struktur kelas dan relasi antar komponen/service.
3.  **[Sequence Diagram](docs/SEQUENCE_DIAGRAM.md)**: Alur proses inisialisasi aplikasi dan fitur konversi.

---
