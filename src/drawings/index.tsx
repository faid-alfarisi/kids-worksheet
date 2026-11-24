import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { BUNGA } from './bunga';
import { KERANJANG_BUAH } from './buah';
import { ESKRIM } from './eskrim';
import { IKAN } from './ikan';
import { type DrawingDef, SIZE, visibleOutline } from './kit';
import { KUPUKUPU } from './kupukupu';
import { PEMANDANGAN } from './pemandangan';

export { hitRegion, SIZE as DRAWING_SIZE, type DrawingDef } from './kit';

/** Koleksi gambar besar (dipakai di Coding & Mewarnai). */
export const DRAWINGS = {
  bunga: BUNGA,
  pemandangan: PEMANDANGAN,
  kupukupu: KUPUKUPU,
  eskrim: ESKRIM,
  ikan: IKAN,
  buah: KERANJANG_BUAH,
};

export type DrawingId = keyof typeof DRAWINGS;
export const DRAWING_IDS = Object.keys(DRAWINGS) as DrawingId[];

/** Banyaknya kelompok warna dalam satu drawing. */
export const groupCount = (def: DrawingDef) => Math.max(...def.regions.map((r) => r.n));

const OUTLINE = '#3A3A3A';

type Label = { text: string; wrong?: boolean };

/**
 * Gambar sebuah drawing.
 * - layer "fill": bagian putih saja (alas untuk dicoret).
 * - layer "line": garis tepi + hiasan saja (ditaruh di atas coretan supaya garis tetap rapi).
 * - layer "all" (default): warna + garis + hiasan + angka (untuk Coding).
 */
export function DrawingArt({
  def,
  size,
  layer = 'all',
  fills,
  labels,
}: {
  def: DrawingDef;
  size: number;
  layer?: 'all' | 'fill' | 'line';
  fills?: Record<number, string>;
  labels?: Record<number, Label | null>;
}) {
  const showFill = layer !== 'line';
  const showLine = layer !== 'fill';
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`} pointerEvents="none">
      {showFill &&
        def.regions.map((r, i) => (
          <Path key={i} d={r.d} fill={fills?.[i] ?? '#fff'} stroke={showLine ? OUTLINE : 'none'} strokeWidth={2.5} strokeLinejoin="round" />
        ))}
      {/* Lapisan garis saja: hanya garis tepi yang terlihat (tanpa isi untuk menutupi). */}
      {!showFill && <Path d={visibleOutline(def)} fill="none" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />}
      {showLine && def.details && <G>{def.details()}</G>}
      {labels &&
        def.regions.map((r, i) => {
          const l = labels[i];
          if (!l) return null;
          return (
            <SvgText
              key={`t${i}`}
              x={r.at[0]}
              y={r.at[1] + 5}
              fontSize={l.wrong ? 18 : 14}
              fontWeight="900"
              textAnchor="middle"
              fill={l.wrong ? '#E53935' : '#37474F'}
            >
              {l.text}
            </SvgText>
          );
        })}
    </Svg>
  );
}
