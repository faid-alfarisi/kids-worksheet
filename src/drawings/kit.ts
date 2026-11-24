import type { ReactNode } from 'react';

/**
 * Perlengkapan "drawing": gambar besar yang terdiri dari beberapa bagian (region).
 * Beda dengan shape: satu drawing punya banyak bagian, tiap bagian punya nomor kelompok warna.
 *
 * Kanvas drawing 200x200. Setiap region disimpan sebagai poligon (kurva diubah jadi titik-titik),
 * supaya mudah digambar DAN mudah dicek "jari menyentuh bagian mana" (point-in-polygon).
 *
 * Cara menambah drawing baru:
 *  1. Buat file baru (lihat bunga.tsx sebagai contoh).
 *  2. Susun region dari belakang ke depan (yang terakhir tampil paling atas).
 *  3. `n` = nomor kelompok warna (1, 2, 3, ...). Bagian dengan nomor sama diwarnai sama di soal Coding.
 *  4. `at` = letak angka; kosongkan untuk memakai titik tengah otomatis.
 *  5. Daftarkan di index.tsx.
 */

export type Pt = [number, number];

export type Region = { pts: Pt[]; n: number; at: Pt; d: string };

export type DrawingDef = {
  name: string;
  regions: Region[];
  /** Hiasan garis/mata di atas semua bagian (tidak bisa diwarnai). */
  details?: () => ReactNode;
};

export const SIZE = 200;

const toD = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;

const centroid = (pts: Pt[]): Pt => {
  const sx = pts.reduce((s, p) => s + p[0], 0);
  const sy = pts.reduce((s, p) => s + p[1], 0);
  return [sx / pts.length, sy / pts.length];
};

export const region = (pts: Pt[], n: number, at?: Pt): Region => ({ pts, n, at: at ?? centroid(pts), d: toD(pts) });

export function ellipsePts(cx: number, cy: number, rx: number, ry: number, rotDeg = 0, steps = 48): Pt[] {
  const t = (rotDeg * Math.PI) / 180;
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    const x = rx * Math.cos(a);
    const y = ry * Math.sin(a);
    return [cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)];
  });
}

export const circle = (cx: number, cy: number, r: number, n: number, at?: Pt) => region(ellipsePts(cx, cy, r, r), n, at ?? [cx, cy]);
export const ellipse = (cx: number, cy: number, rx: number, ry: number, rot: number, n: number, at?: Pt) =>
  region(ellipsePts(cx, cy, rx, ry, rot), n, at ?? [cx, cy]);
export const rect = (x: number, y: number, w: number, h: number, n: number, at?: Pt) =>
  region([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], n, at ?? [x + w / 2, y + h / 2]);
export const poly = (pts: Pt[], n: number, at?: Pt) => region(pts, n, at);

/**
 * Ubah path sederhana (perintah absolut M, L, Q, Z) jadi titik-titik.
 * Cukup untuk kurva-kurva lucu di drawing.
 */
export function pathPts(d: string, steps = 14): Pt[] {
  const tok = d.match(/[MLQZ]|-?\d*\.?\d+/g) ?? [];
  const pts: Pt[] = [];
  let i = 0;
  let cmd = '';
  let cur: Pt = [0, 0];
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    if (/[MLQZ]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'Z') continue;
    if (cmd === 'M' || cmd === 'L') {
      cur = [num(), num()];
      pts.push(cur);
    } else if (cmd === 'Q') {
      const c: Pt = [num(), num()];
      const e: Pt = [num(), num()];
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        pts.push([u * u * cur[0] + 2 * u * t * c[0] + t * t * e[0], u * u * cur[1] + 2 * u * t * c[1] + t * t * e[1]]);
      }
      cur = e;
    }
  }
  return pts;
}

export const curvy = (d: string, n: number, at?: Pt) => region(pathPts(d), n, at);

/** Titik di dalam poligon? (ray casting) */
export function inside([x, y]: Pt, pts: Pt[]) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Pecah tiap sisi poligon jadi potongan kecil (maks. `step` satuan). */
function densify(pts: Pt[], step = 2.5): Pt[] {
  const out: Pt[] = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let s = 0; s < n; s++) out.push([a[0] + ((b[0] - a[0]) * s) / n, a[1] + ((b[1] - a[1]) * s) / n]);
  });
  return out;
}

const outlineCache = new WeakMap<DrawingDef, string>();

/**
 * Garis tepi yang benar-benar terlihat (bagian yang tertutup region di depannya dibuang).
 * Dipakai untuk lapisan garis di atas coretan Mewarnai, karena lapisan itu tidak punya isi warna
 * untuk menutupi garis di belakangnya. Dihitung sekali per drawing.
 */
export function visibleOutline(def: DrawingDef) {
  const cached = outlineCache.get(def);
  if (cached) return cached;
  const parts: string[] = [];
  def.regions.forEach((r, i) => {
    const front = def.regions.slice(i + 1);
    const pts = densify(r.pts);
    let run: Pt[] = [];
    const flush = () => {
      if (run.length > 1) parts.push(`M${run.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`);
      run = [];
    };
    pts.forEach((a, k) => {
      const b = pts[(k + 1) % pts.length];
      const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      if (front.some((f) => inside(mid, f.pts))) return flush();
      if (!run.length) run.push(a);
      run.push(b);
    });
    flush();
  });
  const d = parts.join(' ');
  outlineCache.set(def, d);
  return d;
}

/** Bagian paling atas yang tersentuh di titik (koordinat kanvas 200x200), atau -1. */
export function hitRegion(def: DrawingDef, p: Pt) {
  for (let i = def.regions.length - 1; i >= 0; i--) if (inside(p, def.regions[i].pts)) return i;
  return -1;
}
