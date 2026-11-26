import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path } from 'react-native-svg';

export type TwEl =
  | { t: 'p'; f: string; d: string; m?: 1; x?: string }
  | { t: 'c'; f: string; cx: number; cy: number; r: number; m?: 1; x?: string }
  | { t: 'e'; f: string; cx: number; cy: number; rx: number; ry: number; m?: 1; x?: string };

/**
 * Render elemen vector Twemoji (kanvas asli 36x36 → diskalakan ke 100x100 dengan margin rapi).
 * Elemen bertanda `m: 1` adalah bagian utama (`{...p}`) yang warnanya mengikuti `color` shape / kode warna.
 * Elemen lainnya memakai `part(f, sil)` tetapi dengan stroke proporsional di kanvas 36x36.
 */
export function renderTwemoji(els: readonly TwEl[], p: Paint, sil: boolean): ReactNode {
  const sw = traceMode ? 0.55 : 0.9;
  const dash = traceMode ? '1.4 1.1' : undefined;
  return (
    <G transform="translate(5 5) scale(2.5)">
      {els.map((el, i) => {
        const paint = traceMode
          ? { fill: '#fff', stroke: TRACE_COLOR, strokeWidth: sw, strokeLinejoin: 'round' as const, strokeDasharray: dash }
          : lineOnlyMode
            ? { fill: '#fff', stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const }
            : sil
              ? { fill: SHADOW, stroke: SHADOW, strokeWidth: sw, strokeLinejoin: 'round' as const }
              : el.m
                ? { fill: p.fill, stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const }
                : { fill: el.f, stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const };
        if (el.t === 'p') return <Path key={i} {...paint} d={el.d} transform={el.x} />;
        if (el.t === 'c') return <Circle key={i} {...paint} cx={el.cx} cy={el.cy} r={el.r} transform={el.x} />;
        return <Ellipse key={i} {...paint} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} transform={el.x} />;
      })}
    </G>
  );
}

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

export type Paint = { fill: string; stroke: string; strokeWidth: number; strokeLinejoin: 'round'; strokeDasharray?: string };

/** Warna & pola garis putus-putus untuk mode "tebalkan gambar". */
export const TRACE_COLOR = '#90A4AE';
const TRACE_DASH = '3.5 3';

export const TRACE_PAINT: Paint = { fill: '#fff', stroke: TRACE_COLOR, strokeWidth: 1.4, strokeLinejoin: 'round', strokeDasharray: TRACE_DASH };

/**
 * Mode gambar yang sedang aktif. Diset oleh <Shape> tepat sebelum memanggil `draw()` (sinkron),
 * supaya `part()` dan `stroke()` ikut menggambar garis putus-putus tanpa mengubah tiap shape.
 */
let traceMode = false;
let lineOnlyMode = false;

export function drawTraced<T>(fn: () => T): T {
  traceMode = true;
  try {
    return fn();
  } finally {
    traceMode = false;
  }
}

export function drawLineOnly<T>(fn: () => T): T {
  lineOnlyMode = true;
  try {
    return fn();
  } finally {
    lineOnlyMode = false;
  }
}

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

/** Cat untuk bagian berwarna tetap; jadi hitam saat bayangan, putih bergaris saat lineOnly, putus-putus saat mode tebalkan. */
export const part = (fill: string, sil: boolean): Paint =>
  traceMode
    ? TRACE_PAINT
    : lineOnlyMode
      ? { fill: '#fff', stroke: OUTLINE, strokeWidth: 3, strokeLinejoin: 'round' }
      : { fill: sil ? SHADOW : fill, stroke: sil ? SHADOW : OUTLINE, strokeWidth: 3, strokeLinejoin: 'round' };

/** Garis/tangkai tanpa isi. */
export const stroke = (color: string, sil: boolean, width = 3) => ({
  stroke: traceMode ? TRACE_COLOR : sil ? SHADOW : color,
  strokeWidth: traceMode ? TRACE_PAINT.strokeWidth : width,
  strokeDasharray: traceMode ? TRACE_DASH : undefined,
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
