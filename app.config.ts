import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Konfigurasi utama ada di app.json. File ini hanya menimpa nomor versi
 * lewat environment variable, supaya build otomatis (GitHub Actions) bisa
 * memberi versi yang selalu naik:
 *   APP_VERSION       → versi yang terlihat pengguna, mis. "1.0.42"
 *   APP_VERSION_CODE  → angka versi Android (harus selalu naik agar bisa update)
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const versionCode = process.env.APP_VERSION_CODE ? Number(process.env.APP_VERSION_CODE) : config.android?.versionCode;
  return {
    ...config,
    name: config.name ?? 'Kids Worksheet',
    slug: config.slug ?? 'kids-worksheet',
    version: process.env.APP_VERSION ?? config.version,
    android: { ...config.android, versionCode },
  };
};
