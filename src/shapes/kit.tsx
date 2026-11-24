import type { ReactNode } from 'react';
import { Circle, G, Path } from 'react-native-svg';

/**
 * Perlengkapan menggambar shape. Semua shape memakai kanvas 100x100.
 *
 * Cara menambah shape baru:
 *  1. Buka file kelompok yang cocok (buah.tsx, hewan.tsx, ...) atau buat file baru.
 *  2. Tambah entri { name, color, draw }. `draw(p, sil)` menggambar bentuknya:
 *     - pakai `{...p}` untuk bagian utama (warnanya bisa diganti lewat kode),
 *     - pakai `part(warna, sil)` untuk bagian yang warnanya tetap (daun, roda, ...),
 *     - sembunyikan detail (mata, kilau) saat `sil` true supaya bayangannya polos.
 *  3. Kalau file baru, daftarkan di index.tsx.
 */

export const OUTLINE = '#3A3A3A';
export const SHADOW = '#262626';
export const DARK = '#333';

export type Paint = { fill: string; stroke: string; strokeWidth: number; strokeLinejoin: 'round' };

export type ShapeDef = {
  /** Nama dalam bahasa Indonesia, untuk teks soal. */
  name: string;
  /** Warna asli (dipakai kalau tidak diberi warna). */
  color: string;
  /** Boleh diberi warna apa saja (baju, mobil, ...)? Buah/sayur tidak, karena warnanya khas. */
  recolor?: boolean;
  /**
   * Shape dengan bayangan mirip diberi grup yang sama (mis. 'bulat'),
   * supaya tidak muncul bersamaan di soal bayangan.
   */
  look?: string;
  /**
   * Letak angka (kanvas 100x100) di bagian utama shape, untuk soal Coding (kode warna).
   * Hanya shape yang punya `code` yang dipakai di Coding.
   */
  code?: { x: number; y: number };
  draw: (p: Paint, sil: boolean) => ReactNode;
};

/** Cat untuk bagian berwarna tetap; jadi hitam saat bayangan. */
export const part = (fill: string, sil: boolean): Paint => ({
  fill: sil ? SHADOW : fill,
  stroke: sil ? SHADOW : OUTLINE,
  strokeWidth: 3,
  strokeLinejoin: 'round',
});

/** Garis/tangkai tanpa isi. */
export const stroke = (color: string, sil: boolean, width = 3) => ({
  stroke: sil ? SHADOW : color,
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  fill: 'none',
});

/** Mata bulat dengan kilau putih. */
export const eye = (x: number, y: number, r = 4.5) => (
  <G key={`e${x}-${y}`}>
    <Circle cx={x} cy={y} r={r} fill={DARK} />
    <Circle cx={x + r * 0.35} cy={y - r * 0.35} r={r * 0.35} fill="#fff" />
  </G>
);

export const smile = (cx: number, cy: number, w = 8) => (
  <Path key={`s${cx}-${cy}`} d={`M${cx - w} ${cy} Q${cx} ${cy + w * 0.9} ${cx + w} ${cy}`} {...stroke(DARK, false)} />
);

/** Wajah lucu: dua mata + senyum. Tidak tampil saat bayangan. */
export const face = (sil: boolean, cx: number, cy: number, gap = 10, r = 4) =>
  sil ? null : (
    <G>
      {eye(cx - gap, cy, r)}
      {eye(cx + gap, cy, r)}
      {smile(cx, cy + r + 3, r * 1.4)}
    </G>
  );

export const starPath = (cx: number, cy: number, R: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
};
