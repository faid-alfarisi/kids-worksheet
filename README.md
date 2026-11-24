<p align="center">
  <img src="assets/icon.png" width="120" alt="Ikon Kids Worksheet" />
</p>

<h1 align="center">Kids Worksheet</h1>

<p align="center">
  Aplikasi lembar kerja anak (TK / PAUD) berbahasa Indonesia untuk Android.<br/>
  Hampir semua soal <b>dibuat acak</b>, jadi tidak pernah habis dan tidak membosankan.
</p>

<p align="center">
  <img alt="Expo SDK 58" src="https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo" />
  <img alt="React Native 0.88" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="Platform Android" src="https://img.shields.io/badge/platform-Android-3DDC84?logo=android&logoColor=white" />
</p>

---

## 📲 Unduh

APK terbaru selalu ada di halaman **[Releases](https://github.com/faid-alfarisi/kids-worksheet/releases/latest)**,
dibuat otomatis setiap ada perubahan di branch `main`. Unduh file `.apk` di HP Android, buka, lalu izinkan
"pasang dari sumber tidak dikenal" kalau diminta. Butuh HP Android 64-bit (arm64), yaitu hampir semua HP
beberapa tahun terakhir.

## ✨ Fitur

Begitu dibuka, aplikasi langsung menampilkan daftar kategori. Tap kategori → langsung main.
Setiap permainan punya tombol **🔀 Acak** untuk soal baru dan **🏠** untuk kembali ke beranda.

| Kategori | Isi | Cara main |
|---|---|---|
| 🤖 **Cari Jalan** | Papan 5×5 acak berisi robot, bintang, dan batu | Susun panah ⬆️⬇️⬅️➡️, tekan *Jalankan*. Peta selalu bisa diselesaikan. |
| 🧠 **Coding** | Kode warna: 6 benda berangka **atau** 1 gambar besar berangka | Pilih warna, tap bagian berangka. Benar → warna menempel; salah → ✕ merah sebentar. |
| 🔢 **Berhitung** | 6 jenis lembar: tambah, kurang, hitung benda, tambah/kurang gambar, pasangkan jumlah | Pilih angka 0–10, tap kotak jawaban. |
| 🧩 **Memasangkan** | Pasangan warna, bayangan, dan pasangan benda (baju ↔ celana, dll.) | Tarik garis lurus dari titik ke titik. Benar → hijau; salah → merah lalu hilang. |
| ✏️ **Menggaris** | Garis putus-putus acak (lurus, gelombang, zigzag, dll.) + maze | Tebalkan garis dengan jari (tinta hitam). |
| 🖍️ **Mewarnai** | Gambar besar acak + beberapa lembar gambar | Warnai bebas, 16 warna krayon. Garis tepi tetap rapi di atas coretan. |
| 🦁 **Melengkapi** | Lembar melengkapi gambar hewan | Coret bebas di atas lembar. |
| ⚖️ **Perbandingan** | 4 baris benda dengan ukuran berbeda | Tap yang *paling/lebih besar* atau *kecil* (satu pertanyaan per lembar). |
| 📝 **Menulis** | Gambar benda + namanya dalam huruf putus-putus | Tebalkan hurufnya (tinta hitam). |
| 🐰 **Menggambar** | Shape atau gambar besar dalam garis putus-putus | Tebalkan garisnya, lalu warnai sesukanya. |

## 🧱 Teknologi

- [Expo SDK 58](https://docs.expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/) (routing berbasis file di `src/app/`)
- React Native 0.88, React 19, TypeScript
- [`react-native-svg`](https://github.com/software-mansion/react-native-svg): semua shape, gambar, dan garis digambar dengan kode (tanpa file gambar)
- [`expo-image`](https://docs.expo.dev/versions/latest/sdk/image/) untuk lembar gambar yang tersisa

## 📁 Struktur proyek

```
src/
├── app/                 # Layar (Expo Router). Satu file = satu layar.
│   ├── index.tsx        # Beranda: daftar kategori
│   ├── cari-jalan.tsx   # Tiap kategori permainan punya layar sendiri
│   ├── coding.tsx  berhitung.tsx  memasangkan.tsx  perbandingan.tsx
│   ├── menggaris.tsx  mewarnai.tsx  menulis.tsx  menggambar.tsx
│   ├── kategori/[id].tsx, soal/[cat]/[idx].tsx   # Kategori berbasis lembar gambar
│   └── katalog-shape.tsx                        # Katalog pengembang (tidak ada di menu)
├── components/          # Komponen permainan (MazeGame, MatchGame, CountGame, DrawingSheet, ...)
├── data/                # Daftar kategori + generator soal acak tiap permainan
├── shapes/              # Koleksi shape kecil, 1 file per kelompok (buah, hewan, ...)
├── drawings/            # Koleksi gambar besar yang terdiri dari beberapa bagian bernomor
└── lines/               # Koleksi pola garis (lurus, gelombang, zigzag, ...)
assets/
├── icon.png, android-icon-*.png, splash-icon.png
└── worksheets/          # Lembar gambar yang masih dipakai (melengkapi, menggaris, mewarnai)
```

## 🚀 Menjalankan

Kebutuhan: Node.js, Android SDK + JDK (pakai JDK bawaan Android Studio), dan HP Android
yang tersambung lewat USB atau *wireless debugging* (`adb devices` harus menampilkan HP-nya).

```bash
npm install

# Build development, pasang ke HP, dan jalankan Metro (sekali saja, ±5–10 menit)
npm run android
```

Setelah development build terpasang, untuk sesi berikutnya cukup jalankan Metro.
Setiap perubahan kode langsung muncul di HP tanpa build ulang:

```bash
npx expo start --dev-client
adb reverse tcp:8081 tcp:8081   # kalau HP tidak bisa terhubung ke Metro
```

> **Windows:** kalau Gradle gagal karena versi Java, arahkan `JAVA_HOME` ke JDK Android Studio:
> `$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"` (PowerShell).

### Build APK release di komputer sendiri

```bash
npx expo prebuild --platform android   # hanya perlu kalau app.json / aset native berubah
cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
# hasil: android/app/build/outputs/apk/release/app-release.apk
```

APK hasil build lokal ditandatangani dengan *debug keystore*, cocok untuk dicoba sendiri.
APK resmi untuk dibagikan dibuat otomatis oleh GitHub Actions (lihat bagian berikut).

### Cek kode

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
```

## 🤖 Rilis otomatis (GitHub Actions)

Workflow [`.github/workflows/release-apk.yml`](.github/workflows/release-apk.yml) berjalan setiap ada push
ke `main` (atau manual dari tab **Actions**). Workflow ini:

1. menginstal dependensi, menjalankan `expo prebuild`, lalu build APK release **khusus arm64**;
2. memberi nomor versi otomatis `1.0.<nomor build>` (lihat `app.config.ts`);
3. menandatangani APK dengan **keystore tetap** dari GitHub Secrets;
4. menerbitkan GitHub Release `v1.0.<nomor build>` dengan APK terlampir.

Gunakan branch lain (mis. `dev`) untuk pengembangan, dan merge ke `main` kalau ingin merilis APK baru.

### Menyiapkan keystore (sekali saja)

Keystore harus **tetap sama** untuk semua rilis. Kalau berganti, HP pengguna tidak bisa meng-update aplikasi
dan harus uninstall dulu. Jalankan di komputer sendiri (`keytool` ikut terpasang bersama JDK / Android Studio):

```bash
keytool -genkeypair -v -keystore release.jks -alias kidsworksheet   -keyalg RSA -keysize 2048 -validity 10000
```

Isi password dan data yang diminta. Lalu ubah keystore menjadi teks base64 dan simpan di GitHub Secrets
(**Settings → Secrets and variables → Actions → New repository secret**), atau pakai `gh`:

```bash
base64 -w0 release.jks > keystore.b64          # PowerShell: [Convert]::ToBase64String([IO.File]::ReadAllBytes("release.jks")) | Set-Content keystore.b64
gh secret set ANDROID_KEYSTORE_BASE64 < keystore.b64
gh secret set ANDROID_KEYSTORE_PASSWORD        # diminta mengetik password keystore
gh secret set ANDROID_KEY_ALIAS --body kidsworksheet
gh secret set ANDROID_KEY_PASSWORD             # password key (biasanya sama dengan password keystore)
```

> ⚠️ **Simpan `release.jks` dan password-nya baik-baik di luar repo** (mis. password manager atau cloud
> pribadi). Jangan pernah meng-commit-nya; `*.jks` dan `keystore.b64` sudah ada di `.gitignore`.
> Kalau keystore hilang, rilis berikutnya tidak bisa meng-update aplikasi yang sudah terpasang.

## 🎨 Menambah konten

Semua konten digambar dengan SVG lewat kode, jadi menambah konten tidak perlu file gambar.

| Mau menambah | Caranya |
|---|---|
| **Shape** (benda kecil) | Tambah entri di file kelompoknya di `src/shapes/` (petunjuk di `kit.tsx`). Otomatis dipakai Memasangkan, Perbandingan, Berhitung, Menggambar, dan Menulis. Isi `code` agar bisa dipakai di Coding. |
| **Gambar besar** | Buat file baru di `src/drawings/` dari region bernomor (petunjuk di `kit.ts`), lalu daftarkan di `index.tsx`. Otomatis dipakai Coding, Mewarnai, dan Menggambar. |
| **Pola garis** | Tambah fungsi di `LINE_PATTERNS` (`src/lines/index.ts`). |
| **Lembar gambar** | Taruh gambar di `assets/worksheets/<kategori>/` dan daftarkan di `src/data/sheets.ts`. |

Untuk melihat semua shape (beserta bayangannya) dan gambar besar (beserta nomornya),
buka katalog pengembang di HP:

```bash
adb shell am start -a android.intent.action.VIEW -d "kidsworksheet://katalog-shape"
```

## 🙏 Sumber gambar

Hampir semua konten digambar dengan kode oleh proyek ini. Beberapa lembar kerja (Melengkapi, Menggaris,
Mewarnai) berasal dari situs lembar kerja gratis seperti LembarBelajar.com dan LembarKerja.com, dan
watermark aslinya tetap dibiarkan. Daftar lengkapnya ada di **[CREDITS.md](CREDITS.md)**.

## 📦 Info aplikasi

| | |
|---|---|
| Nama | Kids Worksheet |
| Package | `id.kids.worksheet` |
| Bahasa | Indonesia |
| Orientasi | Potret |
