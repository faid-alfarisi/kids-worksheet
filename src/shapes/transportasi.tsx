import { Circle, Path, Rect } from 'react-native-svg';
import { DARK, OUTLINE, part, SHADOW, type ShapeDef, stroke } from './kit';

const GLASS = '#E3F2FD';

const wheel = (x: number, y: number, r: number, sil: boolean) => (
  <>
    <Circle cx={x} cy={y} r={r} fill={sil ? SHADOW : DARK} />
    {!sil && <Circle cx={x} cy={y} r={r * 0.42} fill="#BDBDBD" />}
  </>
);

export const TRANSPORTASI = {
  mobil: {
    name: 'mobil',
    color: '#EF5350',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...p} d="M8 64 L12 48 Q15 41 24 40 L34 26 Q38 22 45 22 H62 Q68 22 72 28 L80 40 Q91 42 93 54 L93 66 Q93 72 87 72 H13 Q8 72 8 64 Z" />
        {!sil && <Path d="M39 30 Q41 28 45 28 H50 V40 H32 Z" fill={GLASS} stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />}
        {!sil && <Path d="M56 28 H62 Q65 28 67 31 L73 40 H56 Z" fill={GLASS} stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />}
        {wheel(28, 72, 11, sil)}
        {wheel(72, 72, 11, sil)}
        {!sil && <Circle cx={88} cy={54} r={3} fill="#FFF59D" />}
      </>
    ),
  },
  bus: {
    name: 'bus',
    color: '#FFCA28',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Rect {...p} x={6} y={20} width={88} height={54} rx={10} />
        {!sil && [14, 36, 58].map((x) => <Rect key={x} x={x} y={28} width={18} height={18} rx={3} fill={GLASS} stroke={OUTLINE} strokeWidth={2.5} />)}
        {!sil && <Rect x={78} y={28} width={10} height={36} rx={2} fill={GLASS} stroke={OUTLINE} strokeWidth={2.5} />}
        {!sil && <Path d="M6 56 H76" stroke={OUTLINE} strokeWidth={2.5} />}
        {wheel(26, 74, 10, sil)}
        {wheel(70, 74, 10, sil)}
      </>
    ),
  },
  pesawat: {
    name: 'pesawat',
    color: '#42A5F5',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...p} d="M46 46 L30 14 H42 L64 46 Z" />
        <Path {...p} d="M12 46 L6 26 H16 L26 44 Z" />
        <Path {...p} d="M8 50 Q8 40 22 40 H80 Q96 42 96 50 Q96 58 80 60 H22 Q8 60 8 50 Z" />
        <Path {...p} d="M46 54 L30 86 H42 L64 54 Z" />
        {!sil && [32, 44, 56, 68].map((x) => <Circle key={x} cx={x} cy={48} r={3.5} fill={GLASS} stroke={OUTLINE} strokeWidth={1.5} />)}
        {!sil && <Path d="M84 44 Q92 46 92 50 H84 Z" fill={GLASS} stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round" />}
      </>
    ),
  },
  kapal: {
    name: 'kapal',
    color: '#EF5350',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Rect {...part('#424242', sil)} x={56} y={20} width={12} height={22} />
        <Rect {...part('#FFFFFF', sil)} x={28} y={38} width={48} height={22} rx={3} />
        {!sil && [36, 50, 64].map((x) => <Circle key={x} cx={x} cy={49} r={4} fill={GLASS} stroke={OUTLINE} strokeWidth={2} />)}
        <Path {...p} d="M6 58 H94 L80 84 H20 Z" />
        {!sil && <Path d="M10 92 Q20 86 30 92 T50 92 T70 92 T90 92" {...stroke('#29B6F6', false, 3)} />}
      </>
    ),
  },
  roket: {
    name: 'roket',
    color: '#EF5350',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path {...part('#FFA726', sil)} d="M38 70 Q50 100 62 70 Z" />
        <Path {...p} d="M32 52 L16 74 L32 70 Z" />
        <Path {...p} d="M68 52 L84 74 L68 70 Z" />
        <Path {...part('#ECEFF1', sil)} d="M50 4 Q72 24 68 70 H32 Q28 24 50 4 Z" />
        <Path {...p} d="M50 4 Q60 13 64 24 H36 Q40 13 50 4 Z" />
        {!sil && <Circle cx={50} cy={42} r={9} fill="#81D4FA" stroke={OUTLINE} strokeWidth={3} />}
      </>
    ),
  },
} satisfies Record<string, ShapeDef>;
