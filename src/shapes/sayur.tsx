import { Circle, Ellipse, Path } from 'react-native-svg';
import { face, OUTLINE, part, type ShapeDef } from './kit';

const GREEN = '#66BB6A';

export const SAYUR = {
  wortel: {
    name: 'wortel',
    color: '#FB8C00',
    draw: (p, sil) => (
      <>
        <Ellipse {...part(GREEN, sil)} cx={40} cy={18} rx={6} ry={15} transform="rotate(-25 40 18)" />
        <Ellipse {...part(GREEN, sil)} cx={50} cy={14} rx={6} ry={15} />
        <Ellipse {...part(GREEN, sil)} cx={60} cy={18} rx={6} ry={15} transform="rotate(25 60 18)" />
        <Path {...p} d="M50 96 Q40 80 28 38 Q50 24 72 38 Q60 80 50 96 Z" />
        {!sil && <Path d="M36 56 H44 M56 68 H64 M42 80 H48" stroke={OUTLINE} strokeWidth={2.5} strokeLinecap="round" />}
        {face(sil, 50, 46, 8, 3.5)}
      </>
    ),
  },
  terong: {
    name: 'terong',
    color: '#7E57C2',
    draw: (p, sil) => (
      <>
        <Path {...p} d="M30 40 C14 64 28 94 56 92 C84 90 92 62 72 44 C60 32 40 30 30 40 Z" />
        <Path {...part(GREEN, sil)} d="M26 44 Q30 28 48 30 Q52 14 58 14 Q60 26 62 30 Q78 30 76 44 Q66 36 50 40 Q36 38 26 44 Z" />
        {!sil && <Ellipse cx={38} cy={62} rx={5} ry={10} fill="#fff" opacity={0.4} transform="rotate(20 38 62)" />}
        {face(sil, 56, 62, 10, 4)}
      </>
    ),
  },
  brokoli: {
    name: 'brokoli',
    color: '#43A047',
    look: 'pohon',
    draw: (p, sil) => (
      <>
        <Path {...part('#AED581', sil)} d="M40 56 L36 94 H64 L60 56 Z" />
        {[[30, 42], [50, 30], [70, 42], [38, 58], [62, 58], [50, 48]].map(([x, y]) => (
          <Circle key={`${x}${y}`} {...p} cx={x} cy={y} r={17} />
        ))}
        {face(sil, 50, 74, 6, 3)}
      </>
    ),
  },
  tomat: {
    name: 'tomat',
    color: '#E53935',
    look: 'bulat',
    draw: (p, sil) => (
      <>
        <Ellipse {...p} cx={50} cy={58} rx={40} ry={34} />
        <Path {...part(GREEN, sil)} d="M50 30 L36 24 L44 34 L30 38 L46 38 L50 46 L54 38 L70 38 L56 34 L64 24 Z" />
        {!sil && <Ellipse cx={26} cy={52} rx={5} ry={9} fill="#fff" opacity={0.5} transform="rotate(25 26 52)" />}
        {face(sil, 50, 62, 12, 4.5)}
      </>
    ),
  },
  jamur: {
    name: 'jamur',
    color: '#EF5350',
    draw: (p, sil) => (
      <>
        <Path {...part('#FFF3E0', sil)} d="M36 54 L32 88 Q50 96 68 88 L64 54 Z" />
        <Path {...p} d="M8 56 Q10 16 50 14 Q90 16 92 56 Q50 64 8 56 Z" />
        {!sil && [[30, 36, 6], [52, 26, 5], [72, 40, 7], [48, 46, 4]].map(([x, y, r]) => <Circle key={`${x}`} cx={x} cy={y} r={r} fill="#fff" />)}
        {face(sil, 50, 72, 7, 3.2)}
      </>
    ),
  },
} satisfies Record<string, ShapeDef>;
