import type { ReactNode } from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

/**
 * Koleksi bentuk lucu untuk permainan Memasangkan.
 * Setiap bentuk digambar di kanvas 100x100 dan warnanya diberikan lewat kode,
 * jadi cukup satu bentuk untuk semua warna. Mode `silhouette` = bayangan hitam polos.
 */
export type ShapeKind =
  | 'kaos'
  | 'celana'
  | 'mobil'
  | 'rumah'
  | 'kupu'
  | 'bunga'
  | 'ikan'
  | 'bintang'
  | 'hati'
  | 'apel'
  | 'balon'
  | 'kucing';

export const SHAPE_KINDS: ShapeKind[] = ['kaos', 'celana', 'mobil', 'rumah', 'kupu', 'bunga', 'ikan', 'bintang', 'hati', 'apel', 'balon', 'kucing'];

export const SHAPE_NAMES: Record<ShapeKind, string> = {
  kaos: 'baju',
  celana: 'celana',
  mobil: 'mobil',
  rumah: 'garasi',
  kupu: 'kupu-kupu',
  bunga: 'bunga',
  ikan: 'ikan',
  bintang: 'bintang',
  hati: 'hati',
  apel: 'apel',
  balon: 'balon',
  kucing: 'kucing',
};

const OUTLINE = '#3A3A3A';
const SHADOW = '#262626';
const DARK = '#333';

type Paint = { fill: string; stroke: string; strokeWidth: number; strokeLinejoin: 'round' };
type Draw = (p: Paint, sil: boolean) => ReactNode;

/** Mata bulat dengan kilau putih. */
const eye = (x: number, y: number, r = 4.5) => (
  <G key={`e${x}`}>
    <Circle cx={x} cy={y} r={r} fill={DARK} />
    <Circle cx={x + r * 0.35} cy={y - r * 0.35} r={r * 0.35} fill="#fff" />
  </G>
);

const smile = (cx: number, cy: number, w = 8) => (
  <Path d={`M${cx - w} ${cy} Q${cx} ${cy + w * 0.9} ${cx + w} ${cy}`} stroke={DARK} strokeWidth={3} strokeLinecap="round" fill="none" />
);

function starPath(cx: number, cy: number, R: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}
const STAR = starPath(50, 54, 46, 21);

const PETALS = [0, 1, 2, 3, 4].map((i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: 50 + 19 * Math.cos(a), y: 40 + 19 * Math.sin(a) };
});

const DRAW: Record<ShapeKind, Draw> = {
  kaos: (p, sil) => (
    <>
      <Path {...p} d="M34 14 Q50 27 66 14 L91 30 L81 47 L71 41 L71 89 L29 89 L29 41 L19 47 L9 30 Z" />
      {!sil && <Path d="M38 16 Q50 29 62 16" stroke={OUTLINE} strokeWidth={3} fill="none" />}
      {!sil && <Circle cx={50} cy={58} r={9} fill="#fff" opacity={0.55} />}
    </>
  ),
  celana: (p, sil) => (
    <>
      <Path {...p} d="M23 11 H77 L83 91 H58 L50 45 L42 91 H17 Z" />
      {!sil && <Path d="M23 23 H77" stroke={OUTLINE} strokeWidth={3} />}
      {!sil && <Circle cx={50} cy={17} r={2.5} fill={OUTLINE} />}
    </>
  ),
  mobil: (p, sil) => (
    <>
      <Path {...p} d="M8 64 L12 48 Q15 41 24 40 L34 26 Q38 22 45 22 H62 Q68 22 72 28 L80 40 Q91 42 93 54 L93 66 Q93 72 87 72 H13 Q8 72 8 64 Z" />
      {!sil && <Path d="M39 30 Q41 28 45 28 H50 V40 H32 Z" fill="#E3F2FD" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />}
      {!sil && <Path d="M56 28 H62 Q65 28 67 31 L73 40 H56 Z" fill="#E3F2FD" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />}
      <Circle cx={28} cy={72} r={11} fill={sil ? SHADOW : DARK} />
      <Circle cx={72} cy={72} r={11} fill={sil ? SHADOW : DARK} />
      {!sil && <Circle cx={28} cy={72} r={4.5} fill="#BDBDBD" />}
      {!sil && <Circle cx={72} cy={72} r={4.5} fill="#BDBDBD" />}
      {!sil && <Circle cx={88} cy={54} r={3} fill="#FFF59D" />}
    </>
  ),
  rumah: (p, sil) => (
    <>
      <Path {...p} d="M10 48 L50 12 L90 48 V90 H10 Z" />
      {!sil && <Rect x={30} y={56} width={40} height={34} rx={3} fill="#fff" stroke={OUTLINE} strokeWidth={2.5} />}
      {!sil && <Path d="M30 67 H70 M30 78 H70" stroke={OUTLINE} strokeWidth={2} />}
      {!sil && <Circle cx={50} cy={38} r={6} fill="#fff" stroke={OUTLINE} strokeWidth={2.5} />}
    </>
  ),
  kupu: (p, sil) => (
    <>
      <Path d="M46 26 Q40 12 32 10 M54 26 Q60 12 68 10" stroke={sil ? SHADOW : DARK} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Ellipse {...p} cx={29} cy={38} rx={22} ry={19} />
      <Ellipse {...p} cx={71} cy={38} rx={22} ry={19} />
      <Ellipse {...p} cx={33} cy={69} rx={16} ry={15} />
      <Ellipse {...p} cx={67} cy={69} rx={16} ry={15} />
      {!sil && <Circle cx={27} cy={36} r={7} fill="#fff" opacity={0.6} />}
      {!sil && <Circle cx={73} cy={36} r={7} fill="#fff" opacity={0.6} />}
      {!sil && <Circle cx={33} cy={70} r={5} fill="#fff" opacity={0.6} />}
      {!sil && <Circle cx={67} cy={70} r={5} fill="#fff" opacity={0.6} />}
      <Ellipse cx={50} cy={52} rx={7} ry={30} fill={sil ? SHADOW : '#5D4037'} />
      {!sil && eye(47, 32, 2.2)}
      {!sil && eye(53, 32, 2.2)}
    </>
  ),
  bunga: (p, sil) => (
    <>
      <Path d="M50 60 V96" stroke={sil ? SHADOW : '#43A047'} strokeWidth={6} strokeLinecap="round" />
      <Ellipse cx={62} cy={82} rx={11} ry={6} fill={sil ? SHADOW : '#66BB6A'} transform="rotate(-30 62 82)" />
      {PETALS.map((q, i) => (
        <Circle key={i} {...p} cx={q.x} cy={q.y} r={16} />
      ))}
      <Circle cx={50} cy={40} r={12} fill={sil ? SHADOW : '#FFD54F'} stroke={sil ? SHADOW : OUTLINE} strokeWidth={3} />
      {!sil && eye(45.5, 38, 2.4)}
      {!sil && eye(54.5, 38, 2.4)}
      {!sil && smile(50, 43, 4)}
    </>
  ),
  ikan: (p, sil) => (
    <>
      <Path {...p} d="M70 50 L94 30 L90 50 L94 70 Z" />
      <Path {...p} d="M40 31 Q48 18 58 30 Z" />
      <Ellipse {...p} cx={43} cy={52} rx={33} ry={23} />
      {!sil && <Path d="M58 38 Q64 52 58 66" stroke={OUTLINE} strokeWidth={2.5} fill="none" />}
      {!sil && eye(26, 47, 5)}
      {!sil && smile(22, 59, 5)}
    </>
  ),
  bintang: (p, sil) => (
    <>
      <Path {...p} d={STAR} />
      {!sil && eye(41, 52, 4)}
      {!sil && eye(59, 52, 4)}
      {!sil && smile(50, 61, 6)}
    </>
  ),
  hati: (p, sil) => (
    <>
      <Path {...p} d="M50 90 C20 68 6 50 10 32 C14 15 38 10 50 28 C62 10 86 15 90 32 C94 50 80 68 50 90 Z" />
      {!sil && <Ellipse cx={28} cy={32} rx={7} ry={5} fill="#fff" opacity={0.6} transform="rotate(-35 28 32)" />}
      {!sil && eye(39, 46, 4)}
      {!sil && eye(61, 46, 4)}
      {!sil && smile(50, 56, 6)}
    </>
  ),
  apel: (p, sil) => (
    <>
      <Path d="M50 30 Q49 18 55 8" stroke={sil ? SHADOW : '#6D4C41'} strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M54 18 Q66 6 78 14 Q68 26 54 18 Z" fill={sil ? SHADOW : '#66BB6A'} stroke={sil ? SHADOW : OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
      <Path {...p} d="M50 30 C30 16 8 28 12 56 C16 80 36 94 50 86 C64 94 84 80 88 56 C92 28 70 16 50 30 Z" />
      {!sil && <Ellipse cx={28} cy={46} rx={6} ry={10} fill="#fff" opacity={0.5} transform="rotate(20 28 46)" />}
      {!sil && eye(40, 58, 4)}
      {!sil && eye(60, 58, 4)}
      {!sil && smile(50, 67, 6)}
    </>
  ),
  balon: (p, sil) => (
    <>
      <Path d="M50 78 Q42 86 52 92 Q58 96 50 99" stroke={sil ? SHADOW : '#616161'} strokeWidth={2.5} fill="none" />
      <Path d="M44 78 H56 L50 70 Z" fill={sil ? SHADOW : p.fill} stroke={sil ? SHADOW : OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
      <Ellipse {...p} cx={50} cy={40} rx={29} ry={33} />
      {!sil && <Ellipse cx={38} cy={26} rx={6} ry={10} fill="#fff" opacity={0.55} transform="rotate(25 38 26)" />}
    </>
  ),
  kucing: (p, sil) => (
    <>
      <Path {...p} d="M20 42 L24 10 L44 28 Q50 27 56 28 L76 10 L80 42 Q88 58 80 74 Q68 90 50 90 Q32 90 20 74 Q12 58 20 42 Z" />
      {!sil && <Path d="M28 22 L30 34 L38 30 Z M72 22 L70 34 L62 30 Z" fill="#F8BBD0" />}
      {!sil && eye(38, 55, 5)}
      {!sil && eye(62, 55, 5)}
      {!sil && <Path d="M46 64 H54 L50 69 Z" fill="#F48FB1" stroke={DARK} strokeWidth={1.5} strokeLinejoin="round" />}
      {!sil && <Path d="M44 72 Q50 77 56 72 M14 60 L30 63 M14 70 L30 68 M86 60 L70 63 M86 70 L70 68" stroke={DARK} strokeWidth={2} strokeLinecap="round" fill="none" />}
    </>
  ),
};

export function Shape({ kind, color, size, silhouette = false }: { kind: ShapeKind; color: string; size: number; silhouette?: boolean }) {
  const paint: Paint = silhouette
    ? { fill: SHADOW, stroke: SHADOW, strokeWidth: 3, strokeLinejoin: 'round' }
    : { fill: color, stroke: OUTLINE, strokeWidth: 3, strokeLinejoin: 'round' };
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {DRAW[kind](paint, silhouette)}
    </Svg>
  );
}

/** Lingkaran warna polos (untuk mode cocokkan warna). */
export function ColorDot({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={40} fill={color} stroke={OUTLINE} strokeWidth={4} />
      <Ellipse cx={36} cy={34} rx={9} ry={6} fill="#fff" opacity={0.5} transform="rotate(-35 36 34)" />
    </Svg>
  );
}
