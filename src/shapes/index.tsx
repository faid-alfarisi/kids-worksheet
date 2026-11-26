import Svg, { Circle, Ellipse } from 'react-native-svg';
import { BUAH } from './buah';
import { DINOSAURUS } from './dinosaurus';
import { HEWAN } from './hewan';
import { drawLineOnly, drawTraced, OUTLINE, SHADOW, type ShapeDef, TRACE_PAINT } from './kit';
import { LAINNYA } from './lainnya';
import { SAYUR } from './sayur';
import { SEKOLAH } from './sekolah';
import { TRANSPORTASI } from './transportasi';

/**
 * Koleksi shape bersama untuk semua permainan (Memasangkan, Perbandingan, ...).
 * Shape dikelompokkan per kategori; tambah shape di file kelompoknya (lihat petunjuk di kit.tsx).
 */
export const SHAPE_GROUPS = {
  buah: BUAH,
  sayur: SAYUR,
  hewan: HEWAN,
  dinosaurus: DINOSAURUS,
  transportasi: TRANSPORTASI,
  sekolah: SEKOLAH,
  lainnya: LAINNYA,
};

export const SHAPES = {
  ...BUAH,
  ...SAYUR,
  ...HEWAN,
  ...DINOSAURUS,
  ...TRANSPORTASI,
  ...SEKOLAH,
  ...LAINNYA,
};

export type ShapeKind = keyof typeof SHAPES;
export type ShapeGroup = keyof typeof SHAPE_GROUPS;

export const SHAPE_KINDS = Object.keys(SHAPES) as ShapeKind[];

/** Shape yang boleh diwarnai bebas (untuk soal warna). */
export const RECOLOR_KINDS = SHAPE_KINDS.filter((k) => (SHAPES[k] as ShapeDef).recolor);

/** Shape yang punya letak angka (untuk soal Coding/kode warna). */
export const CODE_KINDS = SHAPE_KINDS.filter((k) => (SHAPES[k] as ShapeDef).code);

export const shapeDef = (kind: ShapeKind): ShapeDef => SHAPES[kind];

/**
 * Gambar satu shape. Tanpa `color` → warna aslinya. `silhouette` → bayangan hitam polos.
 * `trace` → hanya garis putus-putus berisi putih (untuk ditebalkan), tanpa detail kecil.
 */
export function Shape({
  kind,
  color,
  size,
  silhouette = false,
  trace = false,
  lineOnly = false,
}: {
  kind: ShapeKind;
  color?: string;
  size: number;
  silhouette?: boolean;
  trace?: boolean;
  lineOnly?: boolean;
}) {
  const def = shapeDef(kind);
  if (trace) {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {drawTraced(() => def.draw(TRACE_PAINT, true))}
      </Svg>
    );
  }
  if (lineOnly) {
    const linePaint = { fill: '#fff', stroke: OUTLINE, strokeWidth: 3, strokeLinejoin: 'round' as const };
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {drawLineOnly(() => def.draw(linePaint, false))}
      </Svg>
    );
  }
  const paint = {
    fill: silhouette ? SHADOW : (color ?? def.color),
    stroke: silhouette ? SHADOW : OUTLINE,
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {def.draw(paint, silhouette)}
    </Svg>
  );
}

/** Lingkaran warna polos (untuk soal cocokkan warna). */
export function ColorDot({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={40} fill={color} stroke={OUTLINE} strokeWidth={4} />
      <Ellipse cx={36} cy={34} rx={9} ry={6} fill="#fff" opacity={0.5} transform="rotate(-35 36 34)" />
    </Svg>
  );
}
