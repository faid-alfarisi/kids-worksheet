import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { LINE_KINDS, type LineKind, linePath } from '../lines';
import { Shape, SHAPE_GROUPS, type ShapeKind } from '../shapes';
import type { CustomPage } from './DrawingSheet';

// Kanvas halaman 300 x 380 (satuan SVG), ikut melebar sesuai layar.
const VW = 300;
const VH = 380;
const ROWS = 4;
const ICON = 58; // ukuran gambar kiri/kanan
const PAD = 8;
const LINE_A = PAD + ICON + 6; // garis mulai
const LINE_B = VW - PAD - ICON - 6; // garis selesai
const TRACE = '#90A4AE';

export type LinesRow = { from: ShapeKind; to: ShapeKind; line: LineKind };

// Yang "berjalan" (kiri) dan tujuannya (kanan).
const MOVERS = [...Object.keys(SHAPE_GROUPS.hewan), ...Object.keys(SHAPE_GROUPS.transportasi)] as ShapeKind[];
const TARGETS = [
  ...Object.keys(SHAPE_GROUPS.buah),
  ...Object.keys(SHAPE_GROUPS.sayur),
  ...Object.keys(SHAPE_GROUPS.makanan),
  ...Object.keys(SHAPE_GROUPS.alam),
  ...Object.keys(SHAPE_GROUPS.lainnya),
] as ShapeKind[];

const shuffle = <T,>(arr: readonly T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Halaman acak: tiap baris gambar kiri → garis putus-putus (pola berbeda) → gambar kanan. */
export function randomLinesRows(): LinesRow[] {
  const from = shuffle(MOVERS);
  const to = shuffle(TARGETS);
  const lines = shuffle(LINE_KINDS);
  return Array.from({ length: ROWS }, (_, i) => ({ from: from[i], to: to[i], line: lines[i % lines.length] }));
}

/** Lembar menggaris: tebalkan garis dari gambar kiri ke gambar kanan. */
export function linesPage(rows: LinesRow[]): CustomPage {
  return {
    ratio: VW / VH,
    render: (w) => {
      const k = w / VW; // satuan SVG → piksel
      const rowH = VH / rows.length;
      const cy = (i: number) => rowH * (i + 0.5);
      const paths = rows.map((r, i) => linePath(r.line, LINE_A, LINE_B, cy(i), 11));
      // Titik mulai = titik pertama path ("M x y").
      const starts = paths.map((d) => d.match(/^M(-?[\d.]+) (-?[\d.]+)/)!.slice(1).map(Number));
      return (
        <View style={{ flex: 1 }}>
          <Svg width={w} height={VH * k} viewBox={`0 0 ${VW} ${VH}`}>
            {paths.map((d, i) => (
              <Path
                key={i}
                d={d}
                fill="none"
                stroke={TRACE}
                strokeWidth={3}
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Titik mulai di ujung kiri tiap garis. */}
            {starts.map(([x, y], i) => (
              <Circle key={`s${i}`} cx={x} cy={y} r={4.5} fill="#66BB6A" />
            ))}
          </Svg>
          {rows.map((r, i) => (
            <View key={`l${i}`} style={{ position: 'absolute', left: PAD * k, top: (cy(i) - ICON / 2) * k }}>
              <Shape kind={r.from} size={ICON * k} />
            </View>
          ))}
          {rows.map((r, i) => (
            <View key={`r${i}`} style={{ position: 'absolute', right: PAD * k, top: (cy(i) - ICON / 2) * k }}>
              <Shape kind={r.to} size={ICON * k} />
            </View>
          ))}
        </View>
      );
    },
  };
}
