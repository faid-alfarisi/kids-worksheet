import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path } from 'react-native-svg';

export type Pt = [number, number];

export type TwEl = (
  | { t: 'p'; f: string; d: string; x?: string }
  | { t: 'c'; f: string; cx: number; cy: number; r: number; x?: string }
  | { t: 'e'; f: string; cx: number; cy: number; rx: number; ry: number; x?: string }
) & {
  /** Bagian utama (ikut berubah warna saat shape diberi prop `color`). */
  m?: 1;
  /** Nomor kelompok warna (1, 2, 3, ...) untuk mode Coding Gambar Besar (multi-warna dalam 1 shape). */
  n?: number;
  /** Letak label angka untuk bagian ini di kanvas 100x100 (kosongkan bila bagian ini diwakili angka di elemen sekelompok lainnya). */
  at?: Pt;
};

export const OUTLINE = '#3A3A3A';
export const SHADOW = '#262626';
export const DARK = '#333';

export type Paint = {
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinejoin: 'round';
  strokeDasharray?: string;
  /** True bila pemanggil sengaja menimpa warna shape (prop `color` diisi). */
  recolored?: boolean;
};

/** Warna & pola garis putus-putus untuk mode "tebalkan gambar". */
export const TRACE_COLOR = '#90A4AE';
const TRACE_DASH = '3.5 3';

export const TRACE_PAINT: Paint = { fill: '#fff', stroke: TRACE_COLOR, strokeWidth: 1.4, strokeLinejoin: 'round', strokeDasharray: TRACE_DASH };

let traceMode = false;
let lineOnlyMode = false;
let strokeOnlyMode = false;

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

export function drawStrokeOnly<T>(fn: () => T): T {
  strokeOnlyMode = true;
  try {
    return fn();
  } finally {
    strokeOnlyMode = false;
  }
}

/**
 * Render elemen vector Twemoji (kanvas asli 36x36 → diskalakan ke 100x100 dengan margin rapi).
 * - `partFills`: jika diberikan (mode Coding Gambar Besar), elemen yang memiliki `el.n` akan memakai `partFills[i] ?? '#FFFFFF'`.
 */
export function renderTwemoji(
  els: readonly TwEl[],
  p: Paint,
  sil: boolean,
  partFills?: Record<number, string>,
): ReactNode {
  const sw = traceMode ? 0.55 : 0.9;
  const dash = traceMode ? '1.4 1.1' : undefined;
  return (
    <G transform="translate(5 5) scale(2.5)">
      {els.map((el, i) => {
        const paint = traceMode
          ? { fill: '#fff', stroke: TRACE_COLOR, strokeWidth: sw, strokeLinejoin: 'round' as const, strokeDasharray: dash }
          : strokeOnlyMode
            ? { fill: 'none', stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const }
            : lineOnlyMode
              ? { fill: '#fff', stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const }
              : sil
                ? { fill: SHADOW, stroke: SHADOW, strokeWidth: sw, strokeLinejoin: 'round' as const }
                : partFills && el.n
                  ? { fill: partFills[i] ?? '#FFFFFF', stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const }
                  : el.m && p.recolored
                    ? { fill: p.fill, stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const }
                    : { fill: el.f, stroke: OUTLINE, strokeWidth: sw, strokeLinejoin: 'round' as const };
        if (el.t === 'p') return <Path key={i} {...paint} d={el.d} transform={el.x} />;
        if (el.t === 'c') return <Circle key={i} {...paint} cx={el.cx} cy={el.cy} r={el.r} transform={el.x} />;
        return <Ellipse key={i} {...paint} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} transform={el.x} />;
      })}
    </G>
  );
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
   * Letak angka (kanvas 100x100) di bagian utama shape, untuk soal Coding 6 benda kecil.
   */
  code?: { x: number; y: number };
  /**
   * Daftar elemen Twemoji (jika shape mendukung mode Coding Gambar Besar multi-warna,
   * elemen yang memiliki `n` dan `at` bisa di-tap per bagian).
   */
  els?: readonly TwEl[];
  draw: (p: Paint, sil: boolean, partFills?: Record<number, string>) => ReactNode;
};

/** Cat untuk bagian berwarna tetap; jadi hitam saat bayangan, putih bergaris saat lineOnly, tanpa isi saat strokeOnly, putus-putus saat mode tebalkan. */
export const part = (fill: string, sil: boolean): Paint =>
  traceMode
    ? TRACE_PAINT
    : strokeOnlyMode
      ? { fill: 'none', stroke: OUTLINE, strokeWidth: 3, strokeLinejoin: 'round' }
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

/** Hit-test poligon untuk path SVG / lingkaran / elips di kanvas 100x100 (untuk tap bagian di Coding Gambar Besar). */
function pathToPolys(d: string, steps = 8): Pt[][] {
  const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const polys: Pt[][] = [];
  let pts: Pt[] = [];
  let i = 0;
  let cmd = '';
  let cur: Pt = [0, 0];
  let start: Pt = [0, 0];
  let lastC: Pt | null = null;
  const num = () => parseFloat(tok[i++]);
  const push = (x: number, y: number) => pts.push([x * 2.5 + 5, y * 2.5 + 5]);

  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === 'Z') {
      if (pts.length > 2) polys.push(pts);
      pts = [];
      cur = [...start];
      lastC = null;
      continue;
    }
    if (C === 'M') {
      if (pts.length > 2) polys.push(pts);
      pts = [];
      const x = num() + (rel ? cur[0] : 0);
      const y = num() + (rel ? cur[1] : 0);
      cur = [x, y];
      start = [x, y];
      push(x, y);
      cmd = rel ? 'l' : 'L';
      lastC = null;
    } else if (C === 'L') {
      const x = num() + (rel ? cur[0] : 0);
      const y = num() + (rel ? cur[1] : 0);
      cur = [x, y];
      push(x, y);
      lastC = null;
    } else if (C === 'H') {
      const x = num() + (rel ? cur[0] : 0);
      cur = [x, cur[1]];
      push(cur[0], cur[1]);
      lastC = null;
    } else if (C === 'V') {
      const y = num() + (rel ? cur[1] : 0);
      cur = [cur[0], y];
      push(cur[0], cur[1]);
      lastC = null;
    } else if (C === 'Q') {
      const cx = num() + (rel ? cur[0] : 0);
      const cy = num() + (rel ? cur[1] : 0);
      const ex = num() + (rel ? cur[0] : 0);
      const ey = num() + (rel ? cur[1] : 0);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        push(u * u * cur[0] + 2 * u * t * cx + t * t * ex, u * u * cur[1] + 2 * u * t * cy + t * t * ey);
      }
      cur = [ex, ey];
      lastC = [cx, cy];
    } else if (C === 'C') {
      const c1x = num() + (rel ? cur[0] : 0);
      const c1y = num() + (rel ? cur[1] : 0);
      const c2x = num() + (rel ? cur[0] : 0);
      const c2y = num() + (rel ? cur[1] : 0);
      const ex = num() + (rel ? cur[0] : 0);
      const ey = num() + (rel ? cur[1] : 0);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        push(
          u * u * u * cur[0] + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * ex,
          u * u * u * cur[1] + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * ey,
        );
      }
      cur = [ex, ey];
      lastC = [c2x, c2y];
    } else if (C === 'S') {
      const c1x = lastC ? 2 * cur[0] - lastC[0] : cur[0];
      const c1y = lastC ? 2 * cur[1] - lastC[1] : cur[1];
      const c2x = num() + (rel ? cur[0] : 0);
      const c2y = num() + (rel ? cur[1] : 0);
      const ex = num() + (rel ? cur[0] : 0);
      const ey = num() + (rel ? cur[1] : 0);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        push(
          u * u * u * cur[0] + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * ex,
          u * u * u * cur[1] + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * ey,
        );
      }
      cur = [ex, ey];
      lastC = [c2x, c2y];
    } else if (C === 'A') {
      // Arc: rx ry xAxisRot largeArc sweep x y → aproksimasi garis lurus ke titik akhir
      num();
      num();
      num();
      num();
      num();
      const ex = num() + (rel ? cur[0] : 0);
      const ey = num() + (rel ? cur[1] : 0);
      push(ex, ey);
      cur = [ex, ey];
      lastC = null;
    } else {
      i++;
    }
  }
  if (pts.length > 2) polys.push(pts);
  return polys;
}

function insidePoly([x, y]: Pt, pts: Pt[]) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const polyCache = new WeakMap<TwEl, Pt[][]>();

function hitEl(el: TwEl, [x, y]: Pt): boolean {
  if (el.t === 'c') {
    const cx = el.cx * 2.5 + 5;
    const cy = el.cy * 2.5 + 5;
    const r = el.r * 2.5;
    return Math.hypot(x - cx, y - cy) <= r;
  }
  if (el.t === 'e') {
    const cx = el.cx * 2.5 + 5;
    const cy = el.cy * 2.5 + 5;
    const rx = el.rx * 2.5;
    const ry = el.ry * 2.5;
    return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
  }
  let polys = polyCache.get(el);
  if (!polys) {
    polys = pathToPolys(el.d);
    polyCache.set(el, polys);
  }
  return polys.some((p) => insidePoly([x, y], p));
}

/**
 * Cari indeks elemen `els` yang tersentuh di titik `p` (koordinat 100x100).
 * 1. Jika tap jatuh di dalam/dekat lingkaran angka `at` (jarak <= 9), utamakan target angka tersebut!
 * 2. Jika tidak, cek poligon elemen yang memiliki `at` dari depan ke belakang.
 * 3. Fallback ke angka `at` terdekat dalam jarak <= 16.
 */
export function hitShapeEl(els: readonly TwEl[], p: Pt): number {
  let nearBadge = -1;
  let nearDist = 9;
  els.forEach((el, i) => {
    if (el.n && el.at) {
      const d = Math.hypot(p[0] - el.at[0], p[1] - el.at[1]);
      if (d < nearDist) {
        nearDist = d;
        nearBadge = i;
      }
    }
  });
  if (nearBadge >= 0) return nearBadge;

  for (let i = els.length - 1; i >= 0; i--) {
    if (els[i].n && els[i].at && hitEl(els[i], p)) return i;
  }

  let best = -1;
  let bestDist = 16;
  els.forEach((el, i) => {
    if (el.n && el.at) {
      const d = Math.hypot(p[0] - el.at[0], p[1] - el.at[1]);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
  });
  return best;
}

/** Wajah lucu: dua mata + senyum. Tidak tampil saat bayangan. */
export const face = (sil: boolean, cx: number, cy: number, gap = 10, r = 4) =>
  sil ? null : (
    <G>
      {eye(cx - gap, cy, r)}
      {eye(cx + gap, cy, r)}
      {smile(cx, cy + r + 3, r * 1.4)}
    </G>
  );
