import { View } from 'react-native';
import Svg, { Line, Text as SvgText } from 'react-native-svg';
import { Shape, SHAPE_KINDS, shapeDef, type ShapeKind } from '../shapes';
import type { CustomPage } from './DrawingSheet';

// Kanvas tulisan 300 x 130 (satuan SVG), ikut melebar sesuai layar.
const VW = 300;
const VH = 130;
const BASE = 96; // garis dasar huruf

/** Shape yang namanya cocok untuk latihan menulis: satu kata, maks. 6 huruf supaya hurufnya tetap besar. */
export const WRITING_KINDS = SHAPE_KINDS.filter((k) => {
  const n = shapeDef(k).name;
  return !/[\s-]/.test(n) && n.length <= 6;
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Lembar menulis: gambar di atas, nama bendanya di bawah dengan huruf putus-putus
 * di atas garis bantu (garis atas, tengah, dasar) seperti buku tulis anak.
 */
export function writingPage(kind: ShapeKind): CustomPage {
  const word = capitalize(shapeDef(kind).name);
  // Ukuran huruf menyesuaikan panjang kata supaya muat satu baris.
  // Jarak antar huruf dirapatkan untuk kata panjang; lebar huruf ±0.62 × ukuran, sisakan ±30 satuan di kiri-kanan.
  const spacing = word.length > 4 ? 4 : 8;
  const fs = Math.min(88, (VW - 60 - spacing * word.length) / (0.62 * word.length));
  const cap = BASE - 0.72 * fs;
  const mid = BASE - 0.52 * fs;
  const ratio = 0.78;

  return {
    ratio,
    render: (w, h) => {
      const textH = w * (VH / VW);
      const shapeSize = Math.min(w * 0.62, h - textH - 24);
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
          <Shape kind={kind} size={shapeSize} />
          <Svg width={w} height={textH} viewBox={`0 0 ${VW} ${VH}`}>
            <Line x1={10} x2={VW - 10} y1={cap} y2={cap} stroke="#B0BEC5" strokeWidth={1.2} strokeDasharray="6 5" />
            <Line x1={10} x2={VW - 10} y1={mid} y2={mid} stroke="#CFD8DC" strokeWidth={1.2} strokeDasharray="6 5" />
            <Line x1={10} x2={VW - 10} y1={BASE} y2={BASE} stroke="#90A4AE" strokeWidth={1.6} />
            <SvgText
              x={VW / 2}
              y={BASE}
              fontSize={fs}
              letterSpacing={spacing}
              textAnchor="middle"
              fill="#F1F3F4"
              stroke="#546E7A"
              strokeWidth={2.4}
              strokeDasharray="5 4"
              strokeLinejoin="round"
            >
              {word}
            </SvgText>
          </Svg>
        </View>
      );
    },
  };
}
