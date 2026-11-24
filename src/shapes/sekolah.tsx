import { Circle, G, Path, Rect } from 'react-native-svg';
import { DARK, OUTLINE, part, type ShapeDef, stroke } from './kit';

/** Peralatan sekolah. */
export const SEKOLAH = {
  pensil: {
    name: 'pensil',
    color: '#FFCA28',
    look: 'batang',
    recolor: true,
    code: { x: 49, y: 51 },
    draw: (p, sil) => (
      <G transform="rotate(-40 50 50)">
        <Rect {...part('#F48FB1', sil)} x={4} y={40} width={14} height={20} rx={4} />
        <Rect {...part('#B0BEC5', sil)} x={16} y={40} width={8} height={20} />
        <Rect {...p} x={24} y={40} width={50} height={20} />
        <Path {...part('#FFE0B2', sil)} d="M74 40 L94 50 L74 60 Z" />
        <Path {...part(DARK, sil)} d="M87 46.5 L94 50 L87 53.5 Z" />
        {!sil && <Path d="M24 50 H74" stroke={OUTLINE} strokeWidth={1.5} opacity={0.5} />}
      </G>
    ),
  },
  krayon: {
    name: 'krayon',
    color: '#42A5F5',
    look: 'batang',
    recolor: true,
    draw: (p, sil) => (
      <G transform="rotate(-40 50 50)">
        <Rect {...p} x={8} y={40} width={66} height={20} rx={4} />
        <Path {...p} d="M74 41 L94 50 L74 59 Z" />
        {!sil && <Rect x={24} y={40} width={36} height={20} fill="#fff" opacity={0.55} />}
        {!sil && <Path d="M28 46 H56 M28 54 H56" stroke={OUTLINE} strokeWidth={2} strokeLinecap="round" />}
      </G>
    ),
  },
  buku: {
    name: 'buku',
    color: '#29B6F6',
    recolor: true,
    code: { x: 54, y: 62 },
    draw: (p, sil) => (
      <>
        <Path {...part('#FFFFFF', sil)} d="M22 80 H82 V92 H22 Q16 92 16 86 Q16 80 22 80 Z" />
        <Rect {...p} x={16} y={10} width={66} height={76} rx={6} />
        {!sil && <Path d="M26 10 V86" stroke={OUTLINE} strokeWidth={3} />}
        {!sil && <Rect x={36} y={24} width={36} height={16} rx={3} fill="#fff" stroke={OUTLINE} strokeWidth={2.5} />}
        {!sil && <Path d="M42 32 H66" stroke={OUTLINE} strokeWidth={2} strokeLinecap="round" />}
        {!sil && <Path d="M24 86 H80 M24 89 H80" stroke="#BDBDBD" strokeWidth={1.5} />}
      </>
    ),
  },
  tas: {
    name: 'tas',
    color: '#EF5350',
    recolor: true,
    draw: (p, sil) => (
      <>
        <Path d="M38 26 Q38 8 50 8 Q62 8 62 26" {...stroke(OUTLINE, sil, 6)} />
        <Rect {...p} x={18} y={22} width={64} height={72} rx={18} />
        {!sil && <Rect x={28} y={56} width={44} height={28} rx={9} fill="#fff" opacity={0.45} stroke={OUTLINE} strokeWidth={2.5} />}
        {!sil && <Path d="M28 66 H72" stroke={OUTLINE} strokeWidth={2} />}
        {!sil && <Circle cx={50} cy={40} r={4} fill={OUTLINE} />}
      </>
    ),
  },
} satisfies Record<string, ShapeDef>;
