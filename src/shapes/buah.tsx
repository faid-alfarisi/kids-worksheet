import { Circle, Ellipse, Path } from 'react-native-svg';
import { DARK, face, part, type ShapeDef, stroke } from './kit';

const GREEN = '#66BB6A';
const BROWN = '#6D4C41';

export const BUAH = {
  apel: {
    name: 'apel',
    color: '#EF5350',
    draw: (p, sil) => (
      <>
        <Path d="M50 30 Q49 18 55 8" {...stroke(BROWN, sil, 5)} />
        <Path {...part(GREEN, sil)} d="M54 18 Q66 6 78 14 Q68 26 54 18 Z" />
        <Path {...p} d="M50 30 C30 16 8 28 12 56 C16 80 36 94 50 86 C64 94 84 80 88 56 C92 28 70 16 50 30 Z" />
        {!sil && <Ellipse cx={28} cy={46} rx={6} ry={10} fill="#fff" opacity={0.5} transform="rotate(20 28 46)" />}
        {face(sil, 50, 58, 10, 4)}
      </>
    ),
  },
  jeruk: {
    name: 'jeruk',
    color: '#FFA726',
    look: 'bulat',
    draw: (p, sil) => (
      <>
        <Path {...part(GREEN, sil)} d="M50 22 Q58 6 76 12 Q68 26 50 22 Z" />
        <Circle {...p} cx={50} cy={58} r={36} />
        {!sil && [[30, 44], [70, 48], [40, 80], [66, 76], [52, 36]].map(([x, y]) => <Circle key={`${x}`} cx={x} cy={y} r={1.8} fill="#fff" opacity={0.6} />)}
        {face(sil, 50, 58, 11, 4.5)}
      </>
    ),
  },
  pisang: {
    name: 'pisang',
    color: '#FFD54F',
    draw: (p, sil) => (
      <>
        <Path {...p} d="M20 26 C14 66 44 92 86 80 C92 78 92 72 86 70 C56 74 36 56 34 26 Z" />
        <Path {...part(BROWN, sil)} d="M20 26 L19 14 L31 13 L34 26 Z" />
        {!sil && <Path d="M28 34 C30 60 48 76 76 78" stroke="#F9A825" strokeWidth={2.5} fill="none" />}
        {face(sil, 46, 62, 7, 3.5)}
      </>
    ),
  },
  semangka: {
    name: 'semangka',
    color: '#EF5350',
    draw: (p, sil) => (
      <>
        <Path {...part('#43A047', sil)} d="M6 34 A44 44 0 0 0 94 34 Z" />
        <Path {...p} d="M14 34 A36 36 0 0 0 86 34 Z" />
        {!sil && [[32, 48], [50, 54], [68, 48], [41, 62], [59, 62]].map(([x, y]) => <Ellipse key={`${x}${y}`} cx={x} cy={y} rx={2.5} ry={4} fill={DARK} />)}
        {face(sil, 50, 40, 9, 3.5)}
      </>
    ),
  },
  stroberi: {
    name: 'stroberi',
    color: '#E53935',
    draw: (p, sil) => (
      <>
        <Path {...p} d="M50 94 C24 82 10 54 20 38 C28 26 72 26 80 38 C90 54 76 82 50 94 Z" />
        <Path {...part(GREEN, sil)} d="M28 34 L36 18 L46 28 L52 12 L58 28 L68 18 L74 34 Q50 42 28 34 Z" />
        {!sil && [[32, 52], [68, 52], [40, 74], [60, 74], [50, 86]].map(([x, y]) => <Ellipse key={`${x}${y}`} cx={x} cy={y} rx={1.8} ry={2.8} fill="#FFF59D" />)}
        {face(sil, 50, 56, 9, 4)}
      </>
    ),
  },
  ceri: {
    name: 'ceri',
    color: '#D32F2F',
    draw: (p, sil) => (
      <>
        <Path d="M32 56 Q38 28 58 12 M68 58 Q62 32 58 12" {...stroke('#558B2F', sil, 4)} />
        <Path {...part(GREEN, sil)} d="M58 12 Q76 4 86 14 Q72 24 58 12 Z" />
        <Circle {...p} cx={32} cy={72} r={20} />
        <Circle {...p} cx={68} cy={74} r={20} />
        {!sil && <Circle cx={25} cy={65} r={4} fill="#fff" opacity={0.6} />}
        {!sil && <Circle cx={61} cy={67} r={4} fill="#fff" opacity={0.6} />}
        {face(sil, 32, 72, 6, 3)}
      </>
    ),
  },
  anggur: {
    name: 'anggur',
    color: '#8E24AA',
    draw: (p, sil) => (
      <>
        <Path d="M50 24 Q50 14 56 6" {...stroke(BROWN, sil, 5)} />
        <Path {...part(GREEN, sil)} d="M54 14 Q70 2 84 12 Q70 24 54 14 Z" />
        {[[30, 34], [50, 32], [70, 34], [40, 52], [60, 52], [30, 66], [50, 70], [70, 66], [50, 88]].map(([x, y]) => (
          <Circle key={`${x}${y}`} {...p} cx={x} cy={y} r={12} />
        ))}
        {face(sil, 50, 52, 7, 3)}
      </>
    ),
  },
} satisfies Record<string, ShapeDef>;
